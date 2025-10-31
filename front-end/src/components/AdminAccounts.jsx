import { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { setUserAdmin } from '../adminApi';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

export default function AdminAccounts() {
  const db = getFirestore();
  const me = getAuth().currentUser;

  const [allUsers, setAllUsers] = useState([]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [search, setSearch] = useState('');
  const [mode, setMode] = useState('username');

  async function load() {
    setLoading(true);
    setErr('');
    try {
      const usersCol = collection(db, 'users');
      const qy = query(usersCol, orderBy('createdAt', 'desc'), limit(500));
      const snap = await getDocs(qy);
      const list = snap.docs.map(d => ({ id: d.id, banned: false, ...d.data() }));
      setAllUsers(list);
      setRows(applyFilter(list, search, mode));
    } catch (e) {
      setErr(String(e.message || e));
    } finally {
      setLoading(false);
    }
  }

  function applyFilter(list, term, by) {
    const t = term.trim().toLowerCase();
    if (!t) return list;
    return list.filter(u => {
      const val = (by === 'email' ? u.email : u.username) || '';
      return val.toLowerCase().includes(t);
    });
  }

  useEffect(() => { load(); }, []);
  useEffect(() => { setRows(applyFilter(allUsers, search, mode)); }, [search, mode, allUsers]);

  async function make(uid, isAdmin) {
    try {
      await setUserAdmin(uid, isAdmin);
      setAllUsers(prev => prev.map(r => r.id === uid ? { ...r, isAdmin } : r));
      setRows(prev => prev.map(r => r.id === uid ? { ...r, isAdmin } : r));
    } catch (e) {
      alert(e.message || 'Failed to update role.');
    }
  }

  async function setBanned(uid, banned) {
    try {
      const me = getAuth().currentUser;
      if (!uid) return;
      if (me && uid === me.uid) {
        return alert('You cannot change your own ban state.');
      }
      if (!window.confirm(banned ? 'Ban this user?' : 'Unban this user?')) return;
  
      const token = await getAuth().currentUser.getIdToken();
      const res = await fetch(`${API_BASE}/api/admin/ban-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ uid, banned })
      });
  
      const payload = await res.json().catch(() => null);
      if (!res.ok) {
        const msg = payload?.error || payload?.message || `${res.status} ${res.statusText}`;
        throw new Error(msg);
      }
  
      // success (200 or 202 per backend change below)
      setAllUsers(prev => prev.map(r => r.id === uid ? { ...r, banned } : r));
      setRows(prev => prev.map(r => r.id === uid ? { ...r, banned } : r));
  
      if (payload?.message) console.log(payload.message);
    } catch (e) {
      console.error(e);
      alert(e.message || 'Failed to update ban state.');
    }
  }
  

  return (
    <div style={styles.wrap}>
      <div style={styles.headerRow}>
        <h2 style={styles.title}>Accounts</h2>

        <div style={styles.toolbar}>
          <label style={styles.label}>
            Search by&nbsp;
            <select
              value={mode}
              onChange={e => setMode(e.target.value)}
              style={styles.select}
            >
              <option value="username">username</option>
              <option value="email">email</option>
            </select>
          </label>

          <input
            placeholder={`Search by ${mode}`}
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={styles.input}
          />

          <button onClick={load} disabled={loading} style={styles.reloadBtn}>
            ⟳ Reload
          </button>
        </div>
      </div>

      {err && <p style={styles.error}>{err}</p>}

      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Username</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Role</th>
              <th style={styles.th}>Status</th>
              <th style={styles.thRight}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} style={styles.loadingCell}>Loading…</td>
              </tr>
            )}

            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={6} style={styles.emptyCell}>No users</td>
              </tr>
            )}

            {!loading && rows.map(r => (
              <tr key={r.id} style={styles.tr}>
                <td style={styles.td}>{(r.firstname || '') + ' ' + (r.lastname || '')}</td>
                <td style={styles.tdMono}>{r.username || '—'}</td>
                <td style={styles.td}>{r.email || '—'}</td>
                <td style={styles.td}>
                  <span style={r.isAdmin ? styles.badgeAdmin : styles.badgeUser}>
                    {r.isAdmin ? 'admin' : 'user'}
                  </span>
                </td>
                <td style={styles.td}>
                  <span style={r.banned ? styles.badgeBanned : styles.badgeActive}>
                    {r.banned ? 'banned' : 'active'}
                  </span>
                </td>
                <td style={styles.tdRight}>
                  {r.isAdmin ? (
                    <button
                      onClick={() => make(r.id, false)}
                      style={{ ...styles.pillBtn, ...styles.pillNeutral }}
                    >
                      Revoke
                    </button>
                  ) : (
                    <button
                      onClick={() => make(r.id, true)}
                      style={{ ...styles.pillBtn, ...styles.pillPrimary }}
                    >
                      Make admin
                    </button>
                  )}

                  {r.banned ? (
                    <button
                      onClick={() => setBanned(r.id, false)}
                      style={{ ...styles.pillBtn, ...styles.pillSuccess, marginLeft: 8 }}
                    >
                      Unban
                    </button>
                  ) : (
                    <button
                      onClick={() => setBanned(r.id, true)}
                      style={{ ...styles.pillBtn, ...styles.pillDanger, marginLeft: 8 }}
                    >
                      Ban
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const border = '1px solid #cbd5e1';

const styles = {
  wrap: {
    padding: '8px 14px'
  },
  headerRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 8
  },
  title: {
    margin: 0,
    fontSize: 18,
    fontWeight: 700
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap'
  },
  label: {
    fontSize: 12,
    color: '#334155'
  },
  select: {
    fontSize: 12,
    padding: '4px 6px',
    borderRadius: 4,
    border: border,
    background: '#f8fafc'
  },
  input: {
    fontSize: 12,
    padding: '6px 8px',
    minWidth: 220,
    borderRadius: 4,
    border: border,
    outline: 'none'
  },
  reloadBtn: {
    fontSize: 12,
    padding: '6px 10px',
    borderRadius: 4,
    border: '1px solid #94a3b8',
    background: '#e2e8f0',
    cursor: 'pointer'
  },
  error: {
    color: '#b91c1c',
    fontSize: 13,
    margin: '8px 0'
  },
  tableWrap: {
    borderRadius: 6,
    border: border,
    overflow: 'hidden',
    background: '#fff'
  },
  table: {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: 0,
    fontSize: 13,
    lineHeight: 1.2
  },
  th: {
    textAlign: 'left',
    padding: '10px 12px',
    borderBottom: border,
    background: '#f1f5f9',
    fontWeight: 700,
    whiteSpace: 'nowrap'
  },
  thRight: {
    textAlign: 'right',
    padding: '10px 12px',
    borderBottom: border,
    background: '#f1f5f9',
    fontWeight: 700
  },
  tr: {
    borderBottom: border
  },
  td: {
    padding: '8px 12px',
    borderBottom: border,
    verticalAlign: 'middle'
  },
  tdMono: {
    padding: '8px 12px',
    borderBottom: border,
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace'
  },
  tdRight: {
    padding: '8px 12px',
    borderBottom: border,
    textAlign: 'right',
    whiteSpace: 'nowrap'
  },
  loadingCell: {
    padding: 16,
    textAlign: 'center',
    color: '#475569'
  },
  emptyCell: {
    padding: 16,
    textAlign: 'center',
    color: '#64748b'
  },
  badgeUser: {
    display: 'inline-block',
    padding: '2px 8px',
    borderRadius: 20,
    background: '#eef2ff',
    color: '#3730a3',
    fontWeight: 700,
    fontSize: 12,
    border: '1px solid #c7d2fe',
    textTransform: 'lowercase'
  },
  badgeAdmin: {
    display: 'inline-block',
    padding: '2px 8px',
    borderRadius: 20,
    background: '#ecfeff',
    color: '#155e75',
    fontWeight: 700,
    fontSize: 12,
    border: '1px solid #a5f3fc',
    textTransform: 'lowercase'
  },
  badgeActive: {
    display: 'inline-block',
    padding: '2px 8px',
    borderRadius: 20,
    background: '#ecfdf5',
    color: '#065f46',
    fontWeight: 700,
    fontSize: 12,
    border: '1px solid #a7f3d0',
    textTransform: 'lowercase'
  },
  badgeBanned: {
    display: 'inline-block',
    padding: '2px 8px',
    borderRadius: 20,
    background: '#fee2e2',
    color: '#991b1b',
    fontWeight: 700,
    fontSize: 12,
    border: '1px solid #fecaca',
    textTransform: 'lowercase'
  },
  pillBtn: {
    fontSize: 12,
    fontWeight: 700,
    padding: '6px 10px',
    borderRadius: 999,
    border: '1px solid transparent',
    cursor: 'pointer',
    background: '#e2e8f0'
  },
  pillPrimary: {
    background: '#dbeafe',
    borderColor: '#93c5fd',
    color: '#1d4ed8'
  },
  pillNeutral: {
    background: '#e5e7eb',
    borderColor: '#d1d5db',
    color: '#374151'
  },
  pillDanger: {
    background: '#fee2e2',
    borderColor: '#fca5a5',
    color: '#b91c1c'
  },
  pillSuccess: {
    background: '#dcfce7',
    borderColor: '#86efac',
    color: '#166534'
  }
};

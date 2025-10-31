import { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

export default function AdminReportedAccounts() {
  const [rows, setRows] = useState([]);
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);

  const fmt = (uid) =>
    users[uid]?.username || users[uid]?.email || uid || 'Unknown';

  useEffect(() => {
    (async () => {
      try {
        const token = await getAuth().currentUser.getIdToken();

        const res = await fetch(`${API_BASE}/api/reports?targetType=user`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to load user reports');
        const data = (await res.json()).filter(
          r => (r.targetType || 'user') === 'user'
        );
        setRows(data);

        const uids = new Set(
          data.flatMap(r => [r.reportedBy, r.reportedUserId || r.targetId]).filter(Boolean)
        );

        const db = getFirestore();
        const entries = await Promise.all(
          [...uids].map(async uid => {
            try {
              const snap = await getDoc(doc(db, 'users', uid));
              return [uid, snap.exists() ? snap.data() : null];
            } catch {
              return [uid, null];
            }
          })
        );
        setUsers(Object.fromEntries(entries));
      } catch (e) {
        alert(e.message || 'Error loading user reports');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function handleBanUser(uid) {
    if (!uid) return;
    if (!window.confirm('Ban this user?')) return;
    const token = await getAuth().currentUser.getIdToken();
    const res = await fetch(`${API_BASE}/api/admin/ban-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ uid, banned: true })
    });
    if (res.ok) alert('User banned.');
    else alert('Failed to ban user.');
  }

  async function handleDeleteReport(reportId) {
    if (!window.confirm('Delete this report?')) return;
    const token = await getAuth().currentUser.getIdToken();

    const tryPaths = [
      `${API_BASE}/api/reports/${reportId}`,
      `${API_BASE}/api/admin/reports/${reportId}`
    ];

    let ok = false;
    for (const p of tryPaths) {
      const res = await fetch(p, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) { ok = true; break; }
    }
    if (ok) setRows(prev => prev.filter(r => r._id !== reportId));
    else alert('Failed to delete report.');
  }

  if (loading) return <p style={styles.loadingCell}>Loading…</p>;

  return (
    <div style={styles.wrap}>
      <div style={styles.headerRow}>
        <h2 style={styles.title}>Reported Accounts</h2>
      </div>

      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Reported User</th>
              <th style={styles.th}>Type</th>
              <th style={styles.th}>Details</th>
              <th style={styles.th}>Reported By</th>
              <th style={styles.th}>Created</th>
              <th style={styles.thRight}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {rows.map(r => {
              const targetUid = r.reportedUserId || r.targetId;
              return (
                <tr key={r._id} style={styles.tr}>
                  <td style={styles.td}>{fmt(targetUid)}</td>
                  <td style={styles.td}>
                    <span style={styles.badgeInfo}>
                      {r.reportType || '—'}
                    </span>
                  </td>
                  <td style={styles.td}>{r.details || '—'}</td>
                  <td style={styles.td}>{fmt(r.reportedBy)}</td>
                  <td style={styles.td}>
                    {r.createdAt ? new Date(r.createdAt).toLocaleString() : '—'}
                  </td>
                  <td style={styles.tdRight}>
                    <button
                      onClick={() => handleBanUser(targetUid)}
                      style={{ ...styles.pillBtn, ...styles.pillDanger }}
                    >
                      🚫 Ban User
                    </button>
                    <button
                      onClick={() => handleDeleteReport(r._id)}
                      style={{ ...styles.pillBtn, ...styles.pillWarn, marginLeft: 8 }}
                    >
                      ❌ Delete Report
                    </button>
                  </td>
                </tr>
              );
            })}

            {rows.length === 0 && (
              <tr>
                <td colSpan={6} style={styles.emptyCell}>
                  No account reports
                </td>
              </tr>
            )}
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
  badgeInfo: {
    display: 'inline-block',
    padding: '2px 8px',
    borderRadius: 20,
    background: '#eef2ff',
    color: '#3730a3',
    fontWeight: 700,
    fontSize: 12,
    border: '1px solid #c7d2fe',
    textTransform: 'none'
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
  pillDanger: {
    background: '#fee2e2',
    borderColor: '#fca5a5',
    color: '#b91c1c'
  },
  pillWarn: {
    background: '#fef3c7',
    borderColor: '#fcd34d',
    color: '#92400e'
  }
};

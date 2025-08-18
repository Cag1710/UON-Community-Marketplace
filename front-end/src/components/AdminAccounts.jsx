import { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { setUserAdmin } from '../adminApi';

export default function AdminAccounts() {
  const db = getFirestore();
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
      const q = query(usersCol, orderBy('createdAt', 'desc'), limit(500));
      const snap = await getDocs(q);
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
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

  useEffect(() => {
    setRows(applyFilter(allUsers, search, mode));
  }, [search, mode, allUsers]);

  async function make(uid, isAdmin) {
    try {
      await setUserAdmin(uid, isAdmin);
      setAllUsers(prev => prev.map(r => r.id === uid ? { ...r, isAdmin } : r));
      setRows(prev => prev.map(r => r.id === uid ? { ...r, isAdmin } : r));
    } catch (e) {
      alert(e.message || 'failed');
    }
  }

  return (
    <div>
      <h2>Accounts</h2>

      <div>
        <input
          placeholder={`Search by ${mode}`}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select value={mode} onChange={e => setMode(e.target.value)}>
          <option value="username">username</option>
          <option value="email">email</option>
        </select>
        <button onClick={load} disabled={loading}>Reload</button>
      </div>

      {err && <p>{err}</p>}
      {loading && <p>Loading…</p>}

      <table>
        <thead>
          <tr>
            <th>Name</th><th>Username</th><th>Email</th><th>Role</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id}>
              <td>{r.firstname} {r.lastname}</td>
              <td>{r.username}</td>
              <td>{r.email}</td>
              <td>{r.isAdmin ? 'admin' : 'user'}</td>
              <td>
                {r.isAdmin
                  ? <button onClick={() => make(r.id, false)}>Revoke</button>
                  : <button onClick={() => make(r.id, true)}>Make admin</button>}
              </td>
            </tr>
          ))}
          {!loading && rows.length === 0 && <tr><td colSpan="5">No users</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
import { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

export default function AdminReportedAccounts() {
  const [rows, setRows] = useState([]);
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);

  const fmt = (uid) => users[uid]?.username || users[uid]?.email || uid || 'Unknown';

  useEffect(() => {
    (async () => {
      try {
        const token = await getAuth().currentUser.getIdToken();

        // Only user reports
        const res = await fetch(`${API_BASE}/api/reports?targetType=user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to load user reports');
        const data = (await res.json()).filter(r => (r.targetType || 'user') === 'user');
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
            } catch { return [uid, null]; }
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
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ uid, banned: true }),
    });
    if (res.ok) alert('User banned.');
    else alert('Failed to ban user.');
  }

  async function handleDeleteReport(reportId) {
    if (!window.confirm('Delete this report?')) return;
    const token = await getAuth().currentUser.getIdToken();

    const tryPaths = [
      `${API_BASE}/api/reports/${reportId}`,
      `${API_BASE}/api/admin/reports/${reportId}`,
    ];
    let ok = false;
    for (const p of tryPaths) {
      const res = await fetch(p, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) { ok = true; break; }
    }
    if (ok) setRows(prev => prev.filter(r => r._id !== reportId));
    else alert('Failed to delete report.');
  }

  if (loading) return <p>Loading…</p>;

  return (
    <div style={{ padding: 16 }}>
      <h2>Reported Accounts</h2>
      <table border="1" cellPadding="6" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr style={{ background: '#f2f2f2' }}>
            <th>Reported User</th>
            <th>Type</th>
            <th>Details</th>
            <th>Reported By</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => {
            const targetUid = r.reportedUserId || r.targetId;
            return (
              <tr key={r._id}>
                <td>{fmt(targetUid)}</td>
                <td>{r.reportType}</td>
                <td>{r.details}</td>
                <td>{fmt(r.reportedBy)}</td>
                <td>{r.createdAt ? new Date(r.createdAt).toLocaleString() : ''}</td>
                <td>
                  <button style={{ marginRight: 8 }} onClick={() => handleBanUser(targetUid)}>
                    🚫 Ban User
                  </button>
                  <button style={{ background: '#f9c74f' }} onClick={() => handleDeleteReport(r._id)}>
                    ❌ Delete Report
                  </button>
                </td>
              </tr>
            );
          })}
          {rows.length === 0 && (
            <tr>
              <td colSpan={6} style={{ textAlign: 'center' }}>No account reports</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

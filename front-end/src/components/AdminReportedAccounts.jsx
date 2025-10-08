import { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

export default function AdminReportedAccounts() {
  const [rows, setRows] = useState([]);
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const token = await getAuth().currentUser.getIdToken();
        const res = await fetch(`${API_BASE}/api/reports?targetType=user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to load user reports');
        const data = await res.json();
        setRows(data);

        const uidSet = new Set([
          ...data.map(r => r.targetId),
          ...data.map(r => r.reportedBy),
        ].filter(Boolean));

        const db = getFirestore();
        const entries = await Promise.all(
          [...uidSet].map(async uid => {
            try {
              const snap = await getDoc(doc(db, 'users', uid));
              return [uid, snap.exists() ? snap.data() : null];
            } catch { return [uid, null]; }
          })
        );
        setUsers(Object.fromEntries(entries));
      } catch (e) {
        alert(e.message || 'Error');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p>Loading…</p>;

  return (
    <div style={{ padding: 16 }}>
      <h2>Reported Accounts</h2>
      <table>
        <thead>
          <tr>
            <th>Reported User</th>
            <th>Type</th>
            <th>Details</th>
            <th>Reported By</th>
            <th>Status</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => {
            const reported = users[r.targetId];
            const reporter = users[r.reportedBy];
            const reportedName = reported?.username || reported?.email || r.targetId;
            const reporterName = reporter?.username || reporter?.email || r.reportedBy;
            return (
              <tr key={r._id}>
                <td>{reportedName}</td>
                <td>{r.reportType}</td>
                <td>{r.details}</td>
                <td>{reporterName}</td>
                <td>{r.status}</td>
                <td>{r.createdAt ? new Date(r.createdAt).toLocaleString() : ''}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

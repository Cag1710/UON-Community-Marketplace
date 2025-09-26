import { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

export default function AdminReportedContent() {
  const [rows, setRows] = useState([]);
  const [users, setUsers] = useState({});     // uid -> {username,email}
  const [listings, setListings] = useState({}); // listingId -> {title}
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const token = await getAuth().currentUser.getIdToken();
        const res = await fetch(`${API_BASE}/api/reports`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to load reports');
        const data = await res.json();
        setRows(data);

        // build distinct sets
        const uidSet = new Set(data.map(r => r.reportedBy).filter(Boolean));
        const lidSet = new Set(data.map(r => r.listingId).filter(Boolean));

        // fetch Firestore users
        const db = getFirestore();
        const userEntries = await Promise.all(
          [...uidSet].map(async uid => {
            try {
              const snap = await getDoc(doc(db, 'users', uid));
              return [uid, snap.exists() ? snap.data() : null];
            } catch { return [uid, null]; }
          })
        );
        setUsers(Object.fromEntries(userEntries));

        // fetch listing titles from backend
        const listingEntries = await Promise.all(
          [...lidSet].map(async id => {
            try {
              const r = await fetch(`${API_BASE}/api/listings/${id}`);
              if (!r.ok) return [id, null];
              const l = await r.json();
              return [id, { title: l.title }];
            } catch { return [id, null]; }
          })
        );
        setListings(Object.fromEntries(listingEntries));
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
      <h2>Reported Content</h2>
      <table>
        <thead>
          <tr>
            <th>Listing</th><th>Type</th><th>Details</th>
            <th>Reported By</th><th>Status</th><th>Created</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => {
            const u = users[r.reportedBy];
            const listing = listings[r.listingId];
            const reporter = u?.username || u?.email || r.reportedBy;
            const title = listing?.title || r.listingId;
            return (
              <tr key={r._id}>
                <td><Link to={`/listing/${r.listingId}`}>{title}</Link></td>
                <td>{r.reportType}</td>
                <td>{r.details}</td>
                <td>{reporter}</td>
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

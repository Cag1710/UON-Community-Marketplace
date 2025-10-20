import { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

export default function AdminReportedContent() {
  const [rows, setRows] = useState([]);
  const [users, setUsers] = useState({});       // uid -> {username,email}
  const [listings, setListings] = useState({});  // id  -> {title,userId}
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const token = await getAuth().currentUser.getIdToken();

        // Pull reports and keep ONLY listing reports
        const res = await fetch(`${API_BASE}/api/reports?targetType=listing`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to load reports');
        const all = await res.json();
        const data = all.filter(r => (r.targetType || 'listing') === 'listing');

        setRows(data);

        // Build sets for fetching related docs
        const uidSet = new Set();
        const lidSet = new Set();

        data.forEach(r => {
          if (r.reportedBy) uidSet.add(r.reportedBy);
          const lid = r.listingId || r.targetId;
          if (lid) lidSet.add(lid);
          if (r.listingOwnerId) uidSet.add(r.listingOwnerId);
        });

        // Fetch listing docs from backend (for title & owner uid)
        const listingEntries = await Promise.all(
          [...lidSet].map(async id => {
            try {
              const r = await fetch(`${API_BASE}/api/listings/${id}`);
              if (!r.ok) return [id, null];
              const l = await r.json();
              // l.userId is the owner uid
              if (l.userId) uidSet.add(l.userId);
              return [id, { title: l.title, userId: l.userId }];
            } catch {
              return [id, null];
            }
          })
        );
        setListings(Object.fromEntries(listingEntries));

        // Fetch Firestore user documents (reporters + owners)
        const db = getFirestore();
        const userEntries = await Promise.all(
          [...uidSet].map(async uid => {
            try {
              const snap = await getDoc(doc(db, 'users', uid));
              return [uid, snap.exists() ? snap.data() : null];
            } catch {
              return [uid, null];
            }
          })
        );
        setUsers(Object.fromEntries(userEntries));
      } catch (e) {
        alert(e.message || 'Error loading reports');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const fmtName = (uid) =>
    users[uid]?.username || users[uid]?.email || uid || 'Unknown';

  async function handleBanUser(uid) {
    if (!uid) return alert('Could not determine listing owner.');
    if (!window.confirm('Ban this user (listing owner)?')) return;
    const token = await getAuth().currentUser.getIdToken();
    const res = await fetch(`${API_BASE}/api/admin/ban-user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ uid, banned: true }),
    });
    if (res.ok) alert('User banned successfully.');
    else alert('Failed to ban user.');
  }

  async function handleDeleteListing(listingId) {
    if (!listingId) return;
    if (!window.confirm('Delete this listing?')) return;
    const token = await getAuth().currentUser.getIdToken();
    const res = await fetch(`${API_BASE}/api/admin/listings/${listingId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) alert('Listing deleted successfully.');
    else alert('Failed to delete listing.');
  }

  async function handleDeleteReport(reportId) {
    if (!window.confirm('Delete this report?')) return;
    const token = await getAuth().currentUser.getIdToken();

    // Prefer the non-admin endpoint if that’s what your backend has,
    // otherwise keep the admin namespaced one.
    const tryPaths = [
      `${API_BASE}/api/reports/${reportId}`,
      `${API_BASE}/api/admin/reports/${reportId}`,
    ];

    let ok = false;
    for (const p of tryPaths) {
      const res = await fetch(p, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) { ok = true; break; }
    }

    if (ok) {
      setRows(prev => prev.filter(r => r._id !== reportId));
    } else {
      alert('Failed to delete report.');
    }
  }

  if (loading) return <p>Loading…</p>;

  return (
    <div style={{ padding: 16 }}>
      <h2>Reported Listings</h2>
      <table border="1" cellPadding="6" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr style={{ background: '#f2f2f2' }}>
            <th>Listing</th>
            <th>Type</th>
            <th>Details</th>
            <th>Reported By</th>
            <th>Listing Owner</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => {
            const listingId = r.listingId || r.targetId;
            const listingInfo = listings[listingId];
            const reporter = fmtName(r.reportedBy);
            const title = listingInfo?.title || r.listingTitle || listingId || '—';
            const ownerUid = r.listingOwnerId || listingInfo?.userId;

            return (
              <tr key={r._id}>
                <td>
                  {listingId ? <Link to={`/listing/${listingId}`}>{title}</Link> : <span>—</span>}
                </td>
                <td>{r.reportType}</td>
                <td>{r.details}</td>
                <td>{reporter}</td>
                <td>{fmtName(ownerUid)}</td>
                <td>{r.createdAt ? new Date(r.createdAt).toLocaleString() : ''}</td>
                <td>
                  <button style={{ marginRight: 8 }} onClick={() => handleDeleteListing(listingId)}>
                    🗑 Delete Listing
                  </button>
                  <button style={{ marginRight: 8 }} onClick={() => handleBanUser(ownerUid)}>
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
              <td colSpan={7} style={{ textAlign: 'center' }}>No listing reports</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

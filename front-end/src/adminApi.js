import { getAuth } from 'firebase/auth';
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

export async function setUserAdmin(uid, makeAdmin) {
  const token = await getAuth().currentUser.getIdToken();  // must be a Firebase ID token
  const res = await fetch(`${API_BASE}/api/admin/set-role`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ uid, admin: !!makeAdmin }),
  });
  // If fetch reaches here, network succeeded; now check status
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `HTTP ${res.status}`);
  }
  return res.json();
}
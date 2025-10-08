import { getAuth } from 'firebase/auth';

export async function submitReport({ apiBase, targetType, targetId, reportType, details }) {
  const curr = getAuth().currentUser;
  if (!curr) throw new Error('Please sign in to report');

  const token = await curr.getIdToken();
  const res = await fetch(`${apiBase}/api/reports`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ targetType, targetId, reportType, details }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `HTTP ${res.status}`);
  }
  return res.json();
}
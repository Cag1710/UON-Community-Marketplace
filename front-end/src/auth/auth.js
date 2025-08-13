// front-end/src/auth/auth.js
/**
 * Replace this with your real auth later.
 * For now, we read a fake currentUser from localStorage.
 * Example structure to store:
 * localStorage.setItem("currentUser", JSON.stringify({ id: "USER_ID", name: "Alex" }));
 */

export function getCurrentUser() {
  try {
    const raw = localStorage.getItem("currentUser");
    if (!raw) return null;
    const u = JSON.parse(raw);
    if (u && u.id) return u;
    return null;
  } catch {
    return null;
  }
}

export function requireAuthOrNull() {
  return getCurrentUser(); // returns user object or null
}

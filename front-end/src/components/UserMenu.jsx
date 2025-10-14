import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import useUser from "../useUser";

export default function UserMenu() {
    const { user, isAdmin, isLoading } = useUser();
    const [open, setOpen] = useState(false);
    const rootRef = useRef(null);
    const btnRef  = useRef(null);

    useEffect(() => {
        function onDocClick(e) {
        if (!rootRef.current) return;
        if (!rootRef.current.contains(e.target)) setOpen(false);
        }
        function onKey(e) {
        if (e.key === "Escape") setOpen(false);
        }
        document.addEventListener("click", onDocClick);
        document.addEventListener("keydown", onKey);
        return () => {
        document.removeEventListener("click", onDocClick);
        document.removeEventListener("keydown", onKey);
        };
    }, []);

    async function doSignOut() {
    await signOut(getAuth());
    setOpen(false);
  }

  const avatarUrl =
    user?.photoURL ||
    "https://ui-avatars.com/api/?name=" +
      encodeURIComponent(user?.displayName || user?.email || "U");

  return (
    <div ref={rootRef} style={{ position: "relative", display: "inline-block" }}>
      <button
        ref={btnRef}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen(o => !o)}
        style={{
          width: 36, height: 36, borderRadius: "50%", overflow: "hidden",
          border: "1px solid #cbd5e1", background: "white", padding: 0, cursor: "pointer"
        }}
      >
        <img src={avatarUrl} alt="User menu" style={{ width: "100%", height: "100%" }} />
      </button>

      {open && (
        <div
          role="menu"
          style={{
            position: "absolute", right: 0, marginTop: 8, minWidth: 200,
            background: "white", border: "1px solid #e5e7eb", borderRadius: 8,
            boxShadow: "0 10px 15px rgba(0,0,0,0.1)", zIndex: 50, padding: 8
          }}
        >
          <div style={{ padding: "8px 10px", borderBottom: "1px solid #f1f5f9" }}>
            <div style={{ fontWeight: 600, fontSize: 14 }}>{user?.displayName || user?.email}</div>
            <div style={{ fontSize: 12, color: "#64748b" }}>{isAdmin ? "Admin" : "User"}</div>
          </div>

          <MenuItem to="/profile" onClick={() => setOpen(false)}>Account Settings</MenuItem>
          {isAdmin && <MenuItem to="/admin-portal">Admin Portal</MenuItem>}
          <MenuItem to="/messages" onClick={() => setOpen(false)}>Messages</MenuItem>
          <MenuItem to="/listings" onClick={() => setOpen(false)}>My Listings</MenuItem>

          <hr style={{ border: 0, borderTop: "1px solid #f1f5f9", margin: "6px 0" }} />

          <button
            onClick={doSignOut}
            style={{
              width: "100%", textAlign: "left", background: "transparent",
              border: 0, padding: "8px 10px", cursor: "pointer"
            }}
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}

function MenuItem({ to, children, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      role="menuitem"
      style={{ display: "block", padding: "8px 10px", textDecoration: "none", color: "#0f172a" }}
    >
      {children}
    </Link>
  );
}
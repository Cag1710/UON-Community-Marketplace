import React, { useEffect, useMemo, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import useUser from '../useUser';
import { updateProfile } from 'firebase/auth';
import {
  getFirestore,
  doc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';

async function uploadToCloudinary(file, { cloudName, uploadPreset, folder }) {
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
  const form = new FormData();
  form.append('file', file);
  form.append('upload_preset', uploadPreset);
  if (folder) form.append('folder', folder);

  const res = await fetch(url, { method: 'POST', body: form });
  if (!res.ok) {
    const t = await res.text().catch(() => '');
    throw new Error(`Cloudinary upload failed: ${res.status} ${t}`);
  }
  const json = await res.json();
  return json.secure_url;
}

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '';
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_PRESET || '';
const CLOUDINARY_FOLDER = 'user-photos';

export default function ProfilePage() {
  const { isLoading, user } = useUser();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');              // case-preserving
  const [originalUsername, setOriginalUsername] = useState('');
  const [originalUsernameLower, setOriginalUsernameLower] = useState('');

  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState(null);
  const [photoBusy, setPhotoBusy] = useState(false);
  const [error, setError] = useState('');
  const [unameChecking, setUnameChecking] = useState(false);
  const [unameError, setUnameError] = useState('');

  const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';
  const db = getFirestore();

  useEffect(() => {
    if (!user) return;
    setDisplayName(user.displayName || '');
    setEmail(user.email || '');
  }, [user]);

  // Load current username from your API (preserve case)
  useEffect(() => {
    if (!user?.uid) return;
    (async () => {
      try {
        const resp = await fetch(`${API_BASE}/api/users/public?ids=${encodeURIComponent(user.uid)}`);
        if (resp.ok) {
          const map = await resp.json();
          const me = map[user.uid];
          const u = me?.username || '';
          setUsername(u);
          setOriginalUsername(u);
          setOriginalUsernameLower(u.toLowerCase());
        }
      } catch (err) {
        console.error('Failed to load username', err);
      }
    })();
  }, [user?.uid, API_BASE]);

  useEffect(() => {
    return () => {
      if (preview?.url) URL.revokeObjectURL(preview.url);
    };
  }, [preview]);

  // --- Username validation & availability (case-insensitive) ---
  const usernameTrimmed = useMemo(() => (username || '').trim(), [username]);
  const usernameLower = useMemo(() => usernameTrimmed.toLowerCase(), [usernameTrimmed]);

  function validateLocalUsername(name) {
    if (!name) return 'Username is required.';
    if (name.length < 3) return 'Username must be at least 3 characters.';
    if (name.length > 20) return 'Username must be at most 20 characters.';
    if (!/^[a-zA-Z0-9._]+$/.test(name)) return 'Only letters, numbers, dot and underscore allowed.';
    return '';
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setUnameError('');
      if (!user?.uid) return;

      const localErr = validateLocalUsername(usernameTrimmed);
      if (localErr) {
        setUnameError(localErr);
        return;
      }

      // If unchanged, skip
      if (usernameLower === (originalUsernameLower || '')) {
        setUnameError('');
        return;
      }

      try {
        setUnameChecking(true);
        // Uniqueness check on lowercase field
        const q = query(collection(db, 'users'), where('usernameLower', '==', usernameLower));
        const snap = await getDocs(q);
        let takenByOther = false;
        snap.forEach((docu) => {
          if (docu.id !== user.uid) takenByOther = true;
        });
        if (!cancelled) {
          setUnameError(takenByOther ? 'This username is already taken.' : '');
        }
      } catch (e) {
        console.error(e);
        if (!cancelled) setUnameError('Could not verify username right now.');
      } finally {
        if (!cancelled) setUnameChecking(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [usernameTrimmed, usernameLower, db, user?.uid, originalUsernameLower]);

  if (isLoading) return <div style={{ textAlign: 'center', padding: 40 }}>Loading...</div>;
  if (!user) {
    window.location.href = '/login';
    return null;
  }

  const displayLabel = originalUsername || displayName || (email ? email.split('@')[0] : 'Unnamed User');
  const headerAvatar = preview?.url || user?.photoURL || null;
  const avatarInitial = (displayLabel[0] || 'U').toUpperCase();

  function onPickPhoto(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith('image/')) return alert('Please choose an image file (jpg/png/webp).');
    if (f.size > 5 * 1024 * 1024) return alert('Max 5MB.');
    const url = URL.createObjectURL(f);
    setPreview((prev) => {
      if (prev?.url) URL.revokeObjectURL(prev.url);
      return { file: f, url };
    });
  }

  async function handleSaveBasic() {
    try {
      setBusy(true);
      setError('');

      const localErr = validateLocalUsername(usernameTrimmed);
      if (localErr) {
        setUnameError(localErr);
        return;
      }
      if (unameError || unameChecking) return;

      // 1) Update Firebase Auth displayName (optional)
      if ((user.displayName || '') !== (displayName || '')) {
        await updateProfile(user, { displayName: displayName || '' });
      }

      // 2) Update Firestore user doc – preserve case + store lowercase
      await updateDoc(doc(db, 'users', user.uid), {
        displayName: displayName || '',
        username: usernameTrimmed,        // preserve case for display
        usernameLower: usernameLower,     // for uniqueness/search
      });

      setOriginalUsername(usernameTrimmed);
      setOriginalUsernameLower(usernameLower);

      alert('Saved!');
    } catch (e) {
      console.error(e);
      setError('Could not save changes.');
    } finally {
      setBusy(false);
    }
  }

  const styles = {
    bg: {
      backgroundColor: '#f9fafb',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      color: '#111827',
      fontFamily: 'Inter, sans-serif',
    },
    header: {
      backgroundColor: '#fff',
      borderBottom: '1px solid #e5e7eb',
      padding: '2rem 1.5rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    content: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: '20px',
      padding: '2rem 1.5rem',
      maxWidth: '1200px',
      margin: '0 auto',
      flexGrow: 1,
    },
    card: {
      backgroundColor: '#fff',
      border: '1px solid #e5e7eb',
      borderRadius: '10px',
      boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
      padding: '20px',
      flex: '1 1 300px',
    },
    field: { display: 'flex', flexDirection: 'column', marginBottom: '10px' },
    label: { fontWeight: '500', fontSize: '0.875rem', marginBottom: '5px' },
    input: { border: '1px solid #d1d5db', borderRadius: '8px', padding: '8px 10px', fontSize: '0.875rem' },
    button: {
      backgroundColor: '#111827',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      padding: '10px 16px',
      cursor: 'pointer',
      fontSize: '0.875rem',
      fontWeight: '500',
      marginTop: '10px',
    },
    resetButton: {
      backgroundColor: '#4A72A4',
      color: 'white',
      border: 'none',
      borderRadius: 6,
      padding: '10px 18px',
      cursor: 'pointer',
      fontSize: '0.875rem',
      fontWeight: 500,
      transition: 'background-color 0.2s, transform 0.1s',
      boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
    },
    primaryButton: {
      backgroundColor: '#4A72A4',
      color: 'white',
      border: 'none',
      borderRadius: 6,
      padding: '10px 18px',
      cursor: 'pointer',
      fontSize: '0.875rem',
      fontWeight: 500,
      boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
    },
    divider: { border: 0, height: 1, backgroundColor: '#e5e7eb' },
  };

  return (
    <div style={styles.bg}>
      <Navbar />

      <header style={styles.header}>
        <div>
          <h1>Account Settings</h1>
          <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
            Manage your profile, security, and preferences.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: '600' }}>{displayLabel}</div>
            <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{email}</div>
          </div>

          {headerAvatar ? (
            <img
              src={headerAvatar}
              alt="avatar"
              style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', border: '1px solid #e5e7eb' }}
            />
          ) : (
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                color: 'white',
                display: 'grid',
                placeItems: 'center',
                fontWeight: '600',
              }}
            >
              {avatarInitial}
            </div>
          )}
        </div>
      </header>

      <main style={styles.content}>
        <div style={styles.card}>
          <h3>Basic Info</h3>
          <hr style={{ marginBottom: 20, ...styles.divider }} />

          {!!error && <div style={{ color: '#dc2626', marginBottom: 12 }}>{error}</div>}

          <div style={styles.field}>
            <label style={styles.label}>Username</label>
            <input
              style={{ ...styles.input, borderColor: unameError ? '#dc2626' : '#d1d5db' }}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. Caleb.G"
            />
            <div style={{ marginTop: 6, fontSize: '0.8rem' }}>
              {unameChecking ? (
                <span style={{ color: '#6b7280' }}>Checking availability…</span>
              ) : unameError ? (
                <span style={{ color: '#dc2626' }}>{unameError}</span>
              ) : usernameTrimmed && usernameLower !== (originalUsernameLower || '') ? (
                <span style={{ color: '#16a34a' }}>Looks good — available.</span>
              ) : null}
            </div>
          </div>

          <button
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#35547a')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#4A72A4')}
            type="button"
            style={{
              ...styles.primaryButton,
              opacity: busy || unameChecking ? 0.8 : 1,
              pointerEvents: busy || unameChecking ? 'none' : 'auto',
            }}
            disabled={busy || unameChecking || !!unameError}
            onClick={handleSaveBasic}
          >
            {busy ? 'Saving…' : 'Save Changes'}
          </button>

          <hr style={{ margin: '25px 0 20px 0' }} />
          <label style={styles.label}>Change Password</label>
          <div style={{ marginTop: 12 }}>
            <button
              style={styles.resetButton}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#35547a')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#4A72A4')}
              onClick={() => (window.location.href = '/forgot-password')}
            >
              Go to Reset Page
            </button>
          </div>
        </div>

        <div style={styles.card}>
          <h3>Profile Picture</h3>
          {!!error && <div style={{ color: '#dc2626', marginBottom: 8 }}>{error}</div>}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 8 }}>
            <img
              src={preview?.url || user?.photoURL || 'https://placehold.co/96x96?text=U'}
              alt="avatar"
              style={{ width: 96, height: 96, borderRadius: '50%', objectFit: 'cover', border: '1px solid #e5e7eb' }}
            />
            <div>
              <label
                htmlFor="avatar-input"
                style={{
                  display: 'inline-block',
                  padding: '8px 12px',
                  borderRadius: 6,
                  border: '1px solid #d1d5db',
                  cursor: 'pointer',
                }}
              >
                Choose Image
              </label>
              <input id="avatar-input" type="file" accept="image/*" onChange={onPickPhoto} style={{ display: 'none' }} />
              {preview && (
                <button
                  style={{ ...styles.primaryButton, marginLeft: 10 }}
                  disabled={photoBusy}
                  onClick={async () => {
                    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
                      return alert('Cloudinary env vars missing. Add VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_PRESET.');
                    }
                    try {
                      setPhotoBusy(true);
                      const url = await uploadToCloudinary(preview.file, {
                        cloudName: CLOUDINARY_CLOUD_NAME,
                        uploadPreset: CLOUDINARY_UPLOAD_PRESET,
                        folder: CLOUDINARY_FOLDER,
                      });

                      await updateProfile(user, { photoURL: url });
                      await updateDoc(doc(db, 'users', user.uid), { photoURL: url });

                      setPreview(null);
                      alert('Profile photo updated!');
                    } catch (e) {
                      console.error(e);
                      alert('Could not update photo.');
                    } finally {
                      setPhotoBusy(false);
                    }
                  }}
                >
                  {photoBusy ? 'Saving…' : 'Save Photo'}
                </button>
              )}
            </div>
          </div>
        </div>

        <div style={styles.card}>
          <h3>Danger Zone</h3>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            Deleting your account is permanent and cannot be undone.
          </p>
          <button style={{ ...styles.button, backgroundColor: '#dc2626' }}>
            Delete Account
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}

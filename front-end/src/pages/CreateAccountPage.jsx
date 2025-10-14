import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";
import ProfileIcon from "../assets/profile.svg";
import UoNLogo from "../assets/uonlogo.svg";

async function uploadToCloudinary(file, { cloudName, uploadPreset, folder }) {
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", uploadPreset);
  if (folder) form.append("folder", folder);

  const res = await fetch(url, { method: "POST", body: form });
  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`Cloudinary upload failed: ${res.status} ${t}`);
  }
  const json = await res.json();
  return json.secure_url;
}

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "";
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_PRESET || "";
const CLOUDINARY_FOLDER = "user-photos";

export default function CreateAccountPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [username, setUsername] = useState("");

  const [file, setFile] = useState(null);
  const [previewURL, setPreviewURL] = useState("");

  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      if (previewURL) URL.revokeObjectURL(previewURL);
    };
  }, [previewURL]);

  function onPickFile(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      setError("Please choose an image file (JPG/PNG/WebP).");
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      setError("Image is too large (max 5MB).");
      return;
    }
    setError("");
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreviewURL((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return url;
    });
  }

  async function createAccount(e) {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Password and Confirm Password do not match!");
      return;
    }

    setBusy(true);
    setError("");

    const auth = getAuth();
    const db = getFirestore();

    try {
      const cleanEmail = email.trim();
      const { user } = await createUserWithEmailAndPassword(auth, cleanEmail, password);

      let photoURL = "";
      if (file && CLOUDINARY_CLOUD_NAME && CLOUDINARY_UPLOAD_PRESET) {
        try {
          photoURL = await uploadToCloudinary(file, {
            cloudName: CLOUDINARY_CLOUD_NAME,
            uploadPreset: CLOUDINARY_UPLOAD_PRESET,
            folder: CLOUDINARY_FOLDER,
          });
        } catch (e) {
          console.warn("Cloudinary upload failed (continuing without photo):", e);
          photoURL = "";
        }
      }

      const displayName = username || [firstname, lastname].filter(Boolean).join(" ") || "";
      try {
        await updateProfile(user, { displayName, photoURL });
      } catch (e) {
        console.warn("updateProfile failed (continuing):", e);
      }

      await setDoc(doc(db, "users", user.uid), {
        firstname,
        lastname,
        username,
        email: cleanEmail,
        photoURL: photoURL || "",
        createdAt: serverTimestamp(),
        isAdmin: false,
      });

      navigate("/");
    } catch (err) {
      console.error("[signup] fatal error:", err);
      setError(err?.message || "Could not create account.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <div className="account-container">
        {error && <p style={{ color: "red", marginBottom: 8 }}>{error}</p>}

        <img src={UoNLogo} className="logo" alt="UoN logo" />
        <h2 className="headingtext">Create Account</h2>

        <div className="icon-wrapper" style={{ position: "relative" }}>
          {previewURL ? (
            <img
              src={previewURL}
              alt="Selected profile"
              className="profile-icon"
              style={{ objectFit: "cover", borderRadius: "50%" }}
            />
          ) : (
            <img src={ProfileIcon} alt="Profile Icon" className="profile-icon" />
          )}

          <label
            htmlFor="avatar-input"
            style={{
              position: "absolute",
              bottom: -8,
              left: "50%",
              transform: "translateX(-50%)",
              background: "#f3f4f6",
              color: "#111827",
              border: "1px solid #d1d5db",
              borderRadius: 8,
              padding: "6px 10px",
              fontSize: 12,
              cursor: "pointer",
              boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
              whiteSpace: "nowrap",
            }}
          >
            Choose Image
          </label>
          <input id="avatar-input" type="file" accept="image/*" onChange={onPickFile} style={{ display: "none" }} />
        </div>

        <p className="generaltext" style={{ marginTop: 24 }}>
          Please enter your details below to create your account.
        </p>

        <form className="form" onSubmit={createAccount}>
          <div className="name-row">
            <input
              type="text"
              placeholder="First name*"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Last name*"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              required
            />
          </div>

          <input
            type="text"
            placeholder="Username*"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email*"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password*"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password*"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <div className="button-row">
            <Link to="/"><button type="button" className="form-button" disabled={busy}>Back</button></Link>
            <button type="submit" className="form-button" disabled={busy}>
              {busy ? "Creating…" : "Create Account"}
            </button>
          </div>

          <div className="form-footer">
            <Link to="/login"><small className="account-text">Already Have an Account?</small></Link>
            <Link to="/faq"><small className="help-text">Help</small></Link>
          </div>
        </form>
      </div>
    </>
  );
}

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import ProfileIcon from '../assets/profile.svg';
import UoNLogo from '../assets/uonlogo.svg';
import { getFirestore, doc, setDoc } from "firebase/firestore"

export default function CreateAccountPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [username, setUsername] = useState('');

  const navigate = useNavigate();

  async function createAccount(e) {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Password and Confirm Password do not match!');
      return;
    }
    try {
      const auth = getAuth();
      const db = getFirestore();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        firstname,
        lastname,
        username,
        email,
        createdAt: new Date()
      });

      navigate('/');
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <>
      <div className="account-container">
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <img src={UoNLogo} className="logo"></img>
        <h2 className="headingtext">Create Account</h2>
        <div className="icon-wrapper">
          <img src={ProfileIcon} alt="Profile Icon" className="profile-icon" />
        </div>
        <p className="generaltext">Please enter your details below to create your account.</p>

        <form className="form" onSubmit={createAccount}>
          <div className="name-row">
            <input type="text" placeholder="First name*" value={firstname} onChange={e => setFirstname(e.target.value)} />
            <input type="text" placeholder="Last name*" value={lastname} onChange={e => setLastname(e.target.value)} />
          </div>
          <input type="text" placeholder="Username*" value={username} onChange={e => setUsername(e.target.value)} />
          <input type="text" placeholder="Email*" value={email} onChange={e => setEmail(e.target.value)} />
          <input type="password" placeholder="Password*" value={password} onChange={e => setPassword(e.target.value)} />
          <input type="password" placeholder="Confirm Password*" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
          <div className="button-row">
            <Link to='/'><button type="button" className="form-button">Back</button></Link>
            <button type="submit" className="form-button">Create Account</button>
          </div>
        </form>

        <div className="form-footer">
          <small className="help-text">Help</small>
        </div>
      </div>
    </>
  );
}

import Navbar from "../components/Navbar";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

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
      await createUserWithEmailAndPassword(getAuth(), email, password);
      navigate('/');
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <>
      <Navbar />
      <div className="create-account-container">
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <h2>Create Account</h2>
        <div className="avatar-placeholder">👤</div>
        <p>Please enter your details below to create your account.</p>

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
            <Link to='/'><button type="button">Back</button></Link>
            <button type="submit">Create Account</button>
          </div>
        </form>

        <small className="help-text">Help</small>
      </div>
    </>
  );
}

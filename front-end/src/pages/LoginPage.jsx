import Navbar from "../components/Navbar";
import { useState } from "react";
import { Link, useNavigate, useNavigation } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

export default function LoginPage() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    async function logIn(e) {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(getAuth(), email, password);
            navigate('/');
        } catch (e) {
            setError(e.message);
        }
    }

    return (
        <>
            <Navbar />
            <div className="login-account-container">
            {error && <p>{error}</p>}
            <h2>Sign in</h2>
            {/* Just a placeholder for the moment didnt have a lot of time right now */}
            <div className="avatar-placeholder">👤</div> 

            <form className="form">
                <input type="text" placeholder="Username/Email*" value={email} onChange={e => setEmail(e.target.value)} />
                <input type="password" placeholder="Password*" value={password} onChange={e => setPassword(e.target.value)} />
                <div className="button-row">
                <Link to='/'><button type="button">Back</button></Link>
                <button type="submit" onClick={logIn}>Sign In</button>
                </div>
            </form>

            <small className="help-text">Help</small>
            </div>
        </>
    );
  }
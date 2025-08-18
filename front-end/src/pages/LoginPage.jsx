import Navbar from "../components/Navbar";
import { useState } from "react";
import { Link, useNavigate, useNavigation } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import ProfileIcon from '../assets/profile.svg';
import UoNLogo from '../assets/uonlogo.svg';

export default function LoginPage() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    async function logIn(e) {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(getAuth(), email, password);
            const user = getAuth().currentUser;
            if (user) {
                await user.getIdToken(true); // refresh token
                const tokenResult = await user.getIdTokenResult();
                console.log("Custom claims:", tokenResult.claims); // <-- should show { admin: true }
            }
            navigate('/');
        } catch (e) {
            setError(e.message);
        }
    }

    return (
        <>
            <div className="account-container">
                {error && <p>{error}</p>}
                <img src={UoNLogo} className="logo"></img>
                <h2 className="headingtext">Sign in</h2>
                <div className="icon-wrapper">
                    <img src={ProfileIcon} alt="Profile Icon" className="profile-icon" />
                </div>

                <form className="form" onSubmit={logIn}>
                    <input type="text" placeholder="Username/Email*" value={email} onChange={e => setEmail(e.target.value)} />
                    <input type="password" placeholder="Password*" value={password} onChange={e => setPassword(e.target.value)} />
                    <div className="checkbox-container">
                        <input type="checkbox" id="remember" />
                        <label htmlFor="remember">Keep me signed in</label>
                    </div>
                    <div className="button-row">
                        <Link to='/'><button type="button" className="form-button">Back</button></Link>
                        <button type="submit" className="form-button">Sign In</button>
                    </div>
                </form>

                <div className="form-footer">
                    <Link to='/forgot-password'><small className="forgot-text">Forgot Password?</small></Link>
                    <small className="help-text">Help</small>
                </div>
            </div>
        </>
    );
}
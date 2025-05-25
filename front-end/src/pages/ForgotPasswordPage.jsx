import UoNLogo from '../assets/uonlogo.svg';
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

export default function ForgotPasswordPage() {

    const [email, setEmail] = useState('');

    const navigate = useNavigate();

    async function forgotPassword(e) {
        e.preventDefault();

        const auth = getAuth();

        try {
            await sendPasswordResetEmail(auth, email);
            alert('Password reset email sent!');
            navigate('/');
        } catch (error) {
            console.error('Firebase forgot password error:', error);
            alert('Failed to send reset email: ' + error.message);
        }
    }

    return (
        <>
            <div className="account-container">
                <img src={UoNLogo} className="logo"></img>
                <h2 className="headingtext">Forgot Password?</h2>
                <p className="generaltext">Please provide the username or email that is associated with your account and we’ll send you password reset instructions.</p>


                <form className='form' onSubmit={forgotPassword}>
                    <input type="text" placeholder="Email*" value={email} onChange={e => setEmail(e.target.value)} />

                    <div className='button-row'>
                        <Link to='/'><button type="button" className="form-button">Back</button></Link>
                        <button type="submit" className="form-button">Forgot Password</button>
                    </div>
                </form>
            </div>
        </>
    );
}
import Navbar from "../components/Navbar";

export default function LoginPage() {
    return (
        <>
            <Navbar />
            <div className="login-account-container">
  
            <h2>Sign in</h2>
            {/* Just a placeholder for the moment didnt have a lot of time right now */}
            <div className="avatar-placeholder">👤</div> 

            <form className="form">
                <div className="name-row">
                <input type="text" placeholder="First name*" />
                <input type="text" placeholder="Last name*" />
                </div>
                <input type="text" placeholder="Username*" />
                <input type="email" placeholder="Email*" />
                <input type="password" placeholder="Password*" />
                <input type="password" placeholder="Confirm Password*" />
                <div className="button-row">
                <button type="button">Back</button>
                <button type="submit">Create Account</button>
                </div>
            </form>

            <small className="help-text">Help</small>
            </div>
        </>
    );
  }
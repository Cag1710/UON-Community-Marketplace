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
                <input type="text" placeholder="Username/Email*" />
                <input type="password" placeholder="Password*" />
                <div className="button-row">
                <button type="button">Back</button>
                <button type="submit">Sign In</button>
                </div>
            </form>

            <small className="help-text">Help</small>
            </div>
        </>
    );
  }
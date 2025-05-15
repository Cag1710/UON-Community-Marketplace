import { Link } from "react-router-dom";


export default function NavBar() {

    return (
        <nav>
            <ul>
                <li><Link to='/'>Home</Link></li>
                <li><Link to='/create-account'>Create Account</Link></li>
                <li><Link to='/login'>Login</Link></li>
                <li><Link to='/listings'>Listings</Link></li>
            </ul>
        </nav>
    )
}
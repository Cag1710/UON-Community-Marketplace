<<<<<<< Updated upstream:front-end/src/components/Navbar.js
import React from 'react';

function Navbar() {
  return (
    <nav style={styles.nav}>
      <div style={styles.left}>
        <h2 style={styles.logo}>UON Community Marketplace</h2>
      </div>
      <div style={styles.links}>
<<<<<<< Updated upstream:front-end/src/components/Navbar.js
        <a href="#" style={styles.link}>Home</a>
        <a href="#" style={styles.link}>Listings</a>
        <a href="#" style={styles.link}>Contact</a>
        <a href="#" style={styles.link}>Help</a>
=======
        <Link to="/" style={styles.link}>Home</Link>
        <Link to="/listings" style={styles.link}>Listings</Link>
        <Link to="/contact" style={styles.link}>Contact Us</Link>
        <Link to="/help" style={styles.link}>Help</Link>
        <Link to="/create-listing" style={styles.link}>Create Listing</Link>
>>>>>>> Stashed changes:front-end/src/components/Navbar.jsx
      </div>
      <div style={styles.profile}>
        <div style={styles.profileIcon}>👤</div>
=======
import React, { useState } from 'react';
import { Link } from "react-router-dom";
import UoNLogo from "../assets/uonlogo.svg";
import useUser from '../useUser';
import UserMenu from "./UserMenu";
import "./Navbar.css";

function Navbar() {
  const { isLoading, user } = useUser();
  const [open, setOpen] = useState(false);

  return (
    <nav className="nav">
      <div className="nav__left">
        <img src={UoNLogo} alt="UON Logo" className="nav__logoImg" />
        <h2 className="nav__logo">UON Community Marketplace</h2>
      </div>

      <button
        className="nav__toggle"
        aria-expanded={open}
        aria-controls="primary-nav"
        onClick={() => setOpen(o => !o)}
      >
        ☰
      </button>

      <div id="primary-nav" className="nav__links" data-open={open}>
        <Link to="/">Home</Link>
        <Link to="/listings">Listings</Link>
        <Link to="/faq">FAQ</Link>
        <Link to="/create-listing">Create Listing</Link>
        <Link to="/messages">Messages</Link>
      </div>

      <div className="nav__profile">
        {!isLoading && user && <UserMenu />}
>>>>>>> Stashed changes:front-end/src/components/Navbar.jsx
      </div>
    </nav>
  );
}

<<<<<<< Updated upstream:front-end/src/components/Navbar.js
const styles = {
  nav: {
    backgroundColor: '#1A1A40',
    color: 'white',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 40px',
  },
  left: {
    flex: 1,
  },
  logo: {
    margin: 0,
    fontSize: '20px',
  },
  links: {
    flex: 2,
    display: 'flex',
    justifyContent: 'space-evenly', // NEW: evenly spaces out the links
    
  },
  
  link: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '16px',
    fontWeight: '500',
  },
  profile: {
    flex: 1,
    display: 'flex',
    justifyContent: 'flex-end',
  },
  profileIcon: {
    width: '36px',
    height: '36px',
    backgroundColor: 'white',
    color: '#1A1A40',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'bold',
    fontSize: '18px',
    cursor: 'pointer',
  },
};

=======
>>>>>>> Stashed changes:front-end/src/components/Navbar.jsx
export default Navbar;

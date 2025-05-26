import React from 'react';
import { Link } from "react-router-dom";
import ProfileIcon from "../assets/profile.svg"
import useUser from '../useUser';

function Navbar() {

  const { isLoading, user } = useUser();

  return (
    <nav style={styles.nav}>
      <div style={styles.left}>
        <h2 style={styles.logo}>UON Community Marketplace</h2>
      </div>

      <div style={styles.links}>
        <Link to="/" style={styles.link}>Home</Link>
        <Link to="/listings" style={styles.link}>Listings</Link>
        <Link to="/contact" style={styles.link}>Contact Us</Link>
        <Link to="/help" style={styles.link}>Help</Link>
        <Link to='/listings' style={styles.link}>Listings</Link>
      </div>

      <div style={styles.profile}>
        {!isLoading && user && (
          <img src={ProfileIcon} alt="Profile Icon" style={styles.profileIcon} />
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    backgroundColor: '#4A72A4',
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
    fontFamily: 'Roboto, sans-serif',
    fontSize: '20px',
  },
  links: {
    flex: 2,
    display: 'flex',
    justifyContent: 'space-evenly',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontFamily: 'Roboto, sans-serif',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
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

export default Navbar;

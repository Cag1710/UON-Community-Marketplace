import React from 'react';

function Navbar() {
  return (
    <nav style={styles.nav}>
      <div style={styles.left}>
        <h2 style={styles.logo}>UON Community Marketplace</h2>
      </div>
      <div style={styles.links}>
        <a href="#" style={styles.link}>Home</a>
        <a href="#" style={styles.link}>Listings</a>
        <a href="#" style={styles.link}>Contact</a>
        <a href="#" style={styles.link}>Help</a>
      </div>
      <div style={styles.profile}>
        <div style={styles.profileIcon}>👤</div>
      </div>
    </nav>
  );
}

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

export default Navbar;

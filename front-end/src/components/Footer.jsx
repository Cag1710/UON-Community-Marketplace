import React from 'react';

function Footer() {
  return (
    <footer style={styles.footer}>
      <p style={styles.text}>© 2025 UON Community Marketplace</p>
      <div style={styles.links}>
        <a href="#" style={styles.link}>About</a>
        <a href="#" style={styles.link}>Contact Us</a>
        <a href="#" style={styles.link}>Privacy Policy</a>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    backgroundColor: '#1A1A40',
    color: 'white',
    padding: '30px 40px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  text: {
    margin: 0,
    fontSize: '14px',
  },
  links: {
    display: 'flex',
    gap: '20px',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '14px',
  },
};

export default Footer;

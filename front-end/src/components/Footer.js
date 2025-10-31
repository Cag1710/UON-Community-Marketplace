import React from 'react';
<<<<<<< Updated upstream:front-end/src/components/Footer.js

function Footer() {
  return (
    <footer style={styles.footer}>
      <p style={styles.text}>© 2025 UON Community Marketplace</p>
      <div style={styles.links}>
        <a href="#" style={styles.link}>About</a>
        <a href="#" style={styles.link}>Contact Us</a>
        <a href="#" style={styles.link}>Privacy Policy</a>
=======
import { Link } from "react-router-dom";
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <p className="footer__text">© 2025 UON Community Marketplace</p>
      <div className="footer__links">
        <Link to="/about-us">About</Link>
        <Link to="/contact-us">Contact Us</Link>
        <Link to="/privacy-policy">Privacy Policy</Link>
>>>>>>> Stashed changes:front-end/src/components/Footer.jsx
      </div>
    </footer>
  );
}

<<<<<<< Updated upstream:front-end/src/components/Footer.js
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

=======
>>>>>>> Stashed changes:front-end/src/components/Footer.jsx
export default Footer;

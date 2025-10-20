import React from 'react';
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
      </div>
    </footer>
  );
}

export default Footer;

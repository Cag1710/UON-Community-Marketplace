import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

function HelpPage() {
  return (
    <>
      <Navbar />
      <div style={{
        minHeight: '100vh',
        background: '#f9f9f9',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{
          maxWidth: 700,
          margin: '40px auto',
          background: '#fff',
          borderRadius: 20,
          boxShadow: '0 4px 24px rgba(74,114,164,0.10)',
          border: '1px solid #e0e0e0',
          padding: 40,
          fontFamily: 'inherit',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          <h1 style={{ color: '#222', fontWeight: 800, marginBottom: 24 }}>Help & Support</h1>
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ color: '#222', fontWeight: 700, marginBottom: 12 }}>Getting Started</h2>
            <ul>
              <li>Sign up or log in with your university email.</li>
              <li>Create a listing from the "Create Listing" page.</li>
              <li>Browse and search for items on the Listings page.</li>
            </ul>
          </section>
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ color: '#222', fontWeight: 700, marginBottom: 12 }}>Account Management</h2>
            <ul>
              <li>Edit your profile from your account page.</li>
              <li>Reset your password using the "Forgot Password" link.</li>
              <li>Manage your listings and messages from your dashboard.</li>
            </ul>
          </section>
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ color: '#222', fontWeight: 700, marginBottom: 12 }}>Buying & Selling</h2>
            <ul>
              <li>Contact sellers using the "Message Seller" button on listings.</li>
              <li>Edit or delete your listings from your profile.</li>
              <li>Mark items as sold when your transaction is complete.</li>
            </ul>
          </section>
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ color: '#222', fontWeight: 700, marginBottom: 12 }}>Messaging</h2>
            <ul>
              <li>Use the built-in messaging system to communicate safely.</li>
              <li>Report or block users if you encounter inappropriate behavior.</li>
            </ul>
          </section>
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ color: '#222', fontWeight: 700, marginBottom: 12 }}>Safety Tips</h2>
            <ul>
              <li>Meet in public places for exchanges.</li>
              <li>Never share sensitive personal information.</li>
              <li>Beware of scams and suspicious offers.</li>
            </ul>
          </section>
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ color: '#222', fontWeight: 700, marginBottom: 12 }}>Troubleshooting</h2>
            <ul>
              <li>If something isn’t working, try refreshing the page or logging out and back in.</li>
              <li>Check your internet connection and browser compatibility.</li>
              <li>If you need more help, <Link to="/contact-us" style={{ color: '#4A72A4', textDecoration: 'underline' }}>contact us</Link>.</li>
            </ul>
          </section>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default HelpPage;
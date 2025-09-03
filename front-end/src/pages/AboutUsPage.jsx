import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function AboutUsPage() {
  return (
    <>
      <Navbar />
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: 'calc(100vh - 0px)', // ensures the content area fills the screen
        background: '#f9f9f9'
      }}>
        <div
          style={{
            flex: 1,
            maxWidth: 1000,
            margin: '40px auto',
            background: '#fff',
            borderRadius: 20,
            boxShadow: '0 4px 24px rgba(74,114,164,0.10)',
            border: '1px solid #e0e0e0',
            padding: 56,
            fontFamily: 'inherit',
            width: '100%',
          }}
        >
          <h1 style={{ color: '#4A72A4', fontWeight: 800, marginBottom: 16 }}>About Us</h1>
          <p style={{ fontSize: 18, color: '#333', marginBottom: 24 }}>
            <b>UON Community Marketplace</b> is a community built platform designed to be used by students to buy and sell items.
          </p>
          <p style={{ fontSize: 16, color: '#444', marginBottom: 16 }}>
            Our goal is to make it easy for the UON community to buy, sell, and swap textbooks, electronics, furniture, clothing, and more in a safe and friendly environment.
          </p>
          <div style={{ fontSize: 16, color: '#444', marginBottom: 16 }}>
            <b>Why use the marketplace?</b>
            <ul style={{ marginTop: 8, marginBottom: 16, color: '#444', fontSize: 16, paddingLeft: 24 }}>
              <li>Only accessible to UON students</li>
              <li>Free to use! No listing or transaction fees</li>
              <li>Easy messaging and search</li>
              <li>Support for a wide range of categories</li>
            </ul>
          </div>
          <p style={{ fontSize: 16, color: '#444' }}>
            Have questions or feedback? Click on the contact us link to shoot us a message!
          </p>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default AboutUsPage;
<<<<<<< Updated upstream:front-end/src/components/WelcomeSection.js
import React from 'react';

function WelcomeSection() {
  const userName = 'Maria'; // Replace this later with real user name

  return (
    <section style={styles.container}>
      {/* LEFT: Welcome Text + Buttons */}
      <div style={styles.left}>
        <h1 style={styles.heading}>Welcome back, {userName}!</h1>
        <div style={styles.buttons}>
          <button style={styles.primaryBtn}>Post a Listing</button>
          <button style={styles.secondaryBtn}>View My Messages</button>
=======
// src/components/WelcomeSection.jsx
import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import './WelcomeSection.css';

export default function WelcomeSection() {
  const [name, setName] = useState('');

  useEffect(() => {
    (async () => {
      const auth = getAuth();
      const db = getFirestore();
      const user = auth.currentUser;
      if (!user) return;

      const snap = await getDoc(doc(db, 'users', user.uid));
      if (snap.exists()) setName(snap.data().firstname || '');
    })();
  }, []);

  return (
    <section className="welcome section">
      <div className="welcome__grid">
        <div className="welcome__text">
          <h1 className="welcome__title">Welcome back, {name}!</h1>
          <div className="welcome__cta">
            <a className="btn btn--primary" href="/create-listing">Post a Listing</a>
            <a className="btn btn--ghost" href="/messages">View My Messages</a>
          </div>
>>>>>>> Stashed changes:front-end/src/components/WelcomeSection.jsx
        </div>

        <div className="welcome__art">
          <img src="/waving-girl.png" alt="" />
        </div>
      </div>
    </section>
  );
}
<<<<<<< Updated upstream:front-end/src/components/WelcomeSection.js

const styles = {
  container: {
    backgroundColor: '#ffffff',
    padding: '60px 40px 40px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  left: {
    flex: 1,
    minWidth: '300px',
  },
  heading: {
    fontSize: '32px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#1A1A40',
  },
  buttons: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
  },
  primaryBtn: {
    padding: '12px 24px',
    fontSize: '16px',
    backgroundColor: '#1A1A40',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  secondaryBtn: {
    padding: '12px 24px',
    fontSize: '16px',
    backgroundColor: 'transparent',
    color: '#1A1A40',
    border: '2px solid #1A1A40',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  right: {
    flex: 1,
    textAlign: 'center',
  },
  image: {
    height: '120px',
  },
  image: {
    height: '190px',        
    width: 'auto',          
    objectFit: 'contain',   
    marginTop: '20px',      
    marginRight: '525px',     
    borderRadius: '12px',   
  }  
};

export default WelcomeSection;
=======
>>>>>>> Stashed changes:front-end/src/components/WelcomeSection.jsx

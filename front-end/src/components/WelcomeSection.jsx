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
        </div>

        <div className="welcome__art">
          <img src="/waving-girl.png" alt="" />
        </div>
      </div>
    </section>
  );
}

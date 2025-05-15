import React from 'react';
import { getAuth, signOut } from 'firebase/auth';

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
        </div>
      </div>

      {/* ✅ Sign Out Button just under the navbar */}
      <div style={styles.signOutContainer}>
        <button style={styles.signOut} onClick={() => signOut(getAuth())}>Sign Out</button>
      </div>

      {/* RIGHT: Waving Illustration */}
      <div style={styles.right}>
        <img
          src="/waving-girl.png"
          alt="Waving girl"
          style={styles.image}
        />
      </div>
    </section>
  );
}

const styles = {
  container: {
    backgroundColor: '#ffffff',
    padding: '60px 40px 40px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    position: 'relative', // ✅ Required for absolute positioning to work
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
  diffimage: {
    height: '120px',
  },
  image: {
    height: '190px',        
    width: 'auto',          
    objectFit: 'contain',   
    marginTop: '20px',      
    marginRight: '525px',     
    borderRadius: '12px',   
  },
  signOutContainer: {
    position: 'absolute',
    top: '20px',
    right: '40px',
    zIndex: 1,
  },
  signOut: {
    padding: '8px 16px',
    fontSize: '14px',
    backgroundColor: 'transparent',
    color: '#1A1A40',
    border: '2px solid #1A1A40',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
};

export default WelcomeSection;

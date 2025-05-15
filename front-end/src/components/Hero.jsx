import React from 'react';

function Hero() {
  return (
    <section style={styles.hero}>
      <div>
        <h1 style={styles.title}>Welcome to the UON Community Marketplace</h1>
        <p style={styles.subtitle}>
          Buy, sell, and connect with students just like you.
        </p>
        <div style={styles.buttonGroup}>
          <button style={styles.primaryBtn}>Create Account</button>
          <button style={styles.secondaryBtn}>Log In</button>
        </div>
      </div>
    </section>
  );
}

const styles = {
  hero: {
    backgroundColor: '#E6F0FF',
    padding: '60px 40px',
    textAlign: 'left',
  },
  title: {
    fontSize: '36px',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  subtitle: {
    fontSize: '20px',
    marginBottom: '30px',
  },
  buttonGroup: {
    display: 'flex',
    gap: '16px',
  },
  primaryBtn: {
    padding: '12px 24px',
    fontSize: '16px',
    backgroundColor: '#5E60CE',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  secondaryBtn: {
    padding: '12px 24px',
    fontSize: '16px',
    backgroundColor: 'transparent',
    color: '#5E60CE',
    border: '2px solid #5E60CE',
    borderRadius: '6px',
    cursor: 'pointer',
  },
};

export default Hero;

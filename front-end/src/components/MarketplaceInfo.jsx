import React from 'react';

function MarketplaceInfo() {
  return (
    <section style={styles.container}>
      <h2 style={styles.heading}>What is UON Community Marketplace?</h2>
      <p style={styles.description}>
        The UON Community Marketplace is a safe, student-only platform where you can buy, sell, and trade items with other University of Newcastle students.
      </p>
      <div style={styles.features}>
        <div style={styles.feature}>
          <div style={styles.icon}>📦</div>
          <p>Buy & Sell</p>
        </div>
        <div style={styles.feature}>
          <div style={styles.icon}>🎓</div>
          <p>For Students</p>
        </div>
        <div style={styles.feature}>
          <div style={styles.icon}>🛡️</div>
          <p>Safe & Secure</p>
        </div>
      </div>
    </section>
  );
}

const styles = {
  container: {
    padding: '60px 40px',
    textAlign: 'center',
    backgroundColor: '#F9FAFB',
  },
  heading: {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  description: {
    fontSize: '18px',
    maxWidth: '700px',
    margin: '0 auto 40px',
    color: '#555',
  },
  features: {
    display: 'flex',
    justifyContent: 'center',
    gap: '60px',
  },
  feature: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  icon: {
    fontSize: '40px',
    marginBottom: '10px',
  },
};

export default MarketplaceInfo;

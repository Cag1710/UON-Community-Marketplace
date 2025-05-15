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
        </div>
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

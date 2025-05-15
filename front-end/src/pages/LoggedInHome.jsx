import React from 'react';
import Navbar from '../components/Navbar';
import WelcomeSection from '../components/WelcomeSection';
import RecentListings from '../components/RecentListings';
import MarketplaceInfo from '../components/MarketplaceInfo';
import Footer from '../components/Footer';

function LoggedInHome() {
  return (
    <div>
      <Navbar />

      {/* ✅ Sign Out Button just under the navbar */}
      <div style={styles.signOutContainer}>
        <button style={styles.signOut}>Sign Out</button>
      </div>

      <WelcomeSection />
      <RecentListings />
      <MarketplaceInfo />
      <Footer />
    </div>
  );
}

const styles = {
  signOutContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: '10px 40px 0', // top padding to avoid overlap
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

export default LoggedInHome;

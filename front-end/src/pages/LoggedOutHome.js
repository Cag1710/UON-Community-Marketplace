import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import RecentListings from '../components/RecentListings';
import MarketplaceInfo from '../components/MarketplaceInfo';
import Footer from '../components/Footer';

function LoggedOutHome() {
  return (
    <div>
      <Navbar />
      <Hero />
      <RecentListings />
      <MarketplaceInfo />
      <Footer />
    </div>
  );
}

export default LoggedOutHome;

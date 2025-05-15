import React from 'react';
import Navbar from '../components/Navbar';
import WelcomeSection from '../components/WelcomeSection';
import Hero from '../components/Hero';
import RecentListings from '../components/RecentListings';
import MarketplaceInfo from '../components/MarketplaceInfo';
import Footer from '../components/Footer';
import useUser from '../useUser';

function HomePage() {

  const { isLoading, user } = useUser();

  return (
    <div>
      <Navbar />
      {!isLoading && (
        user ? <WelcomeSection /> : <Hero />
      )}
      <RecentListings />
      <MarketplaceInfo />
      <Footer />
    </div>
  );
}

export default HomePage;

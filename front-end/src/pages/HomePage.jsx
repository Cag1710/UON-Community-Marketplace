<<<<<<< Updated upstream
export default function HomePage() {
    return (
        <h1>This is the home page</h1>
    );
}
=======
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
      <div className='container'>
      {!isLoading && (
        user ? <WelcomeSection /> : <Hero />
      )}
      </div>
      <section className="section section--muted">
        <div className="section__inner">
          <RecentListings />
        </div>
      </section>
      <div className="container section">
        <MarketplaceInfo />
      </div>
      <Footer />
    </div>
  );
}

export default HomePage;
>>>>>>> Stashed changes

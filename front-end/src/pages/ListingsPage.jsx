import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';

const CATEGORIES = ['Textbook', 'Electronic', 'Furniture', 'Clothing', 'Other'];

function ListingsPage() {
  const [listings, setListings] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/listings')
      .then(res => res.json())
      .then(data => setListings(data));
  }, []);

  const handleCategoryChange = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const filteredListings = selectedCategories.length === 0
    ? listings
    : listings.filter(listing => selectedCategories.includes(listing.category));

  const handleBuy = async (id) => {
    await fetch(`http://localhost:8000/api/listings/${id}`, {
      method: 'DELETE',
    });
    setListings(listings => listings.filter(listing => listing._id !== id));
  };

  return (
    <>
      <Navbar />
      <div style={{ display: 'flex', padding: '32px', background: '#f9f9f9', minHeight: '100vh' }}>
        {/* Sidebar */}
        <aside style={{
          minWidth: 240,
          background: '#f2f2f2',
          borderRadius: 20,
          padding: 24,
          marginRight: 32,
          height: 'fit-content'
        }}>
          <h2 style={{ marginTop: 0 }}>Filters</h2>
          <div>
            <strong style={{ textDecoration: 'underline' }}>Categories</strong>
            <ul style={{ listStyle: 'none', padding: 0, marginTop: 12 }}>
              {CATEGORIES.map(category => (
                <li key={category}>
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category)}
                      onChange={() => handleCategoryChange(category)}
                    />{' '}
                    {category}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Body (Listings) */}
        <main style={{ flex: 1 }}>
          <h1 style={{ textAlign: 'center', marginBottom: 32 }}>Items</h1>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 32,
          }}>
            {filteredListings.map((listing, i) => (
              <div key={listing._id || i} style={{
                background: '#d3d3d3',
                borderRadius: 24,
                padding: 24,
                boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                border: '1px solid #e0e0e0',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minHeight: 220
              }}>
                <div style={{
                  width: '100%',
                  height: 100,
                  borderRadius: 12,
                  marginBottom: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: listing.image ? '#fff' : '#bbb',
                  border: listing.image ? '1px solid #ddd' : 'none',
                  overflow: 'hidden'
                }}>
                  {listing.image ? (
                    <img
                      src={listing.image}
                      alt={listing.title}
                      style={{ maxWidth: '100%', maxHeight: 100, objectFit: 'contain', display: 'block' }}
                    />
                  ) : (
                    <span style={{ color: '#666', fontSize: 16 }}>Picture of Item</span>
                  )}
                </div>
                <div style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', marginBottom: 6 }}>
                    <span style={{ color: '#4A72A4' }}>{listing.category}</span>
                    <span style={{ color: '#222' }}>${listing.price}</span>
                  </div>
                  <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 4 }}>{listing.title}</div>
                  <div style={{ color: '#444', marginBottom: 8 }}>{listing.description}</div>
                  <button
                    style={{
                      marginTop: 8,
                      padding: '8px 16px',
                      borderRadius: 8,
                      border: 'none',
                      background: '#4A72A4',
                      color: 'white',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      transition: 'background 0.2s'
                    }}
                    onClick={() => handleBuy(listing._id)}
                    onMouseOver={e => e.currentTarget.style.background = '#35547a'}
                    onMouseOut={e => e.currentTarget.style.background = '#4A72A4'}
                  >
                    Buy
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </>
  );
}
export default ListingsPage;
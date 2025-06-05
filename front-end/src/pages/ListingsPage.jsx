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

  // Handle checkbox changes
  const handleCategoryChange = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  // Filter 
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
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minHeight: 180
              }}>
                <div style={{
                  background: '#bbb',
                  width: '100%',
                  height: 80,
                  borderRadius: 12,
                  marginBottom: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  Picture of Item
                </div>
                <div style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                    <span>{listing.category}</span>
                    <span>${listing.price}</span>
                  </div>
                  <div>{listing.title}</div>
                  <div>{listing.description}</div>
                  <button
                    style={{
                      marginTop: 16,
                      padding: '8px 16px',
                      borderRadius: 8,
                      border: 'none',
                      background: '#4A72A4',
                      color: 'white',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                    onClick={() => handleBuy(listing._id)}
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
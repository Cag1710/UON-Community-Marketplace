<<<<<<< Updated upstream
import React from 'react';
=======
import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
>>>>>>> Stashed changes

function ListingsPage() {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/listings')
      .then(res => res.json())
      .then(data => setListings(data));
  }, []);

  return (
<<<<<<< Updated upstream
    <div style={{ display: 'flex', padding: '20px' }}>
      {/* Sidebar stuff */}
      <div style={{ marginRight: '40px' }}>
        <h3>Filters</h3>
        <div>
          <label><input type="checkbox" /> Filter 1</label><br />
          <label><input type="checkbox" /> Filter 2</label><br />
          <label><input type="checkbox" /> Filter 3</label><br />
          <label><input type="checkbox" /> Filter 4</label>
        </div>
=======
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
              <li><label><input type="checkbox" /> Textbook</label></li>
              <li><label><input type="checkbox" /> Electronic</label></li>
              <li><label><input type="checkbox" /> Furniture</label></li>
              <li><label><input type="checkbox" /> Clothing</label></li>
              <li><label><input type="checkbox" /> Other</label></li>
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
            {listings.map((listing, i) => (
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
                </div>
              </div>
            ))}
          </div>
        </main>
>>>>>>> Stashed changes
      </div>
      {/* Listings stuff */}
      <div>
        <h3>Listings</h3>
        <div>
          <h4>Listing 1</h4>
          <p>Description of listing 1</p>
          <button>View</button>
        </div>
        <div>
          <h4>Listing 2</h4>
          <p>Description of listing 2</p>
          <button>View</button>
        </div>
      </div>
    </div>
  );
}

export default ListingsPage;
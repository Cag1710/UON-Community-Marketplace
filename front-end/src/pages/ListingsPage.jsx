import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';

// Listing for filters
const CATEGORIES = ['Textbook', 'Electronic', 'Furniture', 'Clothing', 'Other'];

// Listings page component
function ListingsPage() {
  const [listings, setListings] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [notMyListings, setNotMyListings] = useState(false);
  const [userMap, setUserMap] = useState({}); // userId -> user info

  // Get current user ID
  const auth = getAuth();
  const user = auth.currentUser;
  const userId = user ? user.uid : null;

  // Gets all the listings from the db and fetches user info for each listing
  useEffect(() => {
    fetch('http://localhost:8000/api/listings')
      .then(res => res.json())
      .then(async data => {
        setListings(data);

        // Get unique userIds
        const uniqueUserIds = [...new Set(data.map(l => l.userId).filter(Boolean))];
        const db = getFirestore();
        const userMapTemp = {};

        // Fetch user info for each userId
        await Promise.all(uniqueUserIds.map(async uid => {
          try {
            const userDoc = await getDoc(doc(db, 'users', uid));
            if (userDoc.exists()) {
              userMapTemp[uid] = userDoc.data();
            }
          } catch (e) {
            // Ignore errors, just don't show user info
          }
        }));
        setUserMap(userMapTemp);
      });
  }, []);

  // Handles the checkbox changes
  const handleCategoryChange = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  // Filter listings by category and "not my listings"
  const filteredListings = listings.filter(listing => {
    const categoryMatch =
      selectedCategories.length === 0 ||
      selectedCategories.includes(listing.category);
    const notMineMatch =
      !notMyListings || (userId && listing.userId !== userId);
    return categoryMatch && notMineMatch;
  });

  // Buy button that deletes the listing atm
  const handleBuy = async (id) => {
    await fetch(`http://localhost:8000/api/listings/${id}`, {
      method: 'DELETE',
    });
    setListings(listings => listings.filter(listing => listing._id !== id));
  };

  // Renders the listing page
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
          <div style={{ marginTop: 24 }}>
            <label>
              <input
                type="checkbox"
                checked={notMyListings}
                onChange={() => setNotMyListings(v => !v)}
              />{' '}
              Not My Listings
            </label>
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
            {filteredListings.map((listing, i) => {
              const seller = userMap[listing.userId];
              return (
                <Link
                  to={`/listing/${listing._id}`}
                  key={listing._id || i}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div style={{
                    background: '#d3d3d3',
                    borderRadius: 24,
                    padding: 24,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                    border: '1px solid #e0e0e0',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    minHeight: 220,
                    cursor: 'pointer'
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
                      <div style={{ color: '#4A72A4', fontSize: 14, marginBottom: 8 }}>
                        {seller
                          ? <>Posted by <b>{seller.username || seller.email}</b></>
                          : <>Posted by <span style={{ color: '#aaa' }}>Unknown</span></>
                        }
                      </div>
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
                        onClick={e => {
                          e.preventDefault(); // Prevent navigation when clicking Buy
                          handleBuy(listing._id);
                        }}
                        onMouseOver={e => e.currentTarget.style.background = '#35547a'}
                        onMouseOut={e => e.currentTarget.style.background = '#4A72A4'}
                      >
                        Buy
                      </button>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </main>
      </div>
    </>
  );
}

export default ListingsPage;
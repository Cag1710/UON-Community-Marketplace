import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getAuth } from 'firebase/auth';
import { Link } from 'react-router-dom';

function MyListingsPage() {
  const [listings, setListings] = useState([]);
  const [imageIndexes, setImageIndexes] = useState({});
  const [loading, setLoading] = useState(true);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const auth = getAuth();
  const user = auth.currentUser;
  const userId = user ? user.uid : null;
  const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

  useEffect(() => {
    if (!userId) return;
    fetch(`${API_BASE}/api/listings`)
      .then(res => res.json())
      .then(data => {
        const myListings = data.filter(l => l.userId === userId);
        setListings(myListings);
        setLoading(false);
      });
  }, [userId, API_BASE]);

  const handlePrev = (listingId, imagesLength) => {
    setImageIndexes(idx => ({
      ...idx,
      [listingId]: ((idx[listingId] || 0) - 1 + imagesLength) % imagesLength
    }));
  };

  const handleNext = (listingId, imagesLength) => {
    setImageIndexes(idx => ({
      ...idx,
      [listingId]: ((idx[listingId] || 0) + 1) % imagesLength
    }));
  };

  const handleDelete = async (listingId) => {
    try {
      await fetch(`${API_BASE}/api/listings/${listingId}`, {
        method: 'DELETE'
      });
      setListings(listings.filter(l => l._id !== listingId));
      setConfirmDeleteId(null);
    } catch (e) {
      alert('Failed to delete listing.');
    }
  };

  return (
    <>
      <Navbar />
      <div
        style={{
          minHeight: '100vh',
          background: '#f9f9f9',
          fontFamily: 'inherit',
          padding: 32
        }}
      >
        <h1 style={{ textAlign: 'center', marginBottom: 32, color: '#222', fontWeight: 800 }}>My Listings</h1>
        {loading ? (
          <div style={{ color: '#888', fontSize: 18, textAlign: 'center', marginTop: 40 }}>Loading...</div>
        ) : listings.length === 0 ? (
          <div style={{ color: '#888', fontSize: 20, textAlign: 'center', marginTop: 40 }}>
            You haven't created any listings yet.<br />
            <Link to="/create-listing" style={{
              color: '#4A72A4',
              textDecoration: 'underline',
              fontWeight: 600
            }}>
              Create your first listing
            </Link>
          </div>
        ) : (
          <div
            className="listings-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 32,
              transition: 'all 0.2s'
            }}
          >
            {listings.map((listing, i) => {
              const images = listing.images && listing.images.length > 0 ? listing.images : (listing.image ? [listing.image] : []);
              const currentIdx = imageIndexes[listing._id] || 0;

              const handlePrevImg = (e) => {
                e.preventDefault();
                handlePrev(listing._id, images.length);
              };

              const handleNextImg = (e) => {
                e.preventDefault();
                handleNext(listing._id, images.length);
              };

              return (
                <div
                  key={listing._id || i}
                  style={{
                    background: '#fff',
                    borderRadius: 24,
                    padding: 24,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                    border: '1px solid #e0e0e0',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    minHeight: 220,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    transition: 'all 0.2s',
                    position: 'relative'
                  }}
                >
                  <Link
                    to={`/listing/${listing._id}`}
                    style={{ textDecoration: 'none', color: 'inherit', fontFamily: 'inherit', width: '100%' }}
                  >
                    <div style={{
                      width: '100%',
                      minHeight: 100,
                      borderRadius: 12,
                      marginBottom: 16,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: images.length > 0 ? '#fff' : '#bbb',
                      border: images.length > 0 ? '1px solid #ddd' : 'none',
                      overflow: 'hidden',
                      position: 'relative'
                    }}>
                      {images.length > 0 ? (
                        <>
                          <img
                            src={images[currentIdx]}
                            alt={`${listing.title} ${currentIdx + 1}`}
                            style={{
                              maxWidth: '100%',
                              width: 120,
                              height: 100,
                              objectFit: 'cover',
                              borderRadius: 8,
                              border: '1px solid #eee',
                              background: '#fff'
                            }}
                          />
                          {images.length > 1 && (
                            <>
                              <button
                                onClick={handlePrevImg}
                                style={{
                                  position: 'absolute',
                                  left: 4,
                                  top: '50%',
                                  transform: 'translateY(-50%)',
                                  background: 'rgba(74,114,164,0.7)',
                                  color: '#fff',
                                  border: 'none',
                                  borderRadius: '50%',
                                  width: 28,
                                  height: 28,
                                  cursor: 'pointer',
                                  fontWeight: 'bold',
                                  fontSize: 18,
                                  zIndex: 2
                                }}
                                onMouseDown={e => e.preventDefault()}
                              >&lt;</button>
                              <button
                                onClick={handleNextImg}
                                style={{
                                  position: 'absolute',
                                  right: 4,
                                  top: '50%',
                                  transform: 'translateY(-50%)',
                                  background: 'rgba(74,114,164,0.7)',
                                  color: '#fff',
                                  border: 'none',
                                  borderRadius: '50%',
                                  width: 28,
                                  height: 28,
                                  cursor: 'pointer',
                                  fontWeight: 'bold',
                                  fontSize: 18,
                                  zIndex: 2
                                }}
                                onMouseDown={e => e.preventDefault()}
                              >&gt;</button>
                            </>
                          )}
                        </>
                      ) : (
                        <span style={{ color: '#666', fontSize: 16, fontFamily: 'inherit' }}>Picture of Item</span>
                      )}
                    </div>
                    <div style={{ width: '100%', fontFamily: 'inherit' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', marginBottom: 6, fontFamily: 'inherit' }}>
                        <span style={{ color: '#4A72A4', fontFamily: 'inherit' }}>{listing.category}</span>
                        <span style={{ color: '#222', fontFamily: 'inherit' }}>${listing.price}</span>
                      </div>
                      <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 4, fontFamily: 'inherit' }}>{listing.title}</div>
                      <div style={{ color: '#444', marginBottom: 8, fontFamily: 'inherit' }}>{listing.description}</div>
                      <div style={{ color: '#555', fontSize: 15, marginBottom: 4, fontFamily: 'inherit' }}>
                        <b>Location:</b> {listing.location || <span style={{ color: '#aaa' }}>N/A</span>}
                      </div>
                      <div style={{ color: '#555', fontSize: 15, marginBottom: 8, fontFamily: 'inherit' }}>
                        <b>Condition:</b> {listing.condition || <span style={{ color: '#aaa' }}>N/A</span>}
                      </div>
                    </div>
                  </Link>
                  <button
                    style={{
                      marginTop: 12,
                      padding: '8px 16px',
                      borderRadius: 8,
                      border: 'none',
                      background: '#e74c3c',
                      color: 'white',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      transition: 'background 0.2s',
                      fontFamily: 'inherit'
                    }}
                    onClick={() => setConfirmDeleteId(listing._id)}
                  >
                    Remove Listing
                  </button>
                </div>
              );
            })}
          </div>
        )}
        {/* Modal Popup for Confirm Delete */}
        {confirmDeleteId && (
          <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.25)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{
              background: '#fff',
              borderRadius: 16,
              boxShadow: '0 4px 24px rgba(74,114,164,0.18)',
              padding: 36,
              textAlign: 'center',
              minWidth: 320,
              maxWidth: '90vw'
            }}>
              <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 24 }}>
                Are you sure you want to remove this listing?
              </div>
              <button
                style={{
                  padding: '10px 24px',
                  borderRadius: 8,
                  border: 'none',
                  background: '#e74c3c',
                  color: 'white',
                  fontWeight: 'bold',
                  marginRight: 16,
                  cursor: 'pointer'
                }}
                onClick={() => handleDelete(confirmDeleteId)}
              >
                Yes, Remove
              </button>
              <button
                style={{
                  padding: '10px 24px',
                  borderRadius: 8,
                  border: 'none',
                  background: '#bbb',
                  color: '#222',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
                onClick={() => setConfirmDeleteId(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default MyListingsPage;
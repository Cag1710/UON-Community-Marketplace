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
  const [confirmSellId, setConfirmSellId] = useState(null);

  const auth = getAuth();
  const user = auth.currentUser;
  const userId = user ? user.uid : null;
  const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

  useEffect(() => {
    if (!userId) return;
    fetch(`${API_BASE}/api/listings?includeSold=1`)
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
      await fetch(`${API_BASE}/api/listings/${listingId}`, { method: 'DELETE' });
      setListings(listings.filter(l => l._id !== listingId));
      setConfirmDeleteId(null);
    } catch (e) {
      alert('Failed to delete listing.');
    }
  };

  const handleSell = async (listingId) => {
    try {
      const token = await getAuth().currentUser?.getIdToken?.();
  
      const res = await fetch(`${API_BASE}/api/listings/${listingId}/sell`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({}), // server sets sold + soldAt
      });
  
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || `HTTP ${res.status}`);
      }
  
      const updated = await res.json(); // includes { sold: true, soldAt: ... }
      setListings(prev => prev.map(l => (l._id === listingId ? updated : l)));
      setConfirmSellId(null);
    } catch (e) {
      alert(`Could not mark as sold: ${e.message || e}`);
    }
  };

  return (
    <>
      <Navbar />
      <div style={styles.pageContainer}>
        <h1 style={styles.heading}>My Listings</h1>
  
        {loading ? (
          <div style={styles.loadingText}>Loading...</div>
        ) : listings.length === 0 ? (
          <div style={styles.emptyState}>
            You haven't created any listings yet.<br />
            <Link to="/create-listing" style={styles.createLink}>
              Create your first listing
            </Link>
          </div>
        ) : (
          <>
            {/* Split listings */}
            {(() => {
              const activeListings = listings.filter(l => !l.sold);
              const soldListings = listings.filter(l => l.sold);
  
              return (
                <>
                  {/* ACTIVE LISTINGS */}
                  {activeListings.length > 0 && (
                    <>
                      <h2 style={styles.sectionTitle}>Active Listings</h2>
                      <div style={styles.listingsGrid}>
                        {activeListings.map((listing, i) => {
                          const images = listing.images?.length
                            ? listing.images
                            : listing.image
                            ? [listing.image]
                            : [];
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
                            <div key={listing._id || i} style={styles.listingCard}>
                              <Link to={`/listing/${listing._id}`} style={styles.link}>
                                <div style={styles.imageContainer}>
                                  {images.length > 0 ? (
                                    <>
                                      <img
                                        src={images[currentIdx]}
                                        alt={`${listing.title} ${currentIdx + 1}`}
                                        style={styles.image}
                                      />
                                      {images.length > 1 && (
                                        <>
                                          <button onClick={handlePrevImg} style={styles.imageNavLeft}>&lt;</button>
                                          <button onClick={handleNextImg} style={styles.imageNavRight}>&gt;</button>
                                        </>
                                      )}
                                    </>
                                  ) : (
                                    <span style={styles.placeholderText}>Picture of Item</span>
                                  )}
                                </div>
                                <div style={styles.infoContainer}>
                                  <div style={styles.categoryRow}>
                                    <span style={styles.categoryText}>{listing.category}</span>
                                    <span style={styles.priceText}>${listing.price}</span>
                                  </div>
                                  <div style={styles.title}>{listing.title}</div>
                                  <div style={styles.description}>{listing.description}</div>
                                  <div style={styles.infoText}>
                                    <b>Location:</b> {listing.location || <span style={styles.naText}>N/A</span>}
                                  </div>
                                  <div style={styles.infoText}>
                                    <b>Condition:</b> {listing.condition || <span style={styles.naText}>N/A</span>}
                                  </div>
                                </div>
                              </Link>
  
                              <div style={styles.buttonRow}>
                                <button
                                  style={styles.sellButton}
                                  onClick={() => setConfirmSellId(listing._id)}
                                >
                                  Sell Listing
                                </button>
                                <button
                                  style={styles.removeButton}
                                  onClick={() => setConfirmDeleteId(listing._id)}
                                >
                                  Remove Listing
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
  
                  {/* SOLD HISTORY */}
                  {soldListings.length > 0 && (
                    <>
                      <h2 style={styles.sectionTitle}>Sold History</h2>
                      <div style={styles.listingsGrid}>
                        {soldListings.map((listing, i) => {
                          const images = listing.images?.length
                            ? listing.images
                            : listing.image
                            ? [listing.image]
                            : [];
                          const currentIdx = imageIndexes[listing._id] || 0;
  
                          return (
                            <div key={listing._id || i} style={{ ...styles.listingCard, ...styles.soldCard }}>
                              <div style={styles.soldBadge}>SOLD</div>
                              <Link to={`/listing/${listing._id}`} style={styles.link}>
                                <div style={styles.imageContainer}>
                                  {images.length > 0 ? (
                                    <img
                                      src={images[currentIdx]}
                                      alt={`${listing.title} ${currentIdx + 1}`}
                                      style={styles.image}
                                    />
                                  ) : (
                                    <span style={styles.placeholderText}>Picture of Item</span>
                                  )}
                                </div>
                                <div style={styles.infoContainer}>
                                  <div style={styles.categoryRow}>
                                    <span style={styles.categoryText}>{listing.category}</span>
                                    <span style={styles.priceText}>${listing.price}</span>
                                  </div>
                                  <div style={styles.title}>{listing.title}</div>
                                  <div style={styles.description}>{listing.description}</div>
                                  <div style={styles.infoText}>
                                    <b>Location:</b> {listing.location || <span style={styles.naText}>N/A</span>}
                                  </div>
                                  <div style={styles.infoText}>
                                    <b>Condition:</b> {listing.condition || <span style={styles.naText}>N/A</span>}
                                  </div>
                                  <div style={styles.soldMeta}>
                                    Sold on{' '}
                                    {listing.soldAt
                                      ? new Date(listing.soldAt).toLocaleDateString()
                                      : '—'}
                                  </div>
                                </div>
                              </Link>
                              <div style={styles.buttonRow}>
                                <div />
                                <button
                                  style={styles.removeButton}
                                  onClick={() => setConfirmDeleteId(listing._id)}
                                >
                                  Remove Listing
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </>
              );
            })()}
          </>
        )}
  
        {/* SELL CONFIRMATION */}
        {confirmSellId && (
          <div style={styles.modalOverlay}>
            <div style={styles.modal}>
              <div style={styles.modalTitle}>Mark this listing as SOLD?</div>
              <button style={styles.modalConfirm} onClick={() => handleSell(confirmSellId)}>
                Yes, Mark as Sold
              </button>
              <button style={styles.modalCancel} onClick={() => setConfirmSellId(null)}>
                Cancel
              </button>
            </div>
          </div>
        )}
  
        {/* DELETE CONFIRMATION */}
        {confirmDeleteId && (
          <div style={styles.modalOverlay}>
            <div style={styles.modal}>
              <div style={styles.modalTitle}>Are you sure you want to remove this listing?</div>
              <button style={styles.modalConfirm} onClick={() => handleDelete(confirmDeleteId)}>
                Yes, Remove
              </button>
              <button style={styles.modalCancel} onClick={() => setConfirmDeleteId(null)}>
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

const styles = {
  buttonRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 12,
  },
  pageContainer: {
    minHeight: '100vh',
    background: '#f9f9f9',
    fontFamily: 'inherit',
    padding: 32
  },
  heading: {
    textAlign: 'center',
    marginBottom: 32,
    color: '#222',
    fontWeight: 800
  },
  loadingText: {
    color: '#888',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 40
  },
  emptyState: {
    color: '#888',
    fontSize: 20,
    textAlign: 'center',
    marginTop: 40
  },
  createLink: {
    color: '#4A72A4',
    textDecoration: 'underline',
    fontWeight: 600
  },
  listingsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 32,
    transition: 'all 0.2s'
  },
  listingCard: {
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
    transition: 'all 0.2s',
    position: 'relative'
  },
  link: {
    textDecoration: 'none',
    color: 'inherit',
    fontFamily: 'inherit',
    width: '100%'
  },
  imageContainer: {
    width: '100%',
    minHeight: 100,
    borderRadius: 12,
    marginBottom: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#fff',
    border: '1px solid #ddd',
    overflow: 'hidden',
    position: 'relative'
  },
  image: {
    maxWidth: '100%',
    width: 120,
    height: 100,
    objectFit: 'cover',
    borderRadius: 8,
    border: '1px solid #eee',
    background: '#fff'
  },
  placeholderText: { color: '#666', fontSize: 16 },
  imageNavLeft: {
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
  },
  imageNavRight: {
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
  },
  infoContainer: { width: '100%' },
  categoryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontWeight: 'bold',
    marginBottom: 6
  },
  categoryText: { color: '#4A72A4' },
  priceText: { color: '#222' },
  title: { fontWeight: 600, fontSize: 18, marginBottom: 4 },
  description: { color: '#444', marginBottom: 8 },
  infoText: { color: '#555', fontSize: 15, marginBottom: 4 },
  naText: { color: '#aaa' },
  removeButton: {
    padding: '8px 16px',
    borderRadius: 8,
    border: 'none',
    background: '#e74c3c',
    color: 'white',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background 0.2s'
  },
  sellButton: {
    padding: '8px 16px',
    borderRadius: 8,
    border: 'none',
    background: '#4A72A4',
    color: 'white',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background 0.2s'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.25)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  modal: {
    background: '#fff',
    borderRadius: 16,
    boxShadow: '0 4px 24px rgba(74,114,164,0.18)',
    padding: 36,
    textAlign: 'center',
    minWidth: 320,
    maxWidth: '90vw'
  },
  modalTitle: { fontWeight: 700, fontSize: 20, marginBottom: 24 },
  modalConfirm: {
    padding: '10px 24px',
    borderRadius: 8,
    border: 'none',
    background: '#e74c3c',
    color: 'white',
    fontWeight: 'bold',
    marginRight: 16,
    cursor: 'pointer'
  },
  modalCancel: {
    padding: '10px 24px',
    borderRadius: 8,
    border: 'none',
    background: '#bbb',
    color: '#222',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  soldBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    background: '#27ae60',
    color: 'white',
    fontWeight: 700,
    fontSize: 12,
    padding: '4px 10px',
    borderRadius: 999,
    letterSpacing: 0.5,
    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
    zIndex: 5,       
    pointerEvents: 'none',    
  },
  buttonDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed'
  },
  sectionTitle: {
    margin: '28px 0 12px',
    fontWeight: 800,
    fontSize: 22,
    color: '#222',
  },
  soldCard: {
    opacity: 0.9,
    borderColor: '#e6e6e6',
  },
  soldMeta: {
    marginTop: 6,
    fontSize: 13,
    color: '#666',
  },
};

export default MyListingsPage;

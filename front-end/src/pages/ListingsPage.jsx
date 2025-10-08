import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getAuth } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import ReportDialog from '../components/ReportDialog';
import { submitReport } from '../lib/reporting';

const CATEGORIES = ['Textbook', 'Electronic', 'Furniture', 'Clothing', 'Other'];

function ListingsPage() {
  const [listings, setListings] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [notMyListings, setNotMyListings] = useState(false);
  const [userMap, setUserMap] = useState({});
  const [imageIndexes, setImageIndexes] = useState({});

  const [reportOpenFor, setReportOpenFor] = useState(null);
  const [userReport, setUserReport] = useState(null);

  const auth = getAuth();
  const user = auth.currentUser;
  const userId = user ? user.uid : null;
  const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      // 1) load listings
      const res = await fetch(`${API_BASE}/api/listings`);
      const data = await res.json();
      setListings(data);

      // 2) load public user profiles (username/email) from backend
      const uniqueUserIds = [...new Set(data.map(l => l.userId).filter(Boolean))];

      if (uniqueUserIds.length === 0) {
        setUserMap({});
        return;
      }

      try {
        const resp = await fetch(
          `${API_BASE}/api/users/public?ids=${encodeURIComponent(uniqueUserIds.join(','))}`
        );
        const map = resp.ok ? await resp.json() : {};
        setUserMap(map);
      } catch {
        setUserMap({});
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCategoryChange = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const filteredListings = listings.filter(listing => {
    const categoryMatch =
      selectedCategories.length === 0 ||
      selectedCategories.includes(listing.category);
    const notMineMatch =
      !notMyListings || (userId && listing.userId !== userId);
    return categoryMatch && notMineMatch;
  });

  const handleMessage = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/api/listings/${id}`);
      if (!res.ok) {
        alert("Couldn't open chat for this listing.");
        return;
      }
      const listing = await res.json();
      const sellerId = listing.userId;
      navigate(`/messages?listingId=${id}&sellerId=${sellerId}`);
  } catch (e) {
    console.error(e);
    alert("Something went wrong opening the chat.");
  }
};

  // Reporting Actions
  async function submitListingReport({ reportType, details }) {
    try {
      await submitReport({
        apiBase: API_BASE,
        targetType: 'listing',
        targetId: reportOpenFor,
        reportType,
        details,
      });
      alert('Report submitted. Thanks!');
      setReportOpenFor(null);
    } catch (e) {
      console.error(e);
      alert(e.message || 'Could not submit report.');
    }
  }

  async function submitUserReport({ reportType, details }) {
    try {
      await submitReport({
        apiBase: API_BASE,
        targetType: 'user',
        targetId: userReport.userId,
        reportType,
        details,
      });
      alert('User reported. Thanks!');
      setUserReport(null);
    } catch (e) {
      console.error(e);
      alert(e.message || 'Could not submit report.');
    }
  }

  // Renders the lisitng page
  return (
    <>
      <Navbar />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          background: '#f9f9f9',
          fontFamily: 'inherit'
        }}
      >
        <div
          className="listings-main"
          style={{
            display: 'flex',
            flex: 1,
            padding: 32,
            transition: 'all 0.2s'
          }}
        >
          {/* Sidebar */}
          <aside
            className="listings-sidebar"
            style={{
              minWidth: 240,
              background: '#f2f2f2',
              borderRadius: 20,
              padding: 24,
              marginRight: 32,
              height: 'fit-content',
              transition: 'all 0.2s'
            }}
          >
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
            <div
              className="listings-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 32,
                transition: 'all 0.2s'
              }}
            >
              {filteredListings.map((listing, i) => {
                const seller = userMap[listing.userId];
                const images = listing.images && listing.images.length > 0 ? listing.images : (listing.image ? [listing.image] : []);
                const currentIdx = imageIndexes[listing._id] || 0;

                const handlePrev = (e) => {
                  e.preventDefault();
                  setImageIndexes(idx => ({
                    ...idx,
                    [listing._id]: (currentIdx - 1 + images.length) % images.length
                  }));
                };

                const handleNext = (e) => {
                  e.preventDefault();
                  setImageIndexes(idx => ({
                    ...idx,
                    [listing._id]: (currentIdx + 1) % images.length
                  }));
                };

                return (
                  <Link
                    to={`/listing/${listing._id}`}
                    key={listing._id || i}
                    style={{ textDecoration: 'none', color: 'inherit', fontFamily: 'inherit' }}
                  >
                    <div style={{
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
                      transition: 'all 0.2s'
                    }}>
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
                                  onClick={handlePrev}
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
                                  onClick={handleNext}
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
                        <div style={{ color: '#4A72A4', fontSize: 14, marginBottom: 8, fontFamily: 'inherit' }}>
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
                            transition: 'background 0.2s',
                            fontFamily: 'inherit'
                          }}
                          onClick={(e) => { e.preventDefault(); handleMessage(listing._id); }}
                          onMouseOver={e => e.currentTarget.style.background = '#35547a'}
                          onMouseOut={e => e.currentTarget.style.background = '#4A72A4'}
                        >
                          Message Seller
                        </button>

                        {/* Report listing */}
                        <button
                          style={{
                            marginTop: 8, marginLeft: 8,
                            padding: '8px 16px', borderRadius: 8, border: '1px solid #bbb',
                            background: '#fff', color: '#333', cursor: 'pointer', fontWeight: 'bold'
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setReportOpenFor(listing._id);
                          }}
                        >
                          Report Listing
                        </button>

                        {/* Report user */}
                        <button
                          style={{
                            marginTop: 8, marginLeft: 8,
                            padding: '8px 16px', borderRadius: 8, border: '1px solid #bbb',
                            background: '#fff', color: '#333', cursor: 'pointer', fontWeight: 'bold'
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const s = userMap[listing.userId];
                            const label = s?.username || s?.email || listing.userId;
                            setUserReport({ userId: listing.userId, label });
                          }}
                        >
                          Report Seller
                        </button>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </main>

          {/* Report dialogs */}
          {reportOpenFor && (
            <ReportDialog
              open
              onClose={() => setReportOpenFor(null)}
              title="Report listing"
              targetLabel={filteredListings.find(x => x._id === reportOpenFor)?.title}
              onSubmit={submitListingReport}
            />
          )}

          {userReport && (
            <ReportDialog
              open
              onClose={() => setUserReport(null)}
              title="Report user"
              targetLabel={userReport.label}
              onSubmit={submitUserReport}
            />
          )}
        </div>
        <Footer />
      </div>
    </>
  );
}

export default ListingsPage;

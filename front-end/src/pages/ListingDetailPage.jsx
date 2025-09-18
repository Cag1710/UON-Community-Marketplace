import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

function ListingDetailPage() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [seller, setSeller] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:8000/api/listings/${id}`)
      .then(res => res.json())
      .then(async data => {
        setListing(data);
        setCurrentIdx(0);
        if (data.userId) {
          const db = getFirestore();
          const userDoc = await getDoc(doc(db, 'users', data.userId));
          if (userDoc.exists()) setSeller(userDoc.data());
        }
      });
  }, [id]);

  if (!listing) return <div>Loading...</div>;

  const images = listing.images && listing.images.length > 0 ? listing.images : (listing.image ? [listing.image] : []);

  const handlePrev = () => {
    setCurrentIdx(idx => (idx - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    setCurrentIdx(idx => (idx + 1) % images.length);
  };

  const handleMessageSeller = () => {
    navigate(`/messages?listingId=${listing._id}&sellerId=${listing.userId}`);
  };

  return (
    <>
      <Navbar />
      <div
        className="listing-detail-main"
        style={{
          display: 'flex',
          background: '#f9f9f9',
          minHeight: '100vh',
          padding: 40,
          justifyContent: 'center'
        }}
      >
        {/* Left: Image Carousel */}
        <div
          className="listing-detail-image"
          style={{
            background: '#fff',
            borderRadius: 20,
            boxShadow: '0 4px 24px rgba(74,114,164,0.10)',
            border: '1px solid #e0e0e0',
            width: 480,
            minHeight: 480,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 40,
            overflow: 'hidden',
            position: 'relative',
            transition: 'all 0.2s'
          }}
        >
          {images.length > 0 ? (
            <>
              <img
                src={images[currentIdx]}
                alt={`${listing.title} ${currentIdx + 1}`}
                style={{
                  maxWidth: 320,
                  maxHeight: 320,
                  objectFit: 'contain',
                  borderRadius: 8,
                  border: '1px solid #eee',
                  background: '#fff',
                  display: 'block',
                  margin: '0 auto'
                }}
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePrev}
                    style={{
                      position: 'absolute',
                      left: 12,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'rgba(74,114,164,0.7)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '50%',
                      width: 36,
                      height: 36,
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: 22,
                      zIndex: 2
                    }}
                  >&lt;</button>
                  <button
                    onClick={handleNext}
                    style={{
                      position: 'absolute',
                      right: 12,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'rgba(74,114,164,0.7)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '50%',
                      width: 36,
                      height: 36,
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: 22,
                      zIndex: 2
                    }}
                  >&gt;</button>
                </>
              )}
              <div style={{
                position: 'absolute',
                bottom: 12,
                left: 0,
                width: '100%',
                textAlign: 'center',
                color: '#4A72A4',
                fontWeight: 600,
                fontSize: 16
              }}>
                {currentIdx + 1} / {images.length}
              </div>
            </>
          ) : (
            <div style={{ color: '#aaa', fontSize: 24 }}>No Image</div>
          )}
        </div>
        {/* Right: Details */}
        <div
          className="listing-detail-info"
          style={{
            background: '#fff',
            borderRadius: 20,
            boxShadow: '0 4px 24px rgba(74,114,164,0.10)',
            border: '1px solid #e0e0e0',
            padding: 32,
            width: 420,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            transition: 'all 0.2s'
          }}
        >
          <h2 style={{ fontSize: 32, fontWeight: 800, color: '#222', marginBottom: 8 }}>{listing.title}</h2>
          <div style={{ fontSize: 24, color: '#4A72A4', fontWeight: 700, marginBottom: 16 }}>${listing.price}</div>
          <div style={{ marginBottom: 8, color: '#555' }}>
            <b>Category:</b> {listing.category}
          </div>
          <div style={{ marginBottom: 8, color: '#555' }}>
            <b>Location:</b> {listing.location || <span style={{ color: '#aaa' }}>N/A</span>}
          </div>
          <div style={{ marginBottom: 16, color: '#555' }}>
            <b>Condition:</b> {listing.condition || <span style={{ color: '#aaa' }}>N/A</span>}
          </div>
          <div style={{ marginBottom: 24, color: '#444', fontSize: 16 }}>
            {listing.description}
          </div>
          <div style={{ marginBottom: 24, color: '#4A72A4', fontWeight: 600 }}>
            {seller
              ? <>Posted by <b>{seller.username || seller.email}</b></>
              : <>Posted by <span style={{ color: '#aaa' }}>Unknown</span></>
            }
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            <button
              onClick={handleMessageSeller}
              style={{
                padding: '10px 24px',
                borderRadius: 10,
                border: 'none',
                background: '#4A72A4',
                color: 'white',
                fontWeight: 'bold',
                fontSize: 16,
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
              onMouseOver={e => e.currentTarget.style.background = '#35547a'}
              onMouseOut={e => e.currentTarget.style.background = '#4A72A4'}
            >
              Message Seller
            </button>
            <button
              onClick={() => navigate(-1)}
              style={{
                padding: '10px 24px',
                borderRadius: 10,
                border: 'none',
                background: '#bbb',
                color: '#222',
                fontWeight: 'bold',
                fontSize: 16,
                cursor: 'pointer',
                width: 120
              }}
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
export default ListingDetailPage;
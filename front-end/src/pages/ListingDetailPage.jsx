import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

function ListingDetailPage() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [seller, setSeller] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:8000/api/listings/${id}`)
      .then(res => res.json())
      .then(async data => {
        setListing(data);
        if (data.userId) {
          const db = getFirestore();
          const userDoc = await getDoc(doc(db, 'users', data.userId));
          if (userDoc.exists()) setSeller(userDoc.data());
        }
      });
  }, [id]);

  if (!listing) return <div>Loading...</div>;

  return (
    <>
      <Navbar />
      <div style={{
        display: 'flex',
        background: '#f9f9f9',
        minHeight: '100vh',
        padding: 40,
        justifyContent: 'center'
      }}>
        {/* Left: Image */}
        <div style={{
          background: '#fff',
          borderRadius: 20,
          boxShadow: '0 4px 24px rgba(74,114,164,0.10)',
          border: '1px solid #e0e0e0',
          width: 480,
          height: 480,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 40,
          overflow: 'hidden'
        }}>
          {listing.image ? (
            <img
              src={listing.image}
              alt={listing.title}
              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
            />
          ) : (
            <div style={{ color: '#aaa', fontSize: 24 }}>No Image</div>
          )}
        </div>
        {/* Right: Details */}
        <div style={{
          background: '#fff',
          borderRadius: 20,
          boxShadow: '0 4px 24px rgba(74,114,164,0.10)',
          border: '1px solid #e0e0e0',
          padding: 32,
          width: 420,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start'
        }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: '#222', marginBottom: 8 }}>{listing.title}</h2>
          <div style={{ fontSize: 24, color: '#4A72A4', fontWeight: 700, marginBottom: 16 }}>${listing.price}</div>
          <div style={{ marginBottom: 8, color: '#555' }}>
            <b>Category:</b> {listing.category}
          </div>
          {/* Location and Condition */}
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
    </>
  );
}
export default ListingDetailPage;
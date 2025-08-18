import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getAuth } from 'firebase/auth';

function CreateListingPage() {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const navigate = useNavigate();

  // Convert image file to base64
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    const user = auth.currentUser;
    const userId = user ? user.uid : null;

    if (!userId) {
      alert('You must be logged in to create a listing.');
      return;
    }

    await fetch('http://localhost:8000/api/listings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, price, category, description, image, userId }),
    });
    navigate('/listings');
  };

  return (
    <>
      <Navbar />
      <div
        style={{
          background: '#f9f9f9',
          minHeight: '100vh',
          paddingTop: 40,
        }}
      >
        <div
          style={{
            background: '#fff',
            borderRadius: 24,
            padding: 40,
            maxWidth: 600,
            margin: '40px auto',
            boxShadow: '0 4px 24px rgba(74,114,164,0.10)',
            border: '1px solid #e0e0e0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <h1 style={{
            textAlign: 'center',
            marginBottom: 32,
            color: '#222',
            fontWeight: 800,
            fontSize: 32,
            letterSpacing: 1
          }}>
            Create a Listing
          </h1>
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <div style={{ display: 'flex', gap: 32, marginBottom: 20 }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontWeight: 600, color: '#4A72A4' }}>Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Enter Title..."
                  style={{
                    width: '100%',
                    marginBottom: 12,
                    padding: 10,
                    borderRadius: 10,
                    border: '1.5px solid #bfcbe2',
                    fontSize: 16,
                    background: '#f7fafd'
                  }}
                  required
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontWeight: 600, color: '#4A72A4' }}>Price</label>
                <input
                  type="number"
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  placeholder="Enter Price..."
                  style={{
                    width: '100%',
                    marginBottom: 12,
                    padding: 10,
                    borderRadius: 10,
                    border: '1.5px solid #bfcbe2',
                    fontSize: 16,
                    background: '#f7fafd'
                  }}
                  required
                />
              </div>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontWeight: 600, color: '#4A72A4' }}>Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                style={{
                  width: '100%',
                  marginBottom: 12,
                  padding: 10,
                  borderRadius: 10,
                  border: '1.5px solid #bfcbe2',
                  fontSize: 16,
                  background: '#f7fafd'
                }}
                required
              >
                <option value="">Select Category</option>
                <option value="Textbook">Textbook</option>
                <option value="Electronic">Electronic</option>
                <option value="Furniture">Furniture</option>
                <option value="Clothing">Clothing</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontWeight: 600, color: '#4A72A4' }}>Description</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Enter Description..."
                style={{
                  width: '100%',
                  minHeight: 100,
                  marginBottom: 12,
                  padding: 10,
                  borderRadius: 10,
                  border: '1.5px solid #bfcbe2',
                  fontSize: 16,
                  background: '#f7fafd',
                  resize: 'vertical'
                }}
                required
              />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontWeight: 600, color: '#4A72A4' }}>Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{
                  marginBottom: 12,
                  display: 'block',
                  fontSize: 15
                }}
              />
              {image && (
                <img
                  src={image}
                  alt="Preview"
                  style={{
                    width: '100%',
                    maxHeight: 220,
                    objectFit: 'contain',
                    borderRadius: 14,
                    border: '1.5px solid #bfcbe2',
                    marginBottom: 8,
                    background: '#fff'
                  }}
                />
              )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
              <button
                type="button"
                onClick={() => navigate('/listings')}
                style={{
                  padding: '10px 24px',
                  borderRadius: 10,
                  border: 'none',
                  background: '#bbb',
                  color: '#222',
                  fontWeight: 'bold',
                  fontSize: 16,
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
              >
                Back
              </button>
              <button
                type="submit"
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
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default CreateListingPage;
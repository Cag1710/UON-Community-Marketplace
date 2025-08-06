import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

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
    await fetch('http://localhost:8000/api/listings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, price, category, description, image }),
    });
    navigate('/listings');
  };

  return (
    <>
      <Navbar />
      <div
        style={{
          background: '#d3d3d3',
          borderRadius: 24,
          padding: 32,
          maxWidth: 700,
          margin: '40px auto',
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          border: '1px solid #e0e0e0'
        }}
      >
        <h1 style={{ textAlign: 'center', marginBottom: 24 }}>Create a Listing</h1>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontWeight: 600 }}>Title</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Enter Title..."
                style={{
                  width: '100%',
                  marginBottom: 16,
                  padding: 8,
                  borderRadius: 8,
                  border: '1px solid #ccc'
                }}
                required
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontWeight: 600 }}>Price</label>
              <input
                type="number"
                value={price}
                onChange={e => setPrice(e.target.value)}
                placeholder="Enter Price..."
                style={{
                  width: '100%',
                  marginBottom: 16,
                  padding: 8,
                  borderRadius: 8,
                  border: '1px solid #ccc'
                }}
                required
              />
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontWeight: 600 }}>Category</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              style={{
                width: '100%',
                marginBottom: 16,
                padding: 8,
                borderRadius: 8,
                border: '1px solid #ccc'
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
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontWeight: 600 }}>Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Enter Description..."
              style={{
                width: '100%',
                minHeight: 100,
                marginBottom: 16,
                padding: 8,
                borderRadius: 8,
                border: '1px solid #ccc'
              }}
              required
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontWeight: 600 }}>Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ marginBottom: 12 }}
            />
            {image && (
              <img
                src={image}
                alt="Preview"
                style={{
                  width: '100%',
                  maxHeight: 200,
                  objectFit: 'contain',
                  borderRadius: 12,
                  border: '1px solid #ddd',
                  marginBottom: 8
                }}
              />
            )}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button
              type="button"
              onClick={() => navigate('/listings')}
              style={{
                padding: '8px 16px',
                borderRadius: 8,
                border: 'none',
                background: '#bbb',
                color: '#222',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Back
            </button>
            <button
              type="submit"
              style={{
                padding: '8px 16px',
                borderRadius: 8,
                border: 'none',
                background: '#4A72A4',
                color: 'white',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default CreateListingPage;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

function CreateListingPage() {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('http://localhost:8000/api/listings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, price, category, description }),
    });
    navigate('/listings');
  };

  return (
    <>
      <Navbar />
      <div style={{
        background: '#d3d3d3',
        borderRadius: 24,
        padding: 32,
        maxWidth: 700,
        margin: '40px auto'
      }}>
        <h1>Create a Listing</h1>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ flex: 1 }}>
              <label>Title</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Enter Title..."
                style={{ width: '100%', marginBottom: 16 }}
                required
              />
            </div>
            <div style={{ flex: 1 }}>
              <label>Price</label>
              <input
                type="number"
                value={price}
                onChange={e => setPrice(e.target.value)}
                placeholder="Enter Price..."
                style={{ width: '100%', marginBottom: 16 }}
                required
              />
            </div>
          </div>
          <div>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              style={{ width: '100%', marginBottom: 16 }}
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
          <div>
            <label>Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Enter Description..."
              style={{ width: '100%', minHeight: 100, marginBottom: 16 }}
              required
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button type="button" onClick={() => navigate('/listings')}>Back</button>
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
    </>
  );
}

export default CreateListingPage;
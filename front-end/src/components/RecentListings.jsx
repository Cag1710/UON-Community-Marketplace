import React, { useEffect, useState } from 'react';

function RecentListings() {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/listings')
      .then(res => res.json())
      .then(data => {
        // Show 4 most recent (newest first)
        const sorted = data.slice().reverse().slice(0, 4);
        setListings(sorted);
      });
  }, []);

  return (
    <section style={styles.container}>
      <h2 style={styles.heading}>Recent Listings</h2>
      <div style={styles.grid}>
        {listings.map((item, index) => (
          <div key={item._id || index} style={styles.card}>
            {item.image ? (
              <img
                src={item.image}
                alt={item.title}
                style={{ height: '100px', objectFit: 'contain', width: '100%', borderRadius: 4, marginBottom: 10, background: '#fff' }}
              />
            ) : (
              <div style={styles.imagePlaceholder}></div>
            )}
            <h3 style={styles.title}>{item.title}</h3>
            <p style={styles.price}>${item.price}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

const styles = {
  container: {
    padding: '40px',
    backgroundColor: '#f8f8f8',
  },
  heading: {
    fontSize: '24px',
    marginBottom: '20px',
  },
  grid: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
  },
    card: {
    width: '200px',
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    textAlign: 'center',
  },
  imagePlaceholder: {
    height: '100px',
    backgroundColor: '#ddd',
    borderRadius: '4px',
    marginBottom: '10px',
  },
  title: {
    fontSize: '16px',
    fontWeight: 'bold',
  },
  price: {
    fontSize: '14px',
    color: '#333',
  },
};

export default RecentListings;
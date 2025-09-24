import React, { useEffect, useState } from 'react';

function RecentListings() {
  const [listings, setListings] = useState([]);
  const [imageIndexes, setImageIndexes] = useState({}); // listingId -> current image index

  useEffect(() => {
    fetch('http://localhost:8000/api/listings')
      .then(res => res.json())
      .then(data => {
        // Show 4 most recent (newest first)
        const sorted = data.slice().reverse().slice(0, 4);
        setListings(sorted);
      });
  }, []);

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

  return (
    <section style={styles.container}>
      <h2 style={styles.heading}>Recent Listings</h2>
      <div style={styles.grid}>
        {listings.map((item, index) => {
          const images = item.images && item.images.length > 0 ? item.images : (item.image ? [item.image] : []);
          const currentIdx = imageIndexes[item._id] || 0;
          const imageSrc = images.length > 0 ? images[currentIdx] : null;

          return (
            <div key={item._id || index} style={styles.card}>
              <div style={{ position: 'relative', width: '100%' }}>
                {imageSrc ? (
                  <>
                    <img
                      src={imageSrc}
                      alt={item.title}
                      style={{
                        height: '100px',
                        objectFit: 'contain',
                        width: '100%',
                        borderRadius: 4,
                        marginBottom: 10,
                        background: '#fff'
                      }}
                    />
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={e => { e.preventDefault(); handlePrev(item._id, images.length); }}
                          style={{
                            position: 'absolute',
                            left: 4,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'rgba(74,114,164,0.7)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '50%',
                            width: 24,
                            height: 24,
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: 14,
                            zIndex: 2
                          }}
                          onMouseDown={e => e.preventDefault()}
                        >&lt;</button>
                        <button
                          onClick={e => { e.preventDefault(); handleNext(item._id, images.length); }}
                          style={{
                            position: 'absolute',
                            right: 4,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'rgba(74,114,164,0.7)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '50%',
                            width: 24,
                            height: 24,
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: 14,
                            zIndex: 2
                          }}
                          onMouseDown={e => e.preventDefault()}
                        >&gt;</button>
                      </>
                    )}
                  </>
                ) : (
                  <div style={styles.imagePlaceholder}></div>
                )}
              </div>
              <h3 style={styles.title}>{item.title}</h3>
              <p style={styles.price}>${item.price}</p>
            </div>
          );
        })}
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
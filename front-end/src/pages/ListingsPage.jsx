import React from 'react';

function ListingsPage() {
  return (
    <div style={{ display: 'flex', padding: '20px' }}>
      {/* Sidebar stuff */}
      <div style={{ marginRight: '40px' }}>
        <h3>Filters</h3>
        <div>
          <label><input type="checkbox" /> Filter 1</label><br />
          <label><input type="checkbox" /> Filter 2</label><br />
          <label><input type="checkbox" /> Filter 3</label><br />
          <label><input type="checkbox" /> Filter 4</label>
        </div>
      </div>
      {/* Listings stuff */}
      <div>
        <h3>Listings</h3>
        <div>
          <h4>Listing 1</h4>
          <p>Description of listing 1</p>
          <button>View</button>
        </div>
        <div>
          <h4>Listing 2</h4>
          <p>Description of listing 2</p>
          <button>View</button>
        </div>
      </div>
    </div>
  );
}

export default ListingsPage;
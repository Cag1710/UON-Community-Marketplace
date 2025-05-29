import React from 'react';
import Navbar from '../components/Navbar';

function ListingsPage() {
  return (
    <>
      <Navbar />
      <div style={{ display: 'flex', padding: '32px', background: '#f9f9f9', minHeight: '100vh' }}>
        {/* Sidebar Filters */}
        <aside style={{
          minWidth: 240,
          background: '#f2f2f2',
          borderRadius: 20,
          padding: 24,
          marginRight: 32,
          height: 'fit-content'
        }}>
          <h2 style={{ marginTop: 0 }}>Filters</h2>
          <div>
            <strong style={{ textDecoration: 'underline' }}>Categories</strong>
            <ul style={{ listStyle: 'none', padding: 0, marginTop: 12 }}>
              <li><label><input type="checkbox" /> Textbook</label></li>
              <li><label><input type="checkbox" /> Electronic</label></li>
              <li><label><input type="checkbox" /> Furniture</label></li>
              <li><label><input type="checkbox" /> Clothing</label></li>
              <li><label><input type="checkbox" /> etc</label></li>
            </ul>
          </div>
        </aside>

        {/* Main Content */}
        <main style={{ flex: 1 }}>
          <h1 style={{ textAlign: 'center', marginBottom: 32 }}>Items</h1>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 32,
          }}>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} style={{
                background: '#d3d3d3',
                borderRadius: 24,
                padding: 24,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minHeight: 180
              }}>
                <div style={{
                  background: '#bbb',
                  width: '100%',
                  height: 80,
                  borderRadius: 12,
                  marginBottom: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  Picture of Item
                </div>
                <div style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                    <span>Textbook</span>
                    <span>$50</span>
                  </div>
                  <div>Description Description Description</div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </>
  );
}

export default ListingsPage;
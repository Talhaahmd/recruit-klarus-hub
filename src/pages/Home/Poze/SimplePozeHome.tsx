import React from 'react';

const SimplePozeHome: React.FC = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#2563eb', textAlign: 'center' }}>Klarus HR - Poze Landing Page</h1>
      <p style={{ textAlign: 'center', fontSize: '18px' }}>
        This is the new Poze landing page! The server is working correctly.
      </p>
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button style={{ 
          backgroundColor: '#2563eb', 
          color: 'white', 
          padding: '10px 20px', 
          border: 'none', 
          borderRadius: '5px',
          cursor: 'pointer'
        }}>
          Get Started
        </button>
      </div>
    </div>
  );
};

export default SimplePozeHome;

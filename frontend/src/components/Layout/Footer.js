import React from 'react';

const Footer = () => {
  return (
    <footer style={{ 
      backgroundColor: '#333', 
      color: 'white', 
      padding: '40px 0', 
      marginTop: '50px',
      textAlign: 'center'
    }}>
      <div className="container">
        <p>&copy; 2026 Blog Sitesi. Tüm hakları saklıdır.</p>
        <div style={{ marginTop: '20px', display: 'flex', gap: '20px', justifyContent: 'center' }}>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={{ color: 'white' }}>Facebook</a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={{ color: 'white' }}>Twitter</a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ color: 'white' }}>Instagram</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
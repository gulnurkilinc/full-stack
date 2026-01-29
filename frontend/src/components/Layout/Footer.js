import React from 'react';

const Footer = () => {
  return (
    <footer style={{ 
      background: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
      color: 'white', 
      padding: '60px 0 50px 0', 
      marginTop: '0',
      textAlign: 'center',
      borderTop: '1px solid rgba(0, 255, 255, 0.2)',
      boxShadow: '0 -4px 20px rgba(0, 255, 255, 0.1)',
      position: 'relative'
    }}>
      {/* Dekoratif üst çizgi */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '2px',
        background: 'linear-gradient(90deg, transparent 0%, #00ffff 50%, transparent 100%)',
        boxShadow: '0 0 10px rgba(0, 255, 255, 0.5)'
      }}></div>

      <div className="container">
        <p style={{
          fontSize: '16px',
          marginBottom: '30px',
          color: 'rgba(255, 255, 255, 0.9)',
          textShadow: '0 2px 8px rgba(0, 255, 255, 0.2)',
          fontWeight: '500',
          letterSpacing: '0.5px'
        }}>
          &copy; 2026 Blog Sitesi. Tüm hakları saklıdır.
        </p>
        
        <div style={{ 
          marginTop: '20px', 
          display: 'flex', 
          gap: '30px', 
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <a 
            href="https://facebook.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{ 
              color: 'rgba(255, 255, 255, 0.9)',
              textDecoration: 'none',
              fontSize: '15px',
              fontWeight: '500',
              transition: 'all 0.3s',
              padding: '10px 20px',
              borderRadius: '8px',
              border: '1px solid rgba(0, 255, 255, 0.2)',
              backgroundColor: 'rgba(0, 212, 255, 0.05)',
              display: 'inline-block'
            }}
            onMouseEnter={(e) => {
              e.target.style.color = '#00ffff';
              e.target.style.textShadow = '0 0 10px rgba(0, 255, 255, 0.8)';
              e.target.style.transform = 'translateY(-3px)';
              e.target.style.borderColor = '#00ffff';
              e.target.style.backgroundColor = 'rgba(0, 212, 255, 0.15)';
              e.target.style.boxShadow = '0 4px 15px rgba(0, 212, 255, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.color = 'rgba(255, 255, 255, 0.9)';
              e.target.style.textShadow = 'none';
              e.target.style.transform = 'translateY(0)';
              e.target.style.borderColor = 'rgba(0, 255, 255, 0.2)';
              e.target.style.backgroundColor = 'rgba(0, 212, 255, 0.05)';
              e.target.style.boxShadow = 'none';
            }}
          >
            Facebook
          </a>
          <a 
            href="https://twitter.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{ 
              color: 'rgba(255, 255, 255, 0.9)',
              textDecoration: 'none',
              fontSize: '15px',
              fontWeight: '500',
              transition: 'all 0.3s',
              padding: '10px 20px',
              borderRadius: '8px',
              border: '1px solid rgba(0, 255, 255, 0.2)',
              backgroundColor: 'rgba(0, 212, 255, 0.05)',
              display: 'inline-block'
            }}
            onMouseEnter={(e) => {
              e.target.style.color = '#00ffff';
              e.target.style.textShadow = '0 0 10px rgba(0, 255, 255, 0.8)';
              e.target.style.transform = 'translateY(-3px)';
              e.target.style.borderColor = '#00ffff';
              e.target.style.backgroundColor = 'rgba(0, 212, 255, 0.15)';
              e.target.style.boxShadow = '0 4px 15px rgba(0, 212, 255, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.color = 'rgba(255, 255, 255, 0.9)';
              e.target.style.textShadow = 'none';
              e.target.style.transform = 'translateY(0)';
              e.target.style.borderColor = 'rgba(0, 255, 255, 0.2)';
              e.target.style.backgroundColor = 'rgba(0, 212, 255, 0.05)';
              e.target.style.boxShadow = 'none';
            }}
          >
            Twitter
          </a>
          <a 
            href="https://instagram.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{ 
              color: 'rgba(255, 255, 255, 0.9)',
              textDecoration: 'none',
              fontSize: '15px',
              fontWeight: '500',
              transition: 'all 0.3s',
              padding: '10px 20px',
              borderRadius: '8px',
              border: '1px solid rgba(0, 255, 255, 0.2)',
              backgroundColor: 'rgba(0, 212, 255, 0.05)',
              display: 'inline-block'
            }}
            onMouseEnter={(e) => {
              e.target.style.color = '#00ffff';
              e.target.style.textShadow = '0 0 10px rgba(0, 255, 255, 0.8)';
              e.target.style.transform = 'translateY(-3px)';
              e.target.style.borderColor = '#00ffff';
              e.target.style.backgroundColor = 'rgba(0, 212, 255, 0.15)';
              e.target.style.boxShadow = '0 4px 15px rgba(0, 212, 255, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.color = 'rgba(255, 255, 255, 0.9)';
              e.target.style.textShadow = 'none';
              e.target.style.transform = 'translateY(0)';
              e.target.style.borderColor = 'rgba(0, 255, 255, 0.2)';
              e.target.style.backgroundColor = 'rgba(0, 212, 255, 0.05)';
              e.target.style.boxShadow = 'none';
            }}
          >
            Instagram
          </a>
        </div>

        {/* Alt bölüm - İlave bilgi */}
        <div style={{
          marginTop: '40px',
          paddingTop: '30px',
          borderTop: '1px solid rgba(0, 255, 255, 0.1)'
        }}>
          <p style={{
            fontSize: '13px',
            color: 'rgba(255, 255, 255, 0.7)',
            margin: 0,
            letterSpacing: '0.5px'
          }}>
            Uzay ve Teknoloji ile Buluşan Düşünceler
          </p>
        </div>
      </div>

      {/* Dekoratif alt efekt */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '200px',
        height: '2px',
        background: 'linear-gradient(90deg, transparent 0%, rgba(0, 255, 255, 0.3) 50%, transparent 100%)',
        opacity: 0.5
      }}></div>
    </footer>
  );
};

export default Footer;
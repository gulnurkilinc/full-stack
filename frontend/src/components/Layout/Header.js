import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const timeoutRef = useRef(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setShowDropdown(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setShowDropdown(false);
    }, 500); // 300ms bekle
  };

  return (
    <header className="navbar">
      <div className="container">
        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/" style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff' }}>
            Blog Sitesi
          </Link>
          
          <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
            <Link to="/">Ana Sayfa</Link>
            <Link to="/blogs">Bloglar</Link>
            
            {/* Bölümler Dropdown */}
            <div 
              style={{ position: 'relative' }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <span 
                style={{ 
                  cursor: 'pointer',
                  padding: '10px 0',
                  display: 'block'
                }}
              >
                Bölümler
              </span>
              
              {showDropdown && (
                <div 
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: '-10px',
                    backgroundColor: 'white',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    minWidth: '180px',
                    marginTop: '10px',
                    borderRadius: '8px',
                    zIndex: 1000,
                    overflow: 'hidden',
                    paddingTop: '5px'
                  }}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <Link 
                    to="/category/bilim" 
                    style={{ 
                      display: 'block', 
                      padding: '15px 20px',
                      color: '#333',
                      borderBottom: '1px solid #f0f0f0',
                      backgroundColor: 'white'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#f0f7ff';
                      e.target.style.color = '#007bff';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'white';
                      e.target.style.color = '#333';
                    }}
                  >
                    Bilim
                  </Link>
                  <Link 
                    to="/category/siyaset" 
                    style={{ 
                      display: 'block', 
                      padding: '15px 20px',
                      color: '#333',
                      borderBottom: '1px solid #f0f0f0',
                      backgroundColor: 'white'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#f0f7ff';
                      e.target.style.color = '#007bff';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'white';
                      e.target.style.color = '#333';
                    }}
                  >
                    Siyaset
                  </Link>
                  <Link 
                    to="/category/dunya" 
                    style={{ 
                      display: 'block', 
                      padding: '15px 20px',
                      color: '#333',
                      backgroundColor: 'white'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#f0f7ff';
                      e.target.style.color = '#007bff';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'white';
                      e.target.style.color = '#333';
                    }}
                  >
                    Dünya
                  </Link>
                </div>
              )}
            </div>

            <Link to="/contact">İletişim</Link>
            <Link to="/login">
              <button className="btn btn-primary">Giriş Yap</button>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
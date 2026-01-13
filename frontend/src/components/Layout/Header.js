import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const timeoutRef = useRef(null);
  const location = useLocation();

  // Scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Ana sayfa mı kontrol et
  const isHomePage = location.pathname === '/';

  // Header'ın arka plan rengi
  const headerBgColor = isHomePage && !isScrolled 
    ? 'transparent' 
    : 'rgba(208, 39, 39, 0.9)';

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setShowDropdown(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setShowDropdown(false);
    }, 300);
  };

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      backgroundColor: headerBgColor,
      backdropFilter: isHomePage && !isScrolled ? 'none' : 'blur(10px)',
      padding: '1rem 0',
      zIndex: 1000,
      transition: 'all 0.3s ease',
      boxShadow: isHomePage && !isScrolled ? 'none' : '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <div className="container">
        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/" style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            color: 'white'
          }}>
            Blog Sitesi
          </Link>
          
          <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
            <Link to="/" style={{ color: 'white' }}>Ana Sayfa</Link>
            <Link to="/blogs" style={{ color: 'white' }}>Bloglar</Link>
            
            <div 
              style={{ position: 'relative' }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <span style={{ 
                cursor: 'pointer',
                padding: '10px 0',
                display: 'block',
                color: 'white'
              }}>
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

            <Link to="/contact" style={{ color: 'white' }}>İletişim</Link>
            <Link to="/login">
              <button style={{
                backgroundColor: '#007bff',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '5px',
                fontSize: '16px',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#0056b3'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#007bff'}
              >
                Giriş Yap
              </button>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
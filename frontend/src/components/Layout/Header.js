import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/authSlice';

const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchBar, setShowSearchBar] = useState(false);
  const timeoutRef = useRef(null);
  const searchInputRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Redux'tan kullanıcı bilgisi al
  const { isAuthenticated, user } = useSelector((state) => state.auth);

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

  // Arama çubuğu açıldığında input'a focus
  useEffect(() => {
    if (showSearchBar && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearchBar]);

  const isHomePage = location.pathname === '/';

  const headerBgColor = isHomePage && !isScrolled 
    ? 'transparent' 
    : 'rgba(0, 0, 0, 0.9)';

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

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  // Arama işlemleri
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/blogs?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearchBar(false);
      setSearchQuery('');
    }
  };

  const toggleSearchBar = () => {
    setShowSearchBar(!showSearchBar);
    if (showSearchBar) {
      setSearchQuery('');
    }
  };

  // ESC tuşu ile arama çubuğunu kapat
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && showSearchBar) {
        setShowSearchBar(false);
        setSearchQuery('');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showSearchBar]);

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

            {/* ARAMA BUTONU */}
<button
  onClick={toggleSearchBar}
  style={{
    backgroundColor: 'transparent',
    color: 'white',
    border: '2px solid white',
    borderRadius: '50%',
    width: '42px',
    height: '42px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s',
    padding: 0
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.backgroundColor = 'white';
    e.currentTarget.style.transform = 'scale(1.1)';
    const svg = e.currentTarget.querySelector('svg');
    if (svg) svg.style.stroke = '#007bff';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.backgroundColor = 'transparent';
    e.currentTarget.style.transform = 'scale(1)';
    const svg = e.currentTarget.querySelector('svg');
    if (svg) svg.style.stroke = 'white';
  }}
  aria-label="Arama"
>
  {showSearchBar ? (
    // Kapatma ikonu (X)
    <svg 
      width="20" 
      height="20" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      style={{ transition: 'stroke 0.3s' }}
    >
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  ) : (
    // Modern arama ikonu
    <svg 
      width="20" 
      height="20" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="white" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      style={{ transition: 'stroke 0.3s' }}
    >
      <circle cx="11" cy="11" r="8"></circle>
      <path d="m21 21-4.35-4.35"></path>
    </svg>
  )}
</button>
            
            {/* Giriş yapmış kullanıcı için */}
            {isAuthenticated ? (
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <span style={{ color: 'white' }}>
                  👤 {user?.name}
                </span>
                <button
                  onClick={handleLogout}
                  style={{
                    backgroundColor: '#dc3545',
                    color: 'white',
                    padding: '10px 20px',
                    borderRadius: '5px',
                    fontSize: '16px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#c82333'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#dc3545'}
                >
                  Çıkış Yap
                </button>
              </div>
            ) : (
              // Giriş yapmamış kullanıcı için
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
            )}
          </div>
        </nav>

        {/* ARAMA ÇUBUĞU */}
        {showSearchBar && (
          <div style={{
            marginTop: '20px',
            animation: 'slideDown 0.3s ease'
          }}>
            <form onSubmit={handleSearchSubmit} style={{
              display: 'flex',
              gap: '10px',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Blog ara... (başlık, içerik, etiketler)"
                style={{
                  flex: 1,
                  padding: '12px 20px',
                  fontSize: '15px',
                  border: '2px solid white',
                  borderRadius: '25px',
                  outline: 'none',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  transition: 'all 0.3s'
                }}
                onFocus={(e) => {
                  e.target.style.backgroundColor = 'white';
                  e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                }}
                onBlur={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <button
                type="submit"
                style={{
                  padding: '12px 30px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '25px',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#0056b3';
                  e.target.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#007bff';
                  e.target.style.transform = 'scale(1)';
                }}
              >
                Ara
              </button>
            </form>
            <p style={{
              textAlign: 'center',
              color: 'white',
              fontSize: '12px',
              marginTop: '10px',
              opacity: 0.8
            }}>
              ESC tuşu ile kapatabilirsiniz
            </p>
          </div>
        )}
      </div>

      {/* CSS Animasyon */}
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </header>
  );
};

export default Header;
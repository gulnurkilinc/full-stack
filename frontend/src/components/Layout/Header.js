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

  useEffect(() => {
    if (showSearchBar && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearchBar]);

  const isHomePage = location.pathname === '/';

  const headerBgColor = isHomePage && !isScrolled 
    ? 'transparent' 
    : 'rgba(15, 32, 39, 0.95)';

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
      backdropFilter: isHomePage && !isScrolled ? 'none' : 'blur(15px)',
      padding: '1rem 0',
      zIndex: 1000,
      transition: 'all 0.3s ease',
      boxShadow: isHomePage && !isScrolled 
        ? 'none' 
        : '0 4px 20px rgba(0, 255, 255, 0.1), 0 2px 10px rgba(0,0,0,0.3)',
      borderBottom: isHomePage && !isScrolled 
        ? 'none' 
        : '1px solid rgba(0, 255, 255, 0.2)'
    }}>
      <div className="container">
        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/" style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            color: 'white',
            textShadow: '0 2px 10px rgba(0, 255, 255, 0.3)',
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => {
            e.target.style.color = '#00ffff';
            e.target.style.textShadow = '0 0 20px rgba(0, 255, 255, 0.8)';
          }}
          onMouseLeave={(e) => {
            e.target.style.color = 'white';
            e.target.style.textShadow = '0 2px 10px rgba(0, 255, 255, 0.3)';
          }}
          >
            Blog Sitesi
          </Link>
          
          <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
            <Link 
              to="/" 
              style={{ 
                color: 'rgba(255, 255, 255, 0.9)',
                transition: 'all 0.3s',
                fontWeight: '500'
              }}
              onMouseEnter={(e) => {
                e.target.style.color = '#00ffff';
                e.target.style.textShadow = '0 0 10px rgba(0, 255, 255, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = 'rgba(255, 255, 255, 0.9)';
                e.target.style.textShadow = 'none';
              }}
            >
              Ana Sayfa
            </Link>
            <Link 
              to="/blogs" 
              style={{ 
                color: 'rgba(255, 255, 255, 0.9)',
                transition: 'all 0.3s',
                fontWeight: '500'
              }}
              onMouseEnter={(e) => {
                e.target.style.color = '#00ffff';
                e.target.style.textShadow = '0 0 10px rgba(0, 255, 255, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = 'rgba(255, 255, 255, 0.9)';
                e.target.style.textShadow = 'none';
              }}
            >
              Bloglar
            </Link>
            
            <div 
              style={{ position: 'relative' }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <span style={{ 
                cursor: 'pointer',
                padding: '10px 0',
                display: 'block',
                color: 'rgba(255, 255, 255, 0.9)',
                transition: 'all 0.3s',
                fontWeight: '500'
              }}
              onMouseEnter={(e) => {
                e.target.style.color = '#00ffff';
                e.target.style.textShadow = '0 0 10px rgba(0, 255, 255, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = 'rgba(255, 255, 255, 0.9)';
                e.target.style.textShadow = 'none';
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
                    backgroundColor: 'rgba(255, 255, 255, 0.98)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 8px 25px rgba(0, 255, 255, 0.2), 0 4px 12px rgba(0,0,0,0.3)',
                    minWidth: '180px',
                    marginTop: '10px',
                    borderRadius: '12px',
                    zIndex: 1000,
                    overflow: 'hidden',
                    paddingTop: '5px',
                    border: '1px solid rgba(0, 255, 255, 0.3)'
                  }}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <Link 
                    to="/category/bilim" 
                    style={{ 
                      display: 'block', 
                      padding: '15px 20px',
                      color: '#2d3748',
                      borderBottom: '1px solid rgba(0, 212, 255, 0.1)',
                      backgroundColor: 'transparent',
                      transition: 'all 0.2s',
                      fontWeight: '500'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = 'rgba(0, 212, 255, 0.1)';
                      e.target.style.color = '#00d4ff';
                      e.target.style.paddingLeft = '25px';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = '#2d3748';
                      e.target.style.paddingLeft = '20px';
                    }}
                  >
                    Bilim
                  </Link>
                  <Link 
                    to="/category/siyaset" 
                    style={{ 
                      display: 'block', 
                      padding: '15px 20px',
                      color: '#2d3748',
                      borderBottom: '1px solid rgba(0, 212, 255, 0.1)',
                      backgroundColor: 'transparent',
                      transition: 'all 0.2s',
                      fontWeight: '500'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = 'rgba(0, 212, 255, 0.1)';
                      e.target.style.color = '#00d4ff';
                      e.target.style.paddingLeft = '25px';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = '#2d3748';
                      e.target.style.paddingLeft = '20px';
                    }}
                  >
                    Siyaset
                  </Link>
                  <Link 
                    to="/category/dunya" 
                    style={{ 
                      display: 'block', 
                      padding: '15px 20px',
                      color: '#2d3748',
                      backgroundColor: 'transparent',
                      transition: 'all 0.2s',
                      fontWeight: '500'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = 'rgba(0, 212, 255, 0.1)';
                      e.target.style.color = '#00d4ff';
                      e.target.style.paddingLeft = '25px';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = '#2d3748';
                      e.target.style.paddingLeft = '20px';
                    }}
                  >
                    Dünya
                  </Link>
                </div>
              )}
            </div>

            <Link 
              to="/contact" 
              style={{ 
                color: 'rgba(255, 255, 255, 0.9)',
                transition: 'all 0.3s',
                fontWeight: '500'
              }}
              onMouseEnter={(e) => {
                e.target.style.color = '#00ffff';
                e.target.style.textShadow = '0 0 10px rgba(0, 255, 255, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = 'rgba(255, 255, 255, 0.9)';
                e.target.style.textShadow = 'none';
              }}
            >
              İletişim
            </Link>

            {/* ARAMA BUTONU */}
            <button
              onClick={toggleSearchBar}
              style={{
                backgroundColor: 'transparent',
                color: '#00ffff',
                border: '2px solid #00ffff',
                borderRadius: '50%',
                width: '42px',
                height: '42px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s',
                padding: 0,
                boxShadow: '0 0 10px rgba(0, 255, 255, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#00ffff';
                e.currentTarget.style.transform = 'scale(1.1)';
                e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 255, 255, 0.6)';
                const svg = e.currentTarget.querySelector('svg');
                if (svg) svg.style.stroke = '#0f2027';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 0 10px rgba(0, 255, 255, 0.3)';
                const svg = e.currentTarget.querySelector('svg');
                if (svg) svg.style.stroke = '#00ffff';
              }}
              aria-label="Arama"
            >
              {showSearchBar ? (
                <svg 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="#00ffff" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  style={{ transition: 'stroke 0.3s' }}
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              ) : (
                <svg 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="#00ffff" 
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
                <span style={{ 
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontWeight: '500'
                }}>
                  👤 {user?.name}
                </span>
                <button
                  onClick={handleLogout}
                  style={{
                    background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)',
                    color: 'white',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    fontSize: '15px',
                    fontWeight: '600',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    boxShadow: '0 4px 15px rgba(238, 90, 111, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 20px rgba(238, 90, 111, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 15px rgba(238, 90, 111, 0.3)';
                  }}
                >
                  Çıkış Yap
                </button>
              </div>
            ) : (
              <Link to="/login">
                <button style={{
                  background: 'linear-gradient(135deg, #00d4ff 0%, #7b2cbf 100%)',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontSize: '15px',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  boxShadow: '0 4px 15px rgba(0, 212, 255, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 20px rgba(0, 212, 255, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 15px rgba(0, 212, 255, 0.3)';
                }}
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
                  border: '1.5px solid rgba(0, 255, 255, 0.5)',
                  borderRadius: '25px',
                  outline: 'none',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  transition: 'all 0.3s',
                  color: '#2d3748'
                }}
                onFocus={(e) => {
                  e.target.style.backgroundColor = 'white';
                  e.target.style.borderColor = '#00ffff';
                  e.target.style.boxShadow = '0 0 0 3px rgba(0, 255, 255, 0.2), 0 4px 12px rgba(0,0,0,0.15)';
                }}
                onBlur={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                  e.target.style.borderColor = 'rgba(0, 255, 255, 0.5)';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <button
                type="submit"
                style={{
                  padding: '12px 30px',
                  background: 'linear-gradient(135deg, #00d4ff 0%, #7b2cbf 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '25px',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 4px 15px rgba(0, 212, 255, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.05)';
                  e.target.style.boxShadow = '0 6px 20px rgba(0, 212, 255, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = '0 4px 15px rgba(0, 212, 255, 0.3)';
                }}
              >
                Ara
              </button>
            </form>
            <p style={{
              textAlign: 'center',
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '12px',
              marginTop: '10px',
              opacity: 0.9
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
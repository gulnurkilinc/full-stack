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
      if (window.scrollY > 50) {
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
    ? 'rgba(26, 31, 54, 0.85)' 
    : 'rgba(26, 31, 54, 0.98)';

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
      background: headerBgColor,
      backdropFilter: 'blur(20px)',
      padding: '1.2rem 0',
      zIndex: 1000,
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: isScrolled 
        ? '0 2px 24px rgba(0, 0, 0, 0.3), 0 1px 0 rgba(255, 255, 255, 0.05)' 
        : '0 1px 0 rgba(255, 255, 255, 0.05)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
    }}>
      {/* Profesyonel üst gradient çizgi */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '2px',
        background: 'linear-gradient(90deg, #2563eb 0%, #1e40af 100%)'
      }}></div>
      <div className="container">
        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/" style={{ 
            fontSize: '26px', 
            fontWeight: '700', 
            color: '#ffffff',
            letterSpacing: '-0.5px',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
          onMouseEnter={(e) => {
            e.target.style.color = '#3b82f6';
            e.target.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.color = '#ffffff';
            e.target.style.transform = 'translateY(0)';
          }}
          >
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              display: 'inline-block',
              boxShadow: '0 0 12px rgba(59, 130, 246, 0.6)'
            }}></span>
            Blog Sitesi
          </Link>
          
          <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
            <Link 
              to="/" 
              style={{ 
                color: 'rgba(255, 255, 255, 0.7)',
                transition: 'all 0.3s ease',
                fontWeight: '500',
                fontSize: '15px',
                position: 'relative',
                paddingBottom: '2px'
              }}
              onMouseEnter={(e) => {
                e.target.style.color = '#3b82f6';
                e.target.style.fontWeight = '600';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = 'rgba(255, 255, 255, 0.7)';
                e.target.style.fontWeight = '500';
              }}
            >
              Ana Sayfa
            </Link>
            <Link 
              to="/blogs" 
              style={{ 
                color: 'rgba(255, 255, 255, 0.7)',
                transition: 'all 0.3s ease',
                fontWeight: '500',
                fontSize: '15px',
                position: 'relative',
                paddingBottom: '2px'
              }}
              onMouseEnter={(e) => {
                e.target.style.color = '#3b82f6';
                e.target.style.fontWeight = '600';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = 'rgba(255, 255, 255, 0.7)';
                e.target.style.fontWeight = '500';
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
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: 'rgba(255, 255, 255, 0.7)',
                transition: 'all 0.3s ease',
                fontWeight: '500',
                fontSize: '15px'
              }}
              onMouseEnter={(e) => {
                e.target.style.color = '#3b82f6';
                e.target.style.fontWeight = '600';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = 'rgba(255, 255, 255, 0.7)';
                e.target.style.fontWeight = '500';
              }}
              >
                Bölümler
                <svg 
                  width="14" 
                  height="14" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  style={{ 
                    transition: 'transform 0.3s',
                    transform: showDropdown ? 'rotate(180deg)' : 'rotate(0)'
                  }}
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </span>
              
              {showDropdown && (
                <div 
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: '-20px',
                    background: 'linear-gradient(180deg, #1a1f36 0%, #0f172a 100%)',
                    backdropFilter: 'blur(20px)',
                    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.5), 0 2px 8px rgba(0, 0, 0, 0.3)',
                    minWidth: '220px',
                    marginTop: '12px',
                    borderRadius: '16px',
                    zIndex: 1000,
                    overflow: 'hidden',
                    padding: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    animation: 'dropdownFade 0.3s ease'
                  }}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <Link 
                    to="/category/bilim" 
                    style={{ 
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '14px 18px',
                      color: 'rgba(255, 255, 255, 0.7)',
                      backgroundColor: 'transparent',
                      transition: 'all 0.2s ease',
                      fontWeight: '500',
                      fontSize: '14.5px',
                      borderRadius: '10px',
                      margin: '2px 0'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = 'rgba(59, 130, 246, 0.15)';
                      e.target.style.color = '#3b82f6';
                      e.target.style.transform = 'translateX(4px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = 'rgba(255, 255, 255, 0.7)';
                      e.target.style.transform = 'translateX(0)';
                    }}
                  >
                    <span style={{ fontSize: '18px' }}>🔬</span>
                    Bilim
                  </Link>
                  <Link 
                    to="/category/siyaset" 
                    style={{ 
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '14px 18px',
                      color: 'rgba(255, 255, 255, 0.7)',
                      backgroundColor: 'transparent',
                      transition: 'all 0.2s ease',
                      fontWeight: '500',
                      fontSize: '14.5px',
                      borderRadius: '10px',
                      margin: '2px 0'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = 'rgba(59, 130, 246, 0.15)';
                      e.target.style.color = '#3b82f6';
                      e.target.style.transform = 'translateX(4px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = 'rgba(255, 255, 255, 0.7)';
                      e.target.style.transform = 'translateX(0)';
                    }}
                  >
                    <span style={{ fontSize: '18px' }}>🏛️</span>
                    Siyaset
                  </Link>
                  <Link 
                    to="/category/dunya" 
                    style={{ 
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '14px 18px',
                      color: 'rgba(255, 255, 255, 0.7)',
                      backgroundColor: 'transparent',
                      transition: 'all 0.2s ease',
                      fontWeight: '500',
                      fontSize: '14.5px',
                      borderRadius: '10px',
                      margin: '2px 0'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = 'rgba(59, 130, 246, 0.15)';
                      e.target.style.color = '#3b82f6';
                      e.target.style.transform = 'translateX(4px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = 'rgba(255, 255, 255, 0.7)';
                      e.target.style.transform = 'translateX(0)';
                    }}
                  >
                    <span style={{ fontSize: '18px' }}>🌍</span>
                    Dünya
                  </Link>
                </div>
              )}
            </div>

            <Link 
              to="/contact" 
              style={{ 
                color: 'rgba(255, 255, 255, 0.7)',
                transition: 'all 0.3s ease',
                fontWeight: '500',
                fontSize: '15px',
                position: 'relative',
                paddingBottom: '2px'
              }}
              onMouseEnter={(e) => {
                e.target.style.color = '#3b82f6';
                e.target.style.fontWeight = '600';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = 'rgba(255, 255, 255, 0.7)';
                e.target.style.fontWeight = '500';
              }}
            >
              İletişim
            </Link>

            {/* ARAMA BUTONU */}
            <button
              onClick={toggleSearchBar}
              style={{
                backgroundColor: showSearchBar ? '#2563eb' : 'rgba(255, 255, 255, 0.08)',
                color: showSearchBar ? 'white' : 'rgba(255, 255, 255, 0.7)',
                border: '1.5px solid',
                borderColor: showSearchBar ? '#2563eb' : 'rgba(255, 255, 255, 0.15)',
                borderRadius: '12px',
                width: '44px',
                height: '44px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                padding: 0,
                boxShadow: showSearchBar ? '0 4px 16px rgba(37, 99, 235, 0.25)' : '0 2px 8px rgba(0, 0, 0, 0.2)'
              }}
              onMouseEnter={(e) => {
                if (!showSearchBar) {
                  e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.15)';
                  e.currentTarget.style.borderColor = '#3b82f6';
                  e.currentTarget.style.color = '#3b82f6';
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
                }
              }}
              onMouseLeave={(e) => {
                if (!showSearchBar) {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.2)';
                }
              }}
              aria-label="Arama"
            >
              {showSearchBar ? (
                <svg 
                  width="18" 
                  height="18" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              ) : (
                <svg 
                  width="18" 
                  height="18" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
              )}
            </button>
            
            {/* Giriş yapmış kullanıcı için */}
            {isAuthenticated ? (
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px 16px',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.15)'
                }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '600',
                    boxShadow: '0 0 12px rgba(59, 130, 246, 0.4)'
                  }}>
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span style={{ 
                    color: '#ffffff',
                    fontWeight: '600',
                    fontSize: '14.5px'
                  }}>
                    {user?.name}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  style={{
                    backgroundColor: 'rgba(220, 38, 38, 0.1)',
                    color: '#f87171',
                    padding: '11px 24px',
                    borderRadius: '12px',
                    fontSize: '14.5px',
                    fontWeight: '600',
                    border: '1.5px solid rgba(220, 38, 38, 0.3)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 8px rgba(220, 38, 38, 0.15)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#dc2626';
                    e.target.style.color = 'white';
                    e.target.style.borderColor = '#dc2626';
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 16px rgba(220, 38, 38, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'rgba(220, 38, 38, 0.1)';
                    e.target.style.color = '#f87171';
                    e.target.style.borderColor = 'rgba(220, 38, 38, 0.3)';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 2px 8px rgba(220, 38, 38, 0.15)';
                  }}
                >
                  Çıkış Yap
                </button>
              </div>
            ) : (
              <Link to="/login">
                <button style={{
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  color: 'white',
                  padding: '11px 28px',
                  borderRadius: '12px',
                  fontSize: '14.5px',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 16px rgba(37, 99, 235, 0.25)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 24px rgba(37, 99, 235, 0.35)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 16px rgba(37, 99, 235, 0.25)';
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
            marginTop: '24px',
            animation: 'slideDown 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
          }}>
            <form onSubmit={handleSearchSubmit} style={{
              display: 'flex',
              gap: '12px',
              maxWidth: '680px',
              margin: '0 auto'
            }}>
              <div style={{
                flex: 1,
                position: 'relative'
              }}>
                <svg 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="rgba(255, 255, 255, 0.4)" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  style={{
                    position: 'absolute',
                    left: '18px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none'
                  }}
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Blog ara... (başlık, içerik, etiketler)"
                  style={{
                    width: '100%',
                    padding: '14px 20px 14px 52px',
                    fontSize: '15px',
                    border: '1.5px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '14px',
                    outline: 'none',
                    background: 'rgba(255, 255, 255, 0.08)',
                    transition: 'all 0.3s ease',
                    color: '#ffffff',
                    fontWeight: '500'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.background = 'rgba(255, 255, 255, 0.12)';
                    e.target.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.15), 0 4px 16px rgba(0, 0, 0, 0.3)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                    e.target.style.background = 'rgba(255, 255, 255, 0.08)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
              <button
                type="submit"
                style={{
                  padding: '14px 32px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '14px',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 4px 16px rgba(37, 99, 235, 0.25)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 24px rgba(37, 99, 235, 0.35)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 16px rgba(37, 99, 235, 0.25)';
                }}
              >
                Ara
              </button>
            </form>
            <p style={{
              textAlign: 'center',
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: '13px',
              marginTop: '12px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}>
              <kbd style={{
                padding: '3px 8px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '600',
                color: 'rgba(255, 255, 255, 0.8)'
              }}>ESC</kbd>
              tuşu ile kapatabilirsiniz
            </p>
          </div>
        )}
      </div>

      {/* CSS Animasyonlar */}
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes dropdownFade {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Genel link altı çizgi efekti */
        nav a:not(button a) {
          position: relative;
        }

        nav a:not(button a)::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #3b82f6, #2563eb);
          transition: width 0.3s ease;
        }

        nav a:not(button a):hover::after {
          width: 100%;
        }
      `}</style>
    </header>
  );
};

export default Header;
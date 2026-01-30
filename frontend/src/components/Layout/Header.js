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
    ? 'transparent' 
    : 'rgba(255, 255, 255, 0.98)';

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
      backdropFilter: (isHomePage && !isScrolled) ? 'none' : 'blur(12px)',
      padding: '1.3rem 0',
      zIndex: 1000,
      transition: 'all 0.3s ease',
      boxShadow: isScrolled 
        ? '0 1px 3px rgba(0, 0, 0, 0.08)' 
        : 'none',
      borderBottom: (isHomePage && !isScrolled) ? 'none' : (isScrolled ? '1px solid rgba(0, 0, 0, 0.08)' : '1px solid rgba(255, 255, 255, 0.1)')
    }}>
      {/* Minimal accent line */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '1px',
        background: isScrolled 
          ? 'linear-gradient(90deg, transparent 0%, #1a1a1a 50%, transparent 100%)'
          : 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%)',
        opacity: (isHomePage && !isScrolled) ? 0 : 0.15
      }}></div>
      <div className="container">
        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/" style={{ 
            fontSize: '24px', 
            fontWeight: '700', 
            color: isScrolled ? '#1a1a1a' : '#ffffff',
            letterSpacing: '-0.8px',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            textShadow: !isScrolled ? '0 2px 4px rgba(0, 0, 0, 0.3)' : 'none'
          }}
          onMouseEnter={(e) => {
            e.target.style.color = isScrolled ? '#000000' : '#f0f0f0';
            e.target.style.letterSpacing = '-0.9px';
          }}
          onMouseLeave={(e) => {
            e.target.style.color = isScrolled ? '#1a1a1a' : '#ffffff';
            e.target.style.letterSpacing = '-0.8px';
          }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" style={{ transition: 'all 0.3s' }}>
              <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M7 7h10M7 12h10M7 17h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Blog Sitesi
          </Link>
          
          <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
            <Link 
              to="/" 
              style={{ 
                color: isScrolled ? '#4a5568' : 'rgba(255, 255, 255, 0.9)',
                transition: 'all 0.3s ease',
                fontWeight: '500',
                fontSize: '15px',
                position: 'relative',
                paddingBottom: '2px',
                letterSpacing: '-0.2px',
                textShadow: !isScrolled ? '0 1px 3px rgba(0, 0, 0, 0.3)' : 'none'
              }}
              onMouseEnter={(e) => {
                e.target.style.color = isScrolled ? '#1a1a1a' : '#ffffff';
                e.target.style.fontWeight = '600';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = isScrolled ? '#4a5568' : 'rgba(255, 255, 255, 0.9)';
                e.target.style.fontWeight = '500';
              }}
            >
              Ana Sayfa
            </Link>
            <Link 
              to="/blogs" 
              style={{ 
                color: isScrolled ? '#4a5568' : 'rgba(255, 255, 255, 0.9)',
                transition: 'all 0.3s ease',
                fontWeight: '500',
                fontSize: '15px',
                position: 'relative',
                paddingBottom: '2px',
                letterSpacing: '-0.2px',
                textShadow: !isScrolled ? '0 1px 3px rgba(0, 0, 0, 0.3)' : 'none'
              }}
              onMouseEnter={(e) => {
                e.target.style.color = isScrolled ? '#1a1a1a' : '#ffffff';
                e.target.style.fontWeight = '600';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = isScrolled ? '#4a5568' : 'rgba(255, 255, 255, 0.9)';
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
                color: isScrolled ? '#4a5568' : 'rgba(255, 255, 255, 0.9)',
                transition: 'all 0.3s ease',
                fontWeight: '500',
                fontSize: '15px',
                letterSpacing: '-0.2px',
                textShadow: !isScrolled ? '0 1px 3px rgba(0, 0, 0, 0.3)' : 'none'
              }}
              onMouseEnter={(e) => {
                e.target.style.color = isScrolled ? '#1a1a1a' : '#ffffff';
                e.target.style.fontWeight = '600';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = isScrolled ? '#4a5568' : 'rgba(255, 255, 255, 0.9)';
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
                    background: 'white',
                    backdropFilter: 'blur(8px)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.12), 0 1px 3px rgba(0, 0, 0, 0.08)',
                    minWidth: '220px',
                    marginTop: '12px',
                    borderRadius: '12px',
                    zIndex: 1000,
                    overflow: 'hidden',
                    padding: '6px',
                    border: '1px solid rgba(0, 0, 0, 0.08)',
                    animation: 'dropdownFade 0.25s ease'
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
                      padding: '12px 16px',
                      color: '#4a5568',
                      backgroundColor: 'transparent',
                      transition: 'all 0.2s ease',
                      fontWeight: '500',
                      fontSize: '14.5px',
                      borderRadius: '8px',
                      margin: '2px 0'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#f7f8fa';
                      e.target.style.color = '#1a1a1a';
                      e.target.style.transform = 'translateX(3px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = '#4a5568';
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
                      padding: '12px 16px',
                      color: '#4a5568',
                      backgroundColor: 'transparent',
                      transition: 'all 0.2s ease',
                      fontWeight: '500',
                      fontSize: '14.5px',
                      borderRadius: '8px',
                      margin: '2px 0'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#f7f8fa';
                      e.target.style.color = '#1a1a1a';
                      e.target.style.transform = 'translateX(3px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = '#4a5568';
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
                      padding: '12px 16px',
                      color: '#4a5568',
                      backgroundColor: 'transparent',
                      transition: 'all 0.2s ease',
                      fontWeight: '500',
                      fontSize: '14.5px',
                      borderRadius: '8px',
                      margin: '2px 0'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#f7f8fa';
                      e.target.style.color = '#1a1a1a';
                      e.target.style.transform = 'translateX(3px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = '#4a5568';
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
                color: isScrolled ? '#4a5568' : 'rgba(255, 255, 255, 0.9)',
                transition: 'all 0.3s ease',
                fontWeight: '500',
                fontSize: '15px',
                position: 'relative',
                paddingBottom: '2px',
                letterSpacing: '-0.2px',
                textShadow: !isScrolled ? '0 1px 3px rgba(0, 0, 0, 0.3)' : 'none'
              }}
              onMouseEnter={(e) => {
                e.target.style.color = isScrolled ? '#1a1a1a' : '#ffffff';
                e.target.style.fontWeight = '600';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = isScrolled ? '#4a5568' : 'rgba(255, 255, 255, 0.9)';
                e.target.style.fontWeight = '500';
              }}
            >
              İletişim
            </Link>

            {/* ARAMA BUTONU */}
            <button
              onClick={toggleSearchBar}
              style={{
                backgroundColor: showSearchBar ? '#1a1a1a' : (isScrolled ? 'white' : 'rgba(255, 255, 255, 0.15)'),
                color: showSearchBar ? 'white' : (isScrolled ? '#4a5568' : 'rgba(255, 255, 255, 0.9)'),
                border: '1.5px solid',
                borderColor: showSearchBar ? '#1a1a1a' : (isScrolled ? '#e2e8f0' : 'rgba(255, 255, 255, 0.3)'),
                borderRadius: '10px',
                width: '42px',
                height: '42px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                padding: 0,
                boxShadow: isScrolled ? '0 1px 3px rgba(0, 0, 0, 0.08)' : '0 2px 4px rgba(0, 0, 0, 0.2)',
                backdropFilter: !isScrolled ? 'blur(10px)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (!showSearchBar) {
                  e.currentTarget.style.backgroundColor = isScrolled ? '#f7f8fa' : 'rgba(255, 255, 255, 0.25)';
                  e.currentTarget.style.borderColor = isScrolled ? '#cbd5e0' : 'rgba(255, 255, 255, 0.5)';
                  e.currentTarget.style.color = isScrolled ? '#1a1a1a' : '#ffffff';
                }
              }}
              onMouseLeave={(e) => {
                if (!showSearchBar) {
                  e.currentTarget.style.backgroundColor = isScrolled ? 'white' : 'rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.borderColor = isScrolled ? '#e2e8f0' : 'rgba(255, 255, 255, 0.3)';
                  e.currentTarget.style.color = isScrolled ? '#4a5568' : 'rgba(255, 255, 255, 0.9)';
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
                  backgroundColor: isScrolled ? '#f7f8fa' : 'rgba(255, 255, 255, 0.15)',
                  borderRadius: '10px',
                  border: '1px solid',
                  borderColor: isScrolled ? '#e2e8f0' : 'rgba(255, 255, 255, 0.3)',
                  backdropFilter: !isScrolled ? 'blur(10px)' : 'none'
                }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #2d3748 0%, #1a202c 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span style={{ 
                    color: isScrolled ? '#1a1a1a' : '#ffffff',
                    fontWeight: '600',
                    fontSize: '14.5px',
                    letterSpacing: '-0.2px',
                    textShadow: !isScrolled ? '0 1px 3px rgba(0, 0, 0, 0.3)' : 'none'
                  }}>
                    {user?.name}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  style={{
                    backgroundColor: (isHomePage && !isScrolled) ? 'rgba(220, 38, 38, 0.15)' : 'white',
                    color: (isHomePage && !isScrolled) ? '#fca5a5' : '#dc2626',
                    padding: '10px 22px',
                    borderRadius: '10px',
                    fontSize: '14.5px',
                    fontWeight: '600',
                    border: '1.5px solid',
                    borderColor: (isHomePage && !isScrolled) ? 'rgba(220, 38, 38, 0.3)' : '#fee2e2',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: (isHomePage && !isScrolled) ? '0 2px 8px rgba(0, 0, 0, 0.2)' : '0 1px 3px rgba(0, 0, 0, 0.08)',
                    letterSpacing: '-0.2px',
                    backdropFilter: (isHomePage && !isScrolled) ? 'blur(10px)' : 'none'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#dc2626';
                    e.target.style.color = 'white';
                    e.target.style.borderColor = '#dc2626';
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.boxShadow = '0 4px 12px rgba(220, 38, 38, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = (isHomePage && !isScrolled) ? 'rgba(220, 38, 38, 0.15)' : 'white';
                    e.target.style.color = (isHomePage && !isScrolled) ? '#fca5a5' : '#dc2626';
                    e.target.style.borderColor = (isHomePage && !isScrolled) ? 'rgba(220, 38, 38, 0.3)' : '#fee2e2';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = (isHomePage && !isScrolled) ? '0 2px 8px rgba(0, 0, 0, 0.2)' : '0 1px 3px rgba(0, 0, 0, 0.08)';
                  }}
                >
                  Çıkış Yap
                </button>
              </div>
            ) : (
              <Link to="/login">
                <button style={{
                  background: (isHomePage && !isScrolled) 
                    ? 'rgba(255, 255, 255, 0.15)' 
                    : 'linear-gradient(135deg, #1a1a1a 0%, #2d3748 100%)',
                  color: 'white',
                  padding: '10px 26px',
                  borderRadius: '10px',
                  fontSize: '14.5px',
                  fontWeight: '600',
                  border: (isHomePage && !isScrolled) ? '1.5px solid rgba(255, 255, 255, 0.3)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: (isHomePage && !isScrolled) 
                    ? '0 2px 8px rgba(0, 0, 0, 0.2)' 
                    : '0 2px 8px rgba(0, 0, 0, 0.15)',
                  letterSpacing: '-0.2px',
                  backdropFilter: (isHomePage && !isScrolled) ? 'blur(10px)' : 'none'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-1px)';
                  if (isHomePage && !isScrolled) {
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.25)';
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                  }
                  e.target.style.boxShadow = '0 4px 14px rgba(0, 0, 0, 0.25)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  if (isHomePage && !isScrolled) {
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                    e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.2)';
                  } else {
                    e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)';
                  }
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
                  stroke="#a0aec0" 
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
                    padding: '13px 20px 13px 52px',
                    fontSize: '15px',
                    border: '1.5px solid #e2e8f0',
                    borderRadius: '12px',
                    outline: 'none',
                    background: 'white',
                    transition: 'all 0.3s ease',
                    color: '#1a1a1a',
                    fontWeight: '500',
                    letterSpacing: '-0.2px'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#cbd5e0';
                    e.target.style.boxShadow = '0 0 0 3px rgba(0, 0, 0, 0.05), 0 2px 8px rgba(0, 0, 0, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
              <button
                type="submit"
                style={{
                  padding: '13px 30px',
                  background: 'linear-gradient(135deg, #1a1a1a 0%, #2d3748 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                  letterSpacing: '-0.2px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = '0 4px 14px rgba(0, 0, 0, 0.25)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)';
                }}
              >
                Ara
              </button>
            </form>
            <p style={{
              textAlign: 'center',
              color: '#718096',
              fontSize: '13px',
              marginTop: '12px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              letterSpacing: '-0.2px'
            }}>
              <kbd style={{
                padding: '4px 10px',
                backgroundColor: '#f7f8fa',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '600',
                color: '#4a5568'
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
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes dropdownFade {
          from {
            opacity: 0;
            transform: translateY(-6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Modern link underline effect */
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
          background: linear-gradient(90deg, #1a1a1a, #2d3748);
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
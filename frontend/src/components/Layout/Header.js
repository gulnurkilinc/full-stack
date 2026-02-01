import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/authSlice';
import { useTheme } from '../../context/ThemeContext';

const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const timeoutRef = useRef(null);
  const themeTimeoutRef = useRef(null);
  const searchInputRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { themeName, changeTheme, themes } = useTheme();
  
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
    : themeName === 'light'
      ? 'rgba(255, 255, 255, 0.98)'
      : themeName === 'dark'
        ? 'rgba(15, 23, 42, 0.95)'
        : 'rgba(0, 0, 0, 0.95)';

  const scrolledTextColor = themeName === 'light' ? '#4a5568' : themeName === 'dark' ? '#cbd5e0' : '#a3a3a3';
  const scrolledTextHover = themeName === 'light' ? '#1a1a1a' : themeName === 'dark' ? '#f1f5f9' : '#e5e5e5';
  const scrolledLogoColor = themeName === 'light' ? '#1a1a1a' : themeName === 'dark' ? '#f1f5f9' : '#e5e5e5';
  const scrolledBorderColor = themeName === 'light' ? 'rgba(0, 0, 0, 0.08)' : themeName === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.06)';
  const dropdownBg = themeName === 'light' ? '#ffffff' : themeName === 'dark' ? '#1e293b' : '#1a1a1a';
  const dropdownItemColor = themeName === 'light' ? '#4a5568' : themeName === 'dark' ? '#cbd5e0' : '#a3a3a3';
  const dropdownItemHoverBg = themeName === 'light' ? '#f7f8fa' : themeName === 'dark' ? '#334155' : '#2a2a2a';
  const dropdownItemHoverColor = themeName === 'light' ? '#1a1a1a' : themeName === 'dark' ? '#f1f5f9' : '#e5e5e5';
  const searchInputBg = themeName === 'light' ? '#ffffff' : themeName === 'dark' ? '#1e293b' : '#1a1a1a';
  const searchInputColor = themeName === 'light' ? '#1a1a1a' : themeName === 'dark' ? '#f1f5f9' : '#e5e5e5';
  const searchInputBorder = themeName === 'light' ? '#e2e8f0' : themeName === 'dark' ? '#334155' : '#2a2a2a';
  const kbdBg = themeName === 'light' ? '#f7f8fa' : themeName === 'dark' ? '#334155' : '#2a2a2a';
  const kbdBorder = themeName === 'light' ? '#e2e8f0' : themeName === 'dark' ? '#475569' : '#3a3a3a';
  const kbdColor = themeName === 'light' ? '#4a5568' : themeName === 'dark' ? '#cbd5e0' : '#a3a3a3';
  const hintColor = themeName === 'light' ? '#718096' : themeName === 'dark' ? '#94a3b8' : '#737373';

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

  const handleThemeMouseEnter = () => {
    if (themeTimeoutRef.current) clearTimeout(themeTimeoutRef.current);
    setShowThemeMenu(true);
  };

  const handleThemeMouseLeave = () => {
    themeTimeoutRef.current = setTimeout(() => {
      setShowThemeMenu(false);
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

  const themeIcons = {
    light: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="5"/>
        <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
        <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
      </svg>
    ),
    dark: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
      </svg>
    ),
    black: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <circle cx="12" cy="12" r="4" fill="currentColor"/>
      </svg>
    )
  };

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
      borderBottom: (isHomePage && !isScrolled) ? 'none' : (isScrolled ? `1px solid ${scrolledBorderColor}` : '1px solid rgba(255, 255, 255, 0.1)')
    }}>
      {/* Minimal accent line */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '1px',
        background: isScrolled 
          ? `linear-gradient(90deg, transparent 0%, ${scrolledLogoColor} 50%, transparent 100%)`
          : 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%)',
        opacity: (isHomePage && !isScrolled) ? 0 : 0.15
      }}></div>
      <div className="container">
        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/" style={{ 
            fontSize: '24px', 
            fontWeight: '700', 
            color: isScrolled ? scrolledLogoColor : '#ffffff',
            letterSpacing: '-0.8px',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            textShadow: !isScrolled ? '0 2px 4px rgba(0, 0, 0, 0.3)' : 'none'
          }}
          onMouseEnter={(e) => {
            e.target.style.color = isScrolled ? scrolledTextHover : '#f0f0f0';
            e.target.style.letterSpacing = '-0.9px';
          }}
          onMouseLeave={(e) => {
            e.target.style.color = isScrolled ? scrolledLogoColor : '#ffffff';
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
                color: isScrolled ? scrolledTextColor : 'rgba(255, 255, 255, 0.9)',
                transition: 'all 0.3s ease',
                fontWeight: '500',
                fontSize: '15px',
                position: 'relative',
                paddingBottom: '2px',
                letterSpacing: '-0.2px',
                textShadow: !isScrolled ? '0 1px 3px rgba(0, 0, 0, 0.3)' : 'none'
              }}
              onMouseEnter={(e) => {
                e.target.style.color = isScrolled ? scrolledTextHover : '#ffffff';
                e.target.style.fontWeight = '600';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = isScrolled ? scrolledTextColor : 'rgba(255, 255, 255, 0.9)';
                e.target.style.fontWeight = '500';
              }}
            >
              Ana Sayfa
            </Link>
            <Link 
              to="/blogs" 
              style={{ 
                color: isScrolled ? scrolledTextColor : 'rgba(255, 255, 255, 0.9)',
                transition: 'all 0.3s ease',
                fontWeight: '500',
                fontSize: '15px',
                position: 'relative',
                paddingBottom: '2px',
                letterSpacing: '-0.2px',
                textShadow: !isScrolled ? '0 1px 3px rgba(0, 0, 0, 0.3)' : 'none'
              }}
              onMouseEnter={(e) => {
                e.target.style.color = isScrolled ? scrolledTextHover : '#ffffff';
                e.target.style.fontWeight = '600';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = isScrolled ? scrolledTextColor : 'rgba(255, 255, 255, 0.9)';
                e.target.style.fontWeight = '500';
              }}
            >
              Bloglar
            </Link>
            
            {/* Bölümler Dropdown */}
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
                color: isScrolled ? scrolledTextColor : 'rgba(255, 255, 255, 0.9)',
                transition: 'all 0.3s ease',
                fontWeight: '500',
                fontSize: '15px',
                letterSpacing: '-0.2px',
                textShadow: !isScrolled ? '0 1px 3px rgba(0, 0, 0, 0.3)' : 'none'
              }}
              onMouseEnter={(e) => {
                e.target.style.color = isScrolled ? scrolledTextHover : '#ffffff';
                e.target.style.fontWeight = '600';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = isScrolled ? scrolledTextColor : 'rgba(255, 255, 255, 0.9)';
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
                    background: dropdownBg,
                    backdropFilter: 'blur(8px)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.12), 0 1px 3px rgba(0, 0, 0, 0.08)',
                    minWidth: '220px',
                    marginTop: '12px',
                    borderRadius: '12px',
                    zIndex: 1000,
                    overflow: 'hidden',
                    padding: '6px',
                    border: `1px solid ${scrolledBorderColor}`,
                    animation: 'dropdownFade 0.25s ease',
                    transition: 'background 0.3s ease'
                  }}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  {[
                    { to: '/category/bilim', emoji: '🔬', label: 'Bilim' },
                    { to: '/category/siyaset', emoji: '🏛️', label: 'Siyaset' },
                    { to: '/category/dunya', emoji: '🌍', label: 'Dünya' }
                  ].map((item) => (
                    <Link 
                      key={item.label}
                      to={item.to} 
                      style={{ 
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 16px',
                        color: dropdownItemColor,
                        backgroundColor: 'transparent',
                        transition: 'all 0.2s ease',
                        fontWeight: '500',
                        fontSize: '14.5px',
                        borderRadius: '8px',
                        margin: '2px 0'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = dropdownItemHoverBg;
                        e.currentTarget.style.color = dropdownItemHoverColor;
                        e.currentTarget.style.transform = 'translateX(3px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = dropdownItemColor;
                        e.currentTarget.style.transform = 'translateX(0)';
                      }}
                    >
                      <span style={{ fontSize: '18px' }}>{item.emoji}</span>
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link 
              to="/contact" 
              style={{ 
                color: isScrolled ? scrolledTextColor : 'rgba(255, 255, 255, 0.9)',
                transition: 'all 0.3s ease',
                fontWeight: '500',
                fontSize: '15px',
                position: 'relative',
                paddingBottom: '2px',
                letterSpacing: '-0.2px',
                textShadow: !isScrolled ? '0 1px 3px rgba(0, 0, 0, 0.3)' : 'none'
              }}
              onMouseEnter={(e) => {
                e.target.style.color = isScrolled ? scrolledTextHover : '#ffffff';
                e.target.style.fontWeight = '600';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = isScrolled ? scrolledTextColor : 'rgba(255, 255, 255, 0.9)';
                e.target.style.fontWeight = '500';
              }}
            >
              İletişim
            </Link>

            {/* TEMA SEÇICI BUTONU */}
            <div
              style={{ position: 'relative' }}
              onMouseEnter={handleThemeMouseEnter}
              onMouseLeave={handleThemeMouseLeave}
            >
              <button
                style={{
                  backgroundColor: isScrolled
                    ? (themeName === 'light' ? '#f7f8fa' : themeName === 'dark' ? '#334155' : '#2a2a2a')
                    : 'rgba(255, 255, 255, 0.15)',
                  color: isScrolled ? scrolledTextColor : 'rgba(255, 255, 255, 0.9)',
                  border: '1.5px solid',
                  borderColor: isScrolled
                    ? (themeName === 'light' ? '#e2e8f0' : themeName === 'dark' ? '#475569' : '#3a3a3a')
                    : 'rgba(255, 255, 255, 0.3)',
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
                  e.currentTarget.style.backgroundColor = isScrolled
                    ? (themeName === 'light' ? '#edf2f7' : themeName === 'dark' ? '#475569' : '#333333')
                    : 'rgba(255, 255, 255, 0.25)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = isScrolled
                    ? (themeName === 'light' ? '#f7f8fa' : themeName === 'dark' ? '#334155' : '#2a2a2a')
                    : 'rgba(255, 255, 255, 0.15)';
                }}
                aria-label="Tema"
              >
                {themeIcons[themeName]}
              </button>

              {/* Tema Dropdown Menu */}
              {showThemeMenu && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  background: dropdownBg,
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.08)',
                  minWidth: '180px',
                  marginTop: '10px',
                  borderRadius: '12px',
                  zIndex: 1001,
                  overflow: 'hidden',
                  padding: '6px',
                  border: `1px solid ${scrolledBorderColor}`,
                  animation: 'dropdownFade 0.25s ease'
                }}>
                  {Object.keys(themes).map((key) => (
                    <button
                      key={key}
                      onClick={() => { changeTheme(key); setShowThemeMenu(false); }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '11px 16px',
                        color: themeName === key ? (themeName === 'light' ? '#111827' : '#a5b4fc') : dropdownItemColor,
                        backgroundColor: themeName === key
                          ? (themeName === 'light' ? '#eef2ff' : themeName === 'dark' ? '#312e81' : '#2a2a3a')
                          : 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        fontWeight: themeName === key ? '600' : '500',
                        fontSize: '14.5px',
                        borderRadius: '8px',
                        margin: '2px 0',
                        textAlign: 'left'
                      }}
                      onMouseEnter={(e) => {
                        if (themeName !== key) {
                          e.currentTarget.style.backgroundColor = dropdownItemHoverBg;
                          e.currentTarget.style.color = dropdownItemHoverColor;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (themeName !== key) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = dropdownItemColor;
                        }
                      }}
                    >
                      {themeIcons[key]}
                      {themes[key].name}
                      {themeName === key && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 'auto' }}>
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ARAMA BUTONU */}
            <button
              onClick={toggleSearchBar}
              style={{
                backgroundColor: showSearchBar ? (themeName === 'light' ? '#1a1a1a' : themeName === 'dark' ? '#a5b4fc' : '#d4d4d4') : (isScrolled ? (themeName === 'light' ? 'white' : themeName === 'dark' ? '#334155' : '#2a2a2a') : 'rgba(255, 255, 255, 0.15)'),
                color: showSearchBar ? 'white' : (isScrolled ? scrolledTextColor : 'rgba(255, 255, 255, 0.9)'),
                border: '1.5px solid',
                borderColor: showSearchBar ? (themeName === 'light' ? '#1a1a1a' : themeName === 'dark' ? '#a5b4fc' : '#d4d4d4') : (isScrolled ? (themeName === 'light' ? '#e2e8f0' : themeName === 'dark' ? '#475569' : '#3a3a3a') : 'rgba(255, 255, 255, 0.3)'),
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
                  e.currentTarget.style.backgroundColor = isScrolled ? (themeName === 'light' ? '#f7f8fa' : themeName === 'dark' ? '#475569' : '#333333') : 'rgba(255, 255, 255, 0.25)';
                  e.currentTarget.style.borderColor = isScrolled ? (themeName === 'light' ? '#cbd5e0' : themeName === 'dark' ? '#64748b' : '#444444') : 'rgba(255, 255, 255, 0.5)';
                  e.currentTarget.style.color = isScrolled ? scrolledTextHover : '#ffffff';
                }
              }}
              onMouseLeave={(e) => {
                if (!showSearchBar) {
                  e.currentTarget.style.backgroundColor = isScrolled ? (themeName === 'light' ? 'white' : themeName === 'dark' ? '#334155' : '#2a2a2a') : 'rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.borderColor = isScrolled ? (themeName === 'light' ? '#e2e8f0' : themeName === 'dark' ? '#475569' : '#3a3a3a') : 'rgba(255, 255, 255, 0.3)';
                  e.currentTarget.style.color = isScrolled ? scrolledTextColor : 'rgba(255, 255, 255, 0.9)';
                }
              }}
              aria-label="Arama"
            >
              {showSearchBar ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
                  backgroundColor: isScrolled ? (themeName === 'light' ? '#f7f8fa' : themeName === 'dark' ? '#334155' : '#2a2a2a') : 'rgba(255, 255, 255, 0.15)',
                  borderRadius: '10px',
                  border: '1px solid',
                  borderColor: isScrolled ? (themeName === 'light' ? '#e2e8f0' : themeName === 'dark' ? '#475569' : '#3a3a3a') : 'rgba(255, 255, 255, 0.3)',
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
                    color: isScrolled ? scrolledTextHover : '#ffffff',
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
                    backgroundColor: (isHomePage && !isScrolled) ? 'rgba(220, 38, 38, 0.15)' : (themeName === 'light' ? 'white' : themeName === 'dark' ? '#1e293b' : '#1a1a1a'),
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
                    e.target.style.backgroundColor = (isHomePage && !isScrolled) ? 'rgba(220, 38, 38, 0.15)' : (themeName === 'light' ? 'white' : themeName === 'dark' ? '#1e293b' : '#1a1a1a');
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
                  width="20" height="20" viewBox="0 0 24 24" fill="none" 
                  stroke={themeName === 'light' ? '#a0aec0' : themeName === 'dark' ? '#64748b' : '#737373'}
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
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
                    border: `1.5px solid ${searchInputBorder}`,
                    borderRadius: '12px',
                    outline: 'none',
                    background: searchInputBg,
                    transition: 'all 0.3s ease',
                    color: searchInputColor,
                    fontWeight: '500',
                    letterSpacing: '-0.2px'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = themeName === 'light' ? '#cbd5e0' : themeName === 'dark' ? '#475569' : '#3a3a3a';
                    e.target.style.boxShadow = themeName === 'light' ? '0 0 0 3px rgba(0, 0, 0, 0.05), 0 2px 8px rgba(0, 0, 0, 0.1)' : '0 0 0 3px rgba(255,255,255,0.05), 0 2px 8px rgba(0, 0, 0, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = searchInputBorder;
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
              color: hintColor,
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
                backgroundColor: kbdBg,
                border: `1px solid ${kbdBorder}`,
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '600',
                color: kbdColor
              }}>ESC</kbd>
              tuşu ile kapatabilirsiniz
            </p>
          </div>
        )}
      </div>

      {/* CSS Animasyonlar */}
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes dropdownFade {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }

        nav a:not(button a) { position: relative; }

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

        nav a:not(button a):hover::after { width: 100%; }
      `}</style>
    </header>
  );
};

export default Header;
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearError } from '../../redux/authSlice';
import { useTheme } from '../../context/ThemeContext';

const Register = () => {
  const { themeName } = useTheme();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  // Tema renkleri
  const pageBg = themeName === 'light'
    ? 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
    : themeName === 'dark'
      ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
      : 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)';

  const blob1 = themeName === 'light'
    ? 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)'
    : themeName === 'dark'
      ? 'radial-gradient(circle, rgba(0, 255, 255, 0.1) 0%, transparent 70%)'
      : 'radial-gradient(circle, rgba(212, 212, 212, 0.05) 0%, transparent 70%)';

  const blob2 = themeName === 'light'
    ? 'radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, transparent 70%)'
    : themeName === 'dark'
      ? 'radial-gradient(circle, rgba(138, 43, 226, 0.15) 0%, transparent 70%)'
      : 'radial-gradient(circle, rgba(255, 255, 255, 0.03) 0%, transparent 70%)';

  const cardBg = themeName === 'light'
    ? 'rgba(255, 255, 255, 0.95)'
    : themeName === 'dark'
      ? 'rgba(30, 41, 59, 0.95)'
      : 'rgba(26, 26, 26, 0.95)';

  const cardShadow = themeName === 'light'
    ? '0 20px 60px rgba(0, 0, 0, 0.1), 0 0 100px rgba(99, 102, 241, 0.05)'
    : themeName === 'dark'
      ? '0 20px 60px rgba(0, 0, 0, 0.3), 0 0 100px rgba(0, 255, 255, 0.1)'
      : '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 100px rgba(255, 255, 255, 0.02)';

  const cardBorder = themeName === 'light'
    ? '1px solid rgba(99, 102, 241, 0.1)'
    : themeName === 'dark'
      ? '1px solid rgba(255, 255, 255, 0.2)'
      : '1px solid rgba(255, 255, 255, 0.1)';

  const headingColor = themeName === 'light' ? '#1a1a1a' : themeName === 'dark' ? '#f1f5f9' : '#e5e5e5';
  const textColor = themeName === 'light' ? '#4a5568' : themeName === 'dark' ? '#cbd5e0' : '#a3a3a3';
  const labelColor = themeName === 'light' ? '#2d3748' : themeName === 'dark' ? '#e2e8f0' : '#d4d4d4';
  
  const inputBg = themeName === 'light' ? 'white' : themeName === 'dark' ? '#1e293b' : '#1a1a1a';
  const inputBorder = themeName === 'light' ? '#e2e8f0' : themeName === 'dark' ? '#334155' : '#2a2a2a';
  const inputText = themeName === 'light' ? '#2d3748' : themeName === 'dark' ? '#f1f5f9' : '#e5e5e5';
  const inputDisabledBg = themeName === 'light' ? '#f7fafc' : themeName === 'dark' ? '#0f172a' : '#0a0a0a';
  const inputFocusBorder = themeName === 'light' ? '#6366f1' : themeName === 'dark' ? '#00ffff' : '#d4d4d4';
  const inputFocusShadow = themeName === 'light'
    ? '0 0 0 3px rgba(99, 102, 241, 0.1)'
    : themeName === 'dark'
      ? '0 0 0 3px rgba(0, 255, 255, 0.1)'
      : '0 0 0 3px rgba(212, 212, 212, 0.1)';

  const linkColor = themeName === 'light' ? '#6366f1' : themeName === 'dark' ? '#00d4ff' : '#d4d4d4';
  const linkHoverColor = themeName === 'light' ? '#4f46e5' : themeName === 'dark' ? '#00ffff' : '#e5e5e5';

  const footerTextColor = themeName === 'light' 
    ? 'rgba(26, 26, 26, 0.6)' 
    : 'rgba(255, 255, 255, 0.7)';

  const dividerColor = themeName === 'light' ? '#e2e8f0' : themeName === 'dark' ? '#334155' : '#2a2a2a';

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Şifreler eşleşmiyor!');
      return;
    }

    const userData = {
      name: formData.name,
      email: formData.email,
      password: formData.password
    };

    dispatch(register(userData));
  };

  const handleGoogleRegister = () => {
    // Google OAuth işlemi için backend endpoint'inize yönlendirme yapabilirsiniz
    // window.location.href = 'http://localhost:5000/api/auth/google';
    alert('Google ile kayıt özelliği yakında eklenecek!');
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      background: pageBg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden',
      transition: 'background 0.4s ease'
    }}>
      {/* Animated Background Elements */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '10%',
        width: '300px',
        height: '300px',
        background: blob1,
        borderRadius: '50%',
        filter: 'blur(40px)',
        animation: 'float 6s ease-in-out infinite',
        transition: 'background 0.4s ease'
      }}></div>
      
      <div style={{
        position: 'absolute',
        bottom: '10%',
        right: '10%',
        width: '400px',
        height: '400px',
        background: blob2,
        borderRadius: '50%',
        filter: 'blur(40px)',
        animation: 'float 8s ease-in-out infinite reverse',
        transition: 'background 0.4s ease'
      }}></div>

      <div style={{ 
        maxWidth: '440px',
        width: '100%',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ 
          backgroundColor: cardBg,
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '48px 40px',
          boxShadow: cardShadow,
          border: cardBorder,
          transition: 'all 0.4s ease'
        }}>
          
          {/* Logo / Title */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h1 style={{ 
              fontSize: '28px', 
              marginBottom: '8px', 
              color: headingColor,
              fontWeight: '700',
              letterSpacing: '-0.5px',
              transition: 'color 0.4s ease'
            }}>
              Kayıt Ol
            </h1>
            <p style={{ 
              color: textColor,
              fontSize: '15px',
              fontWeight: '400',
              transition: 'color 0.4s ease'
            }}>
              Yeni hesap oluşturun
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)',
              color: 'white',
              padding: '14px 16px',
              borderRadius: '12px',
              marginBottom: '24px',
              fontSize: '14px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: '0 4px 12px rgba(238, 90, 111, 0.3)'
            }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM11 15H9V13H11V15ZM11 11H9V5H11V11Z" fill="white"/>
              </svg>
              {error}
            </div>
          )}

          {/* Google Register Button */}
          <button
            onClick={handleGoogleRegister}
            type="button"
            style={{
              width: '100%',
              padding: '14px 20px',
              marginBottom: '32px',
              border: `1.5px solid ${inputBorder}`,
              borderRadius: '12px',
              backgroundColor: inputBg,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              fontSize: '15px',
              fontWeight: '600',
              color: labelColor,
              transition: 'all 0.2s ease',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = themeName === 'light' ? '#f7fafc' : themeName === 'dark' ? '#0f172a' : '#0a0a0a';
              e.target.style.borderColor = inputFocusBorder;
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = inputFocusShadow;
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = inputBg;
              e.target.style.borderColor = inputBorder;
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
            }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19.6 10.227c0-.709-.064-1.39-.182-2.045H10v3.868h5.382a4.6 4.6 0 01-1.996 3.018v2.51h3.232c1.891-1.742 2.982-4.305 2.982-7.35z" fill="#4285F4"/>
              <path d="M10 20c2.7 0 4.964-.895 6.618-2.423l-3.232-2.509c-.895.6-2.04.955-3.386.955-2.605 0-4.81-1.76-5.595-4.123H1.064v2.59A9.996 9.996 0 0010 20z" fill="#34A853"/>
              <path d="M4.405 11.9c-.2-.6-.314-1.24-.314-1.9 0-.66.114-1.3.314-1.9V5.51H1.064A9.996 9.996 0 000 10c0 1.614.386 3.14 1.064 4.49l3.34-2.59z" fill="#FBBC05"/>
              <path d="M10 3.977c1.468 0 2.786.505 3.823 1.496l2.868-2.868C14.959.99 12.695 0 10 0 6.09 0 2.71 2.24 1.064 5.51l3.34 2.59C5.19 5.736 7.395 3.977 10 3.977z" fill="#EA4335"/>
            </svg>
            Google ile Kayıt Ol
          </button>

          {/* Divider */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            margin: '32px 0',
            gap: '16px'
          }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: dividerColor, transition: 'background-color 0.4s ease' }}></div>
            <span style={{ 
              color: textColor,
              fontSize: '13px',
              fontWeight: '500',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              transition: 'color 0.4s ease'
            }}>
              veya
            </span>
            <div style={{ flex: 1, height: '1px', backgroundColor: dividerColor, transition: 'background-color 0.4s ease' }}></div>
          </div>

          {/* Register Form */}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: labelColor,
                transition: 'color 0.4s ease'
              }}>
                Ad Soyad
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Adınız ve soyadınız"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: `1.5px solid ${inputBorder}`,
                  borderRadius: '10px',
                  fontSize: '15px',
                  color: inputText,
                  backgroundColor: loading ? inputDisabledBg : inputBg,
                  transition: 'all 0.2s ease',
                  outline: 'none',
                  fontFamily: 'inherit'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = inputFocusBorder;
                  e.target.style.boxShadow = inputFocusShadow;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = inputBorder;
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: labelColor,
                transition: 'color 0.4s ease'
              }}>
                E-posta
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="ornek@email.com"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: `1.5px solid ${inputBorder}`,
                  borderRadius: '10px',
                  fontSize: '15px',
                  color: inputText,
                  backgroundColor: loading ? inputDisabledBg : inputBg,
                  transition: 'all 0.2s ease',
                  outline: 'none',
                  fontFamily: 'inherit'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = inputFocusBorder;
                  e.target.style.boxShadow = inputFocusShadow;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = inputBorder;
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: labelColor,
                transition: 'color 0.4s ease'
              }}>
                Şifre
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="En az 6 karakter"
                disabled={loading}
                minLength="6"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: `1.5px solid ${inputBorder}`,
                  borderRadius: '10px',
                  fontSize: '15px',
                  color: inputText,
                  backgroundColor: loading ? inputDisabledBg : inputBg,
                  transition: 'all 0.2s ease',
                  outline: 'none',
                  fontFamily: 'inherit'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = inputFocusBorder;
                  e.target.style.boxShadow = inputFocusShadow;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = inputBorder;
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ 
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: labelColor,
                transition: 'color 0.4s ease'
              }}>
                Şifre Tekrar
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Şifrenizi tekrar girin"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: `1.5px solid ${inputBorder}`,
                  borderRadius: '10px',
                  fontSize: '15px',
                  color: inputText,
                  backgroundColor: loading ? inputDisabledBg : inputBg,
                  transition: 'all 0.2s ease',
                  outline: 'none',
                  fontFamily: 'inherit'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = inputFocusBorder;
                  e.target.style.boxShadow = inputFocusShadow;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = inputBorder;
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Register Button */}
            <button 
              type="submit" 
              disabled={loading}
              className="emerald-btn"
              style={{ 
                width: '100%', 
                padding: '14px 20px',
                fontSize: '15px',
                opacity: loading ? 0.6 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ animation: 'spin 1s linear infinite' }}>
                    <path d="M8 1.5V4.5M8 11.5V14.5M14.5 8H11.5M4.5 8H1.5M12.7 12.7L10.6 10.6M5.4 5.4L3.3 3.3M12.7 3.3L10.6 5.4M5.4 10.6L3.3 12.7" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  Kayıt Olunuyor...
                </span>
              ) : (
                'Kayıt Ol'
              )}
            </button>
          </form>

          {/* Login Link */}
          <div style={{ 
            textAlign: 'center', 
            marginTop: '32px',
            paddingTop: '24px',
            borderTop: `1px solid ${dividerColor}`,
            transition: 'border-color 0.4s ease'
          }}>
            <p style={{ 
              color: textColor,
              fontSize: '14px',
              fontWeight: '500',
              transition: 'color 0.4s ease'
            }}>
              Zaten hesabınız var mı?{' '}
              <Link 
                to="/login" 
                style={{ 
                  color: linkColor,
                  fontWeight: '600',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease'
                }}
                onMouseEnter={(e) => e.target.style.color = linkHoverColor}
                onMouseLeave={(e) => e.target.style.color = linkColor}
              >
                Giriş Yap
              </Link>
            </p>
          </div>
        </div>

        {/* Footer Text */}
        <p style={{
          textAlign: 'center',
          marginTop: '24px',
          color: footerTextColor,
          fontSize: '13px',
          fontWeight: '500',
          textShadow: themeName === 'light' ? 'none' : '0 2px 10px rgba(0, 0, 0, 0.3)',
          transition: 'color 0.4s ease'
        }}>
          © 2025 Tüm hakları saklıdır
        </p>
      </div>

      {/* Animations & Emerald Button */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        /* Emerald Button */
        .emerald-btn {
          display: inline-block;
          background: linear-gradient(135deg, #1f2937 0%, #111827 45%, #0a0e18 100%);
          color: #ffffff;
          font-weight: 600;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: 
            transform 0.35s cubic-bezier(0.4, 0, 0.2, 1),
            box-shadow 0.35s cubic-bezier(0.4, 0, 0.2, 1),
            background 0.35s ease;
          box-shadow: 
            0 4px 18px rgba(17, 24, 39, 0.45),
            0 1px 3px rgba(0, 0, 0, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
          letter-spacing: -0.2px;
        }

        .emerald-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -110%;
          width: 80%;
          height: 100%;
          background: linear-gradient(
            100deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.18) 40%,
            rgba(255, 255, 255, 0.22) 50%,
            rgba(255, 255, 255, 0.18) 60%,
            rgba(255, 255, 255, 0) 100%
          );
          transition: left 0.55s cubic-bezier(0.4, 0, 0.2, 1);
          pointer-events: none;
          z-index: 1;
        }

        .emerald-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #374151 0%, #1f2937 45%, #111827 100%);
          color: #ffffff;
          transform: translateY(-2px);
          box-shadow: 
            0 8px 28px rgba(17, 24, 39, 0.55),
            0 2px 6px rgba(0, 0, 0, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.25);
        }

        .emerald-btn:hover:not(:disabled)::before {
          left: 120%;
        }

        .emerald-btn:active:not(:disabled) {
          transform: translateY(0px);
          box-shadow: 
            0 2px 10px rgba(17, 24, 39, 0.4),
            0 1px 2px rgba(0, 0, 0, 0.06),
            inset 0 2px 4px rgba(0, 0, 0, 0.08);
        }
      `}</style>
    </div>
  );
};

export default Register;
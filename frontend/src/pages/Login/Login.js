import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../../redux/authSlice';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(login(formData));
  };

  const handleGoogleLogin = () => {
    // Google OAuth işlemi için backend endpoint'inize yönlendirme yapabilirsiniz
    // window.location.href = 'http://localhost:5000/api/auth/google';
    alert('Google ile giriş özelliği yakında eklenecek!');
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background Elements */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '10%',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(0, 255, 255, 0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(40px)',
        animation: 'float 6s ease-in-out infinite'
      }}></div>
      
      <div style={{
        position: 'absolute',
        bottom: '10%',
        right: '10%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(138, 43, 226, 0.15) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(40px)',
        animation: 'float 8s ease-in-out infinite reverse'
      }}></div>

      <div style={{ 
        maxWidth: '440px',
        width: '100%',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '48px 40px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), 0 0 100px rgba(0, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          
          {/* Logo / Title */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h1 style={{ 
              fontSize: '28px', 
              marginBottom: '8px', 
              color: '#0f2027',
              fontWeight: '700',
              letterSpacing: '-0.5px'
            }}>
              Hoş Geldiniz
            </h1>
            <p style={{ 
              color: '#4a5568', 
              fontSize: '15px',
              fontWeight: '400'
            }}>
              Hesabınıza giriş yapın
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

          {/* Google Login Button */}
          <button
            onClick={handleGoogleLogin}
            type="button"
            style={{
              width: '100%',
              padding: '14px 20px',
              marginBottom: '32px',
              border: '1.5px solid #e2e8f0',
              borderRadius: '12px',
              backgroundColor: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              fontSize: '15px',
              fontWeight: '600',
              color: '#2d3748',
              transition: 'all 0.2s ease',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#f7fafc';
              e.target.style.borderColor = '#00ffff';
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = '0 4px 12px rgba(0, 255, 255, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'white';
              e.target.style.borderColor = '#e2e8f0';
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
            Google ile Devam Et
          </button>

          {/* Divider */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            margin: '32px 0',
            gap: '16px'
          }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }}></div>
            <span style={{ 
              color: '#a0aec0', 
              fontSize: '13px',
              fontWeight: '500',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              veya
            </span>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }}></div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#2d3748'
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
                  border: '1.5px solid #e2e8f0',
                  borderRadius: '10px',
                  fontSize: '15px',
                  color: '#2d3748',
                  backgroundColor: loading ? '#f7fafc' : 'white',
                  transition: 'all 0.2s ease',
                  outline: 'none',
                  fontFamily: 'inherit'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#00ffff';
                  e.target.style.boxShadow = '0 0 0 3px rgba(0, 255, 255, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e2e8f0';
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
                color: '#2d3748'
              }}>
                Şifre
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                disabled={loading}
                minLength="6"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1.5px solid #e2e8f0',
                  borderRadius: '10px',
                  fontSize: '15px',
                  color: '#2d3748',
                  backgroundColor: loading ? '#f7fafc' : 'white',
                  transition: 'all 0.2s ease',
                  outline: 'none',
                  fontFamily: 'inherit'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#00ffff';
                  e.target.style.boxShadow = '0 0 0 3px rgba(0, 255, 255, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e2e8f0';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '24px'
            }}>
              <label style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                cursor: 'pointer',
                fontSize: '14px',
                color: '#4a5568',
                fontWeight: '500'
              }}>
                <input 
                  type="checkbox" 
                  style={{
                    width: '16px',
                    height: '16px',
                    cursor: 'pointer',
                    accentColor: '#00ffff'
                  }}
                />
                Beni Hatırla
              </label>
              <Link 
                to="/forgot-password" 
                style={{ 
                  fontSize: '14px', 
                  color: '#00d4ff',
                  fontWeight: '600',
                  textDecoration: 'none'
                }}
                onMouseEnter={(e) => e.target.style.color = '#00ffff'}
                onMouseLeave={(e) => e.target.style.color = '#00d4ff'}
              >
                Şifremi Unuttum
              </Link>
            </div>

            {/* Login Button */}
            <button 
              type="submit" 
              disabled={loading}
              style={{ 
                width: '100%', 
                padding: '14px 20px',
                fontSize: '15px',
                fontWeight: '600',
                border: 'none',
                borderRadius: '10px',
                background: loading 
                  ? '#cbd5e0' 
                  : 'linear-gradient(135deg, #00d4ff 0%, #7b2cbf 100%)',
                color: 'white',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: loading 
                  ? 'none' 
                  : '0 4px 20px rgba(0, 212, 255, 0.4)'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 30px rgba(0, 212, 255, 0.6)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 20px rgba(0, 212, 255, 0.4)';
                }
              }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ animation: 'spin 1s linear infinite' }}>
                    <path d="M8 1.5V4.5M8 11.5V14.5M14.5 8H11.5M4.5 8H1.5M12.7 12.7L10.6 10.6M5.4 5.4L3.3 3.3M12.7 3.3L10.6 5.4M5.4 10.6L3.3 12.7" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  Giriş Yapılıyor...
                </span>
              ) : (
                'Giriş Yap'
              )}
            </button>
          </form>

          {/* Register Link */}
          <div style={{ 
            textAlign: 'center', 
            marginTop: '32px',
            paddingTop: '24px',
            borderTop: '1px solid #e2e8f0'
          }}>
            <p style={{ 
              color: '#718096', 
              fontSize: '14px',
              fontWeight: '500'
            }}>
              Hesabınız yok mu?{' '}
              <Link 
                to="/register" 
                style={{ 
                  color: '#00d4ff', 
                  fontWeight: '600',
                  textDecoration: 'none'
                }}
                onMouseEnter={(e) => e.target.style.color = '#00ffff'}
                onMouseLeave={(e) => e.target.style.color = '#00d4ff'}
              >
                Kayıt Ol
              </Link>
            </p>
          </div>
        </div>

        {/* Footer Text */}
        <p style={{
          textAlign: 'center',
          marginTop: '24px',
          color: 'rgba(255, 255, 255, 0.7)',
          fontSize: '13px',
          fontWeight: '500',
          textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
        }}>
          © 2025 Tüm hakları saklıdır
        </p>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
};

export default Login;
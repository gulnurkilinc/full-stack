import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearError } from '../../redux/authSlice';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  // Eğer kullanıcı kayıt olduysa ana sayfaya yönlendir
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Component unmount olduğunda error'ı temizle
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

    // Backend'e kayıt isteği gönder
    const userData = {
      name: formData.name,
      email: formData.email,
      password: formData.password
    };

    dispatch(register(userData));
  };

  const handleSocialRegister = (provider) => {
    alert(`${provider} ile kayıt özelliği yakında eklenecek!`);
  };

  return (
    <div style={{ 
      paddingTop: '80px', 
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '100px 20px'
    }}>
      <div className="container" style={{ maxWidth: '500px' }}>
        <div className="card" style={{ padding: '40px' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h1 style={{ fontSize: '32px', marginBottom: '10px', color: '#333' }}>
              Kayıt Ol
            </h1>
            <p style={{ color: '#666', fontSize: '16px' }}>
              Yeni hesap oluşturun
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              backgroundColor: '#ff4444',
              color: 'white',
              padding: '12px',
              borderRadius: '5px',
              marginBottom: '20px',
              textAlign: 'center',
              fontSize: '14px'
            }}>
              ⚠️ {error}
            </div>
          )}

          {/* Social Register Buttons */}
          <div style={{ marginBottom: '30px' }}>
            <button
              onClick={() => handleSocialRegister('Google')}
              type="button"
              style={{
                width: '100%',
                padding: '12px',
                marginBottom: '12px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                backgroundColor: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                fontSize: '15px',
                fontWeight: '500',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#f8f9fa';
                e.target.style.borderColor = '#007bff';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'white';
                e.target.style.borderColor = '#ddd';
              }}
            >
              <span style={{ fontSize: '20px' }}>🔍</span>
              Google ile Kayıt Ol
            </button>

            <button
              onClick={() => handleSocialRegister('Facebook')}
              type="button"
              style={{
                width: '100%',
                padding: '12px',
                marginBottom: '12px',
                border: 'none',
                borderRadius: '5px',
                backgroundColor: '#1877f2',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                fontSize: '15px',
                fontWeight: '500'
              }}
            >
              <span style={{ fontSize: '20px' }}>📘</span>
              Facebook ile Kayıt Ol
            </button>
          </div>

          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            margin: '30px 0',
            gap: '15px'
          }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#ddd' }}></div>
            <span style={{ color: '#666', fontSize: '14px' }}>VEYA</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#ddd' }}></div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Ad Soyad</label>
              <input
                type="text"
                name="name"
                className="form-input"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Adınız ve soyadınız"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label className="form-label">E-posta</label>
              <input
                type="email"
                name="email"
                className="form-input"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="ornek@email.com"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Şifre</label>
              <input
                type="password"
                name="password"
                className="form-input"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="En az 6 karakter"
                minLength="6"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Şifre Tekrar</label>
              <input
                type="password"
                name="confirmPassword"
                className="form-input"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Şifrenizi tekrar girin"
                disabled={loading}
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ 
                width: '100%', 
                padding: '15px',
                fontSize: '16px',
                fontWeight: '500',
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
              disabled={loading}
            >
              {loading ? (
                <span>
                  ⏳ Kayıt Olunuyor...
                </span>
              ) : (
                'Kayıt Ol'
              )}
            </button>
          </form>

          <div style={{ 
            textAlign: 'center', 
            marginTop: '30px',
            paddingTop: '30px',
            borderTop: '1px solid #eee'
          }}>
            <p style={{ color: '#666', fontSize: '14px' }}>
              Zaten hesabınız var mı?{' '}
              <Link to="/login" style={{ color: '#007bff', fontWeight: '500' }}>
                Giriş Yap
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
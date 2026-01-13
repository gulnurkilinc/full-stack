import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Login işlemi buraya gelecek (Backend'e istek)
    console.log('Login:', formData);
    alert('Giriş yapılıyor...');
  };

  const handleSocialLogin = (provider) => {
    // Sosyal medya login işlemi
    alert(`${provider} ile giriş yapılıyor...`);
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
          {/* Logo / Title */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h1 style={{ fontSize: '32px', marginBottom: '10px', color: '#333' }}>
              Hoş Geldiniz
            </h1>
            <p style={{ color: '#666', fontSize: '16px' }}>
              Hesabınıza giriş yapın
            </p>
          </div>

          {/* Social Login Buttons */}
          <div style={{ marginBottom: '30px' }}>
            {/* Google */}
            <button
              onClick={() => handleSocialLogin('Google')}
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
              Google ile Giriş Yap
            </button>

            {/* Facebook */}
            <button
              onClick={() => handleSocialLogin('Facebook')}
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
                fontWeight: '500',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#166fe5'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#1877f2'}
            >
              <span style={{ fontSize: '20px' }}>📘</span>
              Facebook ile Giriş Yap
            </button>

            {/* Twitter/X */}
            <button
              onClick={() => handleSocialLogin('Twitter')}
              style={{
                width: '100%',
                padding: '12px',
                marginBottom: '12px',
                border: 'none',
                borderRadius: '5px',
                backgroundColor: '#000000',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                fontSize: '15px',
                fontWeight: '500',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#333'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#000'}
            >
              <span style={{ fontSize: '20px' }}>🐦</span>
              Twitter ile Giriş Yap
            </button>

            {/* TikTok */}
            <button
              onClick={() => handleSocialLogin('TikTok')}
              style={{
                width: '100%',
                padding: '12px',
                marginBottom: '12px',
                border: 'none',
                borderRadius: '5px',
                backgroundColor: '#000000',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                fontSize: '15px',
                fontWeight: '500',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#333'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#000'}
            >
              <span style={{ fontSize: '20px' }}>🎵</span>
              TikTok ile Giriş Yap
            </button>

            {/* Instagram */}
            <button
              onClick={() => handleSocialLogin('Instagram')}
              style={{
                width: '100%',
                padding: '12px',
                marginBottom: '12px',
                border: 'none',
                borderRadius: '5px',
                background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                fontSize: '15px',
                fontWeight: '500',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => e.target.style.opacity = '0.9'}
              onMouseLeave={(e) => e.target.style.opacity = '1'}
            >
              <span style={{ fontSize: '20px' }}>📷</span>
              Instagram ile Giriş Yap
            </button>
          </div>

          {/* Divider */}
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

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit}>
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
                placeholder="••••••••"
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input type="checkbox" />
                <span style={{ fontSize: '14px', color: '#666' }}>Beni Hatırla</span>
              </label>
              <Link to="/forgot-password" style={{ fontSize: '14px', color: '#007bff' }}>
                Şifremi Unuttum?
              </Link>
            </div>

            {/* Login Button */}
            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ 
                width: '100%', 
                padding: '15px',
                fontSize: '16px',
                fontWeight: '500'
              }}
            >
              Giriş Yap
            </button>
          </form>

          {/* Register Link */}
          <div style={{ 
            textAlign: 'center', 
            marginTop: '30px',
            paddingTop: '30px',
            borderTop: '1px solid #eee'
          }}>
            <p style={{ color: '#666', fontSize: '14px' }}>
              Hesabınız yok mu?{' '}
              <Link to="/register" style={{ color: '#007bff', fontWeight: '500' }}>
                Kayıt Ol
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
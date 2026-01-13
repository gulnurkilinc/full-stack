import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

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

    console.log('Register:', formData);
    alert('Kayıt işlemi gerçekleştiriliyor...');
  };

  const handleSocialRegister = (provider) => {
    alert(`${provider} ile kayıt olunuyor...`);
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

          {/* Social Register Buttons */}
          <div style={{ marginBottom: '30px' }}>
            <button
              onClick={() => handleSocialRegister('Google')}
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
              />
            </div>

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
              Kayıt Ol
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
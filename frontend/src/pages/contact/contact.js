import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Form gönderme işlemi buraya gelecek
    alert('Mesajınız başarıyla gönderildi!');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh' }}>
      {/* Hero Section */}
      <section style={{
        backgroundColor: '#007bff',
        color: 'white',
        padding: '80px 0',
        textAlign: 'center'
      }}>
        <div className="container">
          <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>
            İletişim
          </h1>
          <p style={{ fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>
            Bizimle iletişime geçmek için aşağıdaki formu doldurabilir veya 
            iletişim bilgilerimizi kullanabilirsiniz.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '60px' 
          }}>
            {/* Contact Form */}
            <div>
              <h2 style={{ fontSize: '32px', marginBottom: '30px' }}>
                Mesaj Gönderin
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Adınız Soyadınız</label>
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
                  <label className="form-label">E-posta Adresiniz</label>
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
                  <label className="form-label">Konu</label>
                  <input
                    type="text"
                    name="subject"
                    className="form-input"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="Mesajınızın konusu"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Mesajınız</label>
                  <textarea
                    name="message"
                    className="form-input"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    placeholder="Mesajınızı buraya yazın..."
                    style={{ resize: 'vertical' }}
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  style={{ width: '100%', padding: '15px' }}
                >
                  Gönder
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div>
              <h2 style={{ fontSize: '32px', marginBottom: '30px' }}>
                İletişim Bilgileri
              </h2>

              {/* Address */}
              <div className="card" style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                  <div style={{ 
                    fontSize: '24px', 
                    color: '#007bff',
                    minWidth: '40px'
                  }}>
                    📍
                  </div>
                  <div>
                    <h3 style={{ marginBottom: '8px', fontSize: '18px' }}>Adres</h3>
                    <p style={{ color: '#666', lineHeight: '1.6' }}>
                      Çanakkale, Türkiye<br />
                      Merkez Mahallesi, Blog Sitesi Sokak No:1
                    </p>
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div className="card" style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                  <div style={{ 
                    fontSize: '24px', 
                    color: '#007bff',
                    minWidth: '40px'
                  }}>
                    📞
                  </div>
                  <div>
                    <h3 style={{ marginBottom: '8px', fontSize: '18px' }}>Telefon</h3>
                    <p style={{ color: '#666' }}>
                      +90 (555) 123 45 67
                    </p>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="card" style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                  <div style={{ 
                    fontSize: '24px', 
                    color: '#007bff',
                    minWidth: '40px'
                  }}>
                    ✉️
                  </div>
                  <div>
                    <h3 style={{ marginBottom: '8px', fontSize: '18px' }}>E-posta</h3>
                    <p style={{ color: '#666' }}>
                      info@blogsitesi.com<br />
                      destek@blogsitesi.com
                    </p>
                  </div>
                </div>
              </div>

              {/* Working Hours */}
              <div className="card">
                <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                  <div style={{ 
                    fontSize: '24px', 
                    color: '#007bff',
                    minWidth: '40px'
                  }}>
                    🕐
                  </div>
                  <div>
                    <h3 style={{ marginBottom: '8px', fontSize: '18px' }}>Çalışma Saatleri</h3>
                    <p style={{ color: '#666', lineHeight: '1.8' }}>
                      Pazartesi - Cuma: 09:00 - 18:00<br />
                      Cumartesi: 10:00 - 16:00<br />
                      Pazar: Kapalı
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div style={{ marginTop: '40px' }}>
                <h3 style={{ marginBottom: '20px', fontSize: '20px' }}>
                  Sosyal Medya
                </h3>
                <div style={{ display: 'flex', gap: '15px' }}>
                  <a 
                    href="https://facebook.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{
                      width: '50px',
                      height: '50px',
                      backgroundColor: '#007bff',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '50%',
                      fontSize: '20px',
                      transition: 'background-color 0.3s'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#0056b3'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#007bff'}
                  >
                    📘
                  </a>
                  <a 
                    href="https://twitter.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{
                      width: '50px',
                      height: '50px',
                      backgroundColor: '#007bff',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '50%',
                      fontSize: '20px',
                      transition: 'background-color 0.3s'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#0056b3'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#007bff'}
                  >
                    🐦
                  </a>
                  <a 
                    href="https://instagram.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{
                      width: '50px',
                      height: '50px',
                      backgroundColor: '#007bff',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '50%',
                      fontSize: '20px',
                      transition: 'background-color 0.3s'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#0056b3'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#007bff'}
                  >
                    📷
                  </a>
                  <a 
                    href="https://linkedin.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{
                      width: '50px',
                      height: '50px',
                      backgroundColor: '#007bff',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '50%',
                      fontSize: '20px',
                      transition: 'background-color 0.3s'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#0056b3'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#007bff'}
                  >
                    💼
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section (Optional) */}
      <section style={{ backgroundColor: '#f8f9fa', padding: '60px 0' }}>
        <div className="container">
          <h2 style={{ fontSize: '32px', marginBottom: '30px', textAlign: 'center' }}>
            Bizi Ziyaret Edin
          </h2>
          <div style={{ 
            width: '100%', 
            height: '400px', 
            backgroundColor: '#ddd',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#666'
          }}>
            {/* Buraya Google Maps embed kodu eklenebilir */}
            <p>🗺️ Harita buraya gelecek</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
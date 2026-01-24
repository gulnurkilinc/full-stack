import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Form gönderme işlemi buraya gelecek
    setTimeout(() => {
      alert('Mesajınız başarıyla gönderildi!');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)',
        color: 'white',
        padding: '100px 0',
        textAlign: 'center'
      }}>
        <div className="container">
          <h1 style={{ 
            fontSize: '48px', 
            marginBottom: '20px',
            fontWeight: '700'
          }}>
            İletişim
          </h1>
          <p style={{ 
            fontSize: '20px', 
            maxWidth: '700px', 
            margin: '0 auto',
            lineHeight: '1.6',
            opacity: '0.95'
          }}>
            Sorularınız, önerileriniz veya işbirliği teklifleriniz için bizimle iletişime geçebilirsiniz.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
            gap: '60px',
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            {/* Contact Form */}
            <div style={{
              backgroundColor: 'white',
              padding: '40px',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
            }}>
              <h2 style={{ 
                fontSize: '32px', 
                marginBottom: '10px',
                color: '#333'
              }}>
                Mesaj Gönderin
              </h2>
              <p style={{ 
                color: '#666', 
                marginBottom: '30px',
                fontSize: '15px'
              }}>
                Formu doldurarak bize ulaşabilirsiniz. En kısa sürede size dönüş yapacağız.
              </p>

              <form onSubmit={handleSubmit}>
                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label className="form-label" style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '600',
                    color: '#333',
                    fontSize: '14px'
                  }}>
                    Adınız Soyadınız *
                  </label>
                  <input
                    type="text"
                    name="name"
                    className="form-input"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Adınız ve soyadınız"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      fontSize: '15px',
                      border: '2px solid #e0e0e0',
                      borderRadius: '8px',
                      outline: 'none',
                      transition: 'border-color 0.3s',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#007bff'}
                    onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label className="form-label" style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '600',
                    color: '#333',
                    fontSize: '14px'
                  }}>
                    E-posta Adresiniz *
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="form-input"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="ornek@email.com"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      fontSize: '15px',
                      border: '2px solid #e0e0e0',
                      borderRadius: '8px',
                      outline: 'none',
                      transition: 'border-color 0.3s',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#007bff'}
                    onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label className="form-label" style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '600',
                    color: '#333',
                    fontSize: '14px'
                  }}>
                    Konu *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    className="form-input"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="Mesajınızın konusu"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      fontSize: '15px',
                      border: '2px solid #e0e0e0',
                      borderRadius: '8px',
                      outline: 'none',
                      transition: 'border-color 0.3s',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#007bff'}
                    onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '25px' }}>
                  <label className="form-label" style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '600',
                    color: '#333',
                    fontSize: '14px'
                  }}>
                    Mesajınız *
                  </label>
                  <textarea
                    name="message"
                    className="form-input"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    placeholder="Mesajınızı buraya yazın..."
                    style={{ 
                      width: '100%',
                      padding: '12px 16px',
                      fontSize: '15px',
                      border: '2px solid #e0e0e0',
                      borderRadius: '8px',
                      outline: 'none',
                      transition: 'border-color 0.3s',
                      resize: 'vertical',
                      fontFamily: 'inherit',
                      lineHeight: '1.6',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#007bff'}
                    onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="btn btn-primary" 
                  style={{ 
                    width: '100%', 
                    padding: '16px',
                    fontSize: '16px',
                    fontWeight: '600',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s',
                    opacity: isSubmitting ? 0.6 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (!isSubmitting) e.target.style.backgroundColor = '#0056b3';
                  }}
                  onMouseLeave={(e) => {
                    if (!isSubmitting) e.target.style.backgroundColor = '#007bff';
                  }}
                >
                  {isSubmitting ? 'Gönderiliyor...' : 'Mesajı Gönder'}
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div>
              <div style={{
                backgroundColor: 'white',
                padding: '40px',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                marginBottom: '30px'
              }}>
                <h2 style={{ 
                  fontSize: '32px', 
                  marginBottom: '10px',
                  color: '#333'
                }}>
                  İletişim Bilgileri
                </h2>
                <p style={{ 
                  color: '#666', 
                  marginBottom: '30px',
                  fontSize: '15px',
                  lineHeight: '1.6'
                }}>
                  Bize aşağıdaki kanallardan ulaşabilirsiniz.
                </p>

                {/* Email */}
                <div className="card" style={{ 
                  marginBottom: '0',
                  padding: '20px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px',
                  border: '1px solid #e9ecef'
                }}>
                  <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                    <div style={{ 
                      fontSize: '28px', 
                      color: '#007bff',
                      minWidth: '40px'
                    }}>
                      ✉️
                    </div>
                    <div>
                      <h3 style={{ 
                        marginBottom: '8px', 
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#333'
                      }}>
                        E-posta
                      </h3>
                      <p style={{ 
                        color: '#666',
                        lineHeight: '1.8',
                        margin: 0
                      }}>
                        gulnurkilinc@gmail.com<br />
                        destek@blogsitesi.com
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div style={{
                backgroundColor: 'white',
                padding: '40px',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
              }}>
                <h3 style={{ 
                  marginBottom: '20px', 
                  fontSize: '24px',
                  fontWeight: '600',
                  color: '#333'
                }}>
                  Sosyal Medya
                </h3>
                <p style={{ 
                  color: '#666', 
                  marginBottom: '25px',
                  fontSize: '15px'
                }}>
                  Bizi sosyal medyada takip edin!
                </p>
                <div style={{ display: 'flex', gap: '15px' }}>
                 {/* Instagram */}
<a 
  href="https://instagram.com" 
  target="_blank" 
  rel="noopener noreferrer"
  style={{
    width: '60px',
    height: '60px',
    background: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '12px',
    transition: 'transform 0.3s, box-shadow 0.3s',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = 'translateY(-5px)';
    e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.2)';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
  }}
  title="Instagram"
>
  <svg 
    width="28" 
    height="28" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="white" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
</a>
                  
                  {/* X (Twitter) */}
                  <a 
                    href="https://x.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{
                      width: '60px',
                      height: '60px',
                      backgroundColor: '#000000',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '12px',
                      fontSize: '24px',
                      fontWeight: 'bold',
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-5px)';
                      e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                    }}
                    title="X (Twitter)"
                  >
                    𝕏
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
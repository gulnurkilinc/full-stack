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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      console.log('📤 Form gönderiliyor:', formData);

      const response = await fetch('http://localhost:4000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adSoyad: formData.name,
          email: formData.email,
          konu: formData.subject,
          mesaj: formData.message
        })
      });

      const data = await response.json();
      console.log('✅ Yanıt:', data);
      console.log('🔴 Hatalar:', data.errors); 

      if (data.success) {
        alert('✅ Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        alert('❌ Hata: ' + (data.message || 'Mesaj gönderilemedi'));
      }
    } catch (error) {
      console.error('❌ Hata:', error);
      alert('❌ Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background Elements */}
      <div style={{
        position: 'absolute',
        top: '15%',
        left: '5%',
        width: '350px',
        height: '350px',
        background: 'radial-gradient(circle, rgba(0, 255, 255, 0.08) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(50px)',
        animation: 'float 7s ease-in-out infinite'
      }}></div>
      
      <div style={{
        position: 'absolute',
        bottom: '20%',
        right: '5%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(138, 43, 226, 0.12) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(50px)',
        animation: 'float 9s ease-in-out infinite reverse'
      }}></div>

      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #00d4ff 0%, #7b2cbf 100%)',
        color: 'white',
        padding: '120px 0 100px',
        textAlign: 'center',
        position: 'relative',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)'
      }}>
        <div className="container">
          <h1 style={{ 
            fontSize: '48px', 
            marginBottom: '20px',
            fontWeight: '700',
            letterSpacing: '-1px',
            textShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
          }}>
            İletişim
          </h1>
          <p style={{ 
            fontSize: '20px', 
            maxWidth: '700px', 
            margin: '0 auto',
            lineHeight: '1.6',
            opacity: '0.95',
            fontWeight: '400'
          }}>
            Sorularınız, önerileriniz veya işbirliği teklifleriniz için bizimle iletişime geçebilirsiniz.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section style={{ padding: '80px 0', position: 'relative', zIndex: 1 }}>
        <div className="container">
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
            gap: '40px',
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            {/* Contact Form */}
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              padding: '48px 40px',
              borderRadius: '20px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), 0 0 100px rgba(0, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <h2 style={{ 
                fontSize: '32px', 
                marginBottom: '12px',
                color: '#0f2027',
                fontWeight: '700',
                letterSpacing: '-0.5px'
              }}>
                Mesaj Gönderin
              </h2>
              <p style={{ 
                color: '#4a5568', 
                marginBottom: '32px',
                fontSize: '15px',
                lineHeight: '1.6'
              }}>
                Formu doldurarak bize ulaşabilirsiniz. En kısa sürede size dönüş yapacağız.
              </p>

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '600',
                    color: '#2d3748',
                    fontSize: '14px'
                  }}>
                    Adınız Soyadınız *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Adınız ve soyadınız"
                    disabled={isSubmitting}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      fontSize: '15px',
                      border: '1.5px solid #e2e8f0',
                      borderRadius: '10px',
                      outline: 'none',
                      transition: 'all 0.2s ease',
                      backgroundColor: isSubmitting ? '#f7fafc' : 'white',
                      color: '#2d3748',
                      boxSizing: 'border-box',
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
                    fontWeight: '600',
                    color: '#2d3748',
                    fontSize: '14px'
                  }}>
                    E-posta Adresiniz *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="ornek@email.com"
                    disabled={isSubmitting}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      fontSize: '15px',
                      border: '1.5px solid #e2e8f0',
                      borderRadius: '10px',
                      outline: 'none',
                      transition: 'all 0.2s ease',
                      backgroundColor: isSubmitting ? '#f7fafc' : 'white',
                      color: '#2d3748',
                      boxSizing: 'border-box',
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
                    fontWeight: '600',
                    color: '#2d3748',
                    fontSize: '14px'
                  }}>
                    Konu *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="Mesajınızın konusu"
                    disabled={isSubmitting}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      fontSize: '15px',
                      border: '1.5px solid #e2e8f0',
                      borderRadius: '10px',
                      outline: 'none',
                      transition: 'all 0.2s ease',
                      backgroundColor: isSubmitting ? '#f7fafc' : 'white',
                      color: '#2d3748',
                      boxSizing: 'border-box',
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

                <div style={{ marginBottom: '28px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '600',
                    color: '#2d3748',
                    fontSize: '14px'
                  }}>
                    Mesajınız *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    placeholder="Mesajınızı buraya yazın..."
                    disabled={isSubmitting}
                    style={{ 
                      width: '100%',
                      padding: '12px 16px',
                      fontSize: '15px',
                      border: '1.5px solid #e2e8f0',
                      borderRadius: '10px',
                      outline: 'none',
                      transition: 'all 0.2s ease',
                      backgroundColor: isSubmitting ? '#f7fafc' : 'white',
                      color: '#2d3748',
                      resize: 'vertical',
                      fontFamily: 'inherit',
                      lineHeight: '1.6',
                      boxSizing: 'border-box'
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

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  style={{ 
                    width: '100%', 
                    padding: '14px 20px',
                    fontSize: '15px',
                    fontWeight: '600',
                    background: isSubmitting 
                      ? '#cbd5e0' 
                      : 'linear-gradient(135deg, #40c8e3 0%, #7b2cbf 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: isSubmitting 
                      ? 'none' 
                      : '0 4px 20px rgba(0, 212, 255, 0.4)'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSubmitting) {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 6px 30px rgba(0, 212, 255, 0.6)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSubmitting) {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 20px rgba(0, 212, 255, 0.4)';
                    }
                  }}
                >
                  {isSubmitting ? (
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ animation: 'spin 1s linear infinite' }}>
                        <path d="M8 1.5V4.5M8 11.5V14.5M14.5 8H11.5M4.5 8H1.5M12.7 12.7L10.6 10.6M5.4 5.4L3.3 3.3M12.7 3.3L10.6 5.4M5.4 10.6L3.3 12.7" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                      Gönderiliyor...
                    </span>
                  ) : (
                    'Mesajı Gönder'
                  )}
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div>
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                padding: '48px 40px',
                borderRadius: '20px',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), 0 0 100px rgba(0, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                marginBottom: '30px'
              }}>
                <h2 style={{ 
                  fontSize: '32px', 
                  marginBottom: '12px',
                  color: '#0f2027',
                  fontWeight: '700',
                  letterSpacing: '-0.5px'
                }}>
                  İletişim Bilgileri
                </h2>
                <p style={{ 
                  color: '#4a5568', 
                  marginBottom: '32px',
                  fontSize: '15px',
                  lineHeight: '1.6'
                }}>
                  Bize aşağıdaki kanallardan ulaşabilirsiniz.
                </p>

                {/* Email */}
                <div style={{ 
                  padding: '24px',
                  background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.08) 0%, rgba(123, 44, 191, 0.08) 100%)',
                  borderRadius: '12px',
                  border: '1px solid rgba(0, 212, 255, 0.2)'
                }}>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    <div style={{ 
                      fontSize: '32px',
                      minWidth: '40px',
                      filter: 'grayscale(0.3)'
                    }}>
                      ✉️
                    </div>
                    <div>
                      <h3 style={{ 
                        marginBottom: '10px', 
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#0f2027'
                      }}>
                        E-posta
                      </h3>
                      <p style={{ 
                        color: '#4a5568',
                        lineHeight: '1.8',
                        margin: 0,
                        fontSize: '15px'
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
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                padding: '48px 40px',
                borderRadius: '20px',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), 0 0 100px rgba(0, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <h3 style={{ 
                  marginBottom: '12px', 
                  fontSize: '24px',
                  fontWeight: '600',
                  color: '#0f2027',
                  letterSpacing: '-0.3px'
                }}>
                  Sosyal Medya
                </h3>
                <p style={{ 
                  color: '#4a5568', 
                  marginBottom: '28px',
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
                      borderRadius: '14px',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.15)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-5px)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(240, 148, 51, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.15)';
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
                      borderRadius: '14px',
                      fontSize: '24px',
                      fontWeight: 'bold',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-5px)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 212, 255, 0.4)';
                      e.currentTarget.style.backgroundColor = '#1a1a1a';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
                      e.currentTarget.style.backgroundColor = '#000000';
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

export default Contact;
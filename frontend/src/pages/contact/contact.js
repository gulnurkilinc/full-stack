import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

const Contact = () => {
  const { themeName } = useTheme();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Tema renkleri
  const pageBg = themeName === 'light' 
    ? 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
    : themeName === 'dark'
      ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
      : 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)';
  
  const blob1 = themeName === 'light'
    ? 'radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%)'
    : themeName === 'dark'
      ? 'radial-gradient(circle, rgba(0, 255, 255, 0.08) 0%, transparent 70%)'
      : 'radial-gradient(circle, rgba(212, 212, 212, 0.05) 0%, transparent 70%)';
  
  const blob2 = themeName === 'light'
    ? 'radial-gradient(circle, rgba(236, 72, 153, 0.08) 0%, transparent 70%)'
    : themeName === 'dark'
      ? 'radial-gradient(circle, rgba(138, 43, 226, 0.12) 0%, transparent 70%)'
      : 'radial-gradient(circle, rgba(255, 255, 255, 0.03) 0%, transparent 70%)';

  const heroTextColor = themeName === 'light' ? '#1a1a1a' : '#ffffff';
  const heroSubtextColor = themeName === 'light' ? 'rgba(26, 26, 26, 0.8)' : 'rgba(255, 255, 255, 0.9)';
  
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

  const infoBg = themeName === 'light'
    ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(236, 72, 153, 0.08) 100%)'
    : themeName === 'dark'
      ? 'linear-gradient(135deg, rgba(0, 212, 255, 0.08) 0%, rgba(123, 44, 191, 0.08) 100%)'
      : 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(212, 212, 212, 0.05) 100%)';
  
  const infoBorder = themeName === 'light'
    ? '1px solid rgba(99, 102, 241, 0.2)'
    : themeName === 'dark'
      ? '1px solid rgba(0, 212, 255, 0.2)'
      : '1px solid rgba(255, 255, 255, 0.1)';

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
      background: pageBg,
      position: 'relative',
      overflow: 'hidden',
      transition: 'background 0.4s ease'
    }}>
      {/* Animated Background Elements */}
      <div style={{
        position: 'absolute',
        top: '15%',
        left: '5%',
        width: '350px',
        height: '350px',
        background: blob1,
        borderRadius: '50%',
        filter: 'blur(50px)',
        animation: 'float 7s ease-in-out infinite',
        transition: 'background 0.4s ease'
      }}></div>
      
      <div style={{
        position: 'absolute',
        bottom: '20%',
        right: '5%',
        width: '400px',
        height: '400px',
        background: blob2,
        borderRadius: '50%',
        filter: 'blur(50px)',
        animation: 'float 9s ease-in-out infinite reverse',
        transition: 'background 0.4s ease'
      }}></div>

      {/* Hero Section */}
      <section style={{
        color: heroTextColor,
        padding: '140px 0 60px',
        textAlign: 'center',
        position: 'relative',
        transition: 'color 0.4s ease'
      }}>
        <div className="container">
          <h1 style={{ 
            fontSize: '48px', 
            marginBottom: '20px',
            fontWeight: '700',
            letterSpacing: '-1px',
            textShadow: themeName === 'light' ? 'none' : '0 4px 20px rgba(0, 0, 0, 0.3)',
            color: heroTextColor,
            transition: 'color 0.4s ease'
          }}>
            İletişim
          </h1>
          <p style={{ 
            fontSize: '20px', 
            maxWidth: '700px', 
            margin: '0 auto',
            lineHeight: '1.6',
            opacity: '0.9',
            fontWeight: '400',
            color: heroSubtextColor,
            transition: 'color 0.4s ease'
          }}>
            Sorularınız, önerileriniz veya işbirliği teklifleriniz için bizimle iletişime geçebilirsiniz.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section style={{ padding: '40px 0 80px', position: 'relative', zIndex: 1 }}>
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
              backgroundColor: cardBg,
              backdropFilter: 'blur(10px)',
              padding: '48px 40px',
              borderRadius: '20px',
              boxShadow: cardShadow,
              border: cardBorder,
              transition: 'all 0.4s ease'
            }}>
              <h2 style={{ 
                fontSize: '32px', 
                marginBottom: '12px',
                color: headingColor,
                fontWeight: '700',
                letterSpacing: '-0.5px',
                transition: 'color 0.4s ease'
              }}>
                Mesaj Gönderin
              </h2>
              <p style={{ 
                color: textColor,
                marginBottom: '32px',
                fontSize: '15px',
                lineHeight: '1.6',
                transition: 'color 0.4s ease'
              }}>
                Formu doldurarak bize ulaşabilirsiniz. En kısa sürede size dönüş yapacağız.
              </p>

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '600',
                    color: labelColor,
                    fontSize: '14px',
                    transition: 'color 0.4s ease'
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
                      border: `1.5px solid ${inputBorder}`,
                      borderRadius: '10px',
                      outline: 'none',
                      transition: 'all 0.2s ease',
                      backgroundColor: isSubmitting ? inputDisabledBg : inputBg,
                      color: inputText,
                      boxSizing: 'border-box',
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
                    fontWeight: '600',
                    color: labelColor,
                    fontSize: '14px',
                    transition: 'color 0.4s ease'
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
                      border: `1.5px solid ${inputBorder}`,
                      borderRadius: '10px',
                      outline: 'none',
                      transition: 'all 0.2s ease',
                      backgroundColor: isSubmitting ? inputDisabledBg : inputBg,
                      color: inputText,
                      boxSizing: 'border-box',
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
                    fontWeight: '600',
                    color: labelColor,
                    fontSize: '14px',
                    transition: 'color 0.4s ease'
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
                      border: `1.5px solid ${inputBorder}`,
                      borderRadius: '10px',
                      outline: 'none',
                      transition: 'all 0.2s ease',
                      backgroundColor: isSubmitting ? inputDisabledBg : inputBg,
                      color: inputText,
                      boxSizing: 'border-box',
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

                <div style={{ marginBottom: '28px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '600',
                    color: labelColor,
                    fontSize: '14px',
                    transition: 'color 0.4s ease'
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
                      border: `1.5px solid ${inputBorder}`,
                      borderRadius: '10px',
                      outline: 'none',
                      transition: 'all 0.2s ease',
                      backgroundColor: isSubmitting ? inputDisabledBg : inputBg,
                      color: inputText,
                      resize: 'vertical',
                      fontFamily: 'inherit',
                      lineHeight: '1.6',
                      boxSizing: 'border-box'
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

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="emerald-btn"
                  style={{ 
                    width: '100%', 
                    padding: '14px 20px',
                    fontSize: '15px',
                    opacity: isSubmitting ? 0.6 : 1,
                    cursor: isSubmitting ? 'not-allowed' : 'pointer'
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
                backgroundColor: cardBg,
                backdropFilter: 'blur(10px)',
                padding: '48px 40px',
                borderRadius: '20px',
                boxShadow: cardShadow,
                border: cardBorder,
                marginBottom: '30px',
                transition: 'all 0.4s ease'
              }}>
                <h2 style={{ 
                  fontSize: '32px', 
                  marginBottom: '12px',
                  color: headingColor,
                  fontWeight: '700',
                  letterSpacing: '-0.5px',
                  transition: 'color 0.4s ease'
                }}>
                  İletişim Bilgileri
                </h2>
                <p style={{ 
                  color: textColor,
                  marginBottom: '32px',
                  fontSize: '15px',
                  lineHeight: '1.6',
                  transition: 'color 0.4s ease'
                }}>
                  Bize aşağıdaki kanallardan ulaşabilirsiniz.
                </p>

                {/* Email */}
                <div style={{ 
                  padding: '24px',
                  background: infoBg,
                  borderRadius: '12px',
                  border: infoBorder,
                  transition: 'all 0.4s ease'
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
                        color: headingColor,
                        transition: 'color 0.4s ease'
                      }}>
                        E-posta
                      </h3>
                      <p style={{ 
                        color: textColor,
                        lineHeight: '1.8',
                        margin: 0,
                        fontSize: '15px',
                        transition: 'color 0.4s ease'
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
                backgroundColor: cardBg,
                backdropFilter: 'blur(10px)',
                padding: '48px 40px',
                borderRadius: '20px',
                boxShadow: cardShadow,
                border: cardBorder,
                transition: 'all 0.4s ease'
              }}>
                <h3 style={{ 
                  marginBottom: '12px', 
                  fontSize: '24px',
                  fontWeight: '600',
                  color: headingColor,
                  letterSpacing: '-0.3px',
                  transition: 'color 0.4s ease'
                }}>
                  Sosyal Medya
                </h3>
                <p style={{ 
                  color: textColor,
                  marginBottom: '28px',
                  fontSize: '15px',
                  transition: 'color 0.4s ease'
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

export default Contact;
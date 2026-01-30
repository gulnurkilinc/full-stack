import React from 'react';

const Footer = () => {
  return (
    <footer style={{ 
      background: 'linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%)',
      color: '#1a1a1a', 
      padding: '70px 0 40px 0', 
      marginTop: '0',
      position: 'relative',
      borderTop: '1px solid #e2e8f0'
    }}>
      {/* Modern minimal top line */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '1px',
        background: 'linear-gradient(90deg, transparent 0%, #1a1a1a 50%, transparent 100%)',
        opacity: 0.15
      }}></div>

      <div className="container">
        {/* Ana İçerik Bölümü */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '60px',
          marginBottom: '60px',
          textAlign: 'left'
        }}>
          {/* Kurum Bilgileri */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '20px'
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <path d="M7 7h10M7 12h10M7 17h6" strokeLinecap="round"/>
              </svg>
              <h3 style={{
                fontSize: '24px',
                fontWeight: '700',
                margin: 0,
                color: '#1a1a1a',
                letterSpacing: '-0.8px',
                fontFamily: 'system-ui, -apple-system, sans-serif'
              }}>
                Blog Sitesi
              </h3>
            </div>
            <p style={{
              fontSize: '15px',
              lineHeight: '1.7',
              color: '#4a5568',
              marginBottom: '30px',
              maxWidth: '320px',
              fontWeight: '400',
              letterSpacing: '-0.2px'
            }}>
              Araştırma odaklı içerikler ve veri destekli analizlerle bilim ve teknoloji dünyasını keşfedin.
            </p>
            {/* Profesyonel Bilgi Badge */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '14px',
                color: '#718096'
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
                <span>Kurumsal İçerik Merkezi</span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '14px',
                color: '#718096'
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <span>7/24 Erişilebilir</span>
              </div>
            </div>
          </div>

          {/* Kurumsal Linkler */}
          <div>
            <h4 style={{
              fontSize: '15px',
              fontWeight: '700',
              marginBottom: '25px',
              color: '#1a1a1a',
              letterSpacing: '0.5px',
              textTransform: 'uppercase'
            }}>
              Kurumsal
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <a href="/" style={{
                color: '#4a5568',
                textDecoration: 'none',
                fontSize: '15px',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                letterSpacing: '-0.2px'
              }}
              onMouseEnter={(e) => {
                e.target.style.color = '#1a1a1a';
                e.target.querySelector('span').style.transform = 'translateX(3px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = '#4a5568';
                e.target.querySelector('span').style.transform = 'translateX(0)';
              }}
              >
                <span style={{ transition: 'transform 0.2s', color: '#cbd5e0' }}>›</span> Ana Sayfa
              </a>
              <a href="/blogs" style={{
                color: '#4a5568',
                textDecoration: 'none',
                fontSize: '15px',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                letterSpacing: '-0.2px'
              }}
              onMouseEnter={(e) => {
                e.target.style.color = '#1a1a1a';
                e.target.querySelector('span').style.transform = 'translateX(3px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = '#4a5568';
                e.target.querySelector('span').style.transform = 'translateX(0)';
              }}
              >
                <span style={{ transition: 'transform 0.2s', color: '#cbd5e0' }}>›</span> Araştırmalar
              </a>
              <a href="/contact" style={{
                color: '#4a5568',
                textDecoration: 'none',
                fontSize: '15px',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                letterSpacing: '-0.2px'
              }}
              onMouseEnter={(e) => {
                e.target.style.color = '#1a1a1a';
                e.target.querySelector('span').style.transform = 'translateX(3px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = '#4a5568';
                e.target.querySelector('span').style.transform = 'translateX(0)';
              }}
              >
                <span style={{ transition: 'transform 0.2s', color: '#cbd5e0' }}>›</span> İletişim
              </a>
              <a href="/about" style={{
                color: '#4a5568',
                textDecoration: 'none',
                fontSize: '15px',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                letterSpacing: '-0.2px'
              }}
              onMouseEnter={(e) => {
                e.target.style.color = '#1a1a1a';
                e.target.querySelector('span').style.transform = 'translateX(3px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = '#4a5568';
                e.target.querySelector('span').style.transform = 'translateX(0)';
              }}
              >
                <span style={{ transition: 'transform 0.2s', color: '#cbd5e0' }}>›</span> Hakkımızda
              </a>
            </div>
          </div>

          {/* Yasal */}
          <div>
            <h4 style={{
              fontSize: '15px',
              fontWeight: '700',
              marginBottom: '25px',
              color: '#1a1a1a',
              letterSpacing: '0.5px',
              textTransform: 'uppercase'
            }}>
              Yasal
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <a href="/privacy" style={{
                color: '#4a5568',
                textDecoration: 'none',
                fontSize: '15px',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                letterSpacing: '-0.2px'
              }}
              onMouseEnter={(e) => {
                e.target.style.color = '#1a1a1a';
                e.target.querySelector('span').style.transform = 'translateX(3px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = '#4a5568';
                e.target.querySelector('span').style.transform = 'translateX(0)';
              }}
              >
                <span style={{ transition: 'transform 0.2s', color: '#cbd5e0' }}>›</span> Gizlilik Politikası
              </a>
              <a href="/terms" style={{
                color: '#4a5568',
                textDecoration: 'none',
                fontSize: '15px',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                letterSpacing: '-0.2px'
              }}
              onMouseEnter={(e) => {
                e.target.style.color = '#1a1a1a';
                e.target.querySelector('span').style.transform = 'translateX(3px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = '#4a5568';
                e.target.querySelector('span').style.transform = 'translateX(0)';
              }}
              >
                <span style={{ transition: 'transform 0.2s', color: '#cbd5e0' }}>›</span> Kullanım Koşulları
              </a>
              <a href="/cookies" style={{
                color: '#4a5568',
                textDecoration: 'none',
                fontSize: '15px',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                letterSpacing: '-0.2px'
              }}
              onMouseEnter={(e) => {
                e.target.style.color = '#1a1a1a';
                e.target.querySelector('span').style.transform = 'translateX(3px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = '#4a5568';
                e.target.querySelector('span').style.transform = 'translateX(0)';
              }}
              >
                <span style={{ transition: 'transform 0.2s', color: '#cbd5e0' }}>›</span> Çerez Politikası
              </a>
              <a href="/gdpr" style={{
                color: '#4a5568',
                textDecoration: 'none',
                fontSize: '15px',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                letterSpacing: '-0.2px'
              }}
              onMouseEnter={(e) => {
                e.target.style.color = '#1a1a1a';
                e.target.querySelector('span').style.transform = 'translateX(3px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = '#4a5568';
                e.target.querySelector('span').style.transform = 'translateX(0)';
              }}
              >
                <span style={{ transition: 'transform 0.2s', color: '#cbd5e0' }}>›</span> KVKK Aydınlatma Metni
              </a>
            </div>
          </div>

          {/* İletişim Bilgileri */}
          <div>
            <h4 style={{
              fontSize: '15px',
              fontWeight: '700',
              marginBottom: '25px',
              color: '#1a1a1a',
              letterSpacing: '0.5px',
              textTransform: 'uppercase'
            }}>
              İletişim
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px'
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4a5568" strokeWidth="2" style={{ marginTop: '2px', minWidth: '18px' }}>
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <div>
                  <p style={{ margin: 0, fontSize: '15px', color: '#4a5568', lineHeight: '1.6', letterSpacing: '-0.2px' }}>
                    info@blogsitesi.com
                  </p>
                </div>
              </div>
              
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px'
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4a5568" strokeWidth="2" style={{ marginTop: '2px', minWidth: '18px' }}>
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <div>
                  <p style={{ margin: 0, fontSize: '15px', color: '#4a5568', lineHeight: '1.6', letterSpacing: '-0.2px' }}>
                    İstanbul, Türkiye
                  </p>
                </div>
              </div>

              {/* Sosyal Medya - Modern */}
              <div style={{ marginTop: '10px' }}>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <a 
                    href="https://linkedin.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    style={{ 
                      width: '38px',
                      height: '38px',
                      backgroundColor: '#f7f8fa',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s',
                      color: '#4a5568'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#0077b5';
                      e.currentTarget.style.borderColor = '#0077b5';
                      e.currentTarget.style.color = '#fff';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#f7f8fa';
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.color = '#4a5568';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>

                  <a 
                    href="https://twitter.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    style={{ 
                      width: '38px',
                      height: '38px',
                      backgroundColor: '#f7f8fa',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s',
                      color: '#4a5568',
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#000000';
                      e.currentTarget.style.borderColor = '#000000';
                      e.currentTarget.style.color = '#fff';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#f7f8fa';
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.color = '#4a5568';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    𝕏
                  </a>

                  <a 
                    href="https://instagram.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    style={{ 
                      width: '38px',
                      height: '38px',
                      backgroundColor: '#f7f8fa',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s',
                      color: '#4a5568'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)';
                      e.currentTarget.style.borderColor = 'transparent';
                      e.currentTarget.style.color = '#fff';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#f7f8fa';
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.color = '#4a5568';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Alt Bölüm - Copyright ve Uyumluluk */}
        <div style={{
          paddingTop: '35px',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div>
            <p style={{
              fontSize: '14px',
              color: '#718096',
              margin: '0 0 8px 0',
              letterSpacing: '-0.2px'
            }}>
              &copy; 2026 Blog Sitesi. Tüm hakları saklıdır.
            </p>
            <p style={{
              fontSize: '13px',
              color: '#a0aec0',
              margin: 0,
              letterSpacing: '-0.2px'
            }}>
              Vergi Kimlik No: XXXXXXXXXX
            </p>
          </div>
          
          <div style={{
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
            <div style={{
              padding: '6px 14px',
              backgroundColor: '#f7f8fa',
              borderRadius: '8px',
              fontSize: '12px',
              color: '#4a5568',
              border: '1px solid #e2e8f0',
              fontWeight: '600',
              letterSpacing: '-0.1px'
            }}>
              ISO 27001
            </div>
            <div style={{
              padding: '6px 14px',
              backgroundColor: '#f7f8fa',
              borderRadius: '8px',
              fontSize: '12px',
              color: '#4a5568',
              border: '1px solid #e2e8f0',
              fontWeight: '600',
              letterSpacing: '-0.1px'
            }}>
              KVKK Uyumlu
            </div>
            <div style={{
              padding: '6px 14px',
              backgroundColor: '#f7f8fa',
              borderRadius: '8px',
              fontSize: '12px',
              color: '#4a5568',
              border: '1px solid #e2e8f0',
              fontWeight: '600',
              letterSpacing: '-0.1px'
            }}>
              SSL Güvenli
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
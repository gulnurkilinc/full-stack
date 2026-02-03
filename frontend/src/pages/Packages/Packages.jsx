import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

const Packages = () => {
  const { themeName } = useTheme();
  const navigate = useNavigate();
  const [showComparison, setShowComparison] = useState(false);

  // Tema renklerini belirle
  const bgColor = themeName === 'light' ? '#f8f9fa' : themeName === 'dark' ? '#0f172a' : '#000000';
  const cardBg = themeName === 'light' ? '#ffffff' : themeName === 'dark' ? '#1e293b' : '#1a1a1a';
  const textColor = themeName === 'light' ? '#1a1a1a' : themeName === 'dark' ? '#f1f5f9' : '#e5e5e5';
  const subtextColor = themeName === 'light' ? '#4a5568' : themeName === 'dark' ? '#cbd5e0' : '#a3a3a3';
  const borderColor = themeName === 'light' ? '#e2e8f0' : themeName === 'dark' ? '#334155' : '#2a2a2a';
  const accentColor = themeName === 'light' ? '#007bff' : themeName === 'dark' ? '#60a5fa' : '#3b82f6';
  const successColor = '#10b981';
  const errorColor = '#ef4444';

  const packages = [
    {
      id: 1,
      name: '🎓 Ücretsiz Paket',
      badge: null,
      badgeColor: '#3b82f6',
      description: 'Temel seviyede platformu deneyimlemek isteyenler için.',
      price: 0,
      priceLabel: 'Ücretsiz',
      features: [
        { text: 'LMM modeline sınırlı erişim', included: true },
        { text: 'Haftalık 3 analiz hakkı', included: true },
        { text: '10 adet basit analiz hakkı', included: true },
        { text: 'Detaylı analizler', included: false },
        { text: 'Gelişmiş raporlar', included: false }
      ],
      buttonText: 'Ücretsiz Başla',
      buttonColor: '#3b82f6',
      highlighted: false
    },
    {
      id: 2,
      name: '📰 Analiz Okuma Paketi',
      badge: null,
      badgeColor: '#eab308',
      description: 'Sadece platformda yayınlanan analizleri okumak isteyenler için.',
      price: 80,
      priceLabel: '₺80 / aylık',
      features: [
        { text: 'Tüm yayınlanan analizleri okuma', included: true },
        { text: 'TBMM, medya ve politika analizleri', included: true },
        { text: 'LMM kullanımı yok', included: false },
        { text: 'Analiz üretme yok', included: false }
      ],
      buttonText: 'Okuma Aboneliği Al',
      buttonColor: '#eab308',
      highlighted: false
    },
    {
      id: 3,
      name: '🚀 Profesyonel Paket',
      badge: 'EN ÇOK TERCİH EDİLEN',
      badgeColor: '#10b981',
      description: 'Hem okumak hem de analiz üretmek isteyen profesyoneller için.',
      price: 700,
      priceLabel: '₺700 / aylık',
      features: [
        { text: 'Tüm analizleri okuma', included: true },
        { text: 'LMM modeline tam erişim', included: true },
        { text: 'Haftalık 30 analiz', included: true },
        { text: 'Gelişmiş analiz seçenekleri', included: true },
        { text: 'Karşılaştırmalı raporlar', included: true }
      ],
      buttonText: 'Profesyonel Ol',
      buttonColor: '#10b981',
      highlighted: true
    },
    {
      id: 4,
      name: '🏛️ Özel Talep / Kurumsal',
      badge: null,
      badgeColor: '#8b5cf6',
      description: 'Kuruma veya projeye özel analizler ve raporlar.',
      price: null,
      priceLabel: 'Özel Fiyatlandırma',
      features: [
        { text: 'Özel veri setleri', included: true },
        { text: 'Talebe özel analiz modeli', included: true },
        { text: 'Kurumsal raporlama', included: true },
        { text: 'Danışmanlık & destek', included: true },
        { text: 'Akademik veya stratejik çıktı', included: true }
      ],
      buttonText: 'Bizimle İletişime Geçin',
      buttonColor: '#8b5cf6',
      highlighted: false,
      note: 'Analiz ihtiyaçlarınızı bize iletin, size özel bir çözüm oluşturalım.'
    }
  ];

  const trustFeatures = [
    { icon: '🔒', text: 'Güvenli ödeme' },
    { icon: '📊', text: 'Şeffaf veri kullanımı' },
    { icon: '📚', text: 'Akademik metodoloji' },
    { icon: '🏛️', text: 'Açık kaynaklara dayalı analizler' }
  ];

  const handlePackageSelect = (pkg) => {
    if (pkg.id === 1) {
      navigate('/register');
    } else if (pkg.id === 4) {
      navigate('/contact');
    } else {
      alert(`${pkg.name} paketi seçildi. Ödeme sayfası yakında eklenecek.`);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: bgColor,
      paddingTop: '120px',
      paddingBottom: '80px',
      transition: 'background-color 0.3s ease'
    }}>
      <div className="container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px' }}>
        
        {/* Başlık Bölümü */}
        <div style={{ textAlign: 'center', marginBottom: '70px' }}>
          <h1 style={{
            fontSize: '52px',
            fontWeight: '800',
            color: textColor,
            marginBottom: '20px',
            letterSpacing: '-1.5px',
            lineHeight: '1.2'
          }}>
            Size Uygun Paketi Seçin
          </h1>
          <p style={{
            fontSize: '20px',
            color: subtextColor,
            maxWidth: '700px',
            margin: '0 auto',
            lineHeight: '1.7',
            fontWeight: '400'
          }}>
            Siyasi analizler, TBMM takibi ve medya izleme için ihtiyacınıza en uygun paketi seçin
          </p>
        </div>

        {/* Paket Kartları */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '28px',
          marginBottom: '80px'
        }}>
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              style={{
                backgroundColor: cardBg,
                border: pkg.highlighted ? `3px solid ${pkg.badgeColor}` : `1.5px solid ${borderColor}`,
                borderRadius: '20px',
                padding: pkg.highlighted ? '42px 34px' : '40px 32px',
                position: 'relative',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: pkg.highlighted 
                  ? `0 12px 40px ${pkg.badgeColor}30` 
                  : '0 4px 12px rgba(0, 0, 0, 0.08)',
                transform: pkg.highlighted ? 'scale(1.05)' : 'scale(1)',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.08) translateY(-8px)';
                e.currentTarget.style.boxShadow = `0 20px 50px ${pkg.badgeColor}40`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = pkg.highlighted ? 'scale(1.05)' : 'scale(1)';
                e.currentTarget.style.boxShadow = pkg.highlighted 
                  ? `0 12px 40px ${pkg.badgeColor}30` 
                  : '0 4px 12px rgba(0, 0, 0, 0.08)';
              }}
            >
              {/* Badge */}
              {pkg.badge && (
                <div style={{
                  position: 'absolute',
                  top: '-14px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: pkg.badgeColor,
                  color: 'white',
                  padding: '8px 20px',
                  borderRadius: '25px',
                  fontSize: '11px',
                  fontWeight: '800',
                  letterSpacing: '1px',
                  boxShadow: `0 4px 15px ${pkg.badgeColor}50`,
                  textTransform: 'uppercase'
                }}>
                  {pkg.badge}
                </div>
              )}

              {/* Paket Başlığı */}
              <div style={{ marginBottom: '24px', marginTop: pkg.badge ? '12px' : '0' }}>
                <h3 style={{
                  fontSize: '26px',
                  fontWeight: '700',
                  color: textColor,
                  marginBottom: '12px',
                  lineHeight: '1.3'
                }}>
                  {pkg.name}
                </h3>
                <p style={{
                  fontSize: '15px',
                  color: subtextColor,
                  lineHeight: '1.6',
                  minHeight: '48px'
                }}>
                  {pkg.description}
                </p>
              </div>

              {/* Fiyat */}
              <div style={{ marginBottom: '32px', paddingBottom: '28px', borderBottom: `1.5px solid ${borderColor}` }}>
                {pkg.price !== null ? (
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                    <span style={{
                      fontSize: pkg.price === 0 ? '36px' : '52px',
                      fontWeight: '900',
                      color: pkg.badgeColor,
                      letterSpacing: '-2px'
                    }}>
                      {pkg.price === 0 ? 'Ücretsiz' : `₺${pkg.price}`}
                    </span>
                    {pkg.price > 0 && (
                      <span style={{ fontSize: '17px', color: subtextColor, fontWeight: '600' }}>
                        / aylık
                      </span>
                    )}
                  </div>
                ) : (
                  <div style={{
                    fontSize: '22px',
                    fontWeight: '700',
                    color: pkg.badgeColor,
                    letterSpacing: '-0.5px'
                  }}>
                    {pkg.priceLabel}
                  </div>
                )}
              </div>

              {/* Özellikler */}
              <div style={{ marginBottom: '32px' }}>
                {pkg.features.map((feature, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '14px',
                      marginBottom: '14px',
                      fontSize: '15px',
                      color: feature.included ? textColor : subtextColor,
                      opacity: feature.included ? 1 : 0.6,
                      fontWeight: feature.included ? '500' : '400'
                    }}
                  >
                    <div style={{ flexShrink: 0, marginTop: '2px' }}>
                      {feature.included ? (
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={successColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      ) : (
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={errorColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      )}
                    </div>
                    <span style={{ lineHeight: '1.5' }}>{feature.text}</span>
                  </div>
                ))}
              </div>

              {/* Not (Sadece Kurumsal Pakette) */}
              {pkg.note && (
                <div style={{
                  backgroundColor: themeName === 'light' ? '#f0f9ff' : themeName === 'dark' ? '#1e3a5f' : '#1a2332',
                  padding: '14px 16px',
                  borderRadius: '12px',
                  marginBottom: '24px',
                  border: `1px solid ${pkg.badgeColor}30`
                }}>
                  <p style={{
                    fontSize: '13px',
                    color: subtextColor,
                    lineHeight: '1.6',
                    margin: 0,
                    fontStyle: 'italic'
                  }}>
                    {pkg.note}
                  </p>
                </div>
              )}

              {/* Buton */}
              <button
                onClick={() => handlePackageSelect(pkg)}
                style={{
                  width: '100%',
                  padding: '16px 28px',
                  fontSize: '16px',
                  fontWeight: '700',
                  backgroundColor: pkg.buttonColor,
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: `0 4px 15px ${pkg.buttonColor}40`,
                  letterSpacing: '-0.3px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-3px)';
                  e.target.style.boxShadow = `0 8px 25px ${pkg.buttonColor}60`;
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = `0 4px 15px ${pkg.buttonColor}40`;
                }}
              >
                {pkg.buttonText}
              </button>
            </div>
          ))}
        </div>

        {/* Güven & Şeffaflık Alanı */}
        <div style={{
          backgroundColor: cardBg,
          padding: '50px 40px',
          borderRadius: '20px',
          border: `1.5px solid ${borderColor}`,
          marginBottom: '60px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)'
        }}>
          <h3 style={{
            fontSize: '26px',
            fontWeight: '700',
            color: textColor,
            marginBottom: '36px',
            textAlign: 'center',
            letterSpacing: '-0.5px'
          }}>
            Güven & Şeffaflık
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '32px'
          }}>
            {trustFeatures.map((feature, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  gap: '12px'
                }}
              >
                <div style={{ fontSize: '48px' }}>{feature.icon}</div>
                <p style={{
                  fontSize: '15px',
                  fontWeight: '600',
                  color: textColor,
                  margin: 0,
                  lineHeight: '1.4'
                }}>
                  {feature.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Üstü CTA */}
        <div style={{
          backgroundColor: cardBg,
          padding: '60px 40px',
          borderRadius: '20px',
          border: `1.5px solid ${borderColor}`,
          textAlign: 'center',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)'
        }}>
          <h2 style={{
            fontSize: '36px',
            fontWeight: '800',
            color: textColor,
            marginBottom: '24px',
            letterSpacing: '-1px'
          }}>
            Size uygun paket hangisi?
          </h2>
          <p style={{
            fontSize: '17px',
            color: subtextColor,
            marginBottom: '40px',
            maxWidth: '600px',
            margin: '0 auto 40px auto',
            lineHeight: '1.7'
          }}>
            Paketler arasında karşılaştırma yapmak veya daha fazla bilgi almak için bizimle iletişime geçebilirsiniz.
          </p>
          <div style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={() => setShowComparison(!showComparison)}
              style={{
                padding: '16px 36px',
                fontSize: '16px',
                fontWeight: '700',
                backgroundColor: accentColor,
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: `0 4px 15px ${accentColor}40`,
                letterSpacing: '-0.3px'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-3px)';
                e.target.style.boxShadow = `0 8px 25px ${accentColor}60`;
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = `0 4px 15px ${accentColor}40`;
              }}
            >
              📊 Paketleri Karşılaştır
            </button>
            <button
              onClick={() => navigate('/contact')}
              style={{
                padding: '16px 36px',
                fontSize: '16px',
                fontWeight: '700',
                backgroundColor: 'transparent',
                color: accentColor,
                border: `2px solid ${accentColor}`,
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                letterSpacing: '-0.3px'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = accentColor;
                e.target.style.color = '#ffffff';
                e.target.style.transform = 'translateY(-3px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = accentColor;
                e.target.style.transform = 'translateY(0)';
              }}
            >
              💬 Bize Sorun
            </button>
          </div>
        </div>

        {/* Karşılaştırma Tablosu (Toggle ile açılır) */}
        {showComparison && (
          <div style={{
            marginTop: '40px',
            backgroundColor: cardBg,
            padding: '40px',
            borderRadius: '20px',
            border: `1.5px solid ${borderColor}`,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
            animation: 'slideDown 0.4s ease'
          }}>
            <h3 style={{
              fontSize: '28px',
              fontWeight: '700',
              color: textColor,
              marginBottom: '32px',
              textAlign: 'center'
            }}>
              📊 Detaylı Paket Karşılaştırması
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '15px' }}>
                <thead>
                  <tr style={{ backgroundColor: themeName === 'light' ? '#f7f8fa' : themeName === 'dark' ? '#0f172a' : '#0a0a0a' }}>
                    <th style={{ padding: '16px', textAlign: 'left', color: textColor, fontWeight: '700', borderBottom: `2px solid ${borderColor}` }}>Özellik</th>
                    {packages.map(pkg => (
                      <th key={pkg.id} style={{ padding: '16px', textAlign: 'center', color: textColor, fontWeight: '700', borderBottom: `2px solid ${borderColor}` }}>
                        {pkg.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {['LMM Erişimi', 'Analiz Okuma', 'Analiz Üretme', 'Gelişmiş Raporlar', 'Özel Destek'].map((feature, idx) => (
                    <tr key={idx} style={{ borderBottom: `1px solid ${borderColor}` }}>
                      <td style={{ padding: '16px', color: textColor, fontWeight: '600' }}>{feature}</td>
                      {packages.map(pkg => (
                        <td key={pkg.id} style={{ padding: '16px', textAlign: 'center' }}>
                          {Math.random() > 0.3 ? (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={successColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={errorColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="18" y1="6" x2="6" y2="18"></line>
                              <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* CSS Animasyonu */}
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Packages;
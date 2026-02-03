import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

const Packages = () => {
  const { themeName } = useTheme();
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' veya 'yearly'
  const [showComparison, setShowComparison] = useState(false);

  // Tema renklerini belirle
  const bgColor = themeName === 'light' ? '#f8f9fa' : themeName === 'dark' ? '#0f172a' : '#000000';
  const cardBg = themeName === 'light' ? '#ffffff' : themeName === 'dark' ? '#1e293b' : '#1a1a1a';
  const textColor = themeName === 'light' ? '#1a1a1a' : themeName === 'dark' ? '#f1f5f9' : '#e5e5e5';
  const subtextColor = themeName === 'light' ? '#4a5568' : themeName === 'dark' ? '#cbd5e0' : '#a3a3a3';
  const borderColor = themeName === 'light' ? '#e2e8f0' : themeName === 'dark' ? '#334155' : '#2a2a2a';
  const accentColor = themeName === 'light' ? '#007bff' : themeName === 'dark' ? '#60a5fa' : '#3b82f6';
  const successColor = '#10b981';

  const packages = [
    {
      id: 1,
      name: 'Ücretsiz',
      badge: null,
      description: 'Temel seviyede platformu deneyimlemek isteyenler için.',
      monthlyPrice: 0,
      yearlyPrice: 0,
      features: [
        { text: 'LMM modeline sınırlı erişim', included: true },
        { text: 'Haftalık 3 analiz hakkı', included: true },
        { text: '10 adet basit analiz hakkı', included: true },
        { text: 'Detaylı analizler', included: false },
        { text: 'Gelişmiş raporlar', included: false }
      ],
      buttonText: 'Ücretsiz Başla',
      highlighted: false
    },
    {
      id: 2,
      name: 'Premium',
      badge: null,
      description: 'Sadece platformda yayınlanan analizleri okumak isteyenler için.',
      monthlyPrice: 80,
      yearlyPrice: 800,
      features: [
        { text: 'Tüm yayınlanan analizleri okuma', included: true },
        { text: 'TBMM, medya ve politika analizleri', included: true },
        { text: 'LMM kullanımı yok', included: false },
        { text: 'Analiz üretme yok', included: false },
        { text: 'Özel raporlama yok', included: false }
      ],
      buttonText: 'Premium Al',
      highlighted: false
    },
    {
      id: 3,
      name: 'Profesyonel',
      badge: 'EN ÇOK TERCİH EDİLEN',
      description: 'Hem okumak hem de analiz üretmek isteyen profesyoneller için.',
      monthlyPrice: 700,
      yearlyPrice: 7000,
      features: [
        { text: 'Tüm analizleri okuma', included: true },
        { text: 'LMM modeline tam erişim', included: true },
        { text: 'Haftalık 30 analiz', included: true },
        { text: 'Gelişmiş analiz seçenekleri', included: true },
        { text: 'Karşılaştırmalı raporlar', included: true }
      ],
      buttonText: 'Profesyonel Ol',
      highlighted: true
    },
    {
      id: 4,
      name: 'Kurumsal',
      badge: null,
      description: 'Kuruma veya projeye özel analizler ve raporlar.',
      monthlyPrice: null,
      yearlyPrice: null,
      features: [
        { text: 'Özel veri setleri', included: true },
        { text: 'Talebe özel analiz modeli', included: true },
        { text: 'Kurumsal raporlama', included: true },
        { text: 'Danışmanlık & destek', included: true },
        { text: 'Akademik veya stratejik çıktı', included: true }
      ],
      buttonText: 'İletişime Geçin',
      highlighted: false,
      note: 'Analiz ihtiyaçlarınızı bize iletin, size özel bir çözüm oluşturalım.'
    }
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
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h1 style={{
            fontSize: '48px',
            fontWeight: '700',
            color: textColor,
            marginBottom: '16px',
            letterSpacing: '-1px',
            lineHeight: '1.2'
          }}>
            Paketlerimiz
          </h1>
          <p style={{
            fontSize: '18px',
            color: subtextColor,
            maxWidth: '650px',
            margin: '0 auto 40px auto',
            lineHeight: '1.6',
            fontWeight: '400'
          }}>
            Siyasi analizler, TBMM takibi ve medya izleme için ihtiyacınıza uygun paketi seçin
          </p>

          {/* Aylık/Yıllık Toggle - Referans Görseldeki Gibi */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '4px',
            backgroundColor: themeName === 'light' ? '#e5e7eb' : themeName === 'dark' ? '#1e293b' : '#0a0a0a',
            borderRadius: '50px',
            position: 'relative',
            gap: '0'
          }}>
            {/* Animasyonlu Arka Plan - Kayan Pill */}
            <div style={{
              position: 'absolute',
              top: '4px',
              bottom: '4px',
              left: billingCycle === 'monthly' ? '4px' : '50%',
              width: 'calc(50% - 4px)',
              backgroundColor: themeName === 'light' ? '#ffffff' : themeName === 'dark' ? '#334155' : '#1a1a1a',
              borderRadius: '50px',
              transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: themeName === 'light' 
                ? '0 2px 4px rgba(0, 0, 0, 0.1)' 
                : '0 2px 8px rgba(0, 0, 0, 0.3)',
              zIndex: 0
            }}></div>
            
            <button
              onClick={() => setBillingCycle('monthly')}
              style={{
                padding: '10px 32px',
                fontSize: '15px',
                fontWeight: '600',
                backgroundColor: 'transparent',
                color: billingCycle === 'monthly' ? textColor : subtextColor,
                border: 'none',
                borderRadius: '50px',
                cursor: 'pointer',
                transition: 'color 0.3s ease',
                position: 'relative',
                zIndex: 1,
                whiteSpace: 'nowrap'
              }}
            >
              Aylık
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              style={{
                padding: '10px 32px',
                fontSize: '15px',
                fontWeight: '600',
                backgroundColor: 'transparent',
                color: billingCycle === 'yearly' ? textColor : subtextColor,
                border: 'none',
                borderRadius: '50px',
                cursor: 'pointer',
                transition: 'color 0.3s ease',
                position: 'relative',
                zIndex: 1,
                whiteSpace: 'nowrap'
              }}
            >
              Yıllık
              <span style={{
                position: 'absolute',
                top: '-6px',
                right: '-6px',
                backgroundColor: '#10b981',
                color: 'white',
                fontSize: '9px',
                padding: '2px 6px',
                borderRadius: '10px',
                fontWeight: '700',
                lineHeight: '1'
              }}>
                -17%
              </span>
            </button>
          </div>
        </div>

        {/* Paket Kartları - Grid ile Hizalı */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '20px',
          marginBottom: '60px',
          alignItems: 'stretch' // Tüm kartları aynı yükseklikte tutar
        }}>
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              style={{
                backgroundColor: cardBg,
                border: pkg.highlighted ? `2px solid ${accentColor}` : `1px solid ${borderColor}`,
                borderRadius: '16px',
                padding: '28px 24px',
                position: 'relative',
                transition: 'all 0.3s ease',
                display: 'grid',
                gridTemplateRows: 'auto auto auto 1fr auto auto', // Sabit yapı
                boxShadow: pkg.highlighted 
                  ? `0 8px 24px ${accentColor}20` 
                  : '0 2px 8px rgba(0, 0, 0, 0.04)',
                height: '100%' // Tüm kartların aynı yükseklikte olmasını sağlar
              }}
              onMouseEnter={(e) => {
                if (!pkg.highlighted) {
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!pkg.highlighted) {
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.04)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
            >
              {/* Badge - Sadece Profesyonel Pakette */}
              {pkg.badge && (
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: accentColor,
                  color: 'white',
                  padding: '6px 16px',
                  borderRadius: '20px',
                  fontSize: '10px',
                  fontWeight: '700',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap'
                }}>
                  {pkg.badge}
                </div>
              )}

              {/* Paket Başlığı - Grid Row 1 */}
              <div style={{ marginBottom: '12px', marginTop: pkg.badge ? '8px' : '0' }}>
                <h3 style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: pkg.highlighted ? accentColor : textColor,
                  marginBottom: '0',
                  textAlign: 'left'
                }}>
                  {pkg.name}
                </h3>
              </div>

              {/* Fiyat - Grid Row 2 */}
              <div style={{ 
                marginBottom: '12px',
                textAlign: 'left'
              }}>
                {pkg.monthlyPrice !== null ? (
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                    {billingCycle === 'yearly' && pkg.yearlyPrice > 0 && (
                      <span style={{
                        fontSize: '24px',
                        fontWeight: '600',
                        color: subtextColor,
                        textDecoration: 'line-through',
                        opacity: 0.5
                      }}>
                        ₺{pkg.monthlyPrice}
                      </span>
                    )}
                    <span style={{
                      fontSize: pkg.monthlyPrice === 0 ? '32px' : '48px',
                      fontWeight: '700',
                      color: pkg.highlighted ? accentColor : textColor,
                      letterSpacing: '-1px'
                    }}>
                      {pkg.monthlyPrice === 0 
                        ? '₺0' 
                        : `₺${billingCycle === 'monthly' ? pkg.monthlyPrice : Math.floor(pkg.yearlyPrice / 12)}`}
                    </span>
                    {pkg.monthlyPrice > 0 && (
                      <span style={{ 
                        fontSize: '16px', 
                        color: subtextColor, 
                        fontWeight: '500',
                        alignSelf: 'flex-end',
                        marginBottom: '8px'
                      }}>
                        /ay
                      </span>
                    )}
                  </div>
                ) : (
                  <div style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    color: textColor
                  }}>
                    Özel Fiyat
                  </div>
                )}
                {billingCycle === 'yearly' && pkg.yearlyPrice > 0 && (
                  <p style={{
                    fontSize: '12px',
                    color: subtextColor,
                    margin: '4px 0 0 0'
                  }}>
                    ilk ay boyunca
                  </p>
                )}
              </div>

              {/* Açıklama - Grid Row 3 */}
              <p style={{
                fontSize: '14px',
                color: subtextColor,
                lineHeight: '1.5',
                marginBottom: '20px',
                minHeight: '42px'
              }}>
                {pkg.description}
              </p>

              {/* Buton - Grid Row 4 */}
              <div style={{ marginBottom: '24px' }}>
                <button
                  onClick={() => handlePackageSelect(pkg)}
                  style={{
                    width: '100%',
                    padding: '13px 24px',
                    fontSize: '15px',
                    fontWeight: '600',
                    backgroundColor: pkg.highlighted ? accentColor : 'transparent',
                    color: pkg.highlighted ? '#ffffff' : textColor,
                    border: `2px solid ${pkg.highlighted ? accentColor : borderColor}`,
                    borderRadius: '10px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (pkg.highlighted) {
                      e.target.style.backgroundColor = themeName === 'light' ? '#0056b3' : '#3b82f6';
                      e.target.style.borderColor = themeName === 'light' ? '#0056b3' : '#3b82f6';
                    } else {
                      e.target.style.backgroundColor = themeName === 'light' ? '#f8f9fa' : themeName === 'dark' ? '#334155' : '#2a2a2a';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (pkg.highlighted) {
                      e.target.style.backgroundColor = accentColor;
                      e.target.style.borderColor = accentColor;
                    } else {
                      e.target.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  {pkg.buttonText}
                </button>
              </div>

              {/* Özellikler - Grid Row 5 (flex: 1 ile genişler) */}
              <div style={{ marginBottom: '16px' }}>
                {pkg.features.map((feature, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px',
                      marginBottom: '12px',
                      fontSize: '14px',
                      color: feature.included ? textColor : subtextColor,
                      opacity: feature.included ? 1 : 0.5
                    }}
                  >
                    <div style={{ flexShrink: 0, marginTop: '2px' }}>
                      {feature.included ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={pkg.highlighted ? accentColor : successColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={subtextColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      )}
                    </div>
                    <span style={{ lineHeight: '1.4' }}>{feature.text}</span>
                  </div>
                ))}
              </div>

              {/* Not (Sadece Kurumsal Pakette) - Grid Row 6 */}
              {pkg.note && (
                <div style={{
                  backgroundColor: themeName === 'light' ? '#f8f9fa' : themeName === 'dark' ? '#1e293b' : '#1a1a1a',
                  padding: '12px',
                  borderRadius: '8px',
                  border: `1px solid ${borderColor}`
                }}>
                  <p style={{
                    fontSize: '12px',
                    color: subtextColor,
                    lineHeight: '1.5',
                    margin: 0,
                    fontStyle: 'italic'
                  }}>
                    {pkg.note}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer Üstü CTA */}
        <div style={{
          backgroundColor: cardBg,
          padding: '50px 40px',
          borderRadius: '12px',
          border: `1px solid ${borderColor}`,
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
        }}>
          <h2 style={{
            fontSize: '32px',
            fontWeight: '700',
            color: textColor,
            marginBottom: '16px',
            letterSpacing: '-0.5px'
          }}>
            Size uygun paket hangisi?
          </h2>
          <p style={{
            fontSize: '16px',
            color: subtextColor,
            marginBottom: '32px',
            maxWidth: '600px',
            margin: '0 auto 32px auto',
            lineHeight: '1.6'
          }}>
            Paketler arasında karşılaştırma yapmak veya daha fazla bilgi almak için bizimle iletişime geçebilirsiniz.
          </p>
          <div style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={() => setShowComparison(!showComparison)}
              style={{
                padding: '14px 32px',
                fontSize: '15px',
                fontWeight: '600',
                backgroundColor: textColor,
                color: bgColor,
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.opacity = '0.9';
              }}
              onMouseLeave={(e) => {
                e.target.style.opacity = '1';
              }}
            >
              Paketleri Karşılaştır
            </button>
            <button
              onClick={() => navigate('/contact')}
              style={{
                padding: '14px 32px',
                fontSize: '15px',
                fontWeight: '600',
                backgroundColor: 'transparent',
                color: textColor,
                border: `1.5px solid ${borderColor}`,
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = themeName === 'light' ? '#f8f9fa' : themeName === 'dark' ? '#334155' : '#2a2a2a';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
              }}
            >
              Bize Sorun
            </button>
          </div>
        </div>

        {/* Karşılaştırma Tablosu */}
        {showComparison && (
          <div style={{
            marginTop: '32px',
            backgroundColor: cardBg,
            padding: '40px',
            borderRadius: '12px',
            border: `1px solid ${borderColor}`,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
            animation: 'slideDown 0.3s ease'
          }}>
            <h3 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: textColor,
              marginBottom: '24px',
              textAlign: 'center'
            }}>
              Detaylı Karşılaştırma
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: `2px solid ${borderColor}` }}>
                    <th style={{ padding: '12px', textAlign: 'left', color: textColor, fontWeight: '600' }}>Özellik</th>
                    {packages.map(pkg => (
                      <th key={pkg.id} style={{ padding: '12px', textAlign: 'center', color: textColor, fontWeight: '600' }}>
                        {pkg.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {packages[0].features.map((_, idx) => (
                    <tr key={idx} style={{ borderBottom: `1px solid ${borderColor}` }}>
                      <td style={{ padding: '12px', color: textColor }}>{packages[0].features[idx].text}</td>
                      {packages.map(pkg => (
                        <td key={pkg.id} style={{ padding: '12px', textAlign: 'center' }}>
                          {pkg.features[idx]?.included ? (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={successColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          ) : (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={subtextColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Packages;
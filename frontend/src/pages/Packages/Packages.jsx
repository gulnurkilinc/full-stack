import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

const Packages = () => {
  const { themeName } = useTheme();
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' veya 'yearly'

  // Tema renklerini belirle
  const bgColor = themeName === 'light' ? '#f8f9fa' : themeName === 'dark' ? '#0f172a' : '#000000';
  const cardBg = themeName === 'light' ? '#ffffff' : themeName === 'dark' ? '#1e293b' : '#1a1a1a';
  const textColor = themeName === 'light' ? '#1a1a1a' : themeName === 'dark' ? '#f1f5f9' : '#e5e5e5';
  const subtextColor = themeName === 'light' ? '#4a5568' : themeName === 'dark' ? '#cbd5e0' : '#a3a3a3';
  const borderColor = themeName === 'light' ? '#e2e8f0' : themeName === 'dark' ? '#334155' : '#2a2a2a';
  const accentColor = themeName === 'light' ? '#007bff' : themeName === 'dark' ? '#60a5fa' : '#3b82f6';

  const packages = [
    {
      id: 1,
      name: 'Başlangıç',
      icon: '🚀',
      monthlyPrice: 0,
      yearlyPrice: 0,
      description: 'Bireysel kullanıcılar için ideal',
      features: [
        { text: 'Haftalık 5 analiz', included: true },
        { text: 'Temel raporlar', included: true },
        { text: 'E-posta desteği', included: true },
        { text: 'Gelişmiş filtreler', included: false },
        { text: 'API erişimi', included: false },
        { text: 'Özel raporlar', included: false }
      ],
      popular: false,
      buttonText: 'Ücretsiz Başla',
      buttonStyle: 'outline'
    },
    {
      id: 2,
      name: 'Profesyonel',
      icon: '💼',
      monthlyPrice: 299,
      yearlyPrice: 2990,
      description: 'Küçük ekipler ve işletmeler için',
      features: [
        { text: 'Sınırsız analiz', included: true },
        { text: 'Gelişmiş raporlar', included: true },
        { text: 'Öncelikli destek', included: true },
        { text: 'Gelişmiş filtreler', included: true },
        { text: 'API erişimi', included: true },
        { text: 'Özel raporlar', included: false }
      ],
      popular: true,
      buttonText: 'Hemen Başla',
      buttonStyle: 'filled'
    },
    {
      id: 3,
      name: 'Kurumsal',
      icon: '🏢',
      monthlyPrice: 999,
      yearlyPrice: 9990,
      description: 'Büyük organizasyonlar için',
      features: [
        { text: 'Sınırsız analiz', included: true },
        { text: 'Özelleştirilmiş raporlar', included: true },
        { text: '7/24 destek', included: true },
        { text: 'Gelişmiş filtreler', included: true },
        { text: 'API erişimi', included: true },
        { text: 'Özel raporlar', included: true }
      ],
      popular: false,
      buttonText: 'İletişime Geç',
      buttonStyle: 'outline'
    }
  ];

  const handlePackageSelect = (pkg) => {
    if (pkg.monthlyPrice === 0) {
      navigate('/register');
    } else if (pkg.id === 3) {
      navigate('/contact');
    } else {
      // Ödeme sayfasına yönlendir (henüz oluşturulmadı)
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
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        
        {/* Başlık Bölümü */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h1 style={{
            fontSize: '48px',
            fontWeight: '800',
            color: textColor,
            marginBottom: '16px',
            letterSpacing: '-1px'
          }}>
            Size Uygun Paketi Seçin
          </h1>
          <p style={{
            fontSize: '18px',
            color: subtextColor,
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            İhtiyaçlarınıza en uygun paketi seçin ve siyasi analizlere tam erişim sağlayın
          </p>

          {/* Aylık/Yıllık Toggle */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '20px',
            marginTop: '40px',
            padding: '8px',
            backgroundColor: cardBg,
            borderRadius: '12px',
            border: `1px solid ${borderColor}`,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
          }}>
            <button
              onClick={() => setBillingCycle('monthly')}
              style={{
                padding: '10px 24px',
                fontSize: '15px',
                fontWeight: '600',
                backgroundColor: billingCycle === 'monthly' ? accentColor : 'transparent',
                color: billingCycle === 'monthly' ? '#ffffff' : subtextColor,
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              Aylık
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              style={{
                padding: '10px 24px',
                fontSize: '15px',
                fontWeight: '600',
                backgroundColor: billingCycle === 'yearly' ? accentColor : 'transparent',
                color: billingCycle === 'yearly' ? '#ffffff' : subtextColor,
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                position: 'relative'
              }}
            >
              Yıllık
              <span style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                backgroundColor: '#10b981',
                color: 'white',
                fontSize: '10px',
                padding: '2px 6px',
                borderRadius: '4px',
                fontWeight: '700'
              }}>
                %17 İndirim
              </span>
            </button>
          </div>
        </div>

        {/* Paket Kartları */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '30px',
          marginBottom: '60px'
        }}>
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              style={{
                backgroundColor: cardBg,
                border: `2px solid ${pkg.popular ? accentColor : borderColor}`,
                borderRadius: '16px',
                padding: '40px 32px',
                position: 'relative',
                transition: 'all 0.3s ease',
                boxShadow: pkg.popular 
                  ? '0 8px 24px rgba(0, 123, 255, 0.15)' 
                  : '0 2px 8px rgba(0, 0, 0, 0.05)',
                transform: pkg.popular ? 'scale(1.05)' : 'scale(1)',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05) translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = pkg.popular ? 'scale(1.05)' : 'scale(1)';
                e.currentTarget.style.boxShadow = pkg.popular 
                  ? '0 8px 24px rgba(0, 123, 255, 0.15)' 
                  : '0 2px 8px rgba(0, 0, 0, 0.05)';
              }}
            >
              {/* Popüler Badge */}
              {pkg.popular && (
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  right: '32px',
                  backgroundColor: accentColor,
                  color: 'white',
                  padding: '6px 16px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '700',
                  letterSpacing: '0.5px'
                }}>
                  EN POPÜLER
                </div>
              )}

              {/* İkon ve İsim */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>{pkg.icon}</div>
                <h3 style={{
                  fontSize: '28px',
                  fontWeight: '700',
                  color: textColor,
                  marginBottom: '8px'
                }}>
                  {pkg.name}
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: subtextColor,
                  marginBottom: '24px'
                }}>
                  {pkg.description}
                </p>
              </div>

              {/* Fiyat */}
              <div style={{ marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                  <span style={{
                    fontSize: '48px',
                    fontWeight: '800',
                    color: textColor,
                    letterSpacing: '-2px'
                  }}>
                    {billingCycle === 'monthly' ? pkg.monthlyPrice : Math.floor(pkg.yearlyPrice / 12)}
                  </span>
                  <span style={{ fontSize: '18px', color: subtextColor, fontWeight: '600' }}>
                    ₺/ay
                  </span>
                </div>
                {billingCycle === 'yearly' && pkg.yearlyPrice > 0 && (
                  <p style={{
                    fontSize: '13px',
                    color: subtextColor,
                    marginTop: '8px'
                  }}>
                    Yıllık {pkg.yearlyPrice.toLocaleString('tr-TR')} ₺ olarak faturalandırılır
                  </p>
                )}
              </div>

              {/* Özellikler */}
              <div style={{ marginBottom: '32px' }}>
                {pkg.features.map((feature, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '12px',
                      fontSize: '15px',
                      color: feature.included ? textColor : subtextColor,
                      opacity: feature.included ? 1 : 0.5
                    }}
                  >
                    {feature.included ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={subtextColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    )}
                    <span>{feature.text}</span>
                  </div>
                ))}
              </div>

              {/* Buton */}
              <button
                onClick={() => handlePackageSelect(pkg)}
                style={{
                  width: '100%',
                  padding: '14px 24px',
                  fontSize: '16px',
                  fontWeight: '600',
                  backgroundColor: pkg.buttonStyle === 'filled' ? accentColor : 'transparent',
                  color: pkg.buttonStyle === 'filled' ? '#ffffff' : accentColor,
                  border: `2px solid ${accentColor}`,
                  borderRadius: '10px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  if (pkg.buttonStyle === 'filled') {
                    e.target.style.backgroundColor = themeName === 'light' ? '#0056b3' : '#3b82f6';
                    e.target.style.transform = 'translateY(-2px)';
                  } else {
                    e.target.style.backgroundColor = accentColor;
                    e.target.style.color = '#ffffff';
                  }
                }}
                onMouseLeave={(e) => {
                  if (pkg.buttonStyle === 'filled') {
                    e.target.style.backgroundColor = accentColor;
                    e.target.style.transform = 'translateY(0)';
                  } else {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = accentColor;
                  }
                }}
              >
                {pkg.buttonText}
              </button>
            </div>
          ))}
        </div>

        {/* SSS Bölümü */}
        <div style={{
          backgroundColor: cardBg,
          padding: '50px 40px',
          borderRadius: '16px',
          border: `1px solid ${borderColor}`,
          marginTop: '60px'
        }}>
          <h2 style={{
            fontSize: '32px',
            fontWeight: '700',
            color: textColor,
            marginBottom: '32px',
            textAlign: 'center'
          }}>
            Sıkça Sorulan Sorular
          </h2>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            {[
              {
                q: 'Paket değişikliği yapabilir miyim?',
                a: 'Evet, istediğiniz zaman paketinizi yükseltebilir veya düşürebilirsiniz. Değişiklik hemen geçerli olur.'
              },
              {
                q: 'Ödeme güvenli mi?',
                a: 'Tüm ödemeler 256-bit SSL şifrelemesi ile korunur ve güvenli ödeme sistemleri kullanılır.'
              },
              {
                q: 'İptal politikanız nedir?',
                a: 'İstediğiniz zaman iptal edebilirsiniz. İptal sonrası mevcut dönem sonuna kadar hizmet devam eder.'
              }
            ].map((faq, index) => (
              <div key={index} style={{ marginBottom: '24px' }}>
                <h4 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: textColor,
                  marginBottom: '8px'
                }}>
                  {faq.q}
                </h4>
                <p style={{
                  fontSize: '15px',
                  color: subtextColor,
                  lineHeight: '1.6'
                }}>
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Packages;
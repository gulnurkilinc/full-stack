import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const TBMM = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('kanunlar');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Detay sayfasına yönlendirme fonksiyonu
  const handleDetailClick = (teklifId) => {
    navigate(`/category/tbmm/kanun-teklifi/${teklifId}`);
  };

  // Örnek veri - Backend bağlandığında buradan gelecek
  const kanunTeklifleri = [
    {
      id: 1,
      title: 'Dijital Hizmet Vergisi Kanunu Teklifi',
      excerpt: 'Dijital platformların Türkiye\'de sağladıkları hizmetlerden elde ettikleri gelirlerin vergilendirilmesine ilişkin kanun teklifi.',
      date: '2026-02-02',
      category: 'Vergi Mevzuatı',
      status: 'Komisyonda',
      image: 'https://via.placeholder.com/400x250'
    },
    {
      id: 2,
      title: 'Çevre Koruma Kanunu Değişiklik Teklifi',
      excerpt: 'Plastik kullanımının azaltılması ve geri dönüşüm oranlarının artırılmasına yönelik düzenlemeler içeren teklif.',
      date: '2026-02-01',
      category: 'Çevre',
      status: 'Genel Kurulda',
      image: 'https://via.placeholder.com/400x250'
    },
    {
      id: 3,
      title: 'İş Kanunu Değişiklik Teklifi',
      excerpt: 'Uzaktan çalışma modellerinin düzenlenmesi ve esnek çalışma saatlerine ilişkin kanun teklifi.',
      date: '2026-01-31',
      category: 'İş Hukuku',
      status: 'Alt Komisyonda',
      image: 'https://via.placeholder.com/400x250'
    }
  ];

  const statistics = [
    { label: 'Toplam Milletvekili', value: '600', icon: '👥' },
    { label: 'Aktif Komisyon', value: '17', icon: '📋' },
    { label: 'Devam Eden Yasa', value: '42', icon: '⚖️' },
    { label: 'Bu Ay Toplantı', value: '28', icon: '📅' }
  ];

  const committees = [
    { name: 'Anayasa Komisyonu', members: 15 },
    { name: 'Adalet Komisyonu', members: 17 },
    { name: 'Dışişleri Komisyonu', members: 15 },
    { name: 'Milli Savunma Komisyonu', members: 13 },
    { name: 'İçişleri Komisyonu', members: 17 },
    { name: 'Sağlık Komisyonu', members: 14 }
  ];

  return (
    <div style={{ 
      background: theme.pageBackground,
      minHeight: '100vh',
      paddingTop: '80px',
      paddingBottom: '80px',
      position: 'relative',
      overflow: 'hidden',
      transition: 'background 0.4s ease'
    }}>
      {/* Subtle Background Elements */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '5%',
        width: '300px',
        height: '300px',
        background: theme.bgBlob1,
        borderRadius: '50%',
        filter: 'blur(60px)',
        animation: 'float 8s ease-in-out infinite',
        zIndex: 0,
        transition: 'background 0.4s ease'
      }}></div>
      
      <div style={{
        position: 'absolute',
        bottom: '15%',
        right: '5%',
        width: '350px',
        height: '350px',
        background: theme.bgBlob2,
        borderRadius: '50%',
        filter: 'blur(60px)',
        animation: 'float 10s ease-in-out infinite reverse',
        zIndex: 0,
        transition: 'background 0.4s ease'
      }}></div>

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Hero Section */}
        <div style={{
          textAlign: 'center',
          marginBottom: '60px',
          padding: '40px 20px'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '20px'
          }}>
            <span style={{ fontSize: '48px' }}>🏛️</span>
          </div>
          <h1 style={{
            fontSize: '56px',
            fontWeight: '700',
            color: theme.headingColor,
            marginBottom: '20px',
            letterSpacing: '-1.5px',
            lineHeight: '1.1',
            transition: 'color 0.4s ease'
          }}>
            Türkiye Büyük Millet Meclisi
          </h1>
          <p style={{
            fontSize: '20px',
            color: theme.textSecondary,
            maxWidth: '700px',
            margin: '0 auto',
            lineHeight: '1.6',
            letterSpacing: '-0.2px',
            transition: 'color 0.4s ease'
          }}>
            TBMM gündem, komisyon çalışmaları ve meclis faaliyetlerini takip edin
          </p>
        </div>

        {/* Statistics Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '24px',
          marginBottom: '60px'
        }}>
          {statistics.map((stat, index) => (
            <div
              key={index}
              style={{
                background: theme.cardBg,
                border: `1px solid ${theme.cardBorder}`,
                borderRadius: '16px',
                padding: '32px 24px',
                textAlign: 'center',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                boxShadow: theme.cardShadow
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = theme.cardShadowHover;
                e.currentTarget.style.borderColor = theme.cardBorderHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = theme.cardShadow;
                e.currentTarget.style.borderColor = theme.cardBorder;
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                {stat.icon}
              </div>
              <div style={{
                fontSize: '42px',
                fontWeight: '700',
                color: theme.headingColor,
                marginBottom: '8px',
                letterSpacing: '-1px',
                transition: 'color 0.4s ease'
              }}>
                {stat.value}
              </div>
              <div style={{
                fontSize: '15px',
                color: theme.textSecondary,
                fontWeight: '500',
                letterSpacing: '-0.2px',
                transition: 'color 0.4s ease'
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          gap: '16px',
          marginBottom: '40px',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          {[
            { id: 'kanunlar', label: 'Kanun Teklifleri', icon: '📜' },
            { id: 'komisyonlar', label: 'Komisyonlar', icon: '📋' },
            { id: 'yasalar', label: 'Kanunlaşan Yasalar', icon: '⚖️' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '14px 28px',
                background: activeTab === tab.id 
                  ? 'linear-gradient(135deg, #1f2937 0%, #111827 45%, #0a0e18 100%)'
                  : theme.cardBg,
                color: activeTab === tab.id ? '#ffffff' : theme.textPrimary,
                border: `1px solid ${activeTab === tab.id ? '#111827' : theme.cardBorder}`,
                borderRadius: '12px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                letterSpacing: '-0.2px',
                boxShadow: activeTab === tab.id 
                  ? '0 4px 18px rgba(17, 24, 39, 0.45)'
                  : theme.cardShadow
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.borderColor = theme.cardBorderHover;
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.borderColor = theme.cardBorder;
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Sections */}
        {activeTab === 'kanunlar' && (
          <div>
            <h2 style={{
              fontSize: '36px',
              fontWeight: '600',
              color: theme.headingColor,
              marginBottom: '40px',
              letterSpacing: '-0.5px',
              transition: 'color 0.4s ease'
            }}>
              Güncel Kanun Teklifleri
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '32px'
            }}>
              {kanunTeklifleri.map((teklif) => (
                <div
                  key={teklif.id}
                  style={{
                    background: theme.cardBg,
                    border: `1px solid ${theme.cardBorder}`,
                    borderRadius: '16px',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    boxShadow: theme.cardShadow
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-6px)';
                    e.currentTarget.style.boxShadow = theme.cardShadowHover;
                    e.currentTarget.style.borderColor = theme.cardBorderHover;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = theme.cardShadow;
                    e.currentTarget.style.borderColor = theme.cardBorder;
                  }}
                >
                  <div style={{
                    width: '100%',
                    height: '200px',
                    overflow: 'hidden',
                    backgroundColor: theme.imgPlaceholderBg,
                    transition: 'background-color 0.4s ease'
                  }}>
                    <img
                      src={teklif.image}
                      alt={teklif.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.4s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'scale(1.08)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'scale(1)';
                      }}
                    />
                  </div>
                  <div style={{ padding: '24px' }}>
                    <div style={{
                      display: 'flex',
                      gap: '12px',
                      marginBottom: '16px',
                      alignItems: 'center',
                      flexWrap: 'wrap'
                    }}>
                      <span style={{
                        display: 'inline-block',
                        background: theme.categoryBg,
                        color: theme.categoryText,
                        padding: '6px 14px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: '600',
                        border: `1px solid ${theme.categoryBorder}`,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        transition: 'all 0.4s ease'
                      }}>
                        {teklif.category}
                      </span>
                      <span style={{
                        display: 'inline-block',
                        background: teklif.status === 'Genel Kurulda' 
                          ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                          : teklif.status === 'Komisyonda'
                            ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                            : 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                        color: '#ffffff',
                        padding: '6px 14px',
                        borderRadius: '8px',
                        fontSize: '11px',
                        fontWeight: '700',
                        letterSpacing: '0.5px',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                        transition: 'all 0.3s ease'
                      }}>
                        {teklif.status}
                      </span>
                      <span style={{
                        fontSize: '13px',
                        color: theme.textMuted,
                        transition: 'color 0.4s ease',
                        marginLeft: 'auto'
                      }}>
                        {new Date(teklif.date).toLocaleDateString('tr-TR')}
                      </span>
                    </div>
                    <h3 style={{
                      fontSize: '20px',
                      fontWeight: '700',
                      color: theme.textPrimary,
                      marginBottom: '12px',
                      lineHeight: '1.3',
                      letterSpacing: '-0.3px',
                      transition: 'color 0.4s ease'
                    }}>
                      {teklif.title}
                    </h3>
                    <p style={{
                      fontSize: '15px',
                      color: theme.textSecondary,
                      lineHeight: '1.6',
                      marginBottom: '20px',
                      letterSpacing: '-0.2px',
                      transition: 'color 0.4s ease'
                    }}>
                      {teklif.excerpt}
                    </p>
                    <button 
                      className="emerald-btn emerald-btn--card"
                      onClick={() => handleDetailClick(teklif.id)}
                    >
                      Detayları Görüntüle
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'komisyonlar' && (
          <div>
            <h2 style={{
              fontSize: '36px',
              fontWeight: '600',
              color: theme.headingColor,
              marginBottom: '40px',
              letterSpacing: '-0.5px',
              transition: 'color 0.4s ease'
            }}>
              TBMM Komisyonları
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '24px'
            }}>
              {committees.map((committee, index) => (
                <div
                  key={index}
                  style={{
                    background: theme.cardBg,
                    border: `1px solid ${theme.cardBorder}`,
                    borderRadius: '16px',
                    padding: '28px 24px',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    boxShadow: theme.cardShadow
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = theme.cardShadowHover;
                    e.currentTarget.style.borderColor = theme.cardBorderHover;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = theme.cardShadow;
                    e.currentTarget.style.borderColor = theme.cardBorder;
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '16px'
                  }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      background: theme.categoryBg,
                      border: `1px solid ${theme.categoryBorder}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px',
                      transition: 'all 0.4s ease'
                    }}>
                      📋
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{
                        fontSize: '17px',
                        fontWeight: '700',
                        color: theme.textPrimary,
                        marginBottom: '4px',
                        letterSpacing: '-0.3px',
                        transition: 'color 0.4s ease'
                      }}>
                        {committee.name}
                      </h3>
                      <p style={{
                        fontSize: '14px',
                        color: theme.textSecondary,
                        margin: 0,
                        transition: 'color 0.4s ease'
                      }}>
                        {committee.members} Üye
                      </p>
                    </div>
                  </div>
                  <button
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: 'transparent',
                      color: theme.textSecondary,
                      border: `1.5px solid ${theme.cardBorder}`,
                      borderRadius: '10px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      letterSpacing: '-0.2px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = theme.categoryBg;
                      e.currentTarget.style.borderColor = theme.cardBorderHover;
                      e.currentTarget.style.color = theme.textPrimary;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.borderColor = theme.cardBorder;
                      e.currentTarget.style.color = theme.textSecondary;
                    }}
                  >
                    Detayları Gör
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'yasalar' && (
          <div>
            <h2 style={{
              fontSize: '36px',
              fontWeight: '600',
              color: theme.headingColor,
              marginBottom: '40px',
              letterSpacing: '-0.5px',
              transition: 'color 0.4s ease'
            }}>
              Kanunlaşan Yasalar
            </h2>
            <div style={{
              background: theme.cardBg,
              border: `1px solid ${theme.cardBorder}`,
              borderRadius: '16px',
              padding: '48px',
              textAlign: 'center',
              boxShadow: theme.cardShadow,
              transition: 'all 0.4s ease'
            }}>
              <div style={{ fontSize: '64px', marginBottom: '24px' }}>⚖️</div>
              <h3 style={{
                fontSize: '24px',
                fontWeight: '600',
                color: theme.headingColor,
                marginBottom: '16px',
                letterSpacing: '-0.3px',
                transition: 'color 0.4s ease'
              }}>
                Kanunlaşma Takip Sistemi
              </h3>
              <p style={{
                fontSize: '16px',
                color: theme.textSecondary,
                maxWidth: '600px',
                margin: '0 auto 32px',
                lineHeight: '1.6',
                letterSpacing: '-0.2px',
                transition: 'color 0.4s ease'
              }}>
                Meclisten geçerek kanunlaşan yasaları ve yürürlük tarihlerini yakında bu bölümden takip edebileceksiniz.
              </p>
              <button className="emerald-btn">
                Yakında
              </button>
            </div>
          </div>
        )}
      </div>

      {/* CSS Animations & Button Styles */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-25px); }
        }

        /* ─── Button Base ─── */
        .emerald-btn {
          display: inline-block;
          background: linear-gradient(135deg, #1f2937 0%, #111827 45%, #0a0e18 100%);
          color: #ffffff;
          font-weight: 600;
          font-size: 16px;
          padding: 16px 42px;
          border: none;
          border-radius: 12px;
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

        /* Shine sweep overlay */
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

        /* Hover */
        .emerald-btn:hover {
          background: linear-gradient(135deg, #374151 0%, #1f2937 45%, #111827 100%);
          color: #ffffff;
          transform: translateY(-2px);
          box-shadow: 
            0 8px 28px rgba(17, 24, 39, 0.55),
            0 2px 6px rgba(0, 0, 0, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.25);
        }

        .emerald-btn:hover::before {
          left: 120%;
        }

        /* Active */
        .emerald-btn:active {
          transform: translateY(0px);
          box-shadow: 
            0 2px 10px rgba(17, 24, 39, 0.4),
            0 1px 2px rgba(0, 0, 0, 0.06),
            inset 0 2px 4px rgba(0, 0, 0, 0.08);
        }

        /* Card variant */
        .emerald-btn--card {
          width: 100%;
          padding: 14px 16px;
          font-size: 15px;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default TBMM;
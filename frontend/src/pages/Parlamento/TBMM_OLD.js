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

  // Modern SVG iconlar ile istatistikler
  const statistics = [
    { 
      label: 'Toplam Milletvekili', 
      value: '600', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      )
    },
    { 
      label: 'Aktif Komisyon', 
      value: '17', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
        </svg>
      )
    },
    { 
      label: 'Devam Eden Yasa', 
      value: '42', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 3v18h18"/>
          <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/>
        </svg>
      )
    },
    { 
      label: 'Bu Ay Toplantı', 
      value: '28', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      )
    }
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
        {/* Hero Section - Daha minimal */}
        <div style={{
          textAlign: 'center',
          marginBottom: '50px',
          padding: '30px 20px'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '56px',
            height: '56px',
            borderRadius: '12px',
            background: theme.categoryBg,
            border: `1px solid ${theme.categoryBorder}`,
            marginBottom: '20px',
            transition: 'all 0.4s ease'
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={theme.textPrimary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </div>
          <h1 style={{
            fontSize: '42px',
            fontWeight: '700',
            color: theme.headingColor,
            marginBottom: '16px',
            letterSpacing: '-1px',
            lineHeight: '1.1',
            transition: 'color 0.4s ease'
          }}>
            Türkiye Büyük Millet Meclisi
          </h1>
          <p style={{
            fontSize: '16px',
            color: theme.textSecondary,
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6',
            letterSpacing: '-0.2px',
            transition: 'color 0.4s ease'
          }}>
            TBMM gündem, komisyon çalışmaları ve meclis faaliyetlerini takip edin
          </p>
        </div>

        {/* Statistics Cards - Küçük ve minimal */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '16px',
          marginBottom: '50px',
          maxWidth: '900px',
          margin: '0 auto 50px'
        }}>
          {statistics.map((stat, index) => (
            <div
              key={index}
              style={{
                background: theme.cardBg,
                border: `1px solid ${theme.cardBorder}`,
                borderRadius: '12px',
                padding: '20px 16px',
                textAlign: 'center',
                transition: 'all 0.25s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.borderColor = theme.cardBorderHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = theme.cardBorder;
              }}
            >
              <div style={{ 
                color: theme.textSecondary,
                marginBottom: '12px',
                display: 'flex',
                justifyContent: 'center',
                opacity: 0.8,
                transition: 'color 0.4s ease'
              }}>
                {stat.icon}
              </div>
              <div style={{
                fontSize: '28px',
                fontWeight: '700',
                color: theme.headingColor,
                marginBottom: '6px',
                letterSpacing: '-0.5px',
                transition: 'color 0.4s ease'
              }}>
                {stat.value}
              </div>
              <div style={{
                fontSize: '12px',
                color: theme.textSecondary,
                fontWeight: '500',
                letterSpacing: '-0.1px',
                transition: 'color 0.4s ease'
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Tab Navigation - Modern SVG iconlar */}
        <div style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '40px',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          {[
            { 
              id: 'kanunlar', 
              label: 'Kanun Teklifleri', 
              icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                </svg>
              )
            },
            { 
              id: 'komisyonlar', 
              label: 'Komisyonlar', 
              icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7"/>
                  <rect x="14" y="3" width="7" height="7"/>
                  <rect x="14" y="14" width="7" height="7"/>
                  <rect x="3" y="14" width="7" height="7"/>
                </svg>
              )
            },
            { 
              id: 'yasalar', 
              label: 'Kanunlaşan Yasalar', 
              icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <path d="M12 18v-6"/>
                  <path d="M9 15l3 3 3-3"/>
                </svg>
              )
            }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '12px 24px',
                background: activeTab === tab.id 
                  ? 'linear-gradient(135deg, #1f2937 0%, #111827 45%, #0a0e18 100%)'
                  : theme.cardBg,
                color: activeTab === tab.id ? '#ffffff' : theme.textPrimary,
                border: `1px solid ${activeTab === tab.id ? '#111827' : theme.cardBorder}`,
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                letterSpacing: '-0.2px',
                boxShadow: activeTab === tab.id 
                  ? '0 4px 12px rgba(17, 24, 39, 0.3)'
                  : 'none'
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
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Sections */}
        {activeTab === 'kanunlar' && (
          <div>
            <h2 style={{
              fontSize: '28px',
              fontWeight: '600',
              color: theme.headingColor,
              marginBottom: '32px',
              letterSpacing: '-0.5px',
              transition: 'color 0.4s ease'
            }}>
              Güncel Kanun Teklifleri
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '24px'
            }}>
              {kanunTeklifleri.map((teklif) => (
                <div
                  key={teklif.id}
                  style={{
                    background: theme.cardBg,
                    border: `1px solid ${theme.cardBorder}`,
                    borderRadius: '12px',
                    overflow: 'hidden',
                    transition: 'all 0.25s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.borderColor = theme.cardBorderHover;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = theme.cardBorder;
                  }}
                >
                  <div style={{
                    width: '100%',
                    height: '180px',
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
                        e.target.style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'scale(1)';
                      }}
                    />
                  </div>
                  <div style={{ padding: '20px' }}>
                    <div style={{
                      display: 'flex',
                      gap: '10px',
                      marginBottom: '14px',
                      alignItems: 'center',
                      flexWrap: 'wrap'
                    }}>
                      <span style={{
                        display: 'inline-block',
                        background: theme.categoryBg,
                        color: theme.categoryText,
                        padding: '5px 12px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: '600',
                        border: `1px solid ${theme.categoryBorder}`,
                        textTransform: 'uppercase',
                        letterSpacing: '0.3px',
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
                        padding: '5px 12px',
                        borderRadius: '6px',
                        fontSize: '10px',
                        fontWeight: '700',
                        letterSpacing: '0.3px',
                        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.12)',
                        transition: 'all 0.3s ease'
                      }}>
                        {teklif.status}
                      </span>
                      <span style={{
                        fontSize: '12px',
                        color: theme.textMuted,
                        transition: 'color 0.4s ease',
                        marginLeft: 'auto'
                      }}>
                        {new Date(teklif.date).toLocaleDateString('tr-TR')}
                      </span>
                    </div>
                    <h3 style={{
                      fontSize: '17px',
                      fontWeight: '600',
                      color: theme.textPrimary,
                      marginBottom: '10px',
                      lineHeight: '1.4',
                      letterSpacing: '-0.3px',
                      transition: 'color 0.4s ease'
                    }}>
                      {teklif.title}
                    </h3>
                    <p style={{
                      fontSize: '14px',
                      color: theme.textSecondary,
                      lineHeight: '1.6',
                      marginBottom: '18px',
                      letterSpacing: '-0.1px',
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
              fontSize: '28px',
              fontWeight: '600',
              color: theme.headingColor,
              marginBottom: '32px',
              letterSpacing: '-0.5px',
              transition: 'color 0.4s ease'
            }}>
              TBMM Komisyonları
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '20px'
            }}>
              {committees.map((committee, index) => (
                <div
                  key={index}
                  style={{
                    background: theme.cardBg,
                    border: `1px solid ${theme.cardBorder}`,
                    borderRadius: '12px',
                    padding: '20px 18px',
                    transition: 'all 0.25s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.borderColor = theme.cardBorderHover;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = theme.cardBorder;
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '14px'
                  }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: theme.categoryBg,
                      border: `1px solid ${theme.categoryBorder}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.4s ease'
                    }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={theme.textPrimary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                      </svg>
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{
                        fontSize: '15px',
                        fontWeight: '600',
                        color: theme.textPrimary,
                        marginBottom: '3px',
                        letterSpacing: '-0.2px',
                        transition: 'color 0.4s ease'
                      }}>
                        {committee.name}
                      </h3>
                      <p style={{
                        fontSize: '13px',
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
                      padding: '9px',
                      background: 'transparent',
                      color: theme.textSecondary,
                      border: `1px solid ${theme.cardBorder}`,
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      letterSpacing: '-0.1px'
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
              fontSize: '28px',
              fontWeight: '600',
              color: theme.headingColor,
              marginBottom: '32px',
              letterSpacing: '-0.5px',
              transition: 'color 0.4s ease'
            }}>
              Kanunlaşan Yasalar
            </h2>
            <div style={{
              background: theme.cardBg,
              border: `1px solid ${theme.cardBorder}`,
              borderRadius: '12px',
              padding: '48px',
              textAlign: 'center',
              transition: 'all 0.4s ease'
            }}>
              <div style={{ 
                marginBottom: '20px',
                color: theme.textSecondary
              }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto' }}>
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <path d="M12 18v-6"/>
                  <path d="M9 15l3 3 3-3"/>
                </svg>
              </div>
              <h3 style={{
                fontSize: '22px',
                fontWeight: '600',
                color: theme.headingColor,
                marginBottom: '12px',
                letterSpacing: '-0.3px',
                transition: 'color 0.4s ease'
              }}>
                Kanunlaşma Takip Sistemi
              </h3>
              <p style={{
                fontSize: '15px',
                color: theme.textSecondary,
                maxWidth: '600px',
                margin: '0 auto 28px',
                lineHeight: '1.6',
                letterSpacing: '-0.1px',
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
          padding: 12px 16px;
          font-size: 14px;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default TBMM;
import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useTheme } from '../../context/ThemeContext';
import CategoryFilter from '../../components/Blog/CategoryFilter';
import Pagination from '../../components/Pagination';

// API Base URL - .env'den al veya default kullan
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

const Blogs = () => {
  const { themeName } = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // URL'den kategoriyi al veya 'all' kullan
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category') || 'all'
  );
  
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [isSearching, setIsSearching] = useState(false);

  // Tema renkleri
  const pageBg = themeName === 'light' ? '#f8f9fa' : themeName === 'dark' ? '#0f172a' : '#000000';
  const heroBg = pageBg; // Hero section arka planı sayfa arka planı ile aynı
  
  const cardBg = themeName === 'light' ? '#ffffff' : themeName === 'dark' ? '#1e293b' : '#1a1a1a';
  const textPrimary = themeName === 'light' ? '#333333' : themeName === 'dark' ? '#f1f5f9' : '#e5e5e5';
  const textSecondary = themeName === 'light' ? '#666666' : themeName === 'dark' ? '#cbd5e0' : '#a3a3a3';
  const textMuted = themeName === 'light' ? '#999999' : themeName === 'dark' ? '#94a3b8' : '#737373';
  const borderColor = themeName === 'light' ? '#eeeeee' : themeName === 'dark' ? '#334155' : '#2a2a2a';
  const inputBorder = themeName === 'light' ? '#e0e0e0' : themeName === 'dark' ? '#334155' : '#2a2a2a';
  const inputBg = themeName === 'light' ? '#ffffff' : themeName === 'dark' ? '#1e293b' : '#1a1a1a';
  const shadowColor = themeName === 'light' ? 'rgba(0,0,0,0.1)' : themeName === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.5)';
  const shadowHoverColor = themeName === 'light' ? 'rgba(0,0,0,0.15)' : themeName === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.7)';
  
  // Buton ve aksiyon renkleri - ThemeContext ile uyumlu
  const accentColor = themeName === 'light' ? '#111827' : themeName === 'dark' ? '#a5b4fc' : '#d4d4d4';
  const accentHover = themeName === 'light' ? '#0a0e18' : themeName === 'dark' ? '#818cf8' : '#e5e5e5';
  
  const infoBg = themeName === 'light' ? '#e7f3ff' : themeName === 'dark' ? '#1e3a5f' : '#1a2332';
  const infoBorder = themeName === 'light' ? '#b3d9ff' : themeName === 'dark' ? '#2563eb' : '#1e40af';
  const infoText = themeName === 'light' ? '#004085' : themeName === 'dark' ? '#bfdbfe' : '#93c5fd';

  // Blogları yükle - 17 analiz per page
  const loadBlogs = async (category = 'all', page = 1, search = '') => {
    try {
      setLoading(true);
      setError(null);

      console.log('📥 Fetching blogs - Category:', category, 'Page:', page, 'Search:', search);

      // Eğer arama varsa search endpoint'ini kullan
      if (search && search.trim() !== '') {
        setIsSearching(true);
        
        const response = await axios.get(`${API_BASE_URL}/api/blogs/search`, {
          params: {
            q: search.trim(),
            page,
            limit: 17 // 17 analiz per page
          }
        });

        console.log('✅ Search Response:', response.data);

        if (response.data && response.data.success) {
          setBlogs(response.data.data || []);
          setPagination(response.data.pagination || {});
        } else {
          setBlogs([]);
          setError('Beklenmeyen veri formatı');
        }
      } else {
        // Normal blog listesi
        setIsSearching(false);
        
        const params = {
          page,
          limit: 17, // 17 analiz per page
          status: 'published'
        };

        if (category !== 'all') {
          params.category = category;
        }

        const response = await axios.get(`${API_BASE_URL}/api/blogs`, { params });

        console.log('✅ Response:', response.data);

        if (response.data && response.data.success) {
          setBlogs(response.data.data || []);
          setPagination(response.data.pagination || {});
        } else {
          setBlogs([]);
          setError('Beklenmeyen veri formatı');
        }
      }

    } catch (err) {
      console.error('❌ Load blogs error:', err);
      
      // Daha detaylı hata mesajı
      if (err.response) {
        setError(`Sunucu hatası: ${err.response.status} - ${err.response.data?.message || 'Bilinmeyen hata'}`);
      } else if (err.request) {
        setError('Sunucuya bağlanılamıyor. Backend çalışıyor mu kontrol edin.');
      } else {
        setError('Analizler yüklenirken hata oluştu');
      }
      
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  // İlk yükleme ve kategori/sayfa/arama değişikliklerinde
  useEffect(() => {
    loadBlogs(selectedCategory, currentPage, searchQuery);
  }, [selectedCategory, currentPage, searchQuery]);
  
  // Kategori değiştiğinde
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Kategori değişince sayfa 1'e dön
    setSearchQuery(''); // Arama sıfırlansın

    // URL'i güncelle (SEO + Back button için)
    if (category === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ category });
    }

    // Sayfayı yukarı kaydır
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Arama fonksiyonu
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Aramada sayfa 1'e dön
    setSelectedCategory('all'); // Kategori filtresi kaldırılsın
    // searchQuery zaten state'de var, useEffect tetiklenecek
  };

  // Arama input değişimi
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Eğer arama boşsa hemen normal listeye dön
    if (value.trim() === '') {
      setCurrentPage(1);
    }
  };

  // Aramayı temizle
  const clearSearch = () => {
    setSearchQuery('');
    setCurrentPage(1);
    setSelectedCategory('all');
  };

  // Sayfa değişimi
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Dinamik stiller
  const styles = {
    pageContainer: {
      minHeight: '100vh',
      backgroundColor: pageBg,
      paddingTop: '70px',
      transition: 'background-color 0.3s ease'
    },
    heroSection: {
      background: heroBg,
      padding: '40px 0 30px 0',
      textAlign: 'center',
      color: textPrimary,
      transition: 'background 0.3s ease'
    },
    heroContent: {
      maxWidth: '800px',
      margin: '0 auto',
      padding: '0 20px'
    },
    heroTitle: {
      fontSize: '36px',
      fontWeight: '700',
      marginBottom: '12px',
      lineHeight: '1.2',
      color: textPrimary,
      transition: 'color 0.3s ease'
    },
    heroSubtitle: {
      fontSize: '16px',
      opacity: '0.85',
      lineHeight: '1.6',
      color: textSecondary,
      transition: 'color 0.3s ease'
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px 20px 40px 20px'
    },
    resultsInfo: {
      marginBottom: '30px',
      padding: '15px 20px',
      backgroundColor: cardBg,
      borderRadius: '8px',
      boxShadow: `0 2px 4px ${shadowColor}`,
      transition: 'all 0.3s ease'
    },
    resultsText: {
      margin: 0,
      fontSize: '14px',
      color: textSecondary,
      fontWeight: '500'
    },
    loadingContainer: {
      textAlign: 'center',
      padding: '80px 20px',
      backgroundColor: cardBg,
      borderRadius: '8px',
      transition: 'background-color 0.3s ease'
    },
    spinner: {
      width: '50px',
      height: '50px',
      border: `4px solid ${borderColor}`,
      borderTop: `4px solid ${accentColor}`,
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      margin: '0 auto 20px'
    },
    loadingText: {
      fontSize: '16px',
      color: textSecondary,
      margin: 0
    },
    errorContainer: {
      textAlign: 'center',
      padding: '60px 20px',
      backgroundColor: cardBg,
      borderRadius: '8px',
      boxShadow: `0 2px 8px ${shadowColor}`,
      transition: 'all 0.3s ease'
    },
    errorIcon: {
      fontSize: '48px',
      marginBottom: '20px'
    },
    errorText: {
      fontSize: '16px',
      color: '#dc3545',
      marginBottom: '20px'
    },
    retryButton: {
      padding: '12px 30px',
      backgroundColor: accentColor,
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      fontSize: '15px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'background-color 0.3s'
    },
    emptyState: {
      textAlign: 'center',
      padding: '80px 20px',
      backgroundColor: cardBg,
      borderRadius: '8px',
      boxShadow: `0 2px 8px ${shadowColor}`,
      transition: 'all 0.3s ease'
    },
    emptyIcon: {
      fontSize: '64px',
      marginBottom: '20px'
    },
    emptyTitle: {
      fontSize: '24px',
      color: textPrimary,
      marginBottom: '10px'
    },
    emptyText: {
      fontSize: '16px',
      color: textSecondary,
      marginBottom: '30px'
    },
    emptyButton: {
      padding: '12px 30px',
      backgroundColor: accentColor,
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      fontSize: '15px',
      fontWeight: '500',
      cursor: 'pointer'
    },
    blogGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
      gap: '30px',
      marginBottom: '40px'
    },
    blogCard: {
      backgroundColor: cardBg,
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: `0 4px 12px ${shadowColor}`,
      transition: 'transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease',
      textDecoration: 'none',
      color: 'inherit',
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    },
    imageContainer: {
      position: 'relative',
      width: '100%',
      height: '220px',
      overflow: 'hidden',
      backgroundColor: themeName === 'light' ? '#f0f0f0' : themeName === 'dark' ? '#2d3748' : '#262626'
    },
    image: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block',
      transition: 'transform 0.3s ease'
    },
    categoryBadge: {
      position: 'absolute',
      top: '15px',
      right: '15px',
      backgroundColor: accentColor,
      color: 'white',
      padding: '6px 14px',
      borderRadius: '6px',
      fontSize: '12px',
      fontWeight: '600',
      boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
    },
    cardContent: {
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      flex: 1
    },
    blogTitle: {
      fontSize: '20px',
      fontWeight: '600',
      marginBottom: '12px',
      color: textPrimary,
      lineHeight: '1.4',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
      transition: 'color 0.3s ease'
    },
    blogExcerpt: {
      fontSize: '14px',
      color: textSecondary,
      lineHeight: '1.6',
      marginBottom: '20px',
      flex: 1,
      display: '-webkit-box',
      WebkitLineClamp: 3,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
      transition: 'color 0.3s ease'
    },
    cardFooter: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      paddingTop: '15px',
      borderTop: `1px solid ${borderColor}`,
      transition: 'border-color 0.3s ease'
    },
    meta: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    },
    author: {
      fontSize: '13px',
      color: textSecondary,
      fontWeight: '500',
      transition: 'color 0.3s ease'
    },
    date: {
      fontSize: '12px',
      color: textMuted,
      transition: 'color 0.3s ease'
    },
    searchSection: {
      marginBottom: '30px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column'
    },
    searchForm: {
      display: 'flex',
      marginBottom: '15px',
      maxWidth: '700px',
      width: '100%'
    },
    searchInputWrapper: {
      position: 'relative',
      flex: 1
    },
    searchInput: {
      width: '100%',
      padding: '16px 110px 16px 24px',
      fontSize: '15px',
      border: `1px solid ${inputBorder}`,
      borderRadius: '50px',
      outline: 'none',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      boxSizing: 'border-box',
      backgroundColor: inputBg,
      color: textPrimary,
      boxShadow: themeName === 'light' 
        ? '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)' 
        : '0 2px 8px rgba(0,0,0,0.2)',
      fontWeight: '400'
    },
    clearButton: {
      position: 'absolute',
      right: '70px',
      top: '50%',
      transform: 'translateY(-50%)',
      backgroundColor: 'transparent',
      border: 'none',
      fontSize: '18px',
      color: textMuted,
      cursor: 'pointer',
      padding: '6px',
      borderRadius: '50%',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '28px',
      height: '28px',
      opacity: '0.6'
    },
    searchButton: {
      position: 'absolute',
      right: '6px',
      top: '50%',
      transform: 'translateY(-50%)',
      padding: '0',
      backgroundColor: 'transparent',
      color: textPrimary,
      border: 'none',
      borderRadius: '50%',
      fontSize: '18px',
      cursor: 'pointer',
      transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '48px',
      height: '48px',
      opacity: '0.7'
    },
    searchInfo: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '15px 20px',
      backgroundColor: infoBg,
      borderRadius: '8px',
      border: `1px solid ${infoBorder}`,
      transition: 'all 0.3s ease',
      maxWidth: '700px',
      width: '100%'
    },
    searchInfoText: {
      margin: 0,
      fontSize: '14px',
      color: infoText
    },
    clearSearchButton: {
      padding: '8px 20px',
      backgroundColor: accentColor,
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      fontSize: '13px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'background-color 0.3s'
    }
  };

  return (
    <div style={styles.pageContainer}>
      {/* Hero Section */}
      <section style={styles.heroSection}>
        <div className="container" style={styles.heroContent}>
          <h1 style={styles.heroTitle}>
            {selectedCategory === 'all' 
              ? 'Tüm Analizler' 
              : `${selectedCategory} Analizleri`
            }
          </h1>
          <p style={styles.heroSubtitle}>
            {selectedCategory === 'all'
              ? 'Derinlemesine araştırmalar, veri analizleri ve uzman görüşleri'
              : `${selectedCategory} kategorisindeki en güncel araştırma ve analizleri keşfedin`
            }
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container" style={styles.container}>
        
        {/* Kategori Filtresi */}
        <CategoryFilter
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />

        {/* ARAMA BÖLÜMÜ - ORTALANMIŞ VE MODERN */}
        <div style={styles.searchSection}>
          <form onSubmit={handleSearch} style={styles.searchForm}>
            <div style={styles.searchInputWrapper}>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch(e);
                  }
                }}
                placeholder="Analiz ara..."
                style={styles.searchInput}
                onFocus={(e) => {
                  e.target.style.borderColor = themeName === 'light' ? '#666666' : '#64748b';
                  e.target.style.boxShadow = themeName === 'light' 
                    ? '0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)' 
                    : '0 4px 16px rgba(0,0,0,0.3)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = inputBorder;
                  e.target.style.boxShadow = themeName === 'light' 
                    ? '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)' 
                    : '0 2px 8px rgba(0,0,0,0.2)';
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  style={styles.clearButton}
                  aria-label="Aramayı temizle"
                  onMouseEnter={(e) => {
                    e.target.style.opacity = '1';
                    e.target.style.backgroundColor = themeName === 'light' ? '#f3f4f6' : '#334155';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.opacity = '0.6';
                    e.target.style.backgroundColor = 'transparent';
                  }}
                >
                  ✕
                </button>
              )}
              <button 
                type="submit" 
                style={styles.searchButton}
                aria-label="Ara"
                onMouseEnter={(e) => {
                  e.target.style.opacity = '1';
                  e.target.style.transform = 'translateY(-50%) scale(1.08)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.opacity = '0.7';
                  e.target.style.transform = 'translateY(-50%) scale(1)';
                }}
              >
                <svg 
                  width="22" 
                  height="22" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
              </button>
            </div>
          </form>
          
          {/* Arama sonucu bilgisi */}
          {isSearching && searchQuery && (
            <div style={styles.searchInfo}>
              <p style={styles.searchInfoText}>
                "<strong>{searchQuery}</strong>" için {pagination.totalBlogs || 0} analiz bulundu
              </p>
              <button 
                onClick={clearSearch} 
                style={styles.clearSearchButton}
                onMouseEnter={(e) => e.target.style.backgroundColor = accentHover}
                onMouseLeave={(e) => e.target.style.backgroundColor = accentColor}
              >
                Aramayı Temizle
              </button>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div style={styles.loadingContainer}>
            <div style={styles.spinner}></div>
            <p style={styles.loadingText}>Analizler yükleniyor...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div style={styles.errorContainer}>
            <div style={styles.errorIcon}>⚠️</div>
            <p style={styles.errorText}>{error}</p>
            <button 
              onClick={() => loadBlogs(selectedCategory, currentPage)}
              style={styles.retryButton}
              onMouseEnter={(e) => e.target.style.backgroundColor = accentHover}
              onMouseLeave={(e) => e.target.style.backgroundColor = accentColor}
            >
              Tekrar Dene
            </button>
          </div>
        )}

        {/* Blog Grid */}
        {!loading && !error && (
          <>
            {blogs.length === 0 ? (
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>📊</div>
                <h3 style={styles.emptyTitle}>
                  {selectedCategory === 'all' 
                    ? 'Henüz analiz yok'
                    : `${selectedCategory} kategorisinde henüz analiz yok`
                  }
                </h3>
                <p style={styles.emptyText}>
                  {selectedCategory !== 'all' && 'Diğer kategorilere göz atabilirsiniz'}
                </p>
                {selectedCategory !== 'all' && (
                  <button
                    onClick={() => handleCategoryChange('all')}
                    style={styles.emptyButton}
                    onMouseEnter={(e) => e.target.style.backgroundColor = accentHover}
                    onMouseLeave={(e) => e.target.style.backgroundColor = accentColor}
                  >
                    Tüm Analizleri Görüntüle
                  </button>
                )}
              </div>
            ) : (
              <>
                {/* Results Info */}
                <div style={styles.resultsInfo}>
                  <p style={styles.resultsText}>
                    {pagination.totalBlogs || blogs.length} analiz bulundu
                    {selectedCategory !== 'all' && ` · ${selectedCategory}`}
                  </p>
                </div>

                {/* Blog Cards */}
                <div style={styles.blogGrid}>
                  {blogs.map((blog) => (
                    <Link
                      key={blog._id}
                      to={`/blog/${blog.slug}`}
                      style={styles.blogCard}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-8px)';
                        e.currentTarget.style.boxShadow = `0 12px 24px ${shadowHoverColor}`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = `0 4px 12px ${shadowColor}`;
                      }}
                    >
                      {/* Image Container */}
                      <div style={styles.imageContainer}>
                        <img
                          src={blog.coverImage?.url || 'https://via.placeholder.com/400x250'}
                          alt={blog.title}
                          style={styles.image}
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/400x250?text=Analiz+Görseli';
                          }}
                        />
                        {/* Category Badge */}
                        <span style={styles.categoryBadge}>
                          {blog.category}
                        </span>
                      </div>

                      {/* Card Content */}
                      <div style={styles.cardContent}>
                        {/* Title */}
                        <h3 style={styles.blogTitle}>{blog.title}</h3>

                        {/* Excerpt */}
                        <p style={styles.blogExcerpt}>
                          {blog.excerpt || 'Analiz özeti bulunamadı...'}
                        </p>

                        {/* Footer */}
                        <div style={styles.cardFooter}>
                          <div style={styles.meta}>
                            {/* Author */}
                            {blog.author?.name && (
                              <span style={styles.author}>
                                👤 {blog.author.name}
                              </span>
                            )}
                            {/* Date */}
                            <span style={styles.date}>
                              📅 {new Date(blog.createdAt).toLocaleDateString('tr-TR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                          <button className="emerald-btn emerald-btn--card" style={{ marginTop: '12px' }}>
                            Analizi İncele
                          </button>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <Pagination
                    currentPage={pagination.currentPage || currentPage}
                    totalPages={pagination.totalPages || 1}
                    totalItems={pagination.totalBlogs || 0}
                    itemsPerPage={17}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            )}
          </>
        )}
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
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

export default Blogs;
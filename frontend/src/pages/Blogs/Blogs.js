import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { blogService } from '../../services/blogService';
import CategoryFilter from '../../components/Blog/CategoryFilter';

const Blogs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // URL'den kategoriyi al veya 'all' kullan
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category') || 'all'
  );
  
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});

  // Blogları yükle
  useEffect(() => {
    const loadBlogs = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('📥 Fetching blogs with category:', selectedCategory);

        const data = await blogService.getBlogs({
          category: selectedCategory,
          page: 1,
          limit: 12
        });

        console.log('✅ Blogs loaded:', data.blogs.length);

        setBlogs(data.blogs || []);
        setPagination(data.pagination || {});
      } catch (err) {
        console.error('❌ Load blogs error:', err);
        setError('Bloglar yüklenirken hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    loadBlogs();
  }, [selectedCategory]);

  // Kategori değiştiğinde
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    
    // URL'i güncelle (SEO + Back button için)
    if (category === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ category });
    }

    // Sayfayı yukarı kaydır
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={styles.pageContainer}>
      {/* Hero Section */}
      <section style={styles.heroSection}>
        <div className="container" style={styles.heroContent}>
          <h1 style={styles.heroTitle}>
            {selectedCategory === 'all' 
              ? 'Tüm Blog Yazıları' 
              : `${selectedCategory} Blog Yazıları`
            }
          </h1>
          <p style={styles.heroSubtitle}>
            {selectedCategory === 'all'
              ? 'Teknoloji, sağlık, bilim ve daha fazlası hakkında güncel içerikler'
              : `${selectedCategory} kategorisindeki en güncel yazıları keşfedin`
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

        {/* Loading State */}
        {loading && (
          <div style={styles.loadingContainer}>
            <div style={styles.spinner}></div>
            <p style={styles.loadingText}>Bloglar yükleniyor...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div style={styles.errorContainer}>
            <div style={styles.errorIcon}>⚠️</div>
            <p style={styles.errorText}>{error}</p>
            <button 
              onClick={() => window.location.reload()}
              style={styles.retryButton}
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
                <div style={styles.emptyIcon}>📝</div>
                <h3 style={styles.emptyTitle}>
                  {selectedCategory === 'all' 
                    ? 'Henüz blog yazısı yok'
                    : `${selectedCategory} kategorisinde henüz blog yazısı yok`
                  }
                </h3>
                <p style={styles.emptyText}>
                  {selectedCategory !== 'all' && 'Diğer kategorilere göz atabilirsiniz'}
                </p>
                {selectedCategory !== 'all' && (
                  <button
                    onClick={() => handleCategoryChange('all')}
                    style={styles.emptyButton}
                  >
                    Tüm Blogları Görüntüle
                  </button>
                )}
              </div>
            ) : (
              <>
                {/* Results Info */}
                <div style={styles.resultsInfo}>
                  <p style={styles.resultsText}>
                    {pagination.total} blog bulundu
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
                        e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.15)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                      }}
                    >
                      {/* Image Container */}
                      <div style={styles.imageContainer}>
                        <img
                          src={blog.coverImage?.url || 'https://via.placeholder.com/400x250'}
                          alt={blog.title}
                          style={styles.image}
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/400x250?text=Blog+Image';
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
                          {blog.excerpt || 'Blog özeti bulunamadı...'}
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
                              📅 {new Date(blog.publishedAt).toLocaleDateString('tr-TR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                          <span style={styles.readMore}>Devamını Oku →</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination Info */}
                {pagination.total > blogs.length && (
                  <div style={styles.paginationInfo}>
                    <p style={styles.paginationText}>
                      {blogs.length} / {pagination.total} blog gösteriliyor
                    </p>
                    {pagination.hasNextPage && (
                      <button style={styles.loadMoreButton}>
                        Daha Fazla Yükle
                      </button>
                    )}
                  </div>
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
      `}</style>
    </div>
  );
};

const styles = {
  pageContainer: {
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
    paddingTop: '80px'
  },
  heroSection: {
    backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)',
    padding: '80px 0',
    textAlign: 'center',
    color: 'white'
  },
  heroContent: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '0 20px'
  },
  heroTitle: {
    fontSize: '48px',
    fontWeight: '700',
    marginBottom: '20px',
    lineHeight: '1.2'
  },
  heroSubtitle: {
    fontSize: '18px',
    opacity: '0.95',
    lineHeight: '1.6'
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 20px'
  },
  resultsInfo: {
    marginBottom: '30px',
    padding: '15px 20px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
  },
  resultsText: {
    margin: 0,
    fontSize: '14px',
    color: '#666',
    fontWeight: '500'
  },
  loadingContainer: {
    textAlign: 'center',
    padding: '80px 20px',
    backgroundColor: 'white',
    borderRadius: '8px'
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #007bff',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 20px'
  },
  loadingText: {
    fontSize: '16px',
    color: '#666',
    margin: 0
  },
  errorContainer: {
    textAlign: 'center',
    padding: '60px 20px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
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
    backgroundColor: '#007bff',
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
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  emptyIcon: {
    fontSize: '64px',
    marginBottom: '20px'
  },
  emptyTitle: {
    fontSize: '24px',
    color: '#333',
    marginBottom: '10px'
  },
  emptyText: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '30px'
  },
  emptyButton: {
    padding: '12px 30px',
    backgroundColor: '#007bff',
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
    backgroundColor: 'white',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
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
    backgroundColor: '#f0f0f0'
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
    backgroundColor: '#007bff',
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
    color: '#333',
    lineHeight: '1.4',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden'
  },
  blogExcerpt: {
    fontSize: '14px',
    color: '#666',
    lineHeight: '1.6',
    marginBottom: '20px',
    flex: 1,
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden'
  },
  cardFooter: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    paddingTop: '15px',
    borderTop: '1px solid #eee'
  },
  meta: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  author: {
    fontSize: '13px',
    color: '#666',
    fontWeight: '500'
  },
  date: {
    fontSize: '12px',
    color: '#999'
  },
  readMore: {
    fontSize: '14px',
    color: '#007bff',
    fontWeight: '600',
    alignSelf: 'flex-end'
  },
  paginationInfo: {
    textAlign: 'center',
    padding: '30px 20px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
  },
  paginationText: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '15px'
  },
  loadMoreButton: {
    padding: '12px 30px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '15px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.3s'
  }
};

export default Blogs;
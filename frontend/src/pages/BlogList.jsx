import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Pagination from '../components/Pagination';

const BlogList = () => {
  const navigate = useNavigate();
  
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBlogs, setTotalBlogs] = useState(0);
  const [limit] = useState(9); // Sayfa başına blog sayısı

  // Filter state
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    'Tümü',
    'Teknoloji',
    'Sağlık',
    'Dünya',
    'Bilim',
    'Ekonomi',
    'Eğitim',
    'Spor',
    'Kültür',
    'Sanat'
  ];

  // Blogları yükle
  const loadBlogs = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page,
        limit,
        status: 'published' // Sadece yayınlanan blogları göster
      };

      if (selectedCategory && selectedCategory !== 'Tümü') {
        params.category = selectedCategory;
      }

      if (searchQuery) {
        params.search = searchQuery;
      }

      const response = await axios.get('http://localhost:4000/api/blogs', { params });

      setBlogs(response.data.data);
      setTotalPages(response.data.pagination.totalPages);
      setTotalBlogs(response.data.pagination.totalBlogs);
      setCurrentPage(response.data.pagination.currentPage);

      // Sayfa değiştiğinde en üste scroll
      window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (err) {
      console.error('❌ Load blogs error:', err);
      setError('Bloglar yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // İlk yükleme
  useEffect(() => {
    loadBlogs(1);
  }, [selectedCategory, searchQuery]);

  // Sayfa değişimi
  const handlePageChange = (page) => {
    loadBlogs(page);
  };

  // Kategori filtresi
  const handleCategoryChange = (category) => {
    setSelectedCategory(category === 'Tümü' ? '' : category);
    setCurrentPage(1);
  };

  // Arama
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    loadBlogs(1);
  };

  // Loading state
  if (loading && blogs.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Bloglar yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>📚 Blog Yazıları</h1>
        <p style={styles.subtitle}>
          En güncel blog yazılarımızı keşfedin
        </p>
      </div>

      {/* Search & Filter */}
      <div style={styles.filterSection}>
        {/* Search */}
        <form onSubmit={handleSearch} style={styles.searchForm}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Blog ara... (başlık, içerik)"
            style={styles.searchInput}
          />
          <button type="submit" style={styles.searchButton}>
            🔍 Ara
          </button>
        </form>

        {/* Categories */}
        <div style={styles.categories}>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              style={{
                ...styles.categoryButton,
                ...(selectedCategory === category || (category === 'Tümü' && !selectedCategory)
                  ? styles.activeCategoryButton
                  : {})
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={styles.errorBox}>
          <span style={styles.errorIcon}>❌</span>
          <p>{error}</p>
        </div>
      )}

      {/* Blog Grid */}
      {blogs.length === 0 && !loading ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>📝</div>
          <h3 style={styles.emptyTitle}>Blog Bulunamadı</h3>
          <p style={styles.emptyText}>
            {searchQuery || selectedCategory
              ? 'Arama kriterlerinize uygun blog bulunamadı.'
              : 'Henüz yayınlanmış blog bulunmuyor.'}
          </p>
          {(searchQuery || selectedCategory) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('');
              }}
              style={styles.resetButton}
            >
              Filtreleri Temizle
            </button>
          )}
        </div>
      ) : (
        <>
          <div style={styles.blogGrid}>
            {blogs.map((blog) => (
              <div
                key={blog._id}
                style={styles.blogCard}
                onClick={() => navigate(`/blog/${blog.slug}`)}
              >
                {/* Cover Image */}
                <div style={styles.imageContainer}>
                  <img
                    src={blog.coverImage?.url || 'https://via.placeholder.com/400x250'}
                    alt={blog.title}
                    style={styles.image}
                  />
                  <div style={styles.categoryBadge}>
                    {blog.category}
                  </div>
                </div>

                {/* Content */}
                <div style={styles.cardContent}>
                  <h3 style={styles.blogTitle}>{blog.title}</h3>
                  
                  <p style={styles.excerpt}>
                    {blog.excerpt || blog.content.substring(0, 120) + '...'}
                  </p>

                  {/* Meta */}
                  <div style={styles.meta}>
                    <div style={styles.author}>
                      <img
                        src={blog.author?.avatar?.url || 'https://ui-avatars.com/api/?name=User'}
                        alt={blog.author?.name}
                        style={styles.avatar}
                      />
                      <span style={styles.authorName}>{blog.author?.name}</span>
                    </div>
                    
                    <div style={styles.metaInfo}>
                      <span style={styles.metaItem}>
                        📅 {new Date(blog.createdAt).toLocaleDateString('tr-TR')}
                      </span>
                      <span style={styles.metaItem}>
                        👁️ {blog.viewCount || 0}
                      </span>
                    </div>
                  </div>

                  {/* Tags */}
                  {blog.tags && blog.tags.length > 0 && (
                    <div style={styles.tags}>
                      {blog.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} style={styles.tag}>
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalBlogs}
            itemsPerPage={limit}
            onPageChange={handlePageChange}
          />
        </>
      )}

      {/* Loading Overlay (sayfa değiştirirken) */}
      {loading && blogs.length > 0 && (
        <div style={styles.loadingOverlay}>
          <div style={styles.spinner}></div>
        </div>
      )}

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
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 20px',
    minHeight: '100vh'
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px'
  },
  title: {
    fontSize: '42px',
    fontWeight: '700',
    margin: '0 0 10px 0',
    color: '#333'
  },
  subtitle: {
    fontSize: '18px',
    color: '#666',
    margin: 0
  },
  filterSection: {
    marginBottom: '40px'
  },
  searchForm: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
    maxWidth: '600px',
    margin: '0 auto 20px'
  },
  searchInput: {
    flex: 1,
    padding: '12px 20px',
    fontSize: '15px',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    outline: 'none',
    transition: 'border-color 0.3s'
  },
  searchButton: {
    padding: '12px 30px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s'
  },
  categories: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  categoryButton: {
    padding: '8px 20px',
    backgroundColor: 'white',
    border: '2px solid #e0e0e0',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.3s',
    color: '#666'
  },
  activeCategoryButton: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
    color: 'white'
  },
  blogGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '30px',
    marginBottom: '20px'
  },
  blogCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    transition: 'transform 0.3s, box-shadow 0.3s',
    display: 'flex',
    flexDirection: 'column'
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: '200px',
    overflow: 'hidden'
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.3s'
  },
  categoryBadge: {
    position: 'absolute',
    top: '15px',
    left: '15px',
    backgroundColor: '#007bff',
    color: 'white',
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600'
  },
  cardContent: {
    padding: '20px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  },
  blogTitle: {
    fontSize: '20px',
    fontWeight: '600',
    margin: '0 0 10px 0',
    color: '#333',
    lineHeight: '1.4'
  },
  excerpt: {
    fontSize: '14px',
    color: '#666',
    lineHeight: '1.6',
    margin: '0 0 15px 0',
    flex: 1
  },
  meta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
    paddingTop: '15px',
    borderTop: '1px solid #f0f0f0'
  },
  author: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  avatar: {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    objectFit: 'cover'
  },
  authorName: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#333'
  },
  metaInfo: {
    display: 'flex',
    gap: '12px'
  },
  metaItem: {
    fontSize: '12px',
    color: '#999'
  },
  tags: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap'
  },
  tag: {
    fontSize: '11px',
    color: '#007bff',
    backgroundColor: '#e7f3ff',
    padding: '4px 8px',
    borderRadius: '4px',
    fontWeight: '500'
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px'
  },
  emptyIcon: {
    fontSize: '64px',
    marginBottom: '20px'
  },
  emptyTitle: {
    fontSize: '24px',
    fontWeight: '600',
    margin: '0 0 10px 0',
    color: '#333'
  },
  emptyText: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '20px'
  },
  resetButton: {
    padding: '12px 30px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  errorBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '20px',
    backgroundColor: '#f8d7da',
    color: '#721c24',
    borderRadius: '8px',
    marginBottom: '30px'
  },
  errorIcon: {
    fontSize: '24px'
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px'
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #007bff',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  loadingText: {
    marginTop: '20px',
    fontSize: '16px',
    color: '#666'
  },
  loadingOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  }
};

export default BlogList;
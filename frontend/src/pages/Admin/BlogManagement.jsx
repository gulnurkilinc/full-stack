import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { blogService } from '../../services/blogService';
import AdminLayout from '../../components/Admin/AdminLayout';

const BlogManagement = () => {
  const navigate = useNavigate();
  
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState({
    status: 'all',
    category: 'all',
    search: ''
  });
useEffect(() => {
  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: 1,
        limit: 50
      };

      if (filter.status !== 'all') {
        params.status = filter.status;
      }

      if (filter.category !== 'all') {
        params.category = filter.category;
      }

      if (filter.search) {
        params.search = filter.search;
      }

      const data = await blogService.getBlogs(params);
      setBlogs(data.blogs || []);
    } catch (err) {
      console.error('Load blogs error:', err);
      setError('Bloglar yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  fetchBlogs();
}, [filter]);

  const loadBlogs = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: 1,
        limit: 50
      };

      if (filter.status !== 'all') {
        params.status = filter.status;
      }

      if (filter.category !== 'all') {
        params.category = filter.category;
      }

      if (filter.search) {
        params.search = filter.search;
      }

      const data = await blogService.getBlogs(params);
      setBlogs(data.blogs || []);
    } catch (err) {
      console.error('Load blogs error:', err);
      setError('Bloglar yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // Blog sil
  const handleDelete = async (id, title) => {
    if (!window.confirm(`"${title}" blog yazısını silmek istediğinizden emin misiniz?`)) {
      return;
    }

    try {
      await blogService.deleteBlog(id);
      alert('Blog başarıyla silindi');
      loadBlogs(); // Listeyi yenile
    } catch (err) {
      alert('Blog silinirken hata oluştu: ' + err.message);
    }
  };

  // Status badge rengi
  const getStatusBadge = (status) => {
    const colors = {
      published: { bg: '#28a745', text: 'white' },
      draft: { bg: '#ffc107', text: '#333' },
      archived: { bg: '#6c757d', text: 'white' }
    };
    return colors[status] || colors.draft;
  };

  return (
    <AdminLayout>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Blog Yönetimi</h1>
            <p style={styles.subtitle}>Tüm blog yazılarınızı buradan yönetin</p>
          </div>
          <Link to="/dashboard/blogs/create">
            <button style={styles.createButton}>
              ➕ Yeni Blog Oluştur
            </button>
          </Link>
        </div>

        {/* Filters */}
        <div style={styles.filters}>
          {/* Search */}
          <input
            type="text"
            placeholder="🔍 Blog ara..."
            value={filter.search}
            onChange={(e) => setFilter({ ...filter, search: e.target.value })}
            style={styles.searchInput}
          />

          {/* Status Filter */}
          <select
            value={filter.status}
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
            style={styles.select}
          >
            <option value="all">Tüm Durumlar</option>
            <option value="published">Yayında</option>
            <option value="draft">Taslak</option>
            <option value="archived">Arşiv</option>
          </select>

          {/* Category Filter */}
          <select
            value={filter.category}
            onChange={(e) => setFilter({ ...filter, category: e.target.value })}
            style={styles.select}
          >
            <option value="all">Tüm Kategoriler</option>
            <option value="Teknoloji">Teknoloji</option>
            <option value="Sağlık">Sağlık</option>
            <option value="Dünya">Dünya</option>
            <option value="Bilim">Bilim</option>
            <option value="Ekonomi">Ekonomi</option>
            <option value="Eğitim">Eğitim</option>
            <option value="Spor">Spor</option>
            <option value="Kültür">Kültür</option>
            <option value="Sanat">Sanat</option>
          </select>
        </div>

        {/* Loading */}
        {loading && (
          <div style={styles.loadingContainer}>
            <div style={styles.spinner}></div>
            <p>Bloglar yükleniyor...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={styles.errorBox}>
            ❌ {error}
          </div>
        )}

        {/* Blog Table */}
        {!loading && !error && (
          <>
            <div style={styles.stats}>
              <span>Toplam {blogs.length} blog bulundu</span>
            </div>

            {blogs.length === 0 ? (
              <div style={styles.emptyState}>
                <p>Henüz blog yazısı yok</p>
                <Link to="/dashboard/blogs/create">
                  <button style={styles.createButton}>
                    İlk Blog'unuzu Oluşturun
                  </button>
                </Link>
              </div>
            ) : (
              <div style={styles.tableContainer}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Kapak</th>
                      <th style={styles.th}>Başlık</th>
                      <th style={styles.th}>Kategori</th>
                      <th style={styles.th}>Durum</th>
                      <th style={styles.th}>Görüntülenme</th>
                      <th style={styles.th}>Tarih</th>
                      <th style={styles.th}>İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {blogs.map((blog) => (
                      <tr key={blog._id} style={styles.tr}>
                        {/* Kapak Görseli */}
                        <td style={styles.td}>
                          <img
                            src={blog.coverImage?.url || 'https://via.placeholder.com/80x50'}
                            alt={blog.title}
                            style={styles.coverImage}
                          />
                        </td>

                        {/* Başlık */}
                        <td style={styles.td}>
                          <div style={styles.titleCell}>
                            <strong>{blog.title}</strong>
                            <small style={{ color: '#666', display: 'block', marginTop: '4px' }}>
                              {blog.slug}
                            </small>
                          </div>
                        </td>

                        {/* Kategori */}
                        <td style={styles.td}>
                          <span style={styles.categoryBadge}>
                            {blog.category}
                          </span>
                        </td>

                        {/* Durum */}
                        <td style={styles.td}>
                          <span style={{
                            ...styles.statusBadge,
                            backgroundColor: getStatusBadge(blog.status).bg,
                            color: getStatusBadge(blog.status).text
                          }}>
                            {blog.status === 'published' && '✅ Yayında'}
                            {blog.status === 'draft' && '📝 Taslak'}
                            {blog.status === 'archived' && '📦 Arşiv'}
                          </span>
                        </td>

                        {/* Görüntülenme */}
                        <td style={styles.td}>
                          <span style={styles.viewCount}>
                            👁️ {blog.viewCount || 0}
                          </span>
                        </td>

                        {/* Tarih */}
                        <td style={styles.td}>
                          {new Date(blog.publishedAt || blog.createdAt).toLocaleDateString('tr-TR')}
                        </td>

                        {/* İşlemler */}
                        <td style={styles.td}>
                          <div style={styles.actions}>
                            {/* Görüntüle */}
                            <Link
                              to={`/blog/${blog.slug}`}
                              target="_blank"
                              style={styles.actionButton}
                              title="Görüntüle"
                            >
                              👁️
                            </Link>

                            {/* Düzenle */}
                            <button
                              onClick={() => navigate(`/dashboard/blogs/edit/${blog._id}`)}
                              style={{ ...styles.actionButton, backgroundColor: '#007bff' }}
                              title="Düzenle"
                            >
                              ✏️
                            </button>

                            {/* Sil */}
                            <button
                              onClick={() => handleDelete(blog._id, blog.title)}
                              style={{ ...styles.actionButton, backgroundColor: '#dc3545' }}
                              title="Sil"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
    </AdminLayout>
  );
};

const styles = {
  container: {
    padding: '40px',
    maxWidth: '1400px',
    margin: '0 auto'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '30px'
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    marginBottom: '5px'
  },
  subtitle: {
    color: '#666',
    fontSize: '16px'
  },
  createButton: {
    padding: '12px 24px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '15px',
    fontWeight: '500',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-block'
  },
  filters: {
    display: 'flex',
    gap: '15px',
    marginBottom: '30px',
    flexWrap: 'wrap'
  },
  searchInput: {
    flex: 1,
    minWidth: '250px',
    padding: '12px 16px',
    fontSize: '15px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    boxSizing: 'border-box'
  },
  select: {
    padding: '12px 16px',
    fontSize: '15px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    backgroundColor: 'white',
    cursor: 'pointer'
  },
  stats: {
    padding: '15px 20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '6px',
    marginBottom: '20px',
    fontSize: '14px',
    color: '#666',
    fontWeight: '500'
  },
  loadingContainer: {
    textAlign: 'center',
    padding: '60px 20px'
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #007bff',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 15px'
  },
  errorBox: {
    padding: '20px',
    backgroundColor: '#f8d7da',
    color: '#721c24',
    borderRadius: '6px',
    border: '1px solid #f5c6cb'
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    backgroundColor: 'white',
    borderRadius: '8px'
  },
  tableContainer: {
    backgroundColor: 'white',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  th: {
    padding: '15px',
    textAlign: 'left',
    backgroundColor: '#f8f9fa',
    fontWeight: '600',
    fontSize: '14px',
    color: '#333',
    borderBottom: '2px solid #dee2e6'
  },
  tr: {
    borderBottom: '1px solid #dee2e6',
    transition: 'background-color 0.2s'
  },
  td: {
    padding: '15px',
    fontSize: '14px',
    verticalAlign: 'middle'
  },
  coverImage: {
    width: '80px',
    height: '50px',
    objectFit: 'cover',
    borderRadius: '4px'
  },
  titleCell: {
    maxWidth: '300px'
  },
  categoryBadge: {
    padding: '4px 12px',
    backgroundColor: '#e9ecef',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '500'
  },
  statusBadge: {
    padding: '4px 12px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '600',
    display: 'inline-block'
  },
  viewCount: {
    fontSize: '13px',
    color: '#666'
  },
  actions: {
    display: 'flex',
    gap: '8px'
  },
  actionButton: {
    padding: '8px 12px',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#6c757d',
    color: 'white',
    cursor: 'pointer',
    fontSize: '14px',
    textDecoration: 'none',
    display: 'inline-block'
  }
};

export default BlogManagement;
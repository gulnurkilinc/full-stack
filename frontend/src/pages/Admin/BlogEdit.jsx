import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { blogService } from '../../services/blogService';
import AdminLayout from '../../components/Admin/AdminLayout';

const BlogEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    category: '',
    tags: '',
    coverImage: '',
    status: 'draft'
  });

  const [originalBlog, setOriginalBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const categories = [
    'Teknoloji', 'Sağlık', 'Dünya', 'Bilim',
    'Ekonomi', 'Eğitim', 'Spor', 'Kültür', 'Sanat'
  ];

  // Blog verilerini yükle
  useEffect(() => {
    loadBlog();
  }, [id]);

  const loadBlog = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('📥 Loading blog with ID:', id);

      const blog = await blogService.getBlogById(id);

      console.log('✅ Blog loaded:', blog);

      setOriginalBlog(blog);

      // Formu doldur
      setFormData({
        title: blog.title || '',
        slug: blog.slug || '',
        content: blog.content || '',
        excerpt: blog.excerpt || '',
        category: blog.category || '',
        tags: blog.tags ? blog.tags.join(', ') : '',
        coverImage: blog.coverImage?.url || '',
        status: blog.status || 'draft'
      });
    } catch (err) {
      console.error('❌ Load blog error:', err);
      setError('Blog yüklenirken hata oluştu: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Slugify fonksiyonu
  const slugify = (text) => {
    if (!text) return '';
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/ı/g, 'i')
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Başlık değiştiğinde slug'ı güncelle
    if (name === 'title') {
      setFormData(prev => ({ ...prev, slug: slugify(value) }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      setError('Başlık gereklidir');
      return;
    }

    if (!formData.content.trim()) {
      setError('İçerik gereklidir');
      return;
    }

    if (!formData.category) {
      setError('Kategori seçimi gereklidir');
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      // Tags'i array'e çevir
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag);

      // Blog verisi
      const blogData = {
        title: formData.title.trim(),
        slug: formData.slug || slugify(formData.title),
        content: formData.content,
        excerpt: formData.excerpt.trim(),
        category: formData.category,
        tags: tagsArray,
        coverImage: formData.coverImage ? {
          url: formData.coverImage
        } : undefined,
        status: formData.status
      };

      console.log('📤 Updating blog ID:', id);
      console.log('📤 Blog data:', blogData);

      const response = await blogService.updateBlog(id, blogData);

      console.log('✅ Blog updated successfully:', response);

      setSuccess(true);

      // 2 saniye sonra blog yönetim sayfasına yönlendir
      setTimeout(() => {
        navigate('/dashboard/blogs');
      }, 2000);

    } catch (err) {
      console.error('❌ Update blog error:', err);
      setError('Blog güncellenirken hata oluştu: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Loading State
  if (loading) {
    return (
      <AdminLayout>
        <div style={styles.centerContainer}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Blog yükleniyor...</p>
        </div>
      </AdminLayout>
    );
  }

  // Error State (Blog bulunamadı)
  if (error && !originalBlog) {
    return (
      <AdminLayout>
        <div style={styles.centerContainer}>
          <div style={styles.errorCard}>
            <div style={styles.errorIcon}>❌</div>
            <h2 style={styles.errorTitle}>Hata</h2>
            <p style={styles.errorMessage}>{error}</p>
            <button
              onClick={() => navigate('/dashboard/blogs')}
              style={styles.backButton}
            >
              ← Blog Listesine Dön
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div style={styles.container}>
        
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>✏️ Blog Düzenle</h1>
            <p style={styles.subtitle}>
              Blog yazınızı güncelleyin
            </p>
          </div>
          <button
            onClick={() => navigate('/dashboard/blogs')}
            style={styles.headerBackButton}
          >
            ← Geri Dön
          </button>
        </div>

        {/* Success Message */}
        {success && (
          <div style={styles.successBox}>
            <span style={styles.successIcon}>✅</span>
            <div>
              <strong>Başarılı!</strong>
              <p style={{ margin: '5px 0 0 0' }}>
                Blog başarıyla güncellendi. Yönlendiriliyorsunuz...
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && originalBlog && (
          <div style={styles.errorBox}>
            <span style={styles.errorBoxIcon}>❌</span>
            <div>
              <strong>Hata!</strong>
              <p style={{ margin: '5px 0 0 0' }}>{error}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={styles.formCard}>
            
            {/* Başlık */}
            <div style={styles.formGroup}>
              <label style={styles.label}>
                Başlık <span style={styles.required}>*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Örn: Yapay Zeka ve Gelecek"
                required
                disabled={saving}
                style={styles.input}
              />
            </div>

            {/* Slug */}
            <div style={styles.formGroup}>
              <label style={styles.label}>URL Slug</label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                placeholder="yapay-zeka-ve-gelecek"
                disabled={saving}
                style={{
                  ...styles.input,
                  backgroundColor: '#f8f9fa',
                  color: '#666'
                }}
                readOnly
              />
              <small style={styles.hint}>
                Başlıktan otomatik oluşturulur (değiştirilebilir)
              </small>
            </div>

            {/* Kategori */}
            <div style={styles.formGroup}>
              <label style={styles.label}>
                Kategori <span style={styles.required}>*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                disabled={saving}
                style={styles.select}
              >
                <option value="">Kategori Seçin</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Özet */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Özet (Kısa Açıklama)</label>
              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                placeholder="Blog yazınızın kısa özeti..."
                rows="3"
                disabled={saving}
                style={styles.textarea}
              />
              <small style={styles.hint}>
                Blog kartlarında ve meta description'da kullanılır
              </small>
            </div>

            {/* İçerik */}
            <div style={styles.formGroup}>
              <label style={styles.label}>
                İçerik <span style={styles.required}>*</span>
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Blog içeriğinizi buraya yazın..."
                required
                rows="15"
                disabled={saving}
                style={styles.textarea}
              />
              <small style={styles.hint}>
                HTML etiketleri kullanabilirsiniz
              </small>
            </div>

            {/* Etiketler */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Etiketler</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="teknoloji, yapay zeka, gelecek"
                disabled={saving}
                style={styles.input}
              />
              <small style={styles.hint}>
                Virgülle ayırarak birden fazla etiket ekleyebilirsiniz
              </small>
            </div>

            {/* Kapak Görseli */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Kapak Görseli URL</label>
              <input
                type="url"
                name="coverImage"
                value={formData.coverImage}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                disabled={saving}
                style={styles.input}
              />
              <small style={styles.hint}>
                Unsplash: https://images.unsplash.com/photo-...
              </small>
              
              {/* Image Preview */}
              {formData.coverImage && (
                <div style={styles.imagePreviewContainer}>
                  <img
                    src={formData.coverImage}
                    alt="Kapak görseli önizleme"
                    style={styles.imagePreview}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            {/* Durum */}
            <div style={styles.formGroup}>
              <label style={styles.label}>
                Durum <span style={styles.required}>*</span>
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                disabled={saving}
                style={styles.select}
              >
                <option value="draft">📝 Taslak (Draft)</option>
                <option value="published">✅ Yayınla (Published)</option>
                <option value="archived">📦 Arşivle (Archived)</option>
              </select>
              <small style={styles.hint}>
                {formData.status === 'draft' && 'Blog taslak olarak kaydedilir, herkese açık olmaz'}
                {formData.status === 'published' && 'Blog yayınlanır ve herkes görebilir'}
                {formData.status === 'archived' && 'Blog arşivlenir, yeni ziyaretçiler göremez'}
              </small>
            </div>

            {/* Action Buttons */}
            <div style={styles.buttonGroup}>
              <button
                type="submit"
                disabled={saving}
                style={{
                  ...styles.submitButton,
                  opacity: saving ? 0.6 : 1,
                  cursor: saving ? 'not-allowed' : 'pointer'
                }}
              >
                {saving ? (
                  <>
                    <span style={styles.buttonSpinner}></span>
                    Kaydediliyor...
                  </>
                ) : (
                  <>💾 Değişiklikleri Kaydet</>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  if (saving) return;
                  if (window.confirm('Kaydedilmemiş değişiklikler kaybolacak. Emin misiniz?')) {
                    navigate('/dashboard/blogs');
                  }
                }}
                disabled={saving}
                style={{
                  ...styles.cancelButton,
                  cursor: saving ? 'not-allowed' : 'pointer'
                }}
              >
                İptal
              </button>
            </div>

            {/* Info Box */}
            <div style={styles.infoBox}>
              <strong>💡 İpucu:</strong> Değişiklikleriniz kaydedilmeden önce tarayıcıyı kapatırsanız, 
              tüm değişiklikler kaybolacaktır.
            </div>
          </div>
        </form>

        {/* Blog Bilgileri */}
        {originalBlog && (
          <div style={styles.metaCard}>
            <h3 style={styles.metaTitle}>📊 Blog Bilgileri</h3>
            <div style={styles.metaGrid}>
              <div style={styles.metaItem}>
                <span style={styles.metaLabel}>Oluşturulma:</span>
                <span style={styles.metaValue}>
                  {new Date(originalBlog.createdAt).toLocaleString('tr-TR')}
                </span>
              </div>
              <div style={styles.metaItem}>
                <span style={styles.metaLabel}>Son Güncelleme:</span>
                <span style={styles.metaValue}>
                  {new Date(originalBlog.updatedAt).toLocaleString('tr-TR')}
                </span>
              </div>
              <div style={styles.metaItem}>
                <span style={styles.metaLabel}>Görüntülenme:</span>
                <span style={styles.metaValue}>
                  👁️ {originalBlog.viewCount || 0}
                </span>
              </div>
              <div style={styles.metaItem}>
                <span style={styles.metaLabel}>Blog ID:</span>
                <span style={{ fontSize: '12px', color: '#999' }}>
                  {originalBlog._id}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes buttonSpin {
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
    maxWidth: '1000px',
    margin: '0 auto',
    minHeight: '100vh'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '30px',
    flexWrap: 'wrap',
    gap: '20px'
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    margin: '0 0 5px 0',
    color: '#333'
  },
  subtitle: {
    color: '#666',
    fontSize: '16px',
    margin: 0
  },
  headerBackButton: {
    padding: '10px 20px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.3s'
  },
  successBox: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '15px',
    padding: '20px',
    backgroundColor: '#d4edda',
    color: '#155724',
    borderRadius: '8px',
    marginBottom: '20px',
    border: '1px solid #c3e6cb'
  },
  successIcon: {
    fontSize: '24px'
  },
  errorBox: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '15px',
    padding: '20px',
    backgroundColor: '#f8d7da',
    color: '#721c24',
    borderRadius: '8px',
    marginBottom: '20px',
    border: '1px solid #f5c6cb'
  },
  errorBoxIcon: {
    fontSize: '24px'
  },
  formCard: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    marginBottom: '20px'
  },
  formGroup: {
    marginBottom: '25px'
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '600',
    fontSize: '14px',
    color: '#333'
  },
  required: {
    color: '#dc3545'
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    fontSize: '15px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    boxSizing: 'border-box',
    transition: 'border-color 0.3s',
    fontFamily: 'inherit'
  },
  select: {
    width: '100%',
    padding: '12px 16px',
    fontSize: '15px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    backgroundColor: 'white',
    boxSizing: 'border-box',
    cursor: 'pointer'
  },
  textarea: {
    width: '100%',
    padding: '12px 16px',
    fontSize: '15px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    boxSizing: 'border-box',
    resize: 'vertical',
    fontFamily: 'inherit',
    lineHeight: '1.6'
  },
  hint: {
    display: 'block',
    marginTop: '6px',
    fontSize: '12px',
    color: '#666',
    fontStyle: 'italic'
  },
  imagePreviewContainer: {
    marginTop: '15px',
    padding: '10px',
    backgroundColor: '#f8f9fa',
    borderRadius: '6px',
    border: '1px solid #dee2e6'
  },
  imagePreview: {
    maxWidth: '100%',
    maxHeight: '300px',
    borderRadius: '6px',
    display: 'block'
  },
  buttonGroup: {
    display: 'flex',
    gap: '15px',
    marginTop: '40px'
  },
  submitButton: {
    flex: 1,
    padding: '16px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px'
  },
  cancelButton: {
    padding: '16px 32px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s'
  },
  buttonSpinner: {
    width: '16px',
    height: '16px',
    border: '2px solid transparent',
    borderTop: '2px solid white',
    borderRadius: '50%',
    animation: 'buttonSpin 0.8s linear infinite',
    display: 'inline-block'
  },
  infoBox: {
    marginTop: '25px',
    padding: '15px',
    backgroundColor: '#e7f3ff',
    borderLeft: '4px solid #007bff',
    borderRadius: '4px',
    fontSize: '14px',
    color: '#004085'
  },
  metaCard: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  metaTitle: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '20px',
    color: '#333'
  },
  metaGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '15px'
  },
  metaItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px'
  },
  metaLabel: {
    fontSize: '12px',
    color: '#666',
    fontWeight: '500'
  },
  metaValue: {
    fontSize: '14px',
    color: '#333',
    fontWeight: '600'
  },
  centerContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '70vh',
    padding: '40px'
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
    textAlign: 'center'
  },
  errorCard: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    textAlign: 'center',
    maxWidth: '500px'
  },
  errorIcon: {
    fontSize: '64px',
    marginBottom: '20px'
  },
  errorTitle: {
    fontSize: '24px',
    fontWeight: '600',
    marginBottom: '10px',
    color: '#333'
  },
  errorMessage: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '30px',
    lineHeight: '1.6'
  },
  backButton: {
    padding: '12px 30px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '15px',
    fontWeight: '500',
    cursor: 'pointer'
  }
};

export default BlogEdit;
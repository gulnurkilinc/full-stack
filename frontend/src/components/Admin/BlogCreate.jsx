import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import api from '../../services/api';
import { slugify } from '../../utils/slugify';
import AdminLayout from '../../components/Admin/AdminLayout';

const BlogCreate = () => {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    category: '',
    tags: '',
    coverImage: '',
    metaTitle: '',
    metaDescription: '',
    status: 'draft'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Kategoriler
  const categories = [
    'Teknoloji', 'Sağlık', 'Dünya', 'Bilim', 
    'Ekonomi', 'Eğitim', 'Spor', 'Kültür', 'Sanat'
  ];

  // React Quill modülleri
  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['blockquote', 'code-block'],
      [{ color: [] }, { background: [] }],
      ['link', 'image'],
      ['clean']
    ]
  };

  // Input değişikliklerini handle et
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Başlık değiştiğinde slug'ı otomatik oluştur
    if (name === 'title' && !formData.slug) {
      setFormData(prev => ({
        ...prev,
        slug: slugify(value)
      }));
    }
  };

  // Rich text editor değişikliği
  const handleContentChange = (value) => {
    setFormData(prev => ({
      ...prev,
      content: value
    }));
  };

  // Form validation
  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Blog başlığı gereklidir');
      return false;
    }
    if (!formData.content.trim() || formData.content === '<p><br></p>') {
      setError('Blog içeriği gereklidir');
      return false;
    }
    if (!formData.category) {
      setError('Kategori seçimi gereklidir');
      return false;
    }
    return true;
  };

  // Form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Tags'i array'e çevir
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag);

      // API'ye gönderilecek data
      const blogData = {
        title: formData.title,
        slug: formData.slug || slugify(formData.title),
        content: formData.content,
        excerpt: formData.excerpt,
        category: formData.category,
        tags: tagsArray,
        coverImage: formData.coverImage ? {
          url: formData.coverImage
        } : undefined,
        metaTitle: formData.metaTitle || formData.title,
        metaDescription: formData.metaDescription || formData.excerpt,
        status: formData.status
      };

      console.log('📤 Sending blog data:', blogData);

      const response = await api.post('/blogs', blogData);

      console.log('✅ Blog created:', response.data);

      setSuccess(true);
      
      // Formu temizle
      setFormData({
        title: '',
        slug: '',
        content: '',
        excerpt: '',
        category: '',
        tags: '',
        coverImage: '',
        metaTitle: '',
        metaDescription: '',
        status: 'draft'
      });

      // 2 saniye sonra blog listesine yönlendir
      setTimeout(() => {
        window.location.href = '/dashboard/blogs';
      }, 2000);

    } catch (err) {
      console.error('❌ Blog create error:', err);
      setError(err.response?.data?.message || 'Blog oluşturulurken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ fontSize: '32px', marginBottom: '10px' }}>Yeni Blog Oluştur</h1>
          <p style={{ color: '#666' }}>Blog yazınızı oluşturun ve yayınlayın</p>
        </div>

        {/* Success Message */}
        {success && (
          <div style={{
            padding: '15px 20px',
            backgroundColor: '#d4edda',
            color: '#155724',
            borderRadius: '5px',
            marginBottom: '20px',
            border: '1px solid #c3e6cb'
          }}>
            ✅ Blog başarıyla oluşturuldu! Yönlendiriliyorsunuz...
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div style={{
            padding: '15px 20px',
            backgroundColor: '#f8d7da',
            color: '#721c24',
            borderRadius: '5px',
            marginBottom: '20px',
            border: '1px solid #f5c6cb'
          }}>
            ❌ {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            
            {/* Başlık */}
            <div style={{ marginBottom: '25px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '500',
                fontSize: '14px'
              }}>
                Blog Başlığı *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Örn: Yapay Zeka ve Gelecek"
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '16px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  boxSizing: 'border-box'
                }}
                required
              />
            </div>

            {/* Slug */}
            <div style={{ marginBottom: '25px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '500',
                fontSize: '14px'
              }}>
                URL Slug
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                placeholder="yapay-zeka-ve-gelecek"
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '16px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  boxSizing: 'border-box'
                }}
              />
              <small style={{ color: '#666', fontSize: '12px' }}>
                Boş bırakılırsa başlıktan otomatik oluşturulur
              </small>
            </div>

            {/* Kategori */}
            <div style={{ marginBottom: '25px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '500',
                fontSize: '14px'
              }}>
                Kategori *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '16px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  boxSizing: 'border-box'
                }}
                required
              >
                <option value="">Kategori Seçin</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Özet */}
            <div style={{ marginBottom: '25px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '500',
                fontSize: '14px'
              }}>
                Özet (Excerpt)
              </label>
              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                placeholder="Blog yazınızın kısa özeti..."
                rows="3"
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '16px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  boxSizing: 'border-box',
                  resize: 'vertical'
                }}
              />
            </div>

            {/* İçerik - React Quill */}
            <div style={{ marginBottom: '25px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '500',
                fontSize: '14px'
              }}>
                Blog İçeriği *
              </label>
              <div style={{ backgroundColor: 'white' }}>
                <ReactQuill
                  theme="snow"
                  value={formData.content}
                  onChange={handleContentChange}
                  modules={quillModules}
                  style={{ height: '400px', marginBottom: '50px' }}
                />
              </div>
            </div>

            {/* Etiketler */}
            <div style={{ marginBottom: '25px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '500',
                fontSize: '14px'
              }}>
                Etiketler
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="yapay zeka, teknoloji, gelecek (virgülle ayırın)"
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '16px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Kapak Görseli */}
            <div style={{ marginBottom: '25px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '500',
                fontSize: '14px'
              }}>
                Kapak Görseli URL
              </label>
              <input
                type="url"
                name="coverImage"
                value={formData.coverImage}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '16px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* SEO - Meta Title */}
            <div style={{ marginBottom: '25px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '500',
                fontSize: '14px'
              }}>
                SEO Meta Title
              </label>
              <input
                type="text"
                name="metaTitle"
                value={formData.metaTitle}
                onChange={handleChange}
                placeholder="SEO için başlık (boş bırakılırsa blog başlığı kullanılır)"
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '16px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* SEO - Meta Description */}
            <div style={{ marginBottom: '25px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '500',
                fontSize: '14px'
              }}>
                SEO Meta Description
              </label>
              <textarea
                name="metaDescription"
                value={formData.metaDescription}
                onChange={handleChange}
                placeholder="SEO için açıklama (boş bırakılırsa özet kullanılır)"
                rows="2"
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '16px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  boxSizing: 'border-box',
                  resize: 'vertical'
                }}
              />
            </div>

            {/* Durum */}
            <div style={{ marginBottom: '30px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '500',
                fontSize: '14px'
              }}>
                Durum
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '16px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  boxSizing: 'border-box'
                }}
              >
                <option value="draft">Taslak</option>
                <option value="published">Yayınla</option>
              </select>
            </div>

            {/* Submit Buttons */}
            <div style={{ display: 'flex', gap: '15px' }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '15px',
                  fontSize: '16px',
                  fontWeight: '500',
                  backgroundColor: loading ? '#6c757d' : '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1
                }}
              >
                {loading ? '⏳ Oluşturuluyor...' : '✅ Blog Oluştur'}
              </button>
              
              <button
                type="button"
                onClick={() => window.location.href = '/dashboard/blogs'}
                style={{
                  padding: '15px 30px',
                  fontSize: '16px',
                  fontWeight: '500',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                İptal
              </button>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default BlogCreate;
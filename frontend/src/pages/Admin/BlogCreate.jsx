import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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

const BlogCreate = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '', // Manuel slug için
    content: '',
    excerpt: '',
    category: '',
    tags: '',
    coverImage: '',
    status: 'draft'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const categories = [
    'Teknoloji', 'Sağlık', 'Dünya', 'Bilim', 
    'Ekonomi', 'Eğitim', 'Spor', 'Kültür', 'Sanat'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Başlık değiştiğinde slug'ı otomatik oluştur
    if (name === 'title') {
      setFormData(prev => ({
        ...prev,
        slug: slugify(value)
      }));
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

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
        return;
      }

      // Tags'i array'e çevir
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag);

      // Blog verisi
      const blogData = {
        title: formData.title.trim(),
        slug: formData.slug || slugify(formData.title), // Slug oluştur
        content: formData.content,
        excerpt: formData.excerpt.trim(),
        category: formData.category,
        tags: tagsArray,
        coverImage: formData.coverImage ? {
          url: formData.coverImage
        } : undefined,
        status: formData.status
      };

      console.log('📤 Sending blog data:', blogData);

      const response = await axios.post(
        'http://localhost:4000/api/blogs',
        blogData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('✅ Blog created successfully:', response.data);

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
        status: 'draft'
      });

      // 2 saniye sonra ana sayfaya yönlendir
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);

    } catch (err) {
      console.error('❌ Blog create error:', err);
      console.error('Error response:', err.response?.data);
      
      if (err.response?.status === 401) {
        setError('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else if (err.response?.data?.message?.includes('duplicate key')) {
        setError('Bu başlıkta bir blog zaten mevcut. Lütfen farklı bir başlık kullanın.');
      } else {
        setError(err.response?.data?.message || 'Blog oluşturulurken hata oluştu');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      padding: '100px 40px 40px', 
      maxWidth: '800px', 
      margin: '0 auto',
      minHeight: '100vh'
    }}>
      <h1 style={{ marginBottom: '10px' }}>✍️ Yeni Blog Oluştur</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        Blog yazınızı oluşturun ve yayınlayın
      </p>

      {success && (
        <div style={{
          padding: '15px 20px',
          backgroundColor: '#d4edda',
          color: '#155724',
          borderRadius: '5px',
          marginBottom: '20px',
          border: '1px solid #c3e6cb'
        }}>
          ✅ Blog başarıyla oluşturuldu! Ana sayfaya yönlendiriliyorsunuz...
        </div>
      )}

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

      <form onSubmit={handleSubmit}>
        <div style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          
          {/* Başlık */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '5px',
              fontWeight: '500'
            }}>
              Başlık *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Örn: Yapay Zeka ve Gelecek"
              required
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

          {/* Slug (otomatik oluşur) */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '5px',
              fontWeight: '500'
            }}>
              URL Slug (otomatik oluşturulur)
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
                fontSize: '14px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                boxSizing: 'border-box',
                backgroundColor: '#f8f9fa',
                color: '#666'
              }}
              readOnly
            />
            <small style={{ color: '#666', fontSize: '12px' }}>
              Başlıktan otomatik oluşturulur
            </small>
          </div>

          {/* Kategori */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '5px',
              fontWeight: '500'
            }}>
              Kategori *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '16px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                boxSizing: 'border-box'
              }}
            >
              <option value="">Kategori Seçin</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Özet */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '5px',
              fontWeight: '500'
            }}>
              Özet (Kısa Açıklama)
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

          {/* İçerik */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '5px',
              fontWeight: '500'
            }}>
              İçerik *
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              placeholder="Blog içeriğinizi buraya yazın..."
              rows="12"
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '16px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                boxSizing: 'border-box',
                resize: 'vertical',
                fontFamily: 'inherit'
              }}
            />
          </div>

          {/* Etiketler */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '5px',
              fontWeight: '500'
            }}>
              Etiketler (virgülle ayırın)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="teknoloji, yapay zeka, gelecek"
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
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '5px',
              fontWeight: '500'
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
            <small style={{ color: '#666', fontSize: '12px' }}>
              Unsplash'tan görsel: https://images.unsplash.com/photo-...
            </small>
          </div>

          {/* Durum */}
          <div style={{ marginBottom: '30px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '5px',
              fontWeight: '500'
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
              <option value="draft">📝 Taslak</option>
              <option value="published">✅ Yayınla</option>
            </select>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                padding: '15px',
                fontSize: '16px',
                fontWeight: '500',
                backgroundColor: loading ? '#ccc' : '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? '⏳ Oluşturuluyor...' : '✅ Blog Oluştur'}
            </button>
            
            <button
              type="button"
              onClick={() => navigate('/')}
              disabled={loading}
              style={{
                padding: '15px 30px',
                fontSize: '16px',
                fontWeight: '500',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              İptal
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default BlogCreate;
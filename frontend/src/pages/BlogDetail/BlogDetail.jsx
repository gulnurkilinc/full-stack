import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBlogBySlug, clearCurrentBlog } from '../../redux/blogSlice';

const BlogDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentBlog: blog, loading, error } = useSelector((state) => state.blogs);

  useEffect(() => {
    dispatch(fetchBlogBySlug(slug));
    return () => {
      dispatch(clearCurrentBlog());
    };
  }, [slug, dispatch]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  // LOADING
  if (loading) {
    return (
      <div style={{ padding: '100px 20px', textAlign: 'center' }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #007bff',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 20px'
        }}></div>
        <h2>Yükleniyor...</h2>
      </div>
    );
  }

  // ERROR
  if (error || !blog) {
    return (
      <div style={{ padding: '100px 20px', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>😕</h1>
        <h2 style={{ marginBottom: '15px' }}>Blog Bulunamadı</h2>
        <p style={{ color: '#666', marginBottom: '30px' }}>
          {typeof error === 'string' ? error : error?.message || 'Aradığınız blog bulunamadı.'}
        </p>
        <button 
          onClick={() => navigate('/')}
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            padding: '12px 30px',
            fontSize: '16px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Ana Sayfaya Dön
        </button>
      </div>
    );
  }

  // Güvenli değer çıkarma fonksiyonları
  const getAuthorName = () => {
    if (!blog.author) return 'Anonim';
    if (typeof blog.author === 'string') return 'Anonim';
    if (typeof blog.author === 'object' && blog.author.name) return blog.author.name;
    return 'Anonim';
  };

  const getPublishDate = () => {
    if (!blog.publishedAt) return 'Tarih belirtilmemiş';
    try {
      return new Date(blog.publishedAt).toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'Tarih belirtilmemiş';
    }
  };

  const readingTime = blog.content 
    ? Math.ceil(blog.content.split(/\s+/).length / 200) 
    : 0;

  // SUCCESS - RENDER
  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh', backgroundColor: '#f9f9f9' }}>
      {/* Hero Section */}
      {blog.coverImage?.url && (
        <div style={{ position: 'relative', width: '100%', height: '500px', overflow: 'hidden' }}>
          <img 
            src={blog.coverImage.url} 
            alt={blog.title || 'Blog'}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/1200x500?text=Blog+Image';
            }}
          />
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)'
          }}>
            <div style={{
              position: 'absolute',
              bottom: '40px',
              left: 0,
              right: 0,
              maxWidth: '1200px',
              margin: '0 auto',
              padding: '0 20px'
            }}>
              <h1 style={{
                fontSize: '48px',
                fontWeight: '700',
                color: 'white',
                lineHeight: '1.2',
                marginBottom: '0',
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
              }}>
                {blog.title || 'Başlık Yok'}
              </h1>
            </div>
          </div>
        </div>
      )}

      {/* Content Container */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '60px 20px', backgroundColor: 'white' }}>
        
        {/* Başlık (Hero yoksa) */}
        {!blog.coverImage?.url && (
          <h1 style={{ fontSize: '42px', fontWeight: '700', marginBottom: '30px', lineHeight: '1.3' }}>
            {blog.title || 'Başlık Yok'}
          </h1>
        )}

        {/* Meta Bilgiler */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '20px',
          marginBottom: '30px',
          paddingBottom: '20px',
          borderBottom: '1px solid #e0e0e0',
          fontSize: '14px',
          color: '#666'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>👤</span>
            <span>{getAuthorName()}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>📅</span>
            <span>{getPublishDate()}</span>
          </div>
          {readingTime > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>⏱️</span>
              <span>{readingTime} dk okuma</span>
            </div>
          )}
          {blog.category && (
            <span style={{
              backgroundColor: '#007bff',
              color: 'white',
              padding: '4px 12px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: '500'
            }}>
              {blog.category}
            </span>
          )}
        </div>

        {/* Etiketler */}
        {blog.tags && Array.isArray(blog.tags) && blog.tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '30px' }}>
            {blog.tags.map((tag, index) => (
              <span
                key={index}
                style={{
                  backgroundColor: '#f0f0f0',
                  color: '#555',
                  padding: '6px 12px',
                  borderRadius: '4px',
                  fontSize: '13px'
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Excerpt */}
        {blog.excerpt && (
          <div style={{ 
            fontSize: '20px', 
            fontStyle: 'italic', 
            color: '#555',
            borderLeft: '4px solid #007bff',
            paddingLeft: '20px',
            marginBottom: '40px',
            lineHeight: '1.6'
          }}>
            {blog.excerpt}
          </div>
        )}

        {/* İçerik */}
        {blog.content && (
          <div 
            style={{ 
              fontSize: '18px', 
              lineHeight: '1.8',
              color: '#333'
            }}
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        )}

        {/* Geri Butonu */}
        <div style={{ marginTop: '60px', paddingTop: '40px', borderTop: '2px solid #e0e0e0' }}>
          <button 
            onClick={() => navigate(-1)}
            style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#007bff',
              backgroundColor: 'transparent',
              border: 'none',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              padding: '0'
            }}
          >
            <span style={{ fontSize: '20px' }}>←</span>
            Geri Dön
          </button>
        </div>
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

export default BlogDetail;
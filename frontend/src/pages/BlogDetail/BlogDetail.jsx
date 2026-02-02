import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBlogBySlug, clearCurrentBlog } from '../../redux/blogSlice';
import { useTheme } from '../../context/ThemeContext';

const BlogDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { theme } = useTheme();

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
      <div style={{ 
        padding: '100px 20px', 
        textAlign: 'center',
        minHeight: '100vh',
        background: theme.pageBackground,
        transition: 'background 0.4s ease'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: `4px solid ${theme.loaderBorder}`,
          borderTop: `4px solid ${theme.loaderTop}`,
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 20px',
          transition: 'border-color 0.4s ease'
        }}></div>
        <h2 style={{ 
          color: theme.textPrimary,
          transition: 'color 0.4s ease'
        }}>
          Yükleniyor...
        </h2>
      </div>
    );
  }

  // ERROR
  if (error || !blog) {
    return (
      <div style={{ 
        padding: '100px 20px', 
        textAlign: 'center', 
        maxWidth: '600px', 
        margin: '0 auto',
        minHeight: '100vh',
        background: theme.pageBackground,
        transition: 'background 0.4s ease'
      }}>
        <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>😕</h1>
        <h2 style={{ 
          marginBottom: '15px',
          color: theme.headingColor,
          transition: 'color 0.4s ease'
        }}>
          Blog Bulunamadı
        </h2>
        <p style={{ 
          color: theme.textSecondary, 
          marginBottom: '30px',
          transition: 'color 0.4s ease'
        }}>
          {typeof error === 'string' ? error : error?.message || 'Aradığınız blog bulunamadı.'}
        </p>
        <button 
          onClick={() => navigate('/')}
          className="emerald-btn"
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
    <div style={{ 
      paddingTop: '80px', 
      minHeight: '100vh', 
      background: theme.pageBackground,
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

      {/* Hero Section */}
      {blog.coverImage?.url && (
        <div style={{ 
          position: 'relative', 
          width: '100%', 
          height: '500px', 
          overflow: 'hidden',
          zIndex: 1
        }}>
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
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                letterSpacing: '-0.5px'
              }}>
                {blog.title || 'Başlık Yok'}
              </h1>
            </div>
          </div>
        </div>
      )}

      {/* Content Container */}
      <div style={{ 
        maxWidth: '900px', 
        margin: '0 auto', 
        padding: '60px 20px',
        backgroundColor: theme.cardBg,
        borderRadius: '16px',
        marginTop: blog.coverImage?.url ? '40px' : '40px',
        marginBottom: '40px',
        boxShadow: theme.cardShadow,
        border: `1px solid ${theme.cardBorder}`,
        position: 'relative',
        zIndex: 1,
        transition: 'all 0.4s ease'
      }}>
        
        {/* Başlık (Hero yoksa) */}
        {!blog.coverImage?.url && (
          <h1 style={{ 
            fontSize: '42px', 
            fontWeight: '700', 
            marginBottom: '30px', 
            lineHeight: '1.3',
            color: theme.headingColor,
            letterSpacing: '-0.5px',
            transition: 'color 0.4s ease'
          }}>
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
          borderBottom: `1px solid ${theme.cardBorder}`,
          fontSize: '14px',
          color: theme.textSecondary,
          transition: 'all 0.4s ease'
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
              backgroundColor: theme.categoryBg,
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
                  backgroundColor: theme.categoryBg,
                  color: theme.categoryText,
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  border: `1px solid ${theme.categoryBorder}`,
                  transition: 'all 0.4s ease'
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
            color: theme.textSecondary,
            borderLeft: `4px solid ${theme.cardBorderHover}`,
            paddingLeft: '20px',
            marginBottom: '40px',
            lineHeight: '1.6',
            transition: 'all 0.4s ease'
          }}>
            {blog.excerpt}
          </div>
        )}

        {/* İçerik */}
        {blog.content && (
          <div 
            className="blog-content"
            style={{ 
              fontSize: '18px', 
              lineHeight: '1.8',
              color: theme.textPrimary,
              transition: 'color 0.4s ease'
            }}
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        )}

        {/* Geri Butonu */}
        <div style={{ 
          marginTop: '60px', 
          paddingTop: '40px', 
          borderTop: `2px solid ${theme.cardBorder}`,
          transition: 'border-color 0.4s ease'
        }}>
          <button 
            onClick={() => navigate(-1)}
            className="back-btn"
            style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: theme.textSecondary,
              backgroundColor: 'transparent',
              border: 'none',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              padding: '0',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.color = theme.textPrimary;
            }}
            onMouseLeave={(e) => {
              e.target.style.color = theme.textSecondary;
            }}
          >
            <span style={{ fontSize: '20px' }}>←</span>
            Geri Dön
          </button>
        </div>
      </div>

      {/* CSS Animations & Styles */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-25px); }
        }

        /* Blog Content Styling */
        .blog-content h1,
        .blog-content h2,
        .blog-content h3,
        .blog-content h4,
        .blog-content h5,
        .blog-content h6 {
          color: ${theme.headingColor};
          margin-top: 32px;
          margin-bottom: 16px;
          font-weight: 600;
          line-height: 1.3;
          letter-spacing: -0.3px;
          transition: color 0.4s ease;
        }

        .blog-content h2 {
          font-size: 32px;
          margin-top: 48px;
        }

        .blog-content h3 {
          font-size: 26px;
          margin-top: 40px;
        }

        .blog-content p {
          margin-bottom: 20px;
          color: ${theme.textPrimary};
          transition: color 0.4s ease;
        }

        .blog-content a {
          color: ${theme.textSecondary};
          text-decoration: underline;
          transition: all 0.3s ease;
        }

        .blog-content a:hover {
          color: ${theme.textPrimary};
        }

        .blog-content ul,
        .blog-content ol {
          margin-bottom: 20px;
          padding-left: 30px;
          color: ${theme.textPrimary};
          transition: color 0.4s ease;
        }

        .blog-content li {
          margin-bottom: 10px;
          line-height: 1.7;
        }

        .blog-content blockquote {
          border-left: 4px solid ${theme.cardBorderHover};
          padding-left: 20px;
          margin: 30px 0;
          font-style: italic;
          color: ${theme.textSecondary};
          transition: all 0.4s ease;
        }

        .blog-content code {
          background-color: ${theme.categoryBg};
          color: ${theme.categoryText};
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.9em;
          font-family: 'Courier New', monospace;
          transition: all 0.4s ease;
        }

        .blog-content pre {
          background-color: ${theme.categoryBg};
          padding: 20px;
          border-radius: 8px;
          overflow-x: auto;
          margin: 24px 0;
          border: 1px solid ${theme.categoryBorder};
          transition: all 0.4s ease;
        }

        .blog-content pre code {
          background: none;
          padding: 0;
        }

        .blog-content img {
          max-width: 100%;
          height: auto;
          border-radius: 12px;
          margin: 30px 0;
          box-shadow: ${theme.cardShadow};
          transition: box-shadow 0.4s ease;
        }

        .blog-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 30px 0;
          border: 1px solid ${theme.cardBorder};
          transition: border-color 0.4s ease;
        }

        .blog-content th,
        .blog-content td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid ${theme.cardBorder};
          color: ${theme.textPrimary};
          transition: all 0.4s ease;
        }

        .blog-content th {
          background-color: ${theme.categoryBg};
          font-weight: 600;
        }

        /* Button Base */
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

        .emerald-btn:active {
          transform: translateY(0px);
          box-shadow: 
            0 2px 10px rgba(17, 24, 39, 0.4),
            0 1px 2px rgba(0, 0, 0, 0.06),
            inset 0 2px 4px rgba(0, 0, 0, 0.08);
        }

        /* Back Button Hover */
        .back-btn:hover span {
          transform: translateX(-4px);
          display: inline-block;
        }
      `}</style>
    </div>
  );
};

export default BlogDetail;
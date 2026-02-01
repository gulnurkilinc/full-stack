import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBlogs, fetchFeaturedBlogs } from '../../redux/blogSlice';
import Pagination from '../../components/Pagination';
import { useTheme } from '../../context/ThemeContext';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch();
  const { theme } = useTheme();

  const { blogs, featuredBlogs, pagination, loading } = useSelector((state) => state.blogs);

  useEffect(() => {
    dispatch(fetchFeaturedBlogs());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchBlogs({ 
      page: currentPage, 
      limit: 15,
      status: 'published'
    }));
  }, [dispatch, currentPage]);

  const sliderNews = featuredBlogs.length > 0 ? featuredBlogs : [];

  useEffect(() => {
    if (sliderNews.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % sliderNews.length);
      }, 20000);
      return () => clearInterval(interval);
    }
  }, [sliderNews.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliderNews.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + sliderNews.length) % sliderNews.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ 
      background: theme.pageBackground,
      minHeight: '100vh',
      paddingBottom: '0',
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

      {/* Hero Slider */}
      {sliderNews.length > 0 && (
        <section style={{ 
          position: 'relative', 
          width: '100%', 
          height: '100vh',
          minHeight: '100vh',
          overflow: 'hidden',
          zIndex: 1
        }}>
          <div style={{
            position: 'relative',
            width: '100%',
            height: '100vh'
          }}>
            {sliderNews.map((news, index) => (
              <div
                key={news._id}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100vh',
                  opacity: index === currentSlide ? 1 : 0,
                  transition: 'opacity 1.2s ease-in-out',
                  backgroundImage: `url(${news.coverImage?.url})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.3) 50%, transparent 100%)'
                }}></div>

                <div className="container" style={{
                  position: 'relative',
                  height: '100vh',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  paddingBottom: '100px',
                  color: 'white'
                }}>
                  <div style={{ maxWidth: '800px' }}>
                    <h1 style={{
                      fontSize: '56px',
                      fontWeight: '800',
                      marginBottom: '24px',
                      lineHeight: '1.1',
                      textShadow: '0 2px 20px rgba(0, 0, 0, 0.4)',
                      letterSpacing: '-1.5px',
                      fontFamily: 'system-ui, -apple-system, sans-serif'
                    }}>
                      {news.title}
                    </h1>
                    <p style={{
                      fontSize: '20px',
                      lineHeight: '1.6',
                      marginBottom: '36px',
                      color: 'rgba(255, 255, 255, 0.95)',
                      textShadow: '0 1px 10px rgba(0, 0, 0, 0.3)',
                      letterSpacing: '-0.2px'
                    }}>
                      {news.excerpt}
                    </p>
                    <Link to={`/blog/${news.slug}`}>
                      <button className="emerald-btn">
                        Devamını Oku
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {sliderNews.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                style={{
                  position: 'absolute',
                  left: '30px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  color: 'white',
                  border: '1.5px solid rgba(255, 255, 255, 0.3)',
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  fontSize: '28px',
                  zIndex: 10,
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(12px)',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '300'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.25)';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                  e.target.style.transform = 'translateY(-50%) scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                  e.target.style.transform = 'translateY(-50%) scale(1)';
                }}
              >
                ‹
              </button>
              <button
                onClick={nextSlide}
                style={{
                  position: 'absolute',
                  right: '30px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  color: 'white',
                  border: '1.5px solid rgba(255, 255, 255, 0.3)',
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  fontSize: '28px',
                  zIndex: 10,
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(12px)',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '300'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.25)';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                  e.target.style.transform = 'translateY(-50%) scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                  e.target.style.transform = 'translateY(-50%) scale(1)';
                }}
              >
                ›
              </button>

              <div style={{
                position: 'absolute',
                bottom: '40px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: '12px',
                zIndex: 10
              }}>
                {sliderNews.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    style={{
                      width: index === currentSlide ? '36px' : '12px',
                      height: '12px',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: index === currentSlide ? 'white' : 'rgba(255, 255, 255, 0.4)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: index === currentSlide ? '0 2px 12px rgba(255, 255, 255, 0.6)' : 'none'
                    }}
                  />
                ))}
              </div>
            </>
          )}
        </section>
      )}

      {/* Blog Posts Section */}
      <div className="container" style={{ marginTop: '80px', marginBottom: '0', paddingBottom: '80px', position: 'relative', zIndex: 1 }}>
        <section>
          <link 
            href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" 
            rel="stylesheet" 
          />

          <h2 style={{ 
            marginBottom: '60px', 
            fontSize: '48px',
            color: theme.headingColor,
            textAlign: 'center',
            fontWeight: '600',
            letterSpacing: '-0.5px',
            fontFamily: "'Inter', sans-serif",
            position: 'relative',
            transition: 'color 0.4s ease'
          }}>
            <span style={{
              position: 'relative',
              display: 'inline-block',
              paddingBottom: '22px'
            }}>
              Son Analizler
              <span style={{
                position: 'absolute',
                bottom: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '56px',
                height: '3px',
                background: theme.accentGradient,
                borderRadius: '2px',
                transition: 'background 0.4s ease'
              }}></span>
            </span>
          </h2>
          
          {/* Loading State */}
          {loading && (
            <div style={{ 
              textAlign: 'center', 
              padding: '60px 20px' 
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
              <p style={{ 
                color: theme.textSecondary,
                fontSize: '16px',
                letterSpacing: '-0.2px',
                transition: 'color 0.4s ease'
              }}>
                Bloglar yükleniyor...
              </p>
            </div>
          )}

          {/* Blog Grid */}
          {!loading && blogs.length === 0 ? (
            <p style={{ 
              textAlign: 'center',
              color: theme.textMuted,
              fontSize: '18px',
              letterSpacing: '-0.2px',
              transition: 'color 0.4s ease'
            }}>
              Henüz blog yazısı yok.
            </p>
          ) : !loading && (
            <>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '32px'
              }}>
                {blogs.map(post => (
                  <div key={post._id} className="card" style={{ 
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    backgroundColor: theme.cardBg,
                    border: `1px solid ${theme.cardBorder}`,
                    borderRadius: '16px',
                    boxShadow: theme.cardShadow
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-6px)';
                    e.currentTarget.style.boxShadow = theme.cardShadowHover;
                    e.currentTarget.style.borderColor = theme.cardBorderHover;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = theme.cardShadow;
                    e.currentTarget.style.borderColor = theme.cardBorder;
                  }}
                  >
                    <div style={{ 
                      width: '100%', 
                      height: '220px', 
                      overflow: 'hidden',
                      backgroundColor: theme.imgPlaceholderBg,
                      position: 'relative',
                      transition: 'background-color 0.4s ease'
                    }}>
                      <img 
                        src={post.coverImage?.url || 'https://via.placeholder.com/400x250'} 
                        alt={post.title}
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'cover',
                          display: 'block',
                          transition: 'transform 0.4s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = 'scale(1.08)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = 'scale(1)';
                        }}
                      />
                    </div>

                    <div style={{ padding: '24px' }}>
                      <span style={{
                        display: 'inline-block',
                        background: theme.categoryBg,
                        color: theme.categoryText,
                        padding: '6px 14px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        marginBottom: '16px',
                        fontWeight: '600',
                        border: `1px solid ${theme.categoryBorder}`,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        transition: 'all 0.4s ease'
                      }}>
                        {post.category}
                      </span>

                      <h3 style={{ 
                        marginBottom: '12px',
                        fontSize: '22px',
                        lineHeight: '1.3',
                        color: theme.textPrimary,
                        fontWeight: '700',
                        letterSpacing: '-0.5px',
                        transition: 'color 0.4s ease'
                      }}>
                        {post.title}
                      </h3>

                      <p style={{ 
                        color: theme.textSecondary, 
                        marginBottom: '20px',
                        fontSize: '15px',
                        lineHeight: '1.6',
                        letterSpacing: '-0.2px',
                        transition: 'color 0.4s ease'
                      }}>
                        {post.excerpt}
                      </p>

                      <Link to={`/blog/${post.slug}`}>
                        <button className="emerald-btn emerald-btn--card">
                          Devamını Oku
                        </button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <Pagination
                  currentPage={pagination.currentPage || currentPage}
                  totalPages={pagination.totalPages || 1}
                  totalItems={pagination.totalBlogs || 0}
                  itemsPerPage={15}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </section>
      </div>

      {/* CSS Animations & Button Styles */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
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
          padding: 14px 16px;
          font-size: 15px;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default Home;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBlogs, fetchFeaturedBlogs } from '../../redux/blogSlice';
import Pagination from '../../components/Pagination';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch();
  
  // Redux'tan blogları al
  const { blogs, featuredBlogs, pagination, loading } = useSelector((state) => state.blogs);

  // Component mount olduğunda öne çıkan blogları çek
  useEffect(() => {
    dispatch(fetchFeaturedBlogs());
  }, [dispatch]);

  // Sayfa değiştiğinde blogları çek
  useEffect(() => {
    dispatch(fetchBlogs({ 
      page: currentPage, 
      limit: 15,
      status: 'published'
    }));
  }, [dispatch, currentPage]);

  // Slider için öne çıkan blogları kullan
  const sliderNews = featuredBlogs.length > 0 ? featuredBlogs : [];

  // 20 saniyede bir otomatik geçiş
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

  // Sayfa değişimi
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ 
      background: 'linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)',
      minHeight: '100vh',
      paddingBottom: '0',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Subtle Background Elements */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '5%',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(45, 55, 72, 0.03) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(60px)',
        animation: 'float 8s ease-in-out infinite',
        zIndex: 0
      }}></div>
      
      <div style={{
        position: 'absolute',
        bottom: '15%',
        right: '5%',
        width: '350px',
        height: '350px',
        background: 'radial-gradient(circle, rgba(26, 26, 26, 0.02) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(60px)',
        animation: 'float 10s ease-in-out infinite reverse',
        zIndex: 0
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
                {/* Modern gradient overlay for content readability */}
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
                  <div style={{
                    maxWidth: '800px'
                  }}>
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
                      <button style={{
                        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d3748 100%)',
                        color: 'white',
                        padding: '16px 42px',
                        fontSize: '16px',
                        border: 'none',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        fontWeight: '600',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                        letterSpacing: '-0.2px'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
                      }}
                      >
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
          <h2 style={{ 
            marginBottom: '60px', 
            fontSize: '48px',
            color: '#1a1a1a',
            textAlign: 'center',
            fontWeight: '800',
            letterSpacing: '-1.5px',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}>
            Son Yazılar
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
                border: '4px solid #e2e8f0',
                borderTop: '4px solid #1a1a1a',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 20px'
              }}></div>
              <p style={{ 
                color: '#4a5568',
                fontSize: '16px',
                letterSpacing: '-0.2px'
              }}>
                Bloglar yükleniyor...
              </p>
            </div>
          )}

          {/* Blog Grid */}
          {!loading && blogs.length === 0 ? (
            <p style={{ 
              textAlign: 'center',
              color: '#718096',
              fontSize: '18px',
              letterSpacing: '-0.2px'
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
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '16px',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-6px)';
                    e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.12)';
                    e.currentTarget.style.borderColor = '#cbd5e0';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.06)';
                    e.currentTarget.style.borderColor = '#e2e8f0';
                  }}
                  >
                    <div style={{ 
                      width: '100%', 
                      height: '220px', 
                      overflow: 'hidden',
                      backgroundColor: '#f7f8fa',
                      position: 'relative'
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
                        background: '#f7f8fa',
                        color: '#4a5568',
                        padding: '6px 14px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        marginBottom: '16px',
                        fontWeight: '600',
                        border: '1px solid #e2e8f0',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        {post.category}
                      </span>

                      <h3 style={{ 
                        marginBottom: '12px',
                        fontSize: '22px',
                        lineHeight: '1.3',
                        color: '#1a1a1a',
                        fontWeight: '700',
                        letterSpacing: '-0.5px'
                      }}>
                        {post.title}
                      </h3>

                      <p style={{ 
                        color: '#4a5568', 
                        marginBottom: '20px',
                        fontSize: '15px',
                        lineHeight: '1.6',
                        letterSpacing: '-0.2px'
                      }}>
                        {post.excerpt}
                      </p>

                      <Link to={`/blog/${post.slug}`}>
                        <button className="btn btn-primary" style={{ 
                          width: '100%',
                          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d3748 100%)',
                          border: 'none',
                          padding: '14px',
                          borderRadius: '10px',
                          color: 'white',
                          fontWeight: '600',
                          fontSize: '15px',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.15)',
                          letterSpacing: '-0.2px'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = 'translateY(-2px)';
                          e.target.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.25)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow = '0 2px 12px rgba(0, 0, 0, 0.15)';
                        }}
                        >
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

      {/* CSS Animation */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-25px); }
        }
      `}</style>
    </div>
  );
};

export default Home;
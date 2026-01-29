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
      background: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
      minHeight: '100vh',
      paddingBottom: '0',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background Elements */}
      <div style={{
        position: 'absolute',
        top: '15%',
        left: '5%',
        width: '350px',
        height: '350px',
        background: 'radial-gradient(circle, rgba(0, 255, 255, 0.08) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(50px)',
        animation: 'float 7s ease-in-out infinite',
        zIndex: 0
      }}></div>
      
      <div style={{
        position: 'absolute',
        bottom: '20%',
        right: '5%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(138, 43, 226, 0.12) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(50px)',
        animation: 'float 9s ease-in-out infinite reverse',
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
                  transition: 'opacity 1s ease-in-out',
                  backgroundImage: `url(${news.coverImage?.url})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                {/* Sadece üst kısımda (header bölgesi) transparan overlay */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '120px',
                  background: 'linear-gradient(to bottom, rgba(15, 32, 39, 0.95) 0%, transparent 100%)'
                }}></div>

                {/* Alt kısımda (yazılar için) transparan overlay */}
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                  height: '300px',
                  background: 'linear-gradient(to top, rgba(15, 32, 39, 0.85) 0%, transparent 100%)'
                }}></div>

                <div className="container" style={{
                  position: 'relative',
                  height: '100vh',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  paddingBottom: '80px',
                  color: 'white'
                }}>
                  <h1 style={{
                    fontSize: '48px',
                    fontWeight: 'bold',
                    marginBottom: '20px',
                    maxWidth: '800px',
                    lineHeight: '1.2',
                    textShadow: '0 0 20px rgba(0, 255, 255, 0.3), 0 4px 15px rgba(0,0,0,0.5)'
                  }}>
                    {news.title}
                  </h1>
                  <p style={{
                    fontSize: '20px',
                    maxWidth: '700px',
                    lineHeight: '1.6',
                    marginBottom: '30px',
                    color: 'rgba(255, 255, 255, 0.95)',
                    textShadow: '0 2px 10px rgba(0,0,0,0.3)'
                  }}>
                    {news.excerpt}
                  </p>
                  <Link to={`/blog/${news.slug}`}>
                    <button style={{
                      background: 'linear-gradient(135deg, #00d4ff 0%, #7b2cbf 100%)',
                      color: 'white',
                      padding: '15px 40px',
                      fontSize: '16px',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      fontWeight: '600',
                      boxShadow: '0 4px 15px rgba(0, 212, 255, 0.4)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 6px 25px rgba(0, 212, 255, 0.6)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 15px rgba(0, 212, 255, 0.4)';
                    }}
                    >
                      Devamını Oku
                    </button>
                  </Link>
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
                  left: '20px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: 'rgba(0, 212, 255, 0.2)',
                  color: '#00ffff',
                  border: '2px solid rgba(0, 255, 255, 0.5)',
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  fontSize: '24px',
                  zIndex: 10,
                  transition: 'all 0.3s',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 4px 15px rgba(0, 212, 255, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(0, 212, 255, 0.4)';
                  e.target.style.boxShadow = '0 0 20px rgba(0, 255, 255, 0.6)';
                  e.target.style.transform = 'translateY(-50%) scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'rgba(0, 212, 255, 0.2)';
                  e.target.style.boxShadow = '0 4px 15px rgba(0, 212, 255, 0.3)';
                  e.target.style.transform = 'translateY(-50%) scale(1)';
                }}
              >
                ‹
              </button>
              <button
                onClick={nextSlide}
                style={{
                  position: 'absolute',
                  right: '20px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: 'rgba(0, 212, 255, 0.2)',
                  color: '#00ffff',
                  border: '2px solid rgba(0, 255, 255, 0.5)',
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  fontSize: '24px',
                  zIndex: 10,
                  transition: 'all 0.3s',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 4px 15px rgba(0, 212, 255, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(0, 212, 255, 0.4)';
                  e.target.style.boxShadow = '0 0 20px rgba(0, 255, 255, 0.6)';
                  e.target.style.transform = 'translateY(-50%) scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'rgba(0, 212, 255, 0.2)';
                  e.target.style.boxShadow = '0 4px 15px rgba(0, 212, 255, 0.3)';
                  e.target.style.transform = 'translateY(-50%) scale(1)';
                }}
              >
                ›
              </button>

              <div style={{
                position: 'absolute',
                bottom: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: '10px',
                zIndex: 10
              }}>
                {sliderNews.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    style={{
                      width: index === currentSlide ? '30px' : '10px',
                      height: '10px',
                      borderRadius: '5px',
                      border: 'none',
                      backgroundColor: index === currentSlide ? '#00ffff' : 'rgba(0, 255, 255, 0.3)',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      boxShadow: index === currentSlide ? '0 0 10px rgba(0, 255, 255, 0.8)' : 'none'
                    }}
                  />
                ))}
              </div>
            </>
          )}
        </section>
      )}

      {/* Blog Posts Section */}
      <div className="container" style={{ marginTop: '60px', marginBottom: '0', paddingBottom: '0', position: 'relative', zIndex: 1 }}>
        <section>
          <h2 style={{ 
            marginBottom: '50px', 
            fontSize: '48px',
            color: 'white',
            textAlign: 'center',
            fontWeight: '700',
            letterSpacing: '-1px',
            textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
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
                border: '4px solid rgba(0, 212, 255, 0.2)',
                borderTop: '4px solid #00d4ff',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 20px',
                boxShadow: '0 0 20px rgba(0, 212, 255, 0.5)'
              }}></div>
              <p style={{ 
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '16px'
              }}>
                Bloglar yükleniyor...
              </p>
            </div>
          )}

          {/* Blog Grid */}
          {!loading && blogs.length === 0 ? (
            <p style={{ 
              textAlign: 'center',
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '18px'
            }}>
              Henüz blog yazısı yok.
            </p>
          ) : !loading && (
            <>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '30px'
              }}>
                {blogs.map(post => (
                  <div key={post._id} className="card" style={{ 
                    overflow: 'hidden',
                    transition: 'all 0.3s',
                    cursor: 'pointer',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '20px',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), 0 0 100px rgba(0, 255, 255, 0.1)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 25px 70px rgba(0, 0, 0, 0.4), 0 0 120px rgba(0, 255, 255, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.3), 0 0 100px rgba(0, 255, 255, 0.1)';
                  }}
                  >
                    <div style={{ 
                      width: '100%', 
                      height: '200px', 
                      overflow: 'hidden',
                      backgroundColor: '#f7fafc',
                      position: 'relative',
                      borderRadius: '20px 20px 0 0'
                    }}>
                      <img 
                        src={post.coverImage?.url || 'https://via.placeholder.com/400x250'} 
                        alt={post.title}
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'cover',
                          display: 'block',
                          transition: 'transform 0.3s'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = 'scale(1.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = 'scale(1)';
                        }}
                      />
                    </div>

                    <div style={{ padding: '20px' }}>
                      <span style={{
                        display: 'inline-block',
                        background: 'linear-gradient(135deg, #00d4ff 0%, #7b2cbf 100%)',
                        color: 'white',
                        padding: '6px 14px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        marginBottom: '14px',
                        fontWeight: '600',
                        boxShadow: '0 2px 10px rgba(0, 212, 255, 0.25)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        {post.category}
                      </span>

                      <h3 style={{ 
                        marginBottom: '12px',
                        fontSize: '20px',
                        lineHeight: '1.4',
                        color: '#0f2027',
                        fontWeight: '700',
                        letterSpacing: '-0.3px'
                      }}>
                        {post.title}
                      </h3>

                      <p style={{ 
                        color: '#4a5568', 
                        marginBottom: '18px',
                        fontSize: '14px',
                        lineHeight: '1.6'
                      }}>
                        {post.excerpt}
                      </p>

                      <Link to={`/blog/${post.slug}`}>
                        <button className="btn btn-primary" style={{ 
                          width: '100%',
                          background: 'linear-gradient(135deg, #00d4ff 0%, #7b2cbf 100%)',
                          border: 'none',
                          padding: '14px',
                          borderRadius: '10px',
                          color: 'white',
                          fontWeight: '600',
                          fontSize: '15px',
                          cursor: 'pointer',
                          transition: 'all 0.3s',
                          boxShadow: '0 4px 20px rgba(0, 212, 255, 0.4)',
                          letterSpacing: '0.3px'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = 'translateY(-2px)';
                          e.target.style.boxShadow = '0 6px 30px rgba(0, 212, 255, 0.6)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow = '0 4px 20px rgba(0, 212, 255, 0.4)';
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
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
};

export default Home;
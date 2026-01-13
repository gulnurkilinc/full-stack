import React from 'react';
import { Link } from 'react-router-dom';

const Blogs = () => {
  // Tüm blog yazıları (daha sonra API'den gelecek)
  const allBlogs = [
    { 
      id: 1, 
      title: 'Yapay Zeka ve Gelecek', 
      category: 'Teknoloji', 
      image: 'https://via.placeholder.com/400x250',
      excerpt: 'Yapay zeka teknolojisinin gelecekte nasıl bir rol oynayacağını keşfedin...',
      date: '15 Ocak 2026',
      author: 'Ahmet Yılmaz'
    },
    { 
      id: 2, 
      title: 'Sağlıklı Yaşam İpuçları', 
      category: 'Sağlık', 
      image: 'https://via.placeholder.com/400x250',
      excerpt: 'Dengeli beslenme ve düzenli egzersizle sağlıklı bir yaşam...',
      date: '14 Ocak 2026',
      author: 'Ayşe Demir'
    },
    { 
      id: 3, 
      title: 'Dünya Siyaseti', 
      category: 'Siyaset', 
      image: 'https://via.placeholder.com/400x250',
      excerpt: 'Küresel siyasi gelişmeleri ve etkilerini analiz ediyoruz...',
      date: '13 Ocak 2026',
      author: 'Mehmet Kaya'
    },
    { 
      id: 4, 
      title: 'Uzayda Yeni Keşifler', 
      category: 'Bilim', 
      image: 'https://via.placeholder.com/400x250',
      excerpt: 'NASA ve diğer uzay ajanslarının son keşiflerini öğrenin...',
      date: '12 Ocak 2026',
      author: 'Zeynep Arslan'
    },
    { 
      id: 5, 
      title: 'Ekonomide Son Gelişmeler', 
      category: 'Ekonomi', 
      image: 'https://via.placeholder.com/400x250',
      excerpt: 'Küresel ekonomideki son trendler ve analizler...',
      date: '11 Ocak 2026',
      author: 'Ali Çelik'
    },
    { 
      id: 6, 
      title: 'Eğitimde Dijital Dönüşüm', 
      category: 'Eğitim', 
      image: 'https://via.placeholder.com/400x250',
      excerpt: 'Dijital araçların eğitime katkıları ve geleceği...',
      date: '10 Ocak 2026',
      author: 'Fatma Şahin'
    },
    { 
      id: 7, 
      title: 'Spor Haberleri', 
      category: 'Spor', 
      image: 'https://via.placeholder.com/400x250',
      excerpt: 'Türkiye ve dünyadan en son spor haberleri...',
      date: '9 Ocak 2026',
      author: 'Mustafa Öztürk'
    },
    { 
      id: 8, 
      title: 'Kültür ve Sanat', 
      category: 'Kültür', 
      image: 'https://via.placeholder.com/400x250',
      excerpt: 'Sanat dünyasından haberler ve etkinlikler...',
      date: '8 Ocak 2026',
      author: 'Elif Yıldız'
    },
    { 
      id: 9, 
      title: 'Çevre ve Doğa', 
      category: 'Çevre', 
      image: 'https://via.placeholder.com/400x250',
      excerpt: 'Çevre koruma çalışmaları ve doğa haberleri...',
      date: '7 Ocak 2026',
      author: 'Emre Aydın'
    },
    { 
      id: 10, 
      title: 'Blockchain Teknolojisi', 
      category: 'Teknoloji', 
      image: 'https://via.placeholder.com/400x250',
      excerpt: 'Blockchain ve kripto para dünyasındaki gelişmeler...',
      date: '6 Ocak 2026',
      author: 'Can Özdemir'
    },
    { 
      id: 11, 
      title: 'Beslenme Rehberi', 
      category: 'Sağlık', 
      image: 'https://via.placeholder.com/400x250',
      excerpt: 'Sağlıklı beslenme için öneriler ve tarifler...',
      date: '5 Ocak 2026',
      author: 'Selin Korkmaz'
    },
    { 
      id: 12, 
      title: 'Küresel Isınma', 
      category: 'Dünya', 
      image: 'https://via.placeholder.com/400x250',
      excerpt: 'İklim değişikliği ve dünya üzerindeki etkileri...',
      date: '4 Ocak 2026',
      author: 'Deniz Yılmaz'
    }
  ];

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh' }}>
      {/* Hero Section */}
      <section style={{
        backgroundColor: '#f8f9fa',
        padding: '60px 0',
        textAlign: 'center'
      }}>
        <div className="container">
          <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>
            Tüm Blog Yazıları
          </h1>
          <p style={{ fontSize: '18px', color: '#666' }}>
            Teknoloji, sağlık, bilim ve daha fazlası hakkında güncel içerikler
          </p>
        </div>
      </section>

      {/* Filters */}
      <section style={{ backgroundColor: 'white', padding: '30px 0', borderBottom: '1px solid #eee' }}>
        <div className="container">
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}>
              Tümü
            </button>
            <button style={{
              padding: '10px 20px',
              backgroundColor: 'white',
              color: '#333',
              border: '1px solid #ddd',
              borderRadius: '5px',
              cursor: 'pointer'
            }}>
              Teknoloji
            </button>
            <button style={{
              padding: '10px 20px',
              backgroundColor: 'white',
              color: '#333',
              border: '1px solid #ddd',
              borderRadius: '5px',
              cursor: 'pointer'
            }}>
              Sağlık
            </button>
            <button style={{
              padding: '10px 20px',
              backgroundColor: 'white',
              color: '#333',
              border: '1px solid #ddd',
              borderRadius: '5px',
              cursor: 'pointer'
            }}>
              Bilim
            </button>
            <button style={{
              padding: '10px 20px',
              backgroundColor: 'white',
              color: '#333',
              border: '1px solid #ddd',
              borderRadius: '5px',
              cursor: 'pointer'
            }}>
              Ekonomi
            </button>
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section style={{ padding: '60px 0' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '30px'
          }}>
            {allBlogs.map(blog => (
              <div key={blog.id} className="card" style={{ 
                overflow: 'hidden',
                transition: 'transform 0.3s, box-shadow 0.3s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
              }}
              >
                {/* Blog Image */}
                <div style={{ 
                  width: '100%', 
                  height: '220px', 
                  overflow: 'hidden',
                  backgroundColor: '#f0f0f0'
                }}>
                  <img 
                    src={blog.image} 
                    alt={blog.title}
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover',
                      display: 'block'
                    }}
                  />
                </div>

                {/* Blog Content */}
                <div style={{ padding: '20px' }}>
                  {/* Category & Date */}
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '12px'
                  }}>
                    <span style={{
                      backgroundColor: '#007bff',
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '3px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      {blog.category}
                    </span>
                    <span style={{ fontSize: '12px', color: '#999' }}>
                      {blog.date}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 style={{ 
                    marginBottom: '12px',
                    fontSize: '20px',
                    lineHeight: '1.4',
                    color: '#333'
                  }}>
                    {blog.title}
                  </h3>

                  {/* Excerpt */}
                  <p style={{ 
                    color: '#666', 
                    marginBottom: '15px',
                    fontSize: '14px',
                    lineHeight: '1.6'
                  }}>
                    {blog.excerpt}
                  </p>

                  {/* Author & Button */}
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginTop: '15px'
                  }}>
                    <span style={{ fontSize: '13px', color: '#666' }}>
                      👤 {blog.author}
                    </span>
                    <Link to={`/blog/${blog.id}`}>
                      <button className="btn btn-primary" style={{ padding: '8px 20px' }}>
                        Oku
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blogs;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  // Slider için state
  const [currentSlide, setCurrentSlide] = useState(0);

  // Slider haberleri
  const sliderNews = [
    {
      id: 1,
      title: 'Yapay Zeka Dünyayı Değiştiriyor',
      excerpt: 'Son yıllarda yapay zeka teknolojisinde yaşanan gelişmeler, hayatımızın her alanını etkiliyor. ChatGPT ve benzeri modeller...',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1920&h=600&fit=crop'
    },
    {
      id: 2,
      title: 'Küresel Isınma: Son Rapor Endişe Verici',
      excerpt: 'Bilim insanları uyarıyor: İklim değişikliği artık geri döndürülemez bir noktaya yaklaşıyor. Yeni veriler gösteriyor ki...',
      image: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=1920&h=600&fit=crop'
    },
    {
      id: 3,
      title: 'Uzayda Yeni Keşif: Mars\'ta Su Bulundu',
      excerpt: 'NASA\'nın Mars görevinde çığır açan bir keşif yapıldı. Kızıl gezegen yüzeyinin altında büyük miktarda su bulundu...',
      image: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=1920&h=600&fit=crop'
    },
    {
      id: 4,
      title: 'Ekonomide Büyük Dönüşüm Başladı',
      excerpt: 'Merkez bankaları faiz kararlarını açıkladı. Piyasalar bu kararlardan nasıl etkilenecek? Uzmanlar değerlendiriyor...',
      image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1920&h=600&fit=crop'
    },
    {
      id: 5,
      title: 'Sağlık Alanında Devrim: Yeni İlaç Bulundu',
      excerpt: 'Kanser tedavisinde umut veren gelişme. Bilim insanları yeni nesil ilaçla %90 başarı oranına ulaştı...',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1920&h=600&fit=crop'
    }
  ];

  // Blog yazıları
  const blogPosts = [
    { id: 1, title: 'Yapay Zeka ve Gelecek', category: 'Teknoloji', image: 'https://via.placeholder.com/400x250' },
    { id: 2, title: 'Sağlıklı Yaşam İpuçları', category: 'Sağlık', image: 'https://via.placeholder.com/400x250' },
    { id: 3, title: 'Dünya Siyaseti', category: 'Siyaset', image: 'https://via.placeholder.com/400x250' },
    { id: 4, title: 'Uzayda Yeni Keşifler', category: 'Bilim', image: 'https://via.placeholder.com/400x250' },
    { id: 5, title: 'Ekonomide Son Gelişmeler', category: 'Ekonomi', image: 'https://via.placeholder.com/400x250' },
    { id: 6, title: 'Eğitimde Dijital Dönüşüm', category: 'Eğitim', image: 'https://via.placeholder.com/400x250' },
    { id: 7, title: 'Spor Haberleri', category: 'Spor', image: 'https://via.placeholder.com/400x250' },
    { id: 8, title: 'Kültür ve Sanat', category: 'Kültür', image: 'https://via.placeholder.com/400x250' },
    { id: 9, title: 'Çevre ve Doğa', category: 'Çevre', image: 'https://via.placeholder.com/400x250' },
    { id: 10, title: 'Blockchain Teknolojisi', category: 'Teknoloji', image: 'https://via.placeholder.com/400x250' },
    { id: 11, title: 'Beslenme Rehberi', category: 'Sağlık', image: 'https://via.placeholder.com/400x250' },
    { id: 12, title: 'Küresel Isınma', category: 'Dünya', image: 'https://via.placeholder.com/400x250' },
    { id: 13, title: 'Kuantum Fiziği', category: 'Bilim', image: 'https://via.placeholder.com/400x250' },
    { id: 14, title: 'Borsa Analizi', category: 'Ekonomi', image: 'https://via.placeholder.com/400x250' },
    { id: 15, title: 'Online Eğitim', category: 'Eğitim', image: 'https://via.placeholder.com/400x250' },
    { id: 16, title: 'Futbol Dünyası', category: 'Spor', image: 'https://via.placeholder.com/400x250' },
    { id: 17, title: 'Müzik Festivalleri', category: 'Kültür', image: 'https://via.placeholder.com/400x250' },
    { id: 18, title: 'Yenilenebilir Enerji', category: 'Çevre', image: 'https://via.placeholder.com/400x250' },
    { id: 19, title: 'Siber Güvenlik', category: 'Teknoloji', image: 'https://via.placeholder.com/400x250' },
    { id: 20, title: 'Meditasyon ve Yoga', category: 'Sağlık', image: 'https://via.placeholder.com/400x250' }
  ];

  // 20 saniyede bir otomatik geçiş
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderNews.length);
    }, 5000); // 200ms = 20 saniye

    return () => clearInterval(interval);
  }, [sliderNews.length]);

  // Manuel geçiş fonksiyonları
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliderNews.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + sliderNews.length) % sliderNews.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };







  return (
    <div>
      {/* Hero Slider */}
<section style={{ 
  position: 'relative', 
  width: '100%', 
  height: '100vh',  // <-- 600px yerine 100vh
  minHeight: '100vh',  // <-- BU SATIRI EKLEYİN
  overflow: 'hidden'
}}>
        {/* Slider Container */}
        <div style={{
          position: 'relative',
          width: '100%',
          height: '100vh'
        }}>
          {sliderNews.map((news, index) => (
            <div
              key={news.id}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100vh',
                opacity: index === currentSlide ? 1 : 0,
                transition: 'opacity 1s ease-in-out',
                backgroundImage: `url(${news.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              {/* Dark Overlay */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.5)'
              }}></div>

              {/* Content */}
              <div className="container" style={{
                position: 'relative',
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                paddingBottom: '60px',
                color: 'white'
              }}>
                <h1 style={{
                  fontSize: '48px',
                  fontWeight: 'bold',
                  marginBottom: '20px',
                  maxWidth: '800px',
                  lineHeight: '1.2'
                }}>
                  {news.title}
                </h1>
                <p style={{
                  fontSize: '20px',
                  maxWidth: '700px',
                  lineHeight: '1.6',
                  marginBottom: '30px'
                }}>
                  {news.excerpt}
                </p>
                <Link to={`/blog/${news.id}`}>
                  <button style={{
                    backgroundColor: '#007bff',
                    color: 'white',
                    padding: '15px 40px',
                    fontSize: '16px',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#0056b3'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#007bff'}
                  >
                    Devamını Oku
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          style={{
            position: 'absolute',
            left: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            color: 'white',
            border: 'none',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            cursor: 'pointer',
            fontSize: '24px',
            zIndex: 10,
            transition: 'background-color 0.3s'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.5)'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'}
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
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            color: 'white',
            border: 'none',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            cursor: 'pointer',
            fontSize: '24px',
            zIndex: 10,
            transition: 'background-color 0.3s'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.5)'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'}
        >
          ›
        </button>

        {/* Dots Navigation */}
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
                backgroundColor: index === currentSlide ? 'white' : 'rgba(255, 255, 255, 0.5)',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            />
          ))}
        </div>
      </section>

      {/* Blog Posts Section */}
      <div className="container" style={{ marginTop: '60px', marginBottom: '60px' }}>
        <section>
          <h2 style={{ marginBottom: '30px', fontSize: '32px' }}>Son Yazılar</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '30px'
          }}>
            {blogPosts.map(post => (
              <div key={post.id} className="card" style={{ 
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
                <div style={{ 
                  width: '100%', 
                  height: '200px', 
                  overflow: 'hidden',
                  backgroundColor: '#f0f0f0'
                }}>
                  <img 
                    src={post.image} 
                    alt={post.title}
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover',
                      display: 'block'
                    }}
                  />
                </div>

                <div style={{ padding: '20px' }}>
                  <span style={{
                    display: 'inline-block',
                    backgroundColor: '#007bff',
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '3px',
                    fontSize: '12px',
                    marginBottom: '12px',
                    fontWeight: '500'
                  }}>
                    {post.category}
                  </span>

                  <h3 style={{ 
                    marginBottom: '12px',
                    fontSize: '20px',
                    lineHeight: '1.4',
                    color: '#333'
                  }}>
                    {post.title}
                  </h3>

                  <p style={{ 
                    color: '#666', 
                    marginBottom: '15px',
                    fontSize: '14px',
                    lineHeight: '1.6'
                  }}>
                    Bu blog yazısının kısa bir özeti buraya gelecek...
                  </p>

                  <Link to={`/blog/${post.id}`}>
                    <button className="btn btn-primary" style={{ width: '100%' }}>
                      Devamını Oku
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
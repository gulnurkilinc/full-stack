import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section style={{
        backgroundImage: 'url("/images/adalet.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '600px',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        color: 'white'
      }}>
        {/* Dark overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)'
        }}></div>

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: '600px' }}>
            <p style={{ fontSize: '14px', letterSpacing: '2px', marginBottom: '20px' }}>
              Blog Sitesi
            </p>
            <h1 style={{ 
              fontSize: '56px', 
              lineHeight: '1.2', 
              marginBottom: '30px',
              fontWeight: '300'
            }}>
              Bilgi ve İlham Dolu<br />
              İçeriklerle Dolu<br />
              Bir Dünya.
            </h1>
            <Link to="/blogs">
              <button style={{
                backgroundColor: '#b8936c',
                color: 'white',
                padding: '15px 40px',
                fontSize: '14px',
                letterSpacing: '1px',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#a07d56'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#b8936c'}
              >
                BLOGLARI KEŞFET
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section style={{ 
        backgroundColor: '#000', 
        color: 'white', 
        padding: '80px 0' 
      }}>
        <div className="container">
          <h2 style={{ 
            fontSize: '42px', 
            marginBottom: '60px',
            fontWeight: '300'
          }}>
            Hakkımızda
          </h2>

          <div className="grid grid-3">
            {/* Card 1 */}
            <div>
              <div style={{
                width: '60px',
                height: '60px',
                backgroundColor: '#b8936c',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
                fontSize: '24px'
              }}>
                01
              </div>
              <h3 style={{ marginBottom: '15px', fontSize: '20px' }}>Kaliteli İçerik</h3>
              <p style={{ color: '#999', lineHeight: '1.8' }}>
                Teknoloji, sağlık, eğitim ve daha birçok alanda uzman yazarlarımız 
                tarafından hazırlanan özgün içerikler.
              </p>
            </div>

            {/* Card 2 */}
            <div>
              <div style={{
                width: '60px',
                height: '60px',
                backgroundColor: '#b8936c',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
                fontSize: '24px'
              }}>
                02
              </div>
              <h3 style={{ marginBottom: '15px', fontSize: '20px' }}>Güncel Haberler</h3>
              <p style={{ color: '#999', lineHeight: '1.8' }}>
                Dünyadan ve Türkiye'den en güncel haberleri takip edin. 
                Her gün yeni içerikler ekliyoruz.
              </p>
            </div>

            {/* Card 3 */}
            <div>
              <div style={{
                width: '60px',
                height: '60px',
                backgroundColor: '#b8936c',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
                fontSize: '24px'
              }}>
                03
              </div>
              <h3 style={{ marginBottom: '15px', fontSize: '20px' }}>Topluluk</h3>
              <p style={{ color: '#999', lineHeight: '1.8' }}>
                Yorumlarınızla ve geri bildirimlerinizle içeriklerimizi 
                zenginleştirin, topluluğumuzun bir parçası olun.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Blogs Section */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <h2 style={{ 
            fontSize: '42px', 
            marginBottom: '40px',
            textAlign: 'center'
          }}>
            Öne Çıkan Yazılar
          </h2>

          <div className="grid grid-3">
            <div className="card">
              <img 
                src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400" 
                alt="Blog"
                style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px 8px 0 0', marginBottom: '20px' }}
              />
              <h3 style={{ marginBottom: '10px' }}>Teknolojide Son Gelişmeler</h3>
              <p style={{ color: '#666', marginBottom: '20px' }}>
                Yapay zeka ve makine öğrenmesi alanındaki en son gelişmeleri keşfedin...
              </p>
              <button className="btn btn-primary">Devamını Oku</button>
            </div>

            <div className="card">
              <img 
                src="https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=400" 
                alt="Blog"
                style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px 8px 0 0', marginBottom: '20px' }}
              />
              <h3 style={{ marginBottom: '10px' }}>Sağlıklı Yaşam İpuçları</h3>
              <p style={{ color: '#666', marginBottom: '20px' }}>
                Dengeli beslenme ve düzenli egzersizle sağlıklı bir yaşam sürdürün...
              </p>
              <button className="btn btn-primary">Devamını Oku</button>
            </div>

            <div className="card">
              <img 
                src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400" 
                alt="Blog"
                style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px 8px 0 0', marginBottom: '20px' }}
              />
              <h3 style={{ marginBottom: '10px' }}>Eğitimde Yeni Trendler</h3>
              <p style={{ color: '#666', marginBottom: '20px' }}>
                Uzaktan eğitim ve dijital öğrenme araçlarının geleceği...
              </p>
              <button className="btn btn-primary">Devamını Oku</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
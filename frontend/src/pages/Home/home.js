import React from 'react';

const Home = () => {
  return (
    <div className="container" style={{ marginTop: '40px' }}>
      <section style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>
          Blog Sitesine Hoş Geldiniz
        </h1>
        <p style={{ fontSize: '18px', color: '#666' }}>
          Teknoloji, sağlık, eğitim ve daha fazlası hakkında güncel içerikler
        </p>
      </section>

      <section>
        <h2 style={{ marginBottom: '30px' }}>Öne Çıkan Yazılar</h2>
        <div className="grid grid-3">
          <div className="card">
            <h3>Blog Başlığı 1</h3>
            <p>Blog özeti buraya gelecek...</p>
            <button className="btn btn-primary">Devamını Oku</button>
          </div>
          <div className="card">
            <h3>Blog Başlığı 2</h3>
            <p>Blog özeti buraya gelecek...</p>
            <button className="btn btn-primary">Devamını Oku</button>
          </div>
          <div className="card">
            <h3>Blog Başlığı 3</h3>
            <p>Blog özeti buraya gelecek...</p>
            <button className="btn btn-primary">Devamını Oku</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
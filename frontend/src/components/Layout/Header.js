import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="navbar">
      <div className="container">
        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/" style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff' }}>
            Blog Sitesi
          </Link>
          
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <Link to="/">Ana Sayfa</Link>
            <Link to="/blogs">Bloglar</Link>
            <Link to="/about">Hakkımızda</Link>
            <Link to="/login">
              <button className="btn btn-primary">Giriş Yap</button>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { logout } from '../../services/authService';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/dashboard/blogs', label: 'Bloglar', icon: '📝' },
    { path: '/dashboard/blogs/create', label: 'Yeni Blog', icon: '➕' },
    { path: '/dashboard/users', label: 'Kullanıcılar', icon: '👥' },
    { path: '/dashboard/settings', label: 'Ayarlar', icon: '⚙️' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div style={{
      width: '250px',
      height: '100vh',
      backgroundColor: '#1a1a2e',
      color: 'white',
      position: 'fixed',
      left: 0,
      top: 0,
      overflowY: 'auto'
    }}>
      {/* Logo */}
      <div style={{
        padding: '30px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <h2 style={{ margin: 0, fontSize: '24px' }}>📚 Blog Admin</h2>
      </div>

      {/* Menu Items */}
      <nav style={{ padding: '20px 0' }}>
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '15px 20px',
              color: 'white',
              textDecoration: 'none',
              backgroundColor: isActive(item.path) ? 'rgba(0,123,255,0.2)' : 'transparent',
              borderLeft: isActive(item.path) ? '4px solid #007bff' : '4px solid transparent',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              if (!isActive(item.path)) {
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive(item.path)) {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            <span style={{ fontSize: '20px' }}>{item.icon}</span>
            <span style={{ fontSize: '15px' }}>{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        right: '20px'
      }}>
        <button
          onClick={logout}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '15px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <span>🚪</span>
          <span>Çıkış Yap</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
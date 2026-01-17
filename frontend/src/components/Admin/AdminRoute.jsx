import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const AdminRoute = ({ children }) => {
  const { loading, isAuthenticated, isAdmin } = useAuth();

  // Yüklenirken loading göster
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #007bff',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Authentication kontrolü
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Admin yetkisi kontrolü
  if (!isAdmin) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '72px', margin: '0' }}>🚫</h1>
        <h2 style={{ marginTop: '20px', marginBottom: '10px' }}>Erişim Reddedildi</h2>
        <p style={{ color: '#666' }}>Bu sayfaya erişim yetkiniz bulunmamaktadır.</p>
        <button
          onClick={() => window.location.href = '/'}
          style={{
            marginTop: '20px',
            padding: '10px 30px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Ana Sayfaya Dön
        </button>
      </div>
    );
  }

  // Yetkili kullanıcı - içeriği göster
  return children;
};

export default AdminRoute;
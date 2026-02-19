import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

// ============================================
// PRIVATE ROUTE - Giriş gerektiren sayfalar
// ============================================
const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);
  const location = useLocation();

  // Yükleniyor
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center', color: '#6366f1' }}>
          <svg
            width="40" height="40"
            viewBox="0 0 40 40"
            style={{ animation: 'spin 1s linear infinite' }}
          >
            <circle cx="20" cy="20" r="16" fill="none" stroke="#e2e8f0" strokeWidth="4" />
            <path d="M20 4 A16 16 0 0 1 36 20" fill="none" stroke="#6366f1" strokeWidth="4" strokeLinecap="round" />
          </svg>
          <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  // Giriş yapılmamış → login'e yönlendir, geri dönüş için mevcut URL'i kaydet
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Rol kontrolü (allowedRoles belirtilmişse)
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// ============================================
// ADMIN ROUTE - Sadece admin erişimi
// ============================================
export const AdminRoute = ({ children }) => {
  return (
    <PrivateRoute allowedRoles={['admin']}>
      {children}
    </PrivateRoute>
  );
};

// ============================================
// AUTHOR ROUTE - Admin ve author erişimi
// ============================================
export const AuthorRoute = ({ children }) => {
  return (
    <PrivateRoute allowedRoles={['admin', 'author']}>
      {children}
    </PrivateRoute>
  );
};

export default PrivateRoute;
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Home from './pages/Home/home';
import Blogs from './pages/Blogs/Blogs';
import Contact from './pages/contact/contact';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import BlogDetail from './pages/BlogDetail/BlogDetail';
import AdminRoute from './components/Admin/AdminRoute';
import Dashboard from './pages/Admin/Dashboard';
import BlogCreate from './pages/Admin/BlogCreate';
import BlogManagement from './pages/Admin/BlogManagement';
import BlogEdit from './pages/Admin/BlogEdit';
import './index.css';

function App() {
  return (
    <Router>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        
        <Routes>
          {/* ============================================ */}
          {/* PUBLIC ROUTES - Header ve Footer ile */}
          {/* ============================================ */}
          
          {/* Ana Sayfa */}
          <Route path="/" element={
            <>
              <Header />
              <main style={{ flex: 1 }}>
                <Home />
              </main>
              <Footer />
            </>
          } />
          
          {/* Blog Listesi */}
          <Route path="/blogs" element={
            <>
              <Header />
              <main style={{ flex: 1 }}>
                <Blogs />
              </main>
              <Footer />
            </>
          } />
          
          {/* Blog Detay */}
          <Route path="/blog/:slug" element={
            <>
              <Header />
              <main style={{ flex: 1 }}>
                <BlogDetail />
              </main>
              <Footer />
            </>
          } />
          
          {/* İletişim */}
          <Route path="/contact" element={
            <>
              <Header />
              <main style={{ flex: 1 }}>
                <Contact />
              </main>
              <Footer />
            </>
          } />
          
          {/* ============================================ */}
          {/* AUTH ROUTES - Header/Footer YOK */}
          {/* ============================================ */}
          
          {/* Login */}
          <Route path="/login" element={<Login />} />
          
          {/* Register */}
          <Route path="/register" element={<Register />} />
          
          {/* ============================================ */}
          {/* ADMIN ROUTES - Protected, Header/Footer YOK */}
          {/* ============================================ */}
          
          {/* Dashboard Ana Sayfa */}
          <Route 
            path="/dashboard" 
            element={
              <AdminRoute>
                <Dashboard />
              </AdminRoute>
            } 
          />
          
          {/* Blog Yönetimi (Liste) - YENİ */}
          <Route 
            path="/dashboard/blogs" 
            element={
              <AdminRoute>
                <BlogManagement />
              </AdminRoute>
            } 
          />
          
          {/* Blog Oluştur */}
          <Route 
            path="/dashboard/blogs/create" 
            element={
              <AdminRoute>
                <BlogCreate />
              </AdminRoute>
            } 
          />
          
          {/* Blog Düzenle - YENİ */}
          <Route 
            path="/dashboard/blogs/edit/:id" 
            element={
              <AdminRoute>
                <BlogEdit />
              </AdminRoute>
            } 
          />
          
          {/* Kullanıcı Yönetimi */}
          <Route 
            path="/dashboard/users" 
            element={
              <AdminRoute>
                <Dashboard />
              </AdminRoute>
            } 
          />
          
          {/* Ayarlar */}
          <Route 
            path="/dashboard/settings" 
            element={
              <AdminRoute>
                <Dashboard />
              </AdminRoute>
            } 
          />
          
          {/* ============================================ */}
          {/* 404 - Sayfa Bulunamadı */}
          {/* ============================================ */}
          
          <Route path="*" element={
            <>
              <Header />
              <main style={{ 
                flex: 1, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                padding: '40px 20px',
                textAlign: 'center',
                minHeight: '60vh'
              }}>
                <div>
                  <h1 style={{ fontSize: '72px', margin: '0', color: '#007bff' }}>404</h1>
                  <h2 style={{ marginTop: '20px', marginBottom: '10px', fontSize: '32px' }}>
                    Sayfa Bulunamadı
                  </h2>
                  <p style={{ color: '#666', marginBottom: '30px', fontSize: '16px' }}>
                    Aradığınız sayfa mevcut değil veya taşınmış olabilir.
                  </p>
                  <button
                    onClick={() => window.location.href = '/'}
                    style={{
                      padding: '12px 30px',
                      backgroundColor: '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      fontSize: '16px',
                      fontWeight: '500',
                      transition: 'background-color 0.3s'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#0056b3'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#007bff'}
                  >
                    Ana Sayfaya Dön
                  </button>
                </div>
              </main>
              <Footer />
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
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
import './index.css';

function App() {
  return (
    <Router>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        
        {/* Public Routes - Header ve Footer ile */}
        <Routes>
          {/* Ana Sayfa ve Blog Sayfaları */}
          <Route path="/" element={
            <>
              <Header />
              <main style={{ flex: 1 }}>
                <Home />
              </main>
              <Footer />
            </>
          } />
          
          <Route path="/blogs" element={
            <>
              <Header />
              <main style={{ flex: 1 }}>
                <Blogs />
              </main>
              <Footer />
            </>
          } />
          
          <Route path="/blog/:slug" element={
            <>
              <Header />
              <main style={{ flex: 1 }}>
                <BlogDetail />
              </main>
              <Footer />
            </>
          } />
          
          <Route path="/contact" element={
            <>
              <Header />
              <main style={{ flex: 1 }}>
                <Contact />
              </main>
              <Footer />
            </>
          } />
          
          {/* Auth Sayfaları - Header/Footer YOK */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Admin Dashboard Routes - Protected, Header/Footer YOK */}
          <Route 
            path="/dashboard" 
            element={
              <AdminRoute>
                <Dashboard />
              </AdminRoute>
            } 
          />
          
          <Route 
            path="/dashboard/blogs" 
            element={
              <AdminRoute>
                <Dashboard />
              </AdminRoute>
            } 
          />
          
          <Route 
            path="/dashboard/blogs/create" 
            element={
              <AdminRoute>
                <BlogCreate />
              </AdminRoute>
            } 
          />
          
          <Route 
            path="/dashboard/users" 
            element={
              <AdminRoute>
                <Dashboard />
              </AdminRoute>
            } 
          />
          
          <Route 
            path="/dashboard/settings" 
            element={
              <AdminRoute>
                <Dashboard />
              </AdminRoute>
            } 
          />
          
          {/* 404 - Sayfa Bulunamadı */}
          <Route path="*" element={
            <>
              <Header />
              <main style={{ 
                flex: 1, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                padding: '40px 20px',
                textAlign: 'center'
              }}>
                <div>
                  <h1 style={{ fontSize: '72px', margin: '0' }}>404</h1>
                  <h2 style={{ marginTop: '20px', marginBottom: '10px' }}>
                    Sayfa Bulunamadı
                  </h2>
                  <p style={{ color: '#666', marginBottom: '30px' }}>
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
                      fontSize: '16px'
                    }}
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
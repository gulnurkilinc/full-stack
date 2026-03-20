import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';          
import 'react-toastify/dist/ReactToastify.css';            
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Home from './pages/Home/home';
import Blogs from './pages/Blogs/Blogs';
import Contact from './pages/contact/contact';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import BlogDetail from './pages/BlogDetail/BlogDetail';
import TBMM from './pages/Parlamento/TBMM';
import KanunTeklifiDetay from './pages/Parlamento/KanunTeklifiDetay';
import ScrollToTop from './components/ScrollToTop';
import Packages from './pages/Packages/Packages';
import AnalyticaAI from './pages/AnalyticaAI/AnalyticaAI';
import { AdminRoute } from './components/PrivateRoute';
import Dashboard from './pages/Admin/Dashboard';
import BlogCreate from './pages/Admin/BlogCreate';
import BlogManagement from './pages/Admin/BlogManagement';
import BlogEdit from './pages/Admin/BlogEdit';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import ResetPassword from './pages/ResetPassword/ResetPassword';
import VerifyEmail from './pages/VerifyEmail/VerifyEmail';
import VerifySuccess from './pages/VerifyEmail/VerifySuccess';
import Profile from './pages/Profile/Profile';
import UserProfile from './pages/UserProfile/UserProfile';
import UserManagement from './pages/Admin/UserManagement';
import SessionTimeout from './components/SessionTimeout/SessionTimeout';
import GoogleSuccess from './pages/Auth/GoogleSuccess';
import ActivityLogs from './pages/Admin/ActivityLogs';
import './index.css';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <ScrollToTop /> {/* ✅ BURAYA EKLENDİ - Router içinde ilk sırada */}
        <SessionTimeout />

        {/* ✅ YENİ - Toast bildirimleri, tüm uygulamada çalışır */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          draggable
          theme="colored"
        />

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

            {/* AnalyticaAI Sayfası */}
            <Route path="/analytica-ai" element={
              <>
                <Header />
                <main style={{ flex: 1 }}>
                  <AnalyticaAI />
                </main>
                <Footer />
              </>
            } />
            
            {/* TBMM Ana Sayfası */}
            <Route path="/category/tbmm" element={
              <>
                <Header />
                <main style={{ flex: 1 }}>
                  <TBMM />
                </main>
                <Footer />
              </>
            } />
            
            {/* Kanun Teklifi Detay Sayfası */}
            <Route path="/category/tbmm/kanun-teklifi/:id" element={
              <>
                <Header />
                <main style={{ flex: 1 }}>
                  <KanunTeklifiDetay />
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
            
            {/* Paketler */}
            <Route path="/packages" element={
              <>
                <Header />
                <main style={{ flex: 1 }}>
                  <Packages />
                </main>
                <Footer />
              </>
            } />
            
            {/* Şifre Sıfırlama */}
           <Route path="/forgot-password" element={<ForgotPassword />} />
           <Route path="/reset-password/:token" element={<ResetPassword />} />

           <Route path="/verify-email" element={<VerifyEmail />} />
           <Route path="/verify-email/:token" element={<VerifySuccess />} />

            {/* Profil */}
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/:username" element={<UserProfile />} />

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
            
            {/* Blog Yönetimi (Liste) */}
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
            
            {/* Blog Düzenle */}
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
                  <UserManagement />
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

            <Route path="/auth/google/success" element={<GoogleSuccess />} />

            <Route 
  path="/dashboard/activity-logs" 
  element={
    <AdminRoute>
      <ActivityLogs />
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
    </ThemeProvider>
  );
}

export default App;
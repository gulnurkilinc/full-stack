import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Home from './pages/Home/home';
import Blogs from './pages/Blogs/Blogs';
import Contact from './pages/contact/contact';
import Login from './pages/Login/Login';  // YENİ
import Register from './pages/Register/Register';  // YENİ
import './index.css';

function App() {
  return (
    <Router>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />  {/* YENİ */}
            <Route path="/register" element={<Register />} />  {/* YENİ */}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
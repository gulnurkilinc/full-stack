import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axiosInstance from '../../api/axiosInstance';
import { useTheme } from '../../context/ThemeContext';

const UserProfile = () => {
  const { themeName } = useTheme();
  const { username } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [profileUser, setProfileUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Giriş yapılmamışsa login'e yönlendir
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Kullanıcı bilgilerini ve bloglarını getir
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchUserProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get(`/user/${username}`);
        if (response.data.success) {
          setProfileUser(response.data.user);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Kullanıcı bulunamadı');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [username, isAuthenticated]);

  // ── TEMA RENKLERİ ─────────────────────────────────────────────────────────
  const pageBg       = themeName === 'light' ? '#f8f9fa' : themeName === 'dark' ? '#0f172a' : '#000000';
  const cardBg       = themeName === 'light' ? '#ffffff' : themeName === 'dark' ? '#1e293b' : '#1a1a1a';
  const cardBorder   = themeName === 'light' ? '#e2e8f0' : themeName === 'dark' ? '#334155' : '#2a2a2a';
  const headingColor = themeName === 'light' ? '#1a1a1a' : themeName === 'dark' ? '#f1f5f9' : '#e5e5e5';
  const textColor    = themeName === 'light' ? '#4a5568' : themeName === 'dark' ? '#cbd5e0' : '#a3a3a3';
  const dividerColor = themeName === 'light' ? '#e2e8f0' : themeName === 'dark' ? '#334155' : '#2a2a2a';
  const blogCardBg   = themeName === 'light' ? '#f8fafc' : themeName === 'dark' ? '#0f172a' : '#0a0a0a';
  const blogCardBorder = themeName === 'light' ? '#e2e8f0' : themeName === 'dark' ? '#1e293b' : '#1a1a1a';
  const linkColor    = themeName === 'light' ? '#6366f1' : themeName === 'dark' ? '#00d4ff' : '#d4d4d4';

  const roleLabels = { user: 'Kullanıcı', author: 'Yazar', admin: 'Admin' };
  const roleColors = {
    user:   { bg: '#eff6ff', border: '#bfdbfe', color: '#1d4ed8' },
    author: { bg: '#fdf4ff', border: '#e9d5ff', color: '#7c3aed' },
    admin:  { bg: '#fef2f2', border: '#fecaca', color: '#dc2626' }
  };

  // ── LOADING ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: pageBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <svg width="40" height="40" viewBox="0 0 16 16" fill="none" style={{ animation: 'spin 1s linear infinite', marginBottom: '16px' }}>
            <path d="M8 1.5V4.5M8 11.5V14.5M14.5 8H11.5M4.5 8H1.5M12.7 12.7L10.6 10.6M5.4 5.4L3.3 3.3M12.7 3.3L10.6 5.4M5.4 10.6L3.3 12.7"
              stroke={textColor} strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <p style={{ color: textColor, fontSize: '15px' }}>Yükleniyor...</p>
        </div>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // ── HATA ──────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: pageBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>😕</div>
          <h2 style={{ color: headingColor, fontSize: '24px', fontWeight: '700', marginBottom: '10px' }}>
            Kullanıcı Bulunamadı
          </h2>
          <p style={{ color: textColor, fontSize: '15px', marginBottom: '24px' }}>{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="emerald-btn"
            style={{ padding: '12px 28px', fontSize: '15px', cursor: 'pointer' }}
          >
            ← Geri Dön
          </button>
        </div>
        <style>{`
          .emerald-btn { background: linear-gradient(135deg, #1f2937 0%, #111827 45%, #0a0e18 100%); color: #ffffff; font-weight: 600; border: none; border-radius: 10px; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; box-shadow: 0 4px 18px rgba(17,24,39,0.45); }
          .emerald-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(17,24,39,0.55); }
        `}</style>
      </div>
    );
  }

  if (!profileUser) return null;

  const role = profileUser.role || 'user';
  const roleStyle = roleColors[role];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: pageBg, paddingTop: '100px', paddingBottom: '60px', transition: 'background 0.4s ease' }}>
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '0 20px' }}>

        {/* Geri butonu */}
        <button
          onClick={() => navigate(-1)}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            color: linkColor, fontSize: '14px', fontWeight: '600',
            background: 'none', border: 'none', cursor: 'pointer',
            marginBottom: '24px', padding: 0
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Geri Dön
        </button>

        {/* ── Profil Kartı ── */}
        <div style={{
          backgroundColor: cardBg, borderRadius: '20px',
          border: `1px solid ${cardBorder}`, overflow: 'hidden',
          marginBottom: '24px',
          boxShadow: themeName === 'light' ? '0 4px 24px rgba(0,0,0,0.06)' : '0 4px 24px rgba(0,0,0,0.3)'
        }}>
          {/* Üst banner */}
          <div style={{
            height: '100px',
            background: themeName === 'light'
              ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)'
              : themeName === 'dark'
                ? 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f2a1e 100%)'
                : 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)'
          }} />

          {/* Avatar + bilgi */}
          <div style={{ padding: '0 32px 28px', position: 'relative' }}>
            <div style={{
              width: '80px', height: '80px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontSize: '32px', fontWeight: '700',
              border: `4px solid ${cardBg}`,
              marginTop: '-40px', marginBottom: '16px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}>
              {profileUser.name?.charAt(0).toUpperCase()}
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h2 style={{ fontSize: '22px', fontWeight: '700', color: headingColor, marginBottom: '4px', letterSpacing: '-0.4px' }}>
                  {profileUser.name}
                </h2>

                {/* Rol badge */}
                <span style={{
                  display: 'inline-block', padding: '4px 12px', marginBottom: '10px',
                  backgroundColor: roleStyle.bg, border: `1px solid ${roleStyle.border}`,
                  borderRadius: '20px', fontSize: '13px', fontWeight: '600', color: roleStyle.color
                }}>
                  {roleLabels[role]}
                </span>
              </div>

              {/* Kayıt tarihi */}
              <div style={{ textAlign: 'right' }}>
                <p style={{ color: textColor, fontSize: '13px', marginBottom: '4px' }}>Kayıt tarihi</p>
                <p style={{ color: headingColor, fontSize: '14px', fontWeight: '600' }}>
                  {profileUser.createdAt
                    ? new Date(profileUser.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
                    : '-'}
                </p>
              </div>
            </div>

            {/* Bio */}
            {profileUser.bio && (
              <p style={{
                color: textColor, fontSize: '14px',
                marginTop: '16px', paddingTop: '16px',
                borderTop: `1px solid ${dividerColor}`,
                lineHeight: '1.7'
              }}>
                {profileUser.bio}
              </p>
            )}

            {/* İstatistikler */}
            <div style={{
              display: 'flex', gap: '24px', flexWrap: 'wrap',
              marginTop: '20px', paddingTop: '20px',
              borderTop: `1px solid ${dividerColor}`
            }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '24px', fontWeight: '700', color: headingColor, marginBottom: '2px' }}>
                  {blogs.length}
                </p>
                <p style={{ fontSize: '13px', color: textColor }}>Blog</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Bloglar ── */}
        <div style={{
          backgroundColor: cardBg, borderRadius: '20px',
          border: `1px solid ${cardBorder}`, padding: '28px',
          boxShadow: themeName === 'light' ? '0 4px 24px rgba(0,0,0,0.06)' : '0 4px 24px rgba(0,0,0,0.3)'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: headingColor, marginBottom: '20px', letterSpacing: '-0.3px' }}>
            Bloglar
            <span style={{
              marginLeft: '10px', fontSize: '13px', fontWeight: '600',
              color: textColor, backgroundColor: blogCardBg,
              padding: '3px 10px', borderRadius: '20px',
              border: `1px solid ${blogCardBorder}`
            }}>
              {blogs.length}
            </span>
          </h3>

          {blogs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
              <p style={{ color: textColor, fontSize: '15px' }}>
                {profileUser.name} henüz blog yazmamış.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {blogs.map((blog) => (
                <Link
                  key={blog._id}
                  to={`/blog/${blog.slug}`}
                  style={{
                    display: 'block', padding: '16px 20px',
                    backgroundColor: blogCardBg,
                    border: `1px solid ${blogCardBorder}`,
                    borderRadius: '12px', textDecoration: 'none',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = linkColor; e.currentTarget.style.transform = 'translateX(4px)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = blogCardBorder; e.currentTarget.style.transform = 'translateX(0)'; }}
                >
                  <h4 style={{ color: headingColor, fontSize: '15px', fontWeight: '600', marginBottom: '6px', letterSpacing: '-0.2px' }}>
                    {blog.title}
                  </h4>
                  <p style={{ color: textColor, fontSize: '13px' }}>
                    {new Date(blog.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .emerald-btn { background: linear-gradient(135deg, #1f2937 0%, #111827 45%, #0a0e18 100%); color: #ffffff; font-weight: 600; border: none; border-radius: 10px; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; box-shadow: 0 4px 18px rgba(17,24,39,0.45); }
        .emerald-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(17,24,39,0.55); }
      `}</style>
    </div>
  );
};

export default UserProfile;
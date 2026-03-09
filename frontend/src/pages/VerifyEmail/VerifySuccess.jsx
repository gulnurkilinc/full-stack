import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { useTheme } from '../../context/ThemeContext';

const VerifySuccess = () => {
  const { themeName } = useTheme();
  const { token } = useParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verify = async () => {
      try {
        const response = await axiosInstance.post(`/verify-email/${token}`);
        if (response.data.success) {
          setStatus('success');
          setMessage(response.data.message);
          // 3 saniye sonra login'e yönlendir
          setTimeout(() => navigate('/login'), 3000);
        }
      } catch (error) {
        setStatus('error');
        setMessage(error.response?.data?.message || 'Doğrulama başarısız');
      }
    };

    if (token) verify();
  }, [token, navigate]);

  const pageBg       = themeName === 'light' ? '#f8f9fa' : themeName === 'dark' ? '#0f172a' : '#000000';
  const cardBg       = themeName === 'light' ? '#ffffff' : themeName === 'dark' ? '#1e293b' : '#1a1a1a';
  const cardBorder   = themeName === 'light' ? '#e2e8f0' : themeName === 'dark' ? '#334155' : '#2a2a2a';
  const headingColor = themeName === 'light' ? '#1a1a1a' : themeName === 'dark' ? '#f1f5f9' : '#e5e5e5';
  const textColor    = themeName === 'light' ? '#4a5568' : themeName === 'dark' ? '#cbd5e0' : '#a3a3a3';

  return (
    <div style={{
      minHeight: '100vh', backgroundColor: pageBg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px', transition: 'background 0.4s ease'
    }}>
      <div style={{
        backgroundColor: cardBg, borderRadius: '20px',
        border: `1px solid ${cardBorder}`, padding: '48px 40px',
        maxWidth: '440px', width: '100%', textAlign: 'center',
        boxShadow: themeName === 'light' ? '0 4px 24px rgba(0,0,0,0.06)' : '0 4px 24px rgba(0,0,0,0.3)'
      }}>

        {/* Loading */}
        {status === 'loading' && (
          <>
            <svg width="48" height="48" viewBox="0 0 16 16" fill="none" style={{ animation: 'spin 1s linear infinite', marginBottom: '20px' }}>
              <path d="M8 1.5V4.5M8 11.5V14.5M14.5 8H11.5M4.5 8H1.5M12.7 12.7L10.6 10.6M5.4 5.4L3.3 3.3M12.7 3.3L10.6 5.4M5.4 10.6L3.3 12.7"
                stroke={textColor} strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <h2 style={{ color: headingColor, fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>
              Doğrulanıyor...
            </h2>
            <p style={{ color: textColor, fontSize: '14px' }}>Lütfen bekleyin.</p>
          </>
        )}

        {/* Başarılı */}
        {status === 'success' && (
          <>
            <div style={{
              width: '80px', height: '80px', borderRadius: '50%',
              backgroundColor: '#f0fdf4', border: '2px solid #bbf7d0',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 24px'
            }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: '700', color: headingColor, marginBottom: '12px', letterSpacing: '-0.4px' }}>
              Email Doğrulandı! 🎉
            </h1>
            <p style={{ color: textColor, fontSize: '15px', lineHeight: '1.7', marginBottom: '28px' }}>
              {message} 3 saniye içinde giriş sayfasına yönlendiriliyorsunuz.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="emerald-btn"
              style={{ width: '100%', padding: '13px', fontSize: '15px', cursor: 'pointer' }}
            >
              Giriş Yap
            </button>
          </>
        )}

        {/* Hata */}
        {status === 'error' && (
          <>
            <div style={{
              width: '80px', height: '80px', borderRadius: '50%',
              backgroundColor: '#fef2f2', border: '2px solid #fecaca',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 24px'
            }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: '700', color: headingColor, marginBottom: '12px', letterSpacing: '-0.4px' }}>
              Doğrulama Başarısız
            </h1>
            <p style={{ color: textColor, fontSize: '15px', lineHeight: '1.7', marginBottom: '28px' }}>
              {message}
            </p>
            <button
              onClick={() => navigate('/register')}
              className="emerald-btn"
              style={{ width: '100%', padding: '13px', fontSize: '15px', cursor: 'pointer' }}
            >
              Tekrar Kayıt Ol
            </button>
          </>
        )}
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .emerald-btn { background: linear-gradient(135deg, #1f2937 0%, #111827 45%, #0a0e18 100%); color: #ffffff; font-weight: 600; border: none; border-radius: 10px; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; box-shadow: 0 4px 18px rgba(17,24,39,0.45); }
        .emerald-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(17,24,39,0.55); }
      `}</style>
    </div>
  );
};

export default VerifySuccess;
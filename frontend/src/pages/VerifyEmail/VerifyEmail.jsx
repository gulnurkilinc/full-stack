import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const VerifyEmail = () => {
  const { themeName } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || 'email adresinize';

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
        maxWidth: '480px', width: '100%', textAlign: 'center',
        boxShadow: themeName === 'light' ? '0 4px 24px rgba(0,0,0,0.06)' : '0 4px 24px rgba(0,0,0,0.3)'
      }}>
        {/* İkon */}
        <div style={{
          width: '80px', height: '80px', borderRadius: '50%',
          backgroundColor: themeName === 'light' ? '#eff6ff' : '#1e3a5f',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 24px'
        }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
        </div>

        <h1 style={{ fontSize: '24px', fontWeight: '700', color: headingColor, marginBottom: '12px', letterSpacing: '-0.4px' }}>
          Emailinizi Doğrulayın
        </h1>

        <p style={{ color: textColor, fontSize: '15px', lineHeight: '1.7', marginBottom: '8px' }}>
          Hesabınız oluşturuldu! Devam etmek için
        </p>
        <p style={{ color: headingColor, fontSize: '15px', fontWeight: '600', marginBottom: '8px' }}>
          {email}
        </p>
        <p style={{ color: textColor, fontSize: '15px', lineHeight: '1.7', marginBottom: '32px' }}>
          adresine gönderilen doğrulama linkine tıklayın.
        </p>

        {/* Bilgi kutusu */}
        <div style={{
          backgroundColor: themeName === 'light' ? '#f8fafc' : '#0f172a',
          border: `1px solid ${cardBorder}`, borderRadius: '12px',
          padding: '16px', marginBottom: '32px', textAlign: 'left'
        }}>
          <p style={{ color: textColor, fontSize: '13px', lineHeight: '1.7', margin: 0 }}>
            📬 Email gelmedi mi? Spam/gereksiz klasörünü kontrol edin. Link <strong style={{ color: headingColor }}>24 saat</strong> geçerlidir.
          </p>
        </div>

        <button
          onClick={() => navigate('/login')}
          className="emerald-btn"
          style={{ width: '100%', padding: '13px', fontSize: '15px', cursor: 'pointer' }}
        >
          Giriş Sayfasına Git
        </button>
      </div>

      <style>{`
        .emerald-btn { background: linear-gradient(135deg, #1f2937 0%, #111827 45%, #0a0e18 100%); color: #ffffff; font-weight: 600; border: none; border-radius: 10px; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; box-shadow: 0 4px 18px rgba(17,24,39,0.45); }
        .emerald-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(17,24,39,0.55); }
      `}</style>
    </div>
  );
};

export default VerifyEmail;
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '../../api/axiosInstance';
import { useTheme } from '../../context/ThemeContext';

const ForgotPassword = () => {
  const { themeName } = useTheme();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  // ── TEMA RENKLERİ ────────────────────────────────────────────────────────────
  const pageBg = themeName === 'light'
    ? 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
    : themeName === 'dark'
      ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
      : 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)';

  const blob1 = themeName === 'light'
    ? 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)'
    : themeName === 'dark'
      ? 'radial-gradient(circle, rgba(0, 255, 255, 0.1) 0%, transparent 70%)'
      : 'radial-gradient(circle, rgba(212, 212, 212, 0.05) 0%, transparent 70%)';

  const blob2 = themeName === 'light'
    ? 'radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, transparent 70%)'
    : themeName === 'dark'
      ? 'radial-gradient(circle, rgba(138, 43, 226, 0.15) 0%, transparent 70%)'
      : 'radial-gradient(circle, rgba(255, 255, 255, 0.03) 0%, transparent 70%)';

  const cardBg = themeName === 'light'
    ? 'rgba(255, 255, 255, 0.95)'
    : themeName === 'dark'
      ? 'rgba(30, 41, 59, 0.95)'
      : 'rgba(26, 26, 26, 0.95)';

  const cardShadow = themeName === 'light'
    ? '0 20px 60px rgba(0, 0, 0, 0.1)'
    : themeName === 'dark'
      ? '0 20px 60px rgba(0, 0, 0, 0.3), 0 0 100px rgba(0, 255, 255, 0.1)'
      : '0 20px 60px rgba(0, 0, 0, 0.5)';

  const cardBorder = themeName === 'light'
    ? '1px solid rgba(99, 102, 241, 0.1)'
    : themeName === 'dark'
      ? '1px solid rgba(255, 255, 255, 0.2)'
      : '1px solid rgba(255, 255, 255, 0.1)';

  const headingColor    = themeName === 'light' ? '#1a1a1a' : themeName === 'dark' ? '#f1f5f9' : '#e5e5e5';
  const textColor       = themeName === 'light' ? '#4a5568' : themeName === 'dark' ? '#cbd5e0' : '#a3a3a3';
  const labelColor      = themeName === 'light' ? '#2d3748' : themeName === 'dark' ? '#e2e8f0' : '#d4d4d4';
  const inputBg         = themeName === 'light' ? 'white'   : themeName === 'dark' ? '#1e293b' : '#1a1a1a';
  const inputBorder     = themeName === 'light' ? '#e2e8f0' : themeName === 'dark' ? '#334155' : '#2a2a2a';
  const inputText       = themeName === 'light' ? '#2d3748' : themeName === 'dark' ? '#f1f5f9' : '#e5e5e5';
  const inputDisabledBg = themeName === 'light' ? '#f7fafc' : themeName === 'dark' ? '#0f172a' : '#0a0a0a';
  const inputFocusBorder= themeName === 'light' ? '#6366f1' : themeName === 'dark' ? '#00ffff' : '#d4d4d4';
  const inputFocusShadow= themeName === 'light'
    ? '0 0 0 3px rgba(99, 102, 241, 0.1)'
    : themeName === 'dark'
      ? '0 0 0 3px rgba(0, 255, 255, 0.1)'
      : '0 0 0 3px rgba(212, 212, 212, 0.1)';
  const linkColor       = themeName === 'light' ? '#6366f1' : themeName === 'dark' ? '#00d4ff' : '#d4d4d4';
  const linkHoverColor  = themeName === 'light' ? '#4f46e5' : themeName === 'dark' ? '#00ffff' : '#e5e5e5';
  const footerTextColor = themeName === 'light' ? 'rgba(26,26,26,0.6)' : 'rgba(255,255,255,0.7)';
  const dividerColor    = themeName === 'light' ? '#e2e8f0' : themeName === 'dark' ? '#334155' : '#2a2a2a';
  const successBg       = themeName === 'light' ? '#f0fdf4' : themeName === 'dark' ? '#052e16' : '#0a1a0a';
  const successBorder   = themeName === 'light' ? '#bbf7d0' : themeName === 'dark' ? '#166534' : '#1a3a1a';

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error('Lütfen email adresinizi girin');
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post('/password/forgot', { email });
      if (response.data.success) {
        setSent(true);
        toast.success('Şifre sıfırlama linki email adresinize gönderildi!');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Bir hata oluştu. Lütfen tekrar deneyin.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: pageBg, display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: '20px',
      position: 'relative', overflow: 'hidden', transition: 'background 0.4s ease'
    }}>
      {/* Animated blobs */}
      <div style={{ position: 'absolute', top: '10%', left: '10%', width: '300px', height: '300px', background: blob1, borderRadius: '50%', filter: 'blur(40px)', animation: 'float 6s ease-in-out infinite', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: '400px', height: '400px', background: blob2, borderRadius: '50%', filter: 'blur(40px)', animation: 'float 8s ease-in-out infinite reverse', pointerEvents: 'none' }} />

      <div style={{ maxWidth: '440px', width: '100%', position: 'relative', zIndex: 1 }}>
        <div style={{ backgroundColor: cardBg, backdropFilter: 'blur(10px)', borderRadius: '20px', padding: '48px 40px', boxShadow: cardShadow, border: cardBorder, transition: 'all 0.4s ease' }}>

          {/* Geri butonu */}
          <Link to="/login" style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            color: linkColor, fontSize: '14px', fontWeight: '600',
            textDecoration: 'none', marginBottom: '32px'
          }}
            onMouseEnter={(e) => e.currentTarget.style.color = linkHoverColor}
            onMouseLeave={(e) => e.currentTarget.style.color = linkColor}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Giriş sayfasına dön
          </Link>

          {/* Başlık */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            {/* İkon */}
            <div style={{
              width: '64px', height: '64px', borderRadius: '16px',
              background: themeName === 'light'
                ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
                : 'linear-gradient(135deg, #00d4ff 0%, #0088cc 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px', boxShadow: themeName === 'light'
                ? '0 8px 24px rgba(99, 102, 241, 0.3)'
                : '0 8px 24px rgba(0, 212, 255, 0.3)'
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
            </div>
            <h1 style={{ fontSize: '26px', marginBottom: '8px', color: headingColor, fontWeight: '700', letterSpacing: '-0.5px' }}>
              Şifremi Unuttum
            </h1>
            <p style={{ color: textColor, fontSize: '15px', lineHeight: '1.6' }}>
              Email adresinizi girin, şifre sıfırlama linkini gönderelim.
            </p>
          </div>

          {/* Gönderildi mesajı */}
          {sent ? (
            <div style={{
              backgroundColor: successBg, border: `1px solid ${successBorder}`,
              borderRadius: '14px', padding: '24px', textAlign: 'center'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📬</div>
              <h3 style={{ color: '#22c55e', fontSize: '18px', fontWeight: '700', marginBottom: '10px' }}>
                Email Gönderildi!
              </h3>
              <p style={{ color: textColor, fontSize: '14px', lineHeight: '1.6', marginBottom: '20px' }}>
                <strong style={{ color: headingColor }}>{email}</strong> adresine şifre sıfırlama linki gönderildi. Gelen kutunuzu kontrol edin.
              </p>
              <p style={{ color: textColor, fontSize: '13px' }}>
                Email gelmedi mi?{' '}
                <button
                  onClick={() => setSent(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: linkColor, fontWeight: '600', fontSize: '13px', padding: 0 }}
                >
                  Tekrar gönder
                </button>
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: labelColor }}>
                  E-posta Adresi
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ornek@email.com"
                  disabled={loading}
                  autoComplete="email"
                  required
                  style={{
                    width: '100%', padding: '12px 16px',
                    border: `1.5px solid ${inputBorder}`, borderRadius: '10px',
                    fontSize: '15px', color: inputText,
                    backgroundColor: loading ? inputDisabledBg : inputBg,
                    outline: 'none', fontFamily: 'inherit',
                    boxSizing: 'border-box', transition: 'all 0.2s ease'
                  }}
                  onFocus={(e) => { e.target.style.borderColor = inputFocusBorder; e.target.style.boxShadow = inputFocusShadow; }}
                  onBlur={(e)  => { e.target.style.borderColor = inputBorder; e.target.style.boxShadow = 'none'; }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="emerald-btn"
                style={{
                  width: '100%', padding: '14px 20px', fontSize: '15px',
                  opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ animation: 'spin 1s linear infinite' }}>
                      <path d="M8 1.5V4.5M8 11.5V14.5M14.5 8H11.5M4.5 8H1.5M12.7 12.7L10.6 10.6M5.4 5.4L3.3 3.3M12.7 3.3L10.6 5.4M5.4 10.6L3.3 12.7" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    Gönderiliyor...
                  </span>
                ) : 'Sıfırlama Linki Gönder'}
              </button>
            </form>
          )}

          {/* Alt link */}
          <div style={{ textAlign: 'center', marginTop: '32px', paddingTop: '24px', borderTop: `1px solid ${dividerColor}` }}>
            <p style={{ color: textColor, fontSize: '14px', fontWeight: '500' }}>
              Şifrenizi hatırladınız mı?{' '}
              <Link to="/login"
                style={{ color: linkColor, fontWeight: '600', textDecoration: 'none' }}
                onMouseEnter={(e) => e.target.style.color = linkHoverColor}
                onMouseLeave={(e) => e.target.style.color = linkColor}
              >
                Giriş Yap
              </Link>
            </p>
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: '24px', color: footerTextColor, fontSize: '13px', fontWeight: '500' }}>
          © 2025 Tüm hakları saklıdır
        </p>
      </div>

      <style>{`
        @keyframes spin  { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-20px); } }
        .emerald-btn { display: inline-block; background: linear-gradient(135deg, #1f2937 0%, #111827 45%, #0a0e18 100%); color: #ffffff; font-weight: 600; border: none; border-radius: 10px; cursor: pointer; position: relative; overflow: hidden; transition: transform 0.35s cubic-bezier(0.4,0,0.2,1), box-shadow 0.35s cubic-bezier(0.4,0,0.2,1); box-shadow: 0 4px 18px rgba(17,24,39,0.45), inset 0 1px 0 rgba(255,255,255,0.15); }
        .emerald-btn::before { content: ''; position: absolute; top: 0; left: -110%; width: 80%; height: 100%; background: linear-gradient(100deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%); transition: left 0.55s cubic-bezier(0.4,0,0.2,1); pointer-events: none; z-index: 1; }
        .emerald-btn:hover:not(:disabled) { background: linear-gradient(135deg, #374151 0%, #1f2937 45%, #111827 100%); transform: translateY(-2px); box-shadow: 0 8px 28px rgba(17,24,39,0.55), inset 0 1px 0 rgba(255,255,255,0.25); }
        .emerald-btn:hover:not(:disabled)::before { left: 120%; }
        .emerald-btn:active:not(:disabled) { transform: translateY(0); }
      `}</style>
    </div>
  );
};

export default ForgotPassword;
import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '../../api/axiosInstance';
import { useTheme } from '../../context/ThemeContext';

const getPasswordStrength = (password) => {
  if (!password) return { score: 0, label: '', color: '' };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 1) return { score, label: 'Çok Zayıf', color: '#ef4444' };
  if (score === 2) return { score, label: 'Zayıf', color: '#f97316' };
  if (score === 3) return { score, label: 'Orta', color: '#eab308' };
  if (score === 4) return { score, label: 'Güçlü', color: '#22c55e' };
  return { score, label: 'Çok Güçlü', color: '#10b981' };
};

const ResetPassword = () => {
  const { themeName } = useTheme();
  const { token } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const passwordStrength = getPasswordStrength(formData.password);

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
  const iconColor       = themeName === 'light' ? '#9ca3af' : themeName === 'dark' ? '#64748b' : '#525252';
  const rulesBg         = themeName === 'light' ? '#f8fafc' : themeName === 'dark' ? '#0f172a' : '#0a0a0a';
  const rulesBorder     = themeName === 'light' ? '#e2e8f0' : themeName === 'dark' ? '#1e293b' : '#1a1a1a';

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.password || !formData.confirmPassword) {
      toast.error('Lütfen tüm alanları doldurun');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('Şifreler eşleşmiyor');
      return;
    }
    if (formData.password.length < 8) {
      toast.error('Şifre en az 8 karakter olmalıdır');
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.put(`/password/reset/${token}`, {
        password: formData.password,
        confirmPassword: formData.confirmPassword
      });

      if (response.data.success) {
        toast.success('Şifreniz başarıyla güncellendi! Giriş yapabilirsiniz.');
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Bir hata oluştu. Link geçersiz veya süresi dolmuş olabilir.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const passwordRules = [
    { label: 'En az 8 karakter',     test: (p) => p.length >= 8 },
    { label: 'En az 1 büyük harf',   test: (p) => /[A-Z]/.test(p) },
    { label: 'En az 1 küçük harf',   test: (p) => /[a-z]/.test(p) },
    { label: 'En az 1 rakam',        test: (p) => /[0-9]/.test(p) },
    { label: 'En az 1 özel karakter',test: (p) => /[^A-Za-z0-9]/.test(p) },
  ];

  const EyeIcon = ({ show }) => show ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );

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

          {/* Başlık */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '16px',
              background: themeName === 'light'
                ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
                : 'linear-gradient(135deg, #00d4ff 0%, #0088cc 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px',
              boxShadow: themeName === 'light'
                ? '0 8px 24px rgba(99, 102, 241, 0.3)'
                : '0 8px 24px rgba(0, 212, 255, 0.3)'
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <h1 style={{ fontSize: '26px', marginBottom: '8px', color: headingColor, fontWeight: '700', letterSpacing: '-0.5px' }}>
              Yeni Şifre Belirle
            </h1>
            <p style={{ color: textColor, fontSize: '15px', lineHeight: '1.6' }}>
              Güçlü bir şifre oluşturun.
            </p>
          </div>

          <form onSubmit={handleSubmit}>

            {/* Yeni Şifre */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: labelColor }}>
                Yeni Şifre
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="En az 8 karakter"
                  disabled={loading}
                  autoComplete="new-password"
                  style={{
                    width: '100%', padding: '12px 48px 12px 16px',
                    border: `1.5px solid ${inputBorder}`, borderRadius: '10px',
                    fontSize: '15px', color: inputText,
                    backgroundColor: loading ? inputDisabledBg : inputBg,
                    outline: 'none', fontFamily: 'inherit',
                    boxSizing: 'border-box', transition: 'all 0.2s ease'
                  }}
                  onFocus={(e) => { e.target.style.borderColor = inputFocusBorder; e.target.style.boxShadow = inputFocusShadow; }}
                  onBlur={(e)  => { e.target.style.borderColor = inputBorder; e.target.style.boxShadow = 'none'; }}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: iconColor, display: 'flex', alignItems: 'center', padding: '4px' }}
                >
                  <EyeIcon show={showPassword} />
                </button>
              </div>

              {/* Şifre güç göstergesi */}
              {formData.password && (
                <div style={{ marginTop: '8px' }}>
                  <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} style={{
                        flex: 1, height: '4px', borderRadius: '2px',
                        backgroundColor: i <= passwordStrength.score ? passwordStrength.color : dividerColor,
                        transition: 'background-color 0.3s ease'
                      }} />
                    ))}
                  </div>
                  <p style={{ fontSize: '12px', color: passwordStrength.color, fontWeight: '600' }}>
                    {passwordStrength.label}
                  </p>
                </div>
              )}

              {/* Şifre kuralları */}
              {formData.password && (
                <div style={{ marginTop: '10px', padding: '12px', backgroundColor: rulesBg, borderRadius: '10px', border: `1px solid ${rulesBorder}` }}>
                  {passwordRules.map((rule, i) => {
                    const passed = rule.test(formData.password);
                    return (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: i < passwordRules.length - 1 ? '6px' : 0, fontSize: '12px', color: passed ? '#22c55e' : textColor }}>
                        <span>{passed ? '✅' : '⭕'}</span>
                        {rule.label}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Şifre Tekrar */}
            <div style={{ marginBottom: '28px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: labelColor }}>
                Şifre Tekrar
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Şifrenizi tekrar girin"
                  disabled={loading}
                  autoComplete="new-password"
                  style={{
                    width: '100%', padding: '12px 48px 12px 16px',
                    border: `1.5px solid ${formData.confirmPassword && formData.password !== formData.confirmPassword ? '#ef4444' : inputBorder}`,
                    borderRadius: '10px', fontSize: '15px', color: inputText,
                    backgroundColor: loading ? inputDisabledBg : inputBg,
                    outline: 'none', fontFamily: 'inherit',
                    boxSizing: 'border-box', transition: 'all 0.2s ease'
                  }}
                  onFocus={(e) => { e.target.style.borderColor = inputFocusBorder; e.target.style.boxShadow = inputFocusShadow; }}
                  onBlur={(e)  => { e.target.style.borderColor = inputBorder; e.target.style.boxShadow = 'none'; }}
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: iconColor, display: 'flex', alignItems: 'center', padding: '4px' }}
                >
                  <EyeIcon show={showConfirmPassword} />
                </button>
              </div>

              {formData.confirmPassword && formData.password && (
                <p style={{ fontSize: '12px', marginTop: '6px', fontWeight: '600', color: formData.password === formData.confirmPassword ? '#22c55e' : '#ef4444' }}>
                  {formData.password === formData.confirmPassword ? '✅ Şifreler eşleşiyor' : '❌ Şifreler eşleşmiyor'}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="emerald-btn"
              style={{ width: '100%', padding: '14px 20px', fontSize: '15px', opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ animation: 'spin 1s linear infinite' }}>
                    <path d="M8 1.5V4.5M8 11.5V14.5M14.5 8H11.5M4.5 8H1.5M12.7 12.7L10.6 10.6M5.4 5.4L3.3 3.3M12.7 3.3L10.6 5.4M5.4 10.6L3.3 12.7" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  Güncelleniyor...
                </span>
              ) : 'Şifremi Güncelle'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '32px', paddingTop: '24px', borderTop: `1px solid ${dividerColor}` }}>
            <p style={{ color: textColor, fontSize: '14px', fontWeight: '500' }}>
              <Link to="/login"
                style={{ color: linkColor, fontWeight: '600', textDecoration: 'none' }}
                onMouseEnter={(e) => e.target.style.color = linkHoverColor}
                onMouseLeave={(e) => e.target.style.color = linkColor}
              >
                ← Giriş sayfasına dön
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

export default ResetPassword;
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearError } from '../../redux/authSlice';
import { useTheme } from '../../context/ThemeContext';

// ============================================
// ŞİFRE GÜCÜ HESAPLA
// ============================================
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

// ============================================
// ŞİFRE KURALLARI KONTROLÜ
// ============================================
const passwordRules = [
  { id: 'length',    label: 'En az 8 karakter',       test: (p) => p.length >= 8 },
  { id: 'uppercase', label: 'En az 1 büyük harf',      test: (p) => /[A-Z]/.test(p) },
  { id: 'lowercase', label: 'En az 1 küçük harf',      test: (p) => /[a-z]/.test(p) },
  { id: 'number',    label: 'En az 1 rakam',           test: (p) => /[0-9]/.test(p) },
  { id: 'special',   label: 'En az 1 özel karakter',   test: (p) => /[^A-Za-z0-9]/.test(p) },
];

const Register = () => {
  const { themeName } = useTheme();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPasswordRules, setShowPasswordRules] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated, user } = useSelector((state) => state.auth);

  const passwordStrength = getPasswordStrength(formData.password);

  // Giriş başarılıysa yönlendir
  useEffect(() => {
    if (isAuthenticated && user) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    return () => dispatch(clearError());
  }, [dispatch]);

  // ── TEMA RENKLERİ ──────────────────────────────────────────────────────────
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

  const headingColor    = themeName === 'light' ? '#1a1a1a'   : themeName === 'dark' ? '#f1f5f9'  : '#e5e5e5';
  const textColor       = themeName === 'light' ? '#4a5568'   : themeName === 'dark' ? '#cbd5e0'  : '#a3a3a3';
  const labelColor      = themeName === 'light' ? '#2d3748'   : themeName === 'dark' ? '#e2e8f0'  : '#d4d4d4';
  const inputBg         = themeName === 'light' ? 'white'     : themeName === 'dark' ? '#1e293b'  : '#1a1a1a';
  const inputBorder     = themeName === 'light' ? '#e2e8f0'   : themeName === 'dark' ? '#334155'  : '#2a2a2a';
  const inputText       = themeName === 'light' ? '#2d3748'   : themeName === 'dark' ? '#f1f5f9'  : '#e5e5e5';
  const inputDisabledBg = themeName === 'light' ? '#f7fafc'   : themeName === 'dark' ? '#0f172a'  : '#0a0a0a';
  const inputFocusBorder= themeName === 'light' ? '#6366f1'   : themeName === 'dark' ? '#00ffff'  : '#d4d4d4';
  const inputFocusShadow= themeName === 'light'
    ? '0 0 0 3px rgba(99, 102, 241, 0.1)'
    : themeName === 'dark'
      ? '0 0 0 3px rgba(0, 255, 255, 0.1)'
      : '0 0 0 3px rgba(212, 212, 212, 0.1)';
  const linkColor       = themeName === 'light' ? '#6366f1'   : themeName === 'dark' ? '#00d4ff'  : '#d4d4d4';
  const linkHoverColor  = themeName === 'light' ? '#4f46e5'   : themeName === 'dark' ? '#00ffff'  : '#e5e5e5';
  const footerTextColor = themeName === 'light' ? 'rgba(26,26,26,0.6)' : 'rgba(255,255,255,0.7)';
  const dividerColor    = themeName === 'light' ? '#e2e8f0'   : themeName === 'dark' ? '#334155'  : '#2a2a2a';
  const iconColor       = themeName === 'light' ? '#9ca3af'   : themeName === 'dark' ? '#64748b'  : '#525252';
  const rulesBg         = themeName === 'light' ? '#f8fafc'   : themeName === 'dark' ? '#0f172a'  : '#0a0a0a';
  const rulesBorder     = themeName === 'light' ? '#e2e8f0'   : themeName === 'dark' ? '#1e293b'  : '#1a1a1a';

  // ── VALIDASYON ─────────────────────────────────────────────────────────────
  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Ad soyad gereklidir';
        if (value.trim().length < 2) return 'Ad soyad en az 2 karakter olmalıdır';
        return '';

      case 'email':
        if (!value) return 'Email gereklidir';
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/.test(value))
          return 'Geçerli bir email adresi girin';
        const blockedDomains = ['tempmail.com', 'guerrillamail.com', 'mailinator.com', 'yopmail.com'];
        if (blockedDomains.some(d => value.toLowerCase().includes(d)))
          return 'Geçici email adresleri kabul edilmemektedir';
        return '';

      case 'password':
        if (!value) return 'Şifre gereklidir';
        if (value.length < 8) return 'Şifre en az 8 karakter olmalıdır';
        if (!/[A-Z]/.test(value)) return 'En az 1 büyük harf gereklidir';
        if (!/[a-z]/.test(value)) return 'En az 1 küçük harf gereklidir';
        if (!/[0-9]/.test(value)) return 'En az 1 rakam gereklidir';
        if (!/[^A-Za-z0-9]/.test(value)) return 'En az 1 özel karakter gereklidir (!@#$%^&*)';
        return '';

      case 'confirmPassword':
        if (!value) return 'Şifre tekrarı gereklidir';
        if (value !== formData.password) return 'Şifreler eşleşmiyor';
        return '';

      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Anlık validasyon
    if (formErrors[name] !== undefined) {
      setFormErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    }

    // Şifre değişince confirmPassword'ü de kontrol et
    if (name === 'password' && formData.confirmPassword) {
      setFormErrors(prev => ({
        ...prev,
        confirmPassword: formData.confirmPassword !== value ? 'Şifreler eşleşmiyor' : ''
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setFormErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    if (name === 'password') setShowPasswordRules(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Tüm alanları validate et
    const errors = {};
    Object.keys(formData).forEach(key => {
      errors[key] = validateField(key, formData[key]);
    });
    setFormErrors(errors);

    // Hata varsa submit etme
    if (Object.values(errors).some(err => err !== '')) return;

    dispatch(register({
      name: formData.name.trim(),
      email: formData.email.toLowerCase().trim(),
      password: formData.password
    }));
  };

  const handleGoogleRegister = () => {
    alert('Google ile kayıt özelliği yakında eklenecek!');
  };

  // ── INPUT STYLE HELPER ──────────────────────────────────────────────────────
  const inputStyle = (fieldName) => ({
    width: '100%',
    padding: '12px 16px',
    border: `1.5px solid ${formErrors[fieldName] ? '#ef4444' : inputBorder}`,
    borderRadius: '10px',
    fontSize: '15px',
    color: inputText,
    backgroundColor: loading ? inputDisabledBg : inputBg,
    transition: 'all 0.2s ease',
    outline: 'none',
    fontFamily: 'inherit',
    boxSizing: 'border-box'
  });

  return (
    <div style={{
      minHeight: '100vh',
      background: pageBg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden',
      transition: 'background 0.4s ease'
    }}>
      {/* Animated blobs */}
      <div style={{
        position: 'absolute', top: '10%', left: '10%',
        width: '300px', height: '300px', background: blob1,
        borderRadius: '50%', filter: 'blur(40px)',
        animation: 'float 6s ease-in-out infinite', pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute', bottom: '10%', right: '10%',
        width: '400px', height: '400px', background: blob2,
        borderRadius: '50%', filter: 'blur(40px)',
        animation: 'float 8s ease-in-out infinite reverse', pointerEvents: 'none'
      }} />

      <div style={{ maxWidth: '440px', width: '100%', position: 'relative', zIndex: 1 }}>
        <div style={{
          backgroundColor: cardBg,
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '48px 40px',
          boxShadow: cardShadow,
          border: cardBorder,
          transition: 'all 0.4s ease'
        }}>

          {/* Başlık */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h1 style={{ fontSize: '28px', marginBottom: '8px', color: headingColor, fontWeight: '700', letterSpacing: '-0.5px' }}>
              Kayıt Ol
            </h1>
            <p style={{ color: textColor, fontSize: '15px' }}>Yeni hesap oluşturun</p>
          </div>

          {/* API Hata mesajı */}
          {error && (
            <div style={{
              background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)',
              color: 'white', padding: '14px 16px', borderRadius: '12px',
              marginBottom: '24px', fontSize: '14px', fontWeight: '500',
              display: 'flex', alignItems: 'center', gap: '10px',
              boxShadow: '0 4px 12px rgba(238, 90, 111, 0.3)'
            }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM11 15H9V13H11V15ZM11 11H9V5H11V11Z" fill="white"/>
              </svg>
              {error}
            </div>
          )}

          {/* Google Kayıt */}
          <button
            onClick={handleGoogleRegister}
            type="button"
            style={{
              width: '100%', padding: '14px 20px', marginBottom: '24px',
              border: `1.5px solid ${inputBorder}`, borderRadius: '12px',
              backgroundColor: inputBg, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '12px', fontSize: '15px', fontWeight: '600', color: labelColor,
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = inputFocusBorder; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = inputBorder; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M19.6 10.227c0-.709-.064-1.39-.182-2.045H10v3.868h5.382a4.6 4.6 0 01-1.996 3.018v2.51h3.232c1.891-1.742 2.982-4.305 2.982-7.35z" fill="#4285F4"/>
              <path d="M10 20c2.7 0 4.964-.895 6.618-2.423l-3.232-2.509c-.895.6-2.04.955-3.386.955-2.605 0-4.81-1.76-5.595-4.123H1.064v2.59A9.996 9.996 0 0010 20z" fill="#34A853"/>
              <path d="M4.405 11.9c-.2-.6-.314-1.24-.314-1.9 0-.66.114-1.3.314-1.9V5.51H1.064A9.996 9.996 0 000 10c0 1.614.386 3.14 1.064 4.49l3.34-2.59z" fill="#FBBC05"/>
              <path d="M10 3.977c1.468 0 2.786.505 3.823 1.496l2.868-2.868C14.959.99 12.695 0 10 0 6.09 0 2.71 2.24 1.064 5.51l3.34 2.59C5.19 5.736 7.395 3.977 10 3.977z" fill="#EA4335"/>
            </svg>
            Google ile Kayıt Ol
          </button>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', margin: '24px 0', gap: '16px' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: dividerColor }} />
            <span style={{ color: textColor, fontSize: '13px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px' }}>veya</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: dividerColor }} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>

            {/* Ad Soyad */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: labelColor }}>
                Ad Soyad
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Adınız ve soyadınız"
                disabled={loading}
                autoComplete="name"
                style={inputStyle('name')}
                onFocus={(e) => { e.target.style.borderColor = inputFocusBorder; e.target.style.boxShadow = inputFocusShadow; }}
              />
              {formErrors.name && (
                <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  ⚠ {formErrors.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: labelColor }}>
                E-posta
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="ornek@email.com"
                disabled={loading}
                autoComplete="email"
                style={inputStyle('email')}
                onFocus={(e) => { e.target.style.borderColor = inputFocusBorder; e.target.style.boxShadow = inputFocusShadow; }}
              />
              {formErrors.email && (
                <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '6px' }}>
                  ⚠ {formErrors.email}
                </p>
              )}
            </div>

            {/* Şifre */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: labelColor }}>
                Şifre
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onFocus={() => setShowPasswordRules(true)}
                  placeholder="En az 8 karakter"
                  disabled={loading}
                  autoComplete="new-password"
                  style={{ ...inputStyle('password'), paddingRight: '48px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: '14px', top: '50%',
                    transform: 'translateY(-50%)', background: 'none',
                    border: 'none', cursor: 'pointer', color: iconColor,
                    display: 'flex', alignItems: 'center', padding: '4px'
                  }}
                >
                  {showPassword ? (
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
                  )}
                </button>
              </div>

              {/* Şifre Güç Göstergesi */}
              {formData.password && (
                <div style={{ marginTop: '8px' }}>
                  <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        style={{
                          flex: 1, height: '4px', borderRadius: '2px',
                          backgroundColor: i <= passwordStrength.score ? passwordStrength.color : dividerColor,
                          transition: 'background-color 0.3s ease'
                        }}
                      />
                    ))}
                  </div>
                  <p style={{ fontSize: '12px', color: passwordStrength.color, fontWeight: '600' }}>
                    {passwordStrength.label}
                  </p>
                </div>
              )}

              {/* Şifre Kuralları */}
              {showPasswordRules && (
                <div style={{
                  marginTop: '10px', padding: '12px',
                  backgroundColor: rulesBg, borderRadius: '10px',
                  border: `1px solid ${rulesBorder}`
                }}>
                  {passwordRules.map((rule) => {
                    const passed = rule.test(formData.password);
                    return (
                      <div key={rule.id} style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        marginBottom: '6px', fontSize: '12px',
                        color: passed ? '#22c55e' : textColor
                      }}>
                        <span style={{ fontSize: '14px' }}>{passed ? '✅' : '⭕'}</span>
                        {rule.label}
                      </div>
                    );
                  })}
                </div>
              )}

              {formErrors.password && (
                <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '6px' }}>
                  ⚠ {formErrors.password}
                </p>
              )}
            </div>

            {/* Şifre Tekrar */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: labelColor }}>
                Şifre Tekrar
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Şifrenizi tekrar girin"
                  disabled={loading}
                  autoComplete="new-password"
                  style={{ ...inputStyle('confirmPassword'), paddingRight: '48px' }}
                  onFocus={(e) => { e.target.style.borderColor = inputFocusBorder; e.target.style.boxShadow = inputFocusShadow; }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: 'absolute', right: '14px', top: '50%',
                    transform: 'translateY(-50%)', background: 'none',
                    border: 'none', cursor: 'pointer', color: iconColor,
                    display: 'flex', alignItems: 'center', padding: '4px'
                  }}
                >
                  {showConfirmPassword ? (
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
                  )}
                </button>
              </div>

              {/* Şifreler eşleşiyor göstergesi */}
              {formData.confirmPassword && formData.password && (
                <p style={{
                  fontSize: '12px', marginTop: '6px', fontWeight: '600',
                  color: formData.password === formData.confirmPassword ? '#22c55e' : '#ef4444'
                }}>
                  {formData.password === formData.confirmPassword ? '✅ Şifreler eşleşiyor' : '❌ Şifreler eşleşmiyor'}
                </p>
              )}

              {formErrors.confirmPassword && (
                <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
                  ⚠ {formErrors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit */}
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
                  Kayıt Olunuyor...
                </span>
              ) : 'Kayıt Ol'}
            </button>
          </form>

          {/* Login linki */}
          <div style={{
            textAlign: 'center', marginTop: '32px', paddingTop: '24px',
            borderTop: `1px solid ${dividerColor}`
          }}>
            <p style={{ color: textColor, fontSize: '14px', fontWeight: '500' }}>
              Zaten hesabınız var mı?{' '}
              <Link
                to="/login"
                style={{ color: linkColor, fontWeight: '600', textDecoration: 'none' }}
                onMouseEnter={(e) => e.target.style.color = linkHoverColor}
                onMouseLeave={(e) => e.target.style.color = linkColor}
              >
                Giriş Yap
              </Link>
            </p>
          </div>
        </div>

        <p style={{
          textAlign: 'center', marginTop: '24px', color: footerTextColor,
          fontSize: '13px', fontWeight: '500'
        }}>
          © 2025 Tüm hakları saklıdır
        </p>
      </div>

      <style>{`
        @keyframes spin  { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-20px); } }

        .emerald-btn {
          display: inline-block;
          background: linear-gradient(135deg, #1f2937 0%, #111827 45%, #0a0e18 100%);
          color: #ffffff; font-weight: 600; border: none; border-radius: 10px;
          cursor: pointer; position: relative; overflow: hidden;
          transition: transform 0.35s cubic-bezier(0.4,0,0.2,1),
                      box-shadow 0.35s cubic-bezier(0.4,0,0.2,1);
          box-shadow: 0 4px 18px rgba(17,24,39,0.45), inset 0 1px 0 rgba(255,255,255,0.15);
        }
        .emerald-btn::before {
          content: ''; position: absolute; top: 0; left: -110%; width: 80%; height: 100%;
          background: linear-gradient(100deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%);
          transition: left 0.55s cubic-bezier(0.4,0,0.2,1); pointer-events: none; z-index: 1;
        }
        .emerald-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #374151 0%, #1f2937 45%, #111827 100%);
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(17,24,39,0.55), inset 0 1px 0 rgba(255,255,255,0.25);
        }
        .emerald-btn:hover:not(:disabled)::before { left: 120%; }
        .emerald-btn:active:not(:disabled) { transform: translateY(0); }
      `}</style>
    </div>
  );
};

export default Register;
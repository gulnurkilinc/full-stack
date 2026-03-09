import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { updateUser } from '../../redux/authSlice';
import axiosInstance from '../../api/axiosInstance';
import { useTheme } from '../../context/ThemeContext';

const Profile = () => {
  const { themeName } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'password'
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    bio: '',
    username: '',
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPasswords, setShowPasswords] = useState({
    old: false, new: false, confirm: false
  });

  // Giriş yapılmamışsa login'e yönlendir
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Kullanıcı bilgilerini forma doldur
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || '',
        username: user.username || '',
      });
    }
  }, [user]);

  // ── TEMA RENKLERİ ─────────────────────────────────────────────────────────
  const pageBg       = themeName === 'light' ? '#f8f9fa' : themeName === 'dark' ? '#0f172a' : '#000000';
  const cardBg       = themeName === 'light' ? '#ffffff' : themeName === 'dark' ? '#1e293b' : '#1a1a1a';
  const cardBorder   = themeName === 'light' ? '#e2e8f0' : themeName === 'dark' ? '#334155' : '#2a2a2a';
  const headingColor = themeName === 'light' ? '#1a1a1a' : themeName === 'dark' ? '#f1f5f9' : '#e5e5e5';
  const textColor    = themeName === 'light' ? '#4a5568' : themeName === 'dark' ? '#cbd5e0' : '#a3a3a3';
  const labelColor   = themeName === 'light' ? '#2d3748' : themeName === 'dark' ? '#e2e8f0' : '#d4d4d4';
  const inputBg      = themeName === 'light' ? '#ffffff' : themeName === 'dark' ? '#0f172a' : '#0a0a0a';
  const inputBorder  = themeName === 'light' ? '#e2e8f0' : themeName === 'dark' ? '#334155' : '#2a2a2a';
  const inputText    = themeName === 'light' ? '#2d3748' : themeName === 'dark' ? '#f1f5f9' : '#e5e5e5';
  const inputFocusBorder = themeName === 'light' ? '#6366f1' : themeName === 'dark' ? '#00ffff' : '#d4d4d4';
  const inputFocusShadow = themeName === 'light'
    ? '0 0 0 3px rgba(99,102,241,0.1)'
    : themeName === 'dark'
      ? '0 0 0 3px rgba(0,255,255,0.1)'
      : '0 0 0 3px rgba(212,212,212,0.1)';
  const iconColor    = themeName === 'light' ? '#9ca3af' : themeName === 'dark' ? '#64748b' : '#525252';
  const tabActiveBg  = themeName === 'light' ? '#ffffff' : themeName === 'dark' ? '#1e293b' : '#1a1a1a';
  const tabInactiveBg= themeName === 'light' ? '#f1f5f9' : themeName === 'dark' ? '#0f172a' : '#0a0a0a';
  const tabBorder    = themeName === 'light' ? '#e2e8f0' : themeName === 'dark' ? '#334155' : '#2a2a2a';
  const dividerColor = themeName === 'light' ? '#e2e8f0' : themeName === 'dark' ? '#334155' : '#2a2a2a';
  const badgeBg      = themeName === 'light' ? '#f0fdf4' : themeName === 'dark' ? '#052e16' : '#0a1a0a';
  const badgeBorder  = themeName === 'light' ? '#bbf7d0' : themeName === 'dark' ? '#166534' : '#1a3a1a';
  const badgeColor   = themeName === 'light' ? '#15803d' : '#22c55e';

  // ── PROFIL GÜNCELLE ────────────────────────────────────────────────────────
  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    if (!profileData.name.trim()) {
      toast.error('İsim alanı boş bırakılamaz');
      return;
    }
    if (!profileData.email.trim()) {
      toast.error('Email alanı boş bırakılamaz');
      return;
    }

    setProfileLoading(true);
    try {
      const response = await axiosInstance.put('/profile/update', {
        name: profileData.name.trim(),
        email: profileData.email.toLowerCase().trim(),
        bio: profileData.bio,
        username: profileData.username.trim()
      });

      if (response.data.success) {
        dispatch(updateUser(response.data.user));
        toast.success('Profil bilgileriniz güncellendi! ✅');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Profil güncellenirken hata oluştu';
      toast.error(message);
    } finally {
      setProfileLoading(false);
    }
  };

  // ── ŞİFRE DEĞİŞTİR ────────────────────────────────────────────────────────
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (!passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error('Lütfen tüm alanları doldurun');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Yeni şifreler eşleşmiyor');
      return;
    }
    if (passwordData.newPassword.length < 8) {
      toast.error('Yeni şifre en az 8 karakter olmalıdır');
      return;
    }
    if (passwordData.oldPassword === passwordData.newPassword) {
      toast.error('Yeni şifre eski şifreyle aynı olamaz');
      return;
    }

    setPasswordLoading(true);
    try {
      const response = await axiosInstance.put('/password/change', {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      });

      if (response.data.success) {
        toast.success('Şifreniz başarıyla değiştirildi! 🔐');
        setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Şifre değiştirilirken hata oluştu';
      toast.error(message);
    } finally {
      setPasswordLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '12px 16px',
    border: `1.5px solid ${inputBorder}`, borderRadius: '10px',
    fontSize: '15px', color: inputText, backgroundColor: inputBg,
    outline: 'none', fontFamily: 'inherit',
    boxSizing: 'border-box', transition: 'all 0.2s ease'
  };

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

  const roleLabels = { user: 'Kullanıcı', author: 'Yazar', admin: 'Admin' };
  const roleColors = {
    user:   { bg: '#eff6ff', border: '#bfdbfe', color: '#1d4ed8' },
    author: { bg: '#fdf4ff', border: '#e9d5ff', color: '#7c3aed' },
    admin:  { bg: '#fef2f2', border: '#fecaca', color: '#dc2626' }
  };
  const role = user?.role || 'user';
  const roleStyle = roleColors[role];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: pageBg, paddingTop: '100px', paddingBottom: '60px', transition: 'background 0.4s ease' }}>
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '0 20px' }}>

        {/* ── Profil Kartı ── */}
        <div style={{ backgroundColor: cardBg, borderRadius: '20px', border: `1px solid ${cardBorder}`, overflow: 'hidden', marginBottom: '24px', boxShadow: themeName === 'light' ? '0 4px 24px rgba(0,0,0,0.06)' : '0 4px 24px rgba(0,0,0,0.3)' }}>

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
            {/* Avatar */}
            <div style={{
              width: '80px', height: '80px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontSize: '32px', fontWeight: '700',
              border: `4px solid ${cardBg}`,
              marginTop: '-40px', marginBottom: '16px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h2 style={{ fontSize: '22px', fontWeight: '700', color: headingColor, marginBottom: '4px', letterSpacing: '-0.4px' }}>
                  {user?.name}
                </h2>
                <p style={{ color: textColor, fontSize: '14px', marginBottom: '10px' }}>
                  {user?.email}
                </p>
                {/* Rol badge */}
                <span style={{
                  display: 'inline-block', padding: '4px 12px',
                  backgroundColor: roleStyle.bg, border: `1px solid ${roleStyle.border}`,
                  borderRadius: '20px', fontSize: '13px', fontWeight: '600', color: roleStyle.color
                }}>
                  {roleLabels[role]}
                </span>
              </div>

              {/* Kayıt tarihi */}
              <div style={{ textAlign: 'right' }}>
                <p style={{ color: textColor, fontSize: '13px', marginBottom: '4px' }}>
                  Kayıt tarihi
                </p>
                <p style={{ color: headingColor, fontSize: '14px', fontWeight: '600' }}>
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                </p>
              </div>
            </div>

            {/* Bio */}
            {user?.bio && (
              <p style={{ color: textColor, fontSize: '14px', marginTop: '16px', paddingTop: '16px', borderTop: `1px solid ${dividerColor}`, lineHeight: '1.6' }}>
                {user.bio}
              </p>
            )}
          </div>
        </div>

        {/* ── Tab Menü ── */}
        <div style={{ display: 'flex', backgroundColor: tabInactiveBg, borderRadius: '12px', padding: '4px', marginBottom: '24px', border: `1px solid ${tabBorder}` }}>
          {[
            { key: 'profile', label: 'Profil Bilgileri', icon: (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            )},
            { key: 'password', label: 'Şifre Değiştir', icon: (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            )}
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                flex: 1, padding: '10px 16px',
                backgroundColor: activeTab === tab.key ? tabActiveBg : 'transparent',
                color: activeTab === tab.key ? headingColor : textColor,
                border: activeTab === tab.key ? `1px solid ${tabBorder}` : '1px solid transparent',
                borderRadius: '10px', cursor: 'pointer',
                fontSize: '14px', fontWeight: activeTab === tab.key ? '600' : '500',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                transition: 'all 0.2s ease',
                boxShadow: activeTab === tab.key ? '0 1px 4px rgba(0,0,0,0.08)' : 'none'
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Form Kartı ── */}
        <div style={{ backgroundColor: cardBg, borderRadius: '20px', border: `1px solid ${cardBorder}`, padding: '32px', boxShadow: themeName === 'light' ? '0 4px 24px rgba(0,0,0,0.06)' : '0 4px 24px rgba(0,0,0,0.3)' }}>

          {/* PROFİL BİLGİLERİ FORMU */}
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileSubmit}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: headingColor, marginBottom: '24px', letterSpacing: '-0.3px' }}>
                Profil Bilgileri
              </h3>

              {/* Ad Soyad */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: labelColor }}>
                  Ad Soyad
                </label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Adınız ve soyadınız"
                  disabled={profileLoading}
                  autoComplete="name"
                  style={inputStyle}
                  onFocus={(e) => { e.target.style.borderColor = inputFocusBorder; e.target.style.boxShadow = inputFocusShadow; }}
                  onBlur={(e)  => { e.target.style.borderColor = inputBorder; e.target.style.boxShadow = 'none'; }}
                />
              </div>

              {/* Email */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: labelColor }}>
                  E-posta
                </label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="ornek@email.com"
                  disabled={profileLoading}
                  autoComplete="email"
                  style={inputStyle}
                  onFocus={(e) => { e.target.style.borderColor = inputFocusBorder; e.target.style.boxShadow = inputFocusShadow; }}
                  onBlur={(e)  => { e.target.style.borderColor = inputBorder; e.target.style.boxShadow = 'none'; }}
                />
              </div>

              {/* Bio */}
              <div style={{ marginBottom: '28px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: labelColor }}>
                  Hakkımda <span style={{ color: textColor, fontWeight: '400' }}>(isteğe bağlı)</span>
                </label>
                <textarea
                  value={profileData.bio}
                  onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Kendinizden kısaca bahsedin..."
                  disabled={profileLoading}
                  maxLength={500}
                  rows={4}
                  style={{ ...inputStyle, resize: 'vertical', minHeight: '100px' }}
                  onFocus={(e) => { e.target.style.borderColor = inputFocusBorder; e.target.style.boxShadow = inputFocusShadow; }}
                  onBlur={(e)  => { e.target.style.borderColor = inputBorder; e.target.style.boxShadow = 'none'; }}
                />
                <p style={{ color: textColor, fontSize: '12px', marginTop: '4px', textAlign: 'right' }}>
                  {profileData.bio.length}/500
                </p>
              </div>

              {/* Kullanıcı Adı */}
              <div style={{ marginBottom: '28px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: labelColor }}>
                  Kullanıcı Adı <span style={{ color: textColor, fontWeight: '400' }}>(isteğe bağlı)</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: textColor, fontSize: '15px', fontWeight: '500' }}>@</span>
                  <input
                    type="text"
                    value={profileData.username}
                    onChange={(e) => setProfileData(prev => ({ ...prev, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') }))}
                    placeholder="kullanici_adi"
                    disabled={profileLoading}
                    maxLength={30}
                    style={{ ...inputStyle, paddingLeft: '30px' }}
                    onFocus={(e) => { e.target.style.borderColor = inputFocusBorder; e.target.style.boxShadow = inputFocusShadow; }}
                    onBlur={(e)  => { e.target.style.borderColor = inputBorder; e.target.style.boxShadow = 'none'; }}
                  />
                </div>
                <p style={{ color: textColor, fontSize: '12px', marginTop: '6px' }}>
                  Sadece harf, rakam ve _ kullanabilirsiniz. Örnek: <strong style={{ color: headingColor }}>gulnur_kilinc</strong>
                </p>
                {profileData.username && (
                  <p style={{ fontSize: '12px', marginTop: '4px', color: textColor }}>
                    Profil linkin: <strong style={{ color: headingColor }}>/profile/{profileData.username}</strong>
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={profileLoading}
                className="emerald-btn"
                style={{ padding: '12px 32px', fontSize: '15px', opacity: profileLoading ? 0.6 : 1, cursor: profileLoading ? 'not-allowed' : 'pointer' }}
              >
                {profileLoading ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ animation: 'spin 1s linear infinite' }}>
                      <path d="M8 1.5V4.5M8 11.5V14.5M14.5 8H11.5M4.5 8H1.5M12.7 12.7L10.6 10.6M5.4 5.4L3.3 3.3M12.7 3.3L10.6 5.4M5.4 10.6L3.3 12.7" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    Kaydediliyor...
                  </span>
                ) : 'Değişiklikleri Kaydet'}
              </button>
            </form>
          )}

          {/* ŞİFRE DEĞİŞTİR FORMU */}
          {activeTab === 'password' && (
            <form onSubmit={handlePasswordSubmit}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: headingColor, marginBottom: '8px', letterSpacing: '-0.3px' }}>
                Şifre Değiştir
              </h3>
              <p style={{ color: textColor, fontSize: '14px', marginBottom: '24px' }}>
                Güvenliğiniz için güçlü bir şifre kullanın.
              </p>

              {/* Mevcut Şifre */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: labelColor }}>
                  Mevcut Şifre
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPasswords.old ? 'text' : 'password'}
                    value={passwordData.oldPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, oldPassword: e.target.value }))}
                    placeholder="Mevcut şifreniz"
                    disabled={passwordLoading}
                    autoComplete="current-password"
                    style={{ ...inputStyle, paddingRight: '48px' }}
                    onFocus={(e) => { e.target.style.borderColor = inputFocusBorder; e.target.style.boxShadow = inputFocusShadow; }}
                    onBlur={(e)  => { e.target.style.borderColor = inputBorder; e.target.style.boxShadow = 'none'; }}
                  />
                  <button type="button" onClick={() => setShowPasswords(p => ({ ...p, old: !p.old }))}
                    style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: iconColor, display: 'flex', alignItems: 'center', padding: '4px' }}>
                    <EyeIcon show={showPasswords.old} />
                  </button>
                </div>
              </div>

              {/* Yeni Şifre */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: labelColor }}>
                  Yeni Şifre
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                    placeholder="En az 8 karakter"
                    disabled={passwordLoading}
                    autoComplete="new-password"
                    style={{ ...inputStyle, paddingRight: '48px' }}
                    onFocus={(e) => { e.target.style.borderColor = inputFocusBorder; e.target.style.boxShadow = inputFocusShadow; }}
                    onBlur={(e)  => { e.target.style.borderColor = inputBorder; e.target.style.boxShadow = 'none'; }}
                  />
                  <button type="button" onClick={() => setShowPasswords(p => ({ ...p, new: !p.new }))}
                    style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: iconColor, display: 'flex', alignItems: 'center', padding: '4px' }}>
                    <EyeIcon show={showPasswords.new} />
                  </button>
                </div>
              </div>

              {/* Şifre Tekrar */}
              <div style={{ marginBottom: '28px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: labelColor }}>
                  Yeni Şifre Tekrar
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="Yeni şifrenizi tekrar girin"
                    disabled={passwordLoading}
                    autoComplete="new-password"
                    style={{ ...inputStyle, paddingRight: '48px' }}
                    onFocus={(e) => { e.target.style.borderColor = inputFocusBorder; e.target.style.boxShadow = inputFocusShadow; }}
                    onBlur={(e)  => { e.target.style.borderColor = inputBorder; e.target.style.boxShadow = 'none'; }}
                  />
                  <button type="button" onClick={() => setShowPasswords(p => ({ ...p, confirm: !p.confirm }))}
                    style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: iconColor, display: 'flex', alignItems: 'center', padding: '4px' }}>
                    <EyeIcon show={showPasswords.confirm} />
                  </button>
                </div>
                {passwordData.confirmPassword && passwordData.newPassword && (
                  <p style={{ fontSize: '12px', marginTop: '6px', fontWeight: '600', color: passwordData.newPassword === passwordData.confirmPassword ? '#22c55e' : '#ef4444' }}>
                    {passwordData.newPassword === passwordData.confirmPassword ? '✅ Şifreler eşleşiyor' : '❌ Şifreler eşleşmiyor'}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={passwordLoading}
                className="emerald-btn"
                style={{ padding: '12px 32px', fontSize: '15px', opacity: passwordLoading ? 0.6 : 1, cursor: passwordLoading ? 'not-allowed' : 'pointer' }}
              >
                {passwordLoading ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ animation: 'spin 1s linear infinite' }}>
                      <path d="M8 1.5V4.5M8 11.5V14.5M14.5 8H11.5M4.5 8H1.5M12.7 12.7L10.6 10.6M5.4 5.4L3.3 3.3M12.7 3.3L10.6 5.4M5.4 10.6L3.3 12.7" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    Değiştiriliyor...
                  </span>
                ) : 'Şifremi Değiştir'}
              </button>
            </form>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .emerald-btn { display: inline-block; background: linear-gradient(135deg, #1f2937 0%, #111827 45%, #0a0e18 100%); color: #ffffff; font-weight: 600; border: none; border-radius: 10px; cursor: pointer; position: relative; overflow: hidden; transition: transform 0.35s cubic-bezier(0.4,0,0.2,1), box-shadow 0.35s cubic-bezier(0.4,0,0.2,1); box-shadow: 0 4px 18px rgba(17,24,39,0.45), inset 0 1px 0 rgba(255,255,255,0.15); }
        .emerald-btn::before { content: ''; position: absolute; top: 0; left: -110%; width: 80%; height: 100%; background: linear-gradient(100deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%); transition: left 0.55s cubic-bezier(0.4,0,0.2,1); pointer-events: none; z-index: 1; }
        .emerald-btn:hover:not(:disabled) { background: linear-gradient(135deg, #374151 0%, #1f2937 45%, #111827 100%); transform: translateY(-2px); box-shadow: 0 8px 28px rgba(17,24,39,0.55), inset 0 1px 0 rgba(255,255,255,0.25); }
        .emerald-btn:hover:not(:disabled)::before { left: 120%; }
        .emerald-btn:active:not(:disabled) { transform: translateY(0); }
      `}</style>
    </div>
  );
};

export default Profile;
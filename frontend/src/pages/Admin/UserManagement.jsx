import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '../../api/axiosInstance';
import { useTheme } from '../../context/ThemeContext';

const UserManagement = () => {
  const { themeName } = useTheme();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [deleteModal, setDeleteModal] = useState(null); // silinecek kullanıcı
  const [roleLoading, setRoleLoading] = useState(null); // rol değiştirilen user id
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Admin değilse yönlendir
  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      navigate('/');
    }
  }, [isAuthenticated, user, navigate]);

  // Kullanıcıları getir
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/admin/users');
      if (response.data.success) {
        setUsers(response.data.users);
      }
    } catch (error) {
      toast.error('Kullanıcılar yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // Rol değiştir
  const handleRoleChange = async (userId, newRole) => {
    setRoleLoading(userId);
    try {
      const response = await axiosInstance.put(`/admin/users/${userId}/role`, { role: newRole });
      if (response.data.success) {
        setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: newRole } : u));
        toast.success('Kullanıcı rolü güncellendi ✅');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Rol güncellenirken hata oluştu');
    } finally {
      setRoleLoading(null);
    }
  };

  // Kullanıcı sil
  const handleDelete = async () => {
    if (!deleteModal) return;
    setDeleteLoading(true);
    try {
      const response = await axiosInstance.delete(`/admin/users/${deleteModal._id}`);
      if (response.data.success) {
        setUsers(prev => prev.filter(u => u._id !== deleteModal._id));
        toast.success('Kullanıcı silindi');
        setDeleteModal(null);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Kullanıcı silinirken hata oluştu');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Filtrele
  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          u.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === 'all' || u.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  // ── TEMA RENKLERİ ─────────────────────────────────────────────────────────
  const pageBg       = themeName === 'light' ? '#f8f9fa' : themeName === 'dark' ? '#0f172a' : '#000000';
  const cardBg       = themeName === 'light' ? '#ffffff' : themeName === 'dark' ? '#1e293b' : '#1a1a1a';
  const cardBorder   = themeName === 'light' ? '#e2e8f0' : themeName === 'dark' ? '#334155' : '#2a2a2a';
  const headingColor = themeName === 'light' ? '#1a1a1a' : themeName === 'dark' ? '#f1f5f9' : '#e5e5e5';
  const textColor    = themeName === 'light' ? '#4a5568' : themeName === 'dark' ? '#cbd5e0' : '#a3a3a3';
  const inputBg      = themeName === 'light' ? '#ffffff' : themeName === 'dark' ? '#0f172a' : '#0a0a0a';
  const inputBorder  = themeName === 'light' ? '#e2e8f0' : themeName === 'dark' ? '#334155' : '#2a2a2a';
  const inputText    = themeName === 'light' ? '#2d3748' : themeName === 'dark' ? '#f1f5f9' : '#e5e5e5';
  const rowHoverBg   = themeName === 'light' ? '#f8fafc' : themeName === 'dark' ? '#0f172a' : '#0a0a0a';
  const dividerColor = themeName === 'light' ? '#e2e8f0' : themeName === 'dark' ? '#334155' : '#2a2a2a';
  const modalBg      = themeName === 'light' ? '#ffffff' : themeName === 'dark' ? '#1e293b' : '#1a1a1a';

  const roleColors = {
    user:   { bg: '#eff6ff', border: '#bfdbfe', color: '#1d4ed8' },
    author: { bg: '#fdf4ff', border: '#e9d5ff', color: '#7c3aed' },
    admin:  { bg: '#fef2f2', border: '#fecaca', color: '#dc2626' }
  };
  const roleLabels = { user: 'Kullanıcı', author: 'Yazar', admin: 'Admin' };

  // ── LOADING ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: pageBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <svg width="40" height="40" viewBox="0 0 16 16" fill="none" style={{ animation: 'spin 1s linear infinite', marginBottom: '16px' }}>
            <path d="M8 1.5V4.5M8 11.5V14.5M14.5 8H11.5M4.5 8H1.5M12.7 12.7L10.6 10.6M5.4 5.4L3.3 3.3M12.7 3.3L10.6 5.4M5.4 10.6L3.3 12.7"
              stroke={textColor} strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <p style={{ color: textColor }}>Yükleniyor...</p>
        </div>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: pageBg, paddingTop: '100px', paddingBottom: '60px', transition: 'background 0.4s ease' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px' }}>

        {/* ── Başlık ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <Link to="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: textColor, fontSize: '14px', fontWeight: '500', textDecoration: 'none', marginBottom: '8px' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
              Dashboard
            </Link>
            <h1 style={{ fontSize: '26px', fontWeight: '700', color: headingColor, letterSpacing: '-0.5px', margin: 0 }}>
              Kullanıcı Yönetimi
            </h1>
            <p style={{ color: textColor, fontSize: '14px', marginTop: '4px' }}>
              Toplam {users.length} kullanıcı
            </p>
          </div>

          {/* İstatistik badge'leri */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {['user', 'author', 'admin'].map(role => {
              const count = users.filter(u => u.role === role).length;
              const rc = roleColors[role];
              return (
                <div key={role} style={{ padding: '8px 16px', backgroundColor: rc.bg, border: `1px solid ${rc.border}`, borderRadius: '10px', textAlign: 'center' }}>
                  <p style={{ fontSize: '18px', fontWeight: '700', color: rc.color, margin: 0 }}>{count}</p>
                  <p style={{ fontSize: '12px', color: rc.color, margin: 0 }}>{roleLabels[role]}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Filtreler ── */}
        <div style={{ backgroundColor: cardBg, borderRadius: '16px', border: `1px solid ${cardBorder}`, padding: '20px', marginBottom: '20px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Arama */}
          <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={textColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="İsim veya email ile ara..."
              style={{
                width: '100%', padding: '10px 12px 10px 36px',
                border: `1.5px solid ${inputBorder}`, borderRadius: '10px',
                fontSize: '14px', color: inputText, backgroundColor: inputBg,
                outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Rol filtresi */}
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            style={{
              padding: '10px 16px', border: `1.5px solid ${inputBorder}`,
              borderRadius: '10px', fontSize: '14px', color: inputText,
              backgroundColor: inputBg, outline: 'none', cursor: 'pointer',
              fontFamily: 'inherit'
            }}
          >
            <option value="all">Tüm Roller</option>
            <option value="user">Kullanıcı</option>
            <option value="author">Yazar</option>
            <option value="admin">Admin</option>
          </select>

          {/* Sonuç sayısı */}
          <p style={{ color: textColor, fontSize: '14px', whiteSpace: 'nowrap' }}>
            {filteredUsers.length} sonuç
          </p>
        </div>

        {/* ── Tablo ── */}
        <div style={{ backgroundColor: cardBg, borderRadius: '16px', border: `1px solid ${cardBorder}`, overflow: 'hidden', boxShadow: themeName === 'light' ? '0 4px 24px rgba(0,0,0,0.06)' : '0 4px 24px rgba(0,0,0,0.3)' }}>
          {filteredUsers.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>👥</div>
              <p style={{ color: textColor, fontSize: '15px' }}>Kullanıcı bulunamadı.</p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${dividerColor}` }}>
                  {['Kullanıcı', 'Email', 'Rol', 'Kayıt Tarihi', 'İşlemler'].map(h => (
                    <th key={h} style={{ padding: '14px 20px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: textColor, whiteSpace: 'nowrap' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u, i) => {
                  const rc = roleColors[u.role] || roleColors.user;
                  const isCurrentUser = u._id === user?._id;
                  return (
                    <tr
                      key={u._id}
                      style={{
                        borderBottom: i < filteredUsers.length - 1 ? `1px solid ${dividerColor}` : 'none',
                        transition: 'background 0.15s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = rowHoverBg}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      {/* Kullanıcı */}
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{
                            width: '36px', height: '36px', borderRadius: '50%',
                            background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'white', fontSize: '14px', fontWeight: '600', flexShrink: 0
                          }}>
                            {u.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p style={{ color: headingColor, fontSize: '14px', fontWeight: '600', margin: 0 }}>
                              {u.name}
                              {isCurrentUser && (
                                <span style={{ marginLeft: '6px', fontSize: '11px', color: textColor, fontWeight: '400' }}>(sen)</span>
                              )}
                            </p>
                            {u.username && (
                              <p style={{ color: textColor, fontSize: '12px', margin: 0 }}>@{u.username}</p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td style={{ padding: '14px 20px' }}>
                        <p style={{ color: textColor, fontSize: '14px', margin: 0 }}>{u.email}</p>
                      </td>

                      {/* Rol */}
                      <td style={{ padding: '14px 20px' }}>
                        {isCurrentUser ? (
                          <span style={{ padding: '4px 12px', backgroundColor: rc.bg, border: `1px solid ${rc.border}`, borderRadius: '20px', fontSize: '13px', fontWeight: '600', color: rc.color }}>
                            {roleLabels[u.role]}
                          </span>
                        ) : (
                          <select
                            value={u.role}
                            onChange={(e) => handleRoleChange(u._id, e.target.value)}
                            disabled={roleLoading === u._id}
                            style={{
                              padding: '5px 10px',
                              backgroundColor: rc.bg,
                              border: `1px solid ${rc.border}`,
                              borderRadius: '20px',
                              fontSize: '13px',
                              fontWeight: '600',
                              color: rc.color,
                              cursor: 'pointer',
                              outline: 'none',
                              opacity: roleLoading === u._id ? 0.6 : 1
                            }}
                          >
                            <option value="user">Kullanıcı</option>
                            <option value="author">Yazar</option>
                            <option value="admin">Admin</option>
                          </select>
                        )}
                      </td>

                      {/* Kayıt Tarihi */}
                      <td style={{ padding: '14px 20px' }}>
                        <p style={{ color: textColor, fontSize: '13px', margin: 0 }}>
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                        </p>
                      </td>

                      {/* İşlemler */}
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          {/* Profil görüntüle */}
                          {u.username && (
                            <Link
                              to={`/profile/${u.username}`}
                              style={{
                                padding: '6px 12px', borderRadius: '8px',
                                fontSize: '13px', fontWeight: '500',
                                backgroundColor: themeName === 'light' ? '#f1f5f9' : '#334155',
                                color: textColor, textDecoration: 'none',
                                transition: 'all 0.2s ease'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
                              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                            >
                              Profil
                            </Link>
                          )}

                          {/* Sil butonu */}
                          {!isCurrentUser && (
                            <button
                              onClick={() => setDeleteModal(u)}
                              style={{
                                padding: '6px 12px', borderRadius: '8px',
                                fontSize: '13px', fontWeight: '500',
                                backgroundColor: '#fef2f2',
                                color: '#dc2626',
                                border: '1px solid #fecaca',
                                cursor: 'pointer', transition: 'all 0.2s ease'
                              }}
                              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#dc2626'; e.currentTarget.style.color = 'white'; }}
                              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#fef2f2'; e.currentTarget.style.color = '#dc2626'; }}
                            >
                              Sil
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ── Silme Modalı ── */}
      {deleteModal && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 9999, padding: '20px'
        }}>
          <div style={{
            backgroundColor: modalBg, borderRadius: '16px',
            padding: '32px', maxWidth: '420px', width: '100%',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>⚠️</div>
              <h3 style={{ color: headingColor, fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>
                Kullanıcıyı Sil
              </h3>
              <p style={{ color: textColor, fontSize: '14px', lineHeight: '1.6' }}>
                <strong style={{ color: headingColor }}>{deleteModal.name}</strong> adlı kullanıcıyı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setDeleteModal(null)}
                disabled={deleteLoading}
                style={{
                  flex: 1, padding: '12px', borderRadius: '10px',
                  fontSize: '14px', fontWeight: '600',
                  backgroundColor: themeName === 'light' ? '#f1f5f9' : '#334155',
                  color: textColor, border: 'none', cursor: 'pointer'
                }}
              >
                İptal
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                style={{
                  flex: 1, padding: '12px', borderRadius: '10px',
                  fontSize: '14px', fontWeight: '600',
                  backgroundColor: '#dc2626', color: 'white',
                  border: 'none', cursor: deleteLoading ? 'not-allowed' : 'pointer',
                  opacity: deleteLoading ? 0.6 : 1
                }}
              >
                {deleteLoading ? 'Siliniyor...' : 'Evet, Sil'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default UserManagement;
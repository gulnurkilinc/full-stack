import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/Admin/AdminLayout';
import axiosInstance from '../../api/axiosInstance';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axiosInstance.get('/admin/stats');
        if (response.data.success) {
          setStats(response.data.stats);
        }
      } catch (error) {
        console.error('Stats yüklenemedi:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const roleLabels = { user: 'Kullanıcı', author: 'Yazar', admin: 'Admin' };
  const roleColors = {
    user:   { bg: '#eff6ff', border: '#bfdbfe', color: '#1d4ed8' },
    author: { bg: '#fdf4ff', border: '#e9d5ff', color: '#7c3aed' },
    admin:  { bg: '#fef2f2', border: '#fecaca', color: '#dc2626' }
  };

  const statCards = stats ? [
    { label: 'Toplam Kullanıcı', value: stats.totalUsers, color: '#6366f1', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    )},
    { label: 'Toplam Blog', value: stats.totalBlogs, color: '#22c55e', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
      </svg>
    )},
    { label: 'Yayınlanan Blog', value: stats.publishedBlogs, color: '#f59e0b', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    )},
    { label: 'Bu Ay Yeni Kayıt', value: stats.newUsersThisMonth, color: '#ec4899', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/>
        <line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/>
      </svg>
    )},
  ] : [];

  return (
    <AdminLayout>
      <div style={{ padding: '32px' }}>
        {/* Başlık */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1a1a1a', marginBottom: '6px', letterSpacing: '-0.5px' }}>
            Dashboard
          </h1>
          <p style={{ color: '#64748b', fontSize: '15px' }}>
            {new Date().toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
            <svg width="40" height="40" viewBox="0 0 16 16" fill="none" style={{ animation: 'spin 1s linear infinite', marginBottom: '16px' }}>
              <path d="M8 1.5V4.5M8 11.5V14.5M14.5 8H11.5M4.5 8H1.5M12.7 12.7L10.6 10.6M5.4 5.4L3.3 3.3M12.7 3.3L10.6 5.4M5.4 10.6L3.3 12.7"
                stroke="#64748b" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <p>Yükleniyor...</p>
          </div>
        ) : (
          <>
            {/* İstatistik Kartları */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
              {statCards.map((card, i) => (
                <div key={i} style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '52px', height: '52px', borderRadius: '14px', backgroundColor: `${card.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: card.color, flexShrink: 0 }}>
                    {card.icon}
                  </div>
                  <div>
                    <p style={{ color: '#64748b', fontSize: '13px', fontWeight: '500', marginBottom: '4px' }}>{card.label}</p>
                    <p style={{ fontSize: '28px', fontWeight: '700', color: '#1a1a1a', letterSpacing: '-0.5px' }}>{card.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>

              {/* Rol Dağılımı */}
              <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a1a', marginBottom: '20px' }}>Kullanıcı Rol Dağılımı</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {stats && Object.entries(stats.roles).map(([role, count]) => {
                    const rc = roleColors[role];
                    const total = stats.totalUsers;
                    const percent = total > 0 ? Math.round((count / total) * 100) : 0;
                    return (
                      <div key={role}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                          <span style={{ fontSize: '14px', fontWeight: '600', color: rc.color }}>{roleLabels[role]}</span>
                          <span style={{ fontSize: '14px', color: '#64748b' }}>{count} ({percent}%)</span>
                        </div>
                        <div style={{ height: '8px', backgroundColor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${percent}%`, backgroundColor: rc.color, borderRadius: '4px', transition: 'width 0.5s ease' }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* En Çok Okunan Bloglar */}
              <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a1a', marginBottom: '20px' }}>En Çok Okunan Bloglar</h3>
                {stats?.topBlogs?.length === 0 ? (
                  <p style={{ color: '#64748b', fontSize: '14px', textAlign: 'center', padding: '20px' }}>Henüz blog yok.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {stats?.topBlogs?.map((blog, i) => (
                      <div key={blog._id} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', color: '#64748b', flexShrink: 0 }}>
                          {i + 1}
                        </span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {blog.title}
                          </p>
                        </div>
                        <span style={{ fontSize: '13px', color: '#64748b', flexShrink: 0 }}>{blog.views || 0} görüntülenme</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Son Kayıt Olan Kullanıcılar */}
            <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a1a' }}>Son Kayıt Olan Kullanıcılar</h3>
                <Link to="/dashboard/users" style={{ fontSize: '14px', color: '#6366f1', fontWeight: '600', textDecoration: 'none' }}>
                  Tümünü Gör →
                </Link>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    {['Kullanıcı', 'Email', 'Rol', 'Kayıt Tarihi'].map(h => (
                      <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#64748b' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {stats?.recentUsers?.map((u) => {
                    const rc = roleColors[u.role] || roleColors.user;
                    return (
                      <tr key={u._id} style={{ borderBottom: '1px solid #f8fafc' }}>
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '13px', fontWeight: '600', flexShrink: 0 }}>
                              {u.name?.charAt(0).toUpperCase()}
                            </div>
                            <p style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a' }}>{u.name}</p>
                          </div>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <p style={{ fontSize: '14px', color: '#64748b' }}>{u.email}</p>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ padding: '4px 10px', backgroundColor: rc.bg, border: `1px solid ${rc.border}`, borderRadius: '20px', fontSize: '12px', fontWeight: '600', color: rc.color }}>
                            {roleLabels[u.role]}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <p style={{ fontSize: '13px', color: '#64748b' }}>
                            {new Date(u.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </AdminLayout>
  );
};

export default Dashboard;
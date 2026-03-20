import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/Admin/AdminLayout';
import axiosInstance from '../../api/axiosInstance';

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchLogs();
  }, [page]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/admin/activity-logs?page=${page}&limit=20`);
      if (response.data.success) {
        setLogs(response.data.logs);
        setTotalPages(response.data.pages);
        setTotal(response.data.total);
      }
    } catch (error) {
      console.error('Loglar yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  const actionColors = {
    'Giriş yapıldı':       { bg: '#f0fdf4', border: '#bbf7d0', color: '#16a34a', icon: '🔐' },
    'Profil güncellendi':  { bg: '#eff6ff', border: '#bfdbfe', color: '#1d4ed8', icon: '✏️' },
    'Şifre değiştirildi':  { bg: '#fdf4ff', border: '#e9d5ff', color: '#7c3aed', icon: '🔑' },
  };

  const getActionStyle = (action) => actionColors[action] || { bg: '#f8fafc', border: '#e2e8f0', color: '#64748b', icon: '📋' };

  return (
    <AdminLayout>
      <div style={{ padding: '32px' }}>
        {/* Başlık */}
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1a1a1a', marginBottom: '6px', letterSpacing: '-0.5px' }}>
            Aktivite Logları
          </h1>
          <p style={{ color: '#64748b', fontSize: '15px' }}>
            Toplam {total} kayıt
          </p>
        </div>

        {/* Tablo */}
        <div style={{ backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
              <svg width="40" height="40" viewBox="0 0 16 16" fill="none" style={{ animation: 'spin 1s linear infinite', marginBottom: '16px' }}>
                <path d="M8 1.5V4.5M8 11.5V14.5M14.5 8H11.5M4.5 8H1.5M12.7 12.7L10.6 10.6M5.4 5.4L3.3 3.3M12.7 3.3L10.6 5.4M5.4 10.6L3.3 12.7"
                  stroke="#64748b" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <p>Yükleniyor...</p>
            </div>
          ) : logs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
              <p>Henüz aktivite logu yok.</p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: '#f8fafc' }}>
                  {['İşlem', 'Kullanıcı', 'Email', 'IP Adresi', 'Tarih'].map(h => (
                    <th key={h} style={{ padding: '14px 20px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#64748b' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {logs.map((log, i) => {
                  const actionStyle = getActionStyle(log.action);
                  return (
                    <tr key={log._id} style={{ borderBottom: i < logs.length - 1 ? '1px solid #f8fafc' : 'none', transition: 'background 0.15s ease' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>

                      {/* İşlem */}
                      <td style={{ padding: '14px 20px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '5px 12px', backgroundColor: actionStyle.bg, border: `1px solid ${actionStyle.border}`, borderRadius: '20px', fontSize: '13px', fontWeight: '600', color: actionStyle.color }}>
                          {actionStyle.icon} {log.action}
                        </span>
                      </td>

                      {/* Kullanıcı */}
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '13px', fontWeight: '600', flexShrink: 0 }}>
                            {log.userName?.charAt(0).toUpperCase()}
                          </div>
                          <p style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a' }}>{log.userName}</p>
                        </div>
                      </td>

                      {/* Email */}
                      <td style={{ padding: '14px 20px' }}>
                        <p style={{ fontSize: '13px', color: '#64748b' }}>{log.userEmail}</p>
                      </td>

                      {/* IP */}
                      <td style={{ padding: '14px 20px' }}>
                        <p style={{ fontSize: '13px', color: '#64748b', fontFamily: 'monospace' }}>{log.ip || '-'}</p>
                      </td>

                      {/* Tarih */}
                      <td style={{ padding: '14px 20px' }}>
                        <p style={{ fontSize: '13px', color: '#64748b' }}>
                          {new Date(log.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Sayfalama */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '24px' }}>
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: 'white', color: page === 1 ? '#cbd5e0' : '#1a1a1a', cursor: page === 1 ? 'not-allowed' : 'pointer', fontSize: '14px', fontWeight: '500' }}
            >
              ← Önceki
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)}
                style={{ width: '36px', height: '36px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: page === p ? '#111827' : 'white', color: page === p ? 'white' : '#1a1a1a', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>
                {p}
              </button>
            ))}

            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: 'white', color: page === totalPages ? '#cbd5e0' : '#1a1a1a', cursor: page === totalPages ? 'not-allowed' : 'pointer', fontSize: '14px', fontWeight: '500' }}
            >
              Sonraki →
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </AdminLayout>
  );
};

export default ActivityLogs;
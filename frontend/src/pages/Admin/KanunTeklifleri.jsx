import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/Admin/AdminLayout';
import axiosInstance from '../../api/axiosInstance';
import { toast } from 'react-toastify';

const KanunTeklifleri = () => {
  const navigate = useNavigate();
  const [teklifler, setTeklifler] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDurum, setSelectedDurum] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchTeklifler();
  }, [currentPage, selectedDurum]);

  const fetchTeklifler = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: currentPage, limit: 15 });
      if (selectedDurum) params.append('durum', selectedDurum);
      const response = await axiosInstance.get(`/kanun-teklifleri?${params}`);
      if (response.data.success) {
        setTeklifler(response.data.proposals);
        setTotal(response.data.total);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      toast.error('Teklifler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal) return;
    setDeleteLoading(true);
    try {
      const response = await axiosInstance.delete(`/admin/kanun-teklifi/${deleteModal._id}`);
      if (response.data.success) {
        setTeklifler(prev => prev.filter(t => t._id !== deleteModal._id));
        toast.success('Kanun teklifi silindi');
        setDeleteModal(null);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Silme işlemi başarısız');
    } finally {
      setDeleteLoading(false);
    }
  };

  const durumColors = {
    KABUL_EDILDI:  { bg: '#f0fdf4', border: '#bbf7d0', color: '#16a34a', label: 'Kabul Edildi' },
    REDDEDILDI:    { bg: '#fef2f2', border: '#fecaca', color: '#dc2626', label: 'Reddedildi' },
    GORUSLULUYOR:  { bg: '#fffbeb', border: '#fde68a', color: '#d97706', label: 'Görüşülüyor' }
  };

  const filtered = teklifler.filter(t =>
    t.baslik?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.teklifNo?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div style={{ padding: '32px' }}>
        {/* Başlık */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1a1a1a', marginBottom: '6px', letterSpacing: '-0.5px' }}>
              Kanun Teklifleri
            </h1>
            <p style={{ color: '#64748b', fontSize: '15px' }}>Toplam {total} teklif</p>
          </div>
          <button
            onClick={() => navigate('/dashboard/kanun-teklifleri/ekle')}
            style={{ padding: '12px 24px', background: '#111827', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            + Yeni Teklif Ekle
          </button>
        </div>

        {/* Filtreler */}
        <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #f1f5f9', padding: '20px', marginBottom: '20px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Başlık veya teklif no ile ara..."
              style={{ width: '100%', padding: '10px 12px 10px 36px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          <select
            value={selectedDurum}
            onChange={(e) => { setSelectedDurum(e.target.value); setCurrentPage(1); }}
            style={{ padding: '10px 16px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none', cursor: 'pointer', backgroundColor: 'white' }}
          >
            <option value="">Tüm Durumlar</option>
            <option value="GORUSLULUYOR">Görüşülüyor</option>
            <option value="KABUL_EDILDI">Kabul Edildi</option>
            <option value="REDDEDILDI">Reddedildi</option>
          </select>
        </div>

        {/* Tablo */}
        <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #f1f5f9', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
              <svg width="40" height="40" viewBox="0 0 16 16" fill="none" style={{ animation: 'spin 1s linear infinite', marginBottom: '16px' }}>
                <path d="M8 1.5V4.5M8 11.5V14.5M14.5 8H11.5M4.5 8H1.5M12.7 12.7L10.6 10.6M5.4 5.4L3.3 3.3M12.7 3.3L10.6 5.4M5.4 10.6L3.3 12.7" stroke="#64748b" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <p>Yükleniyor...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
              <p>Kanun teklifi bulunamadı.</p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: '#f8fafc' }}>
                  {['Teklif No', 'Başlık', 'Kategori', 'Durum', 'Tarih', 'Oylar', 'İşlemler'].map(h => (
                    <th key={h} style={{ padding: '14px 20px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#64748b' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((teklif, i) => {
                  const dc = durumColors[teklif.durum] || durumColors.GORUSLULUYOR;
                  return (
                    <tr key={teklif._id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid #f8fafc' : 'none', transition: 'background 0.15s' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>

                      <td style={{ padding: '14px 20px' }}>
                        <p style={{ fontSize: '13px', fontWeight: '600', color: '#1a1a1a', fontFamily: 'monospace' }}>{teklif.teklifNo}</p>
                      </td>

                      <td style={{ padding: '14px 20px', maxWidth: '280px' }}>
                        <p style={{ fontSize: '14px', fontWeight: '500', color: '#1a1a1a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {teklif.baslik}
                        </p>
                      </td>

                      <td style={{ padding: '14px 20px' }}>
                        <p style={{ fontSize: '13px', color: '#64748b' }}>{teklif.kategori}</p>
                      </td>

                      <td style={{ padding: '14px 20px' }}>
                        <span style={{ padding: '4px 10px', backgroundColor: dc.bg, border: `1px solid ${dc.border}`, borderRadius: '20px', fontSize: '12px', fontWeight: '600', color: dc.color }}>
                          {dc.label}
                        </span>
                      </td>

                      <td style={{ padding: '14px 20px' }}>
                        <p style={{ fontSize: '13px', color: '#64748b' }}>
                          {teklif.gorusulmeTarihi ? new Date(teklif.gorusulmeTarihi).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                        </p>
                      </td>

                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ display: 'flex', gap: '8px', fontSize: '12px' }}>
                          <span style={{ color: '#16a34a', fontWeight: '600' }}>✓{teklif.oySayilari?.kabul || 0}</span>
                          <span style={{ color: '#dc2626', fontWeight: '600' }}>✗{teklif.oySayilari?.ret || 0}</span>
                        </div>
                      </td>

                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <Link
                            to={`/category/tbmm/kanun-teklifi/${teklif._id}`}
                            target="_blank"
                            style={{ padding: '6px 12px', borderRadius: '8px', fontSize: '13px', fontWeight: '500', backgroundColor: '#f1f5f9', color: '#64748b', textDecoration: 'none' }}
                          >
                            Görüntüle
                          </Link>
                          <button
                            onClick={() => navigate(`/dashboard/kanun-teklifleri/duzenle/${teklif._id}`)}
                            style={{ padding: '6px 12px', borderRadius: '8px', fontSize: '13px', fontWeight: '500', backgroundColor: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', cursor: 'pointer' }}
                          >
                            Düzenle
                          </button>
                          <button
                            onClick={() => setDeleteModal(teklif)}
                            style={{ padding: '6px 12px', borderRadius: '8px', fontSize: '13px', fontWeight: '500', backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', cursor: 'pointer' }}
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#dc2626'; e.currentTarget.style.color = 'white'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#fef2f2'; e.currentTarget.style.color = '#dc2626'; }}
                          >
                            Sil
                          </button>
                        </div>
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
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
              style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: 'white', color: currentPage === 1 ? '#cbd5e0' : '#1a1a1a', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', fontSize: '14px' }}>
              ← Önceki
            </button>
            <span style={{ fontSize: '14px', color: '#64748b', padding: '0 12px' }}>{currentPage} / {totalPages}</span>
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
              style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: 'white', color: currentPage === totalPages ? '#cbd5e0' : '#1a1a1a', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', fontSize: '14px' }}>
              Sonraki →
            </button>
          </div>
        )}
      </div>

      {/* Silme Modalı */}
      {deleteModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '32px', maxWidth: '420px', width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>⚠️</div>
              <h3 style={{ color: '#1a1a1a', fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>Teklifi Sil</h3>
              <p style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.6' }}>
                <strong style={{ color: '#1a1a1a' }}>{deleteModal.teklifNo}</strong> numaralı teklifi silmek istediğinize emin misiniz?
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setDeleteModal(null)} disabled={deleteLoading}
                style={{ flex: 1, padding: '12px', borderRadius: '10px', fontSize: '14px', fontWeight: '600', backgroundColor: '#f1f5f9', color: '#64748b', border: 'none', cursor: 'pointer' }}>
                İptal
              </button>
              <button onClick={handleDelete} disabled={deleteLoading}
                style={{ flex: 1, padding: '12px', borderRadius: '10px', fontSize: '14px', fontWeight: '600', backgroundColor: '#dc2626', color: 'white', border: 'none', cursor: deleteLoading ? 'not-allowed' : 'pointer', opacity: deleteLoading ? 0.6 : 1 }}>
                {deleteLoading ? 'Siliniyor...' : 'Evet, Sil'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </AdminLayout>
  );
};

export default KanunTeklifleri;
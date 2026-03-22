import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../components/Admin/AdminLayout';
import axiosInstance from '../../api/axiosInstance';
import { toast } from 'react-toastify';

const kategoriler = [
  'Vergi Mevzuatı', 'Eğitim', 'Sağlık', 'Ekonomi', 'Çevre',
  'Ulaştırma', 'Enerji', 'Adalet', 'Dış İlişkiler', 'Savunma',
  'İç Güvenlik', 'Tarım', 'Kültür ve Turizm', 'Spor',
  'Bilim ve Teknoloji', 'İletişim', 'Sosyal Güvenlik',
  'Aile ve Sosyal Hizmetler', 'Diğer'
];

const KanunTeklifiForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEdit);

  const [formData, setFormData] = useState({
    teklifNo: '',
    baslik: '',
    kategori: 'Vergi Mevzuatı',
    aciklama: '',
    durum: 'GORUSLULUYOR',
    gorusulmeTarihi: '',
    oySayilari: {
      kabul: 0,
      ret: 0,
      cekimser: 0,
      katilmayan: 0
    }
  });

  const [uploadLoading, setUploadLoading] = useState(false);
const [uploadResult, setUploadResult] = useState(null);

  // Düzenleme modunda mevcut veriyi çek
  useEffect(() => {
    if (isEdit) {
      fetchTeklif();
    }
  }, [id]);

  const fetchTeklif = async () => {
    setFetchLoading(true);
    try {
      const response = await axiosInstance.get(`/kanun-teklifi/${id}`);
      if (response.data.success) {
        const t = response.data.teklif;
        setFormData({
          teklifNo: t.teklifNo || '',
          baslik: t.baslik || '',
          kategori: t.kategori || 'Vergi Mevzuatı',
          aciklama: t.aciklama || '',
          durum: t.durum || 'GORUSLULUYOR',
          gorusulmeTarihi: t.gorusulmeTarihi ? new Date(t.gorusulmeTarihi).toISOString().split('T')[0] : '',
          oySayilari: {
            kabul: t.oySayilari?.kabul || 0,
            ret: t.oySayilari?.ret || 0,
            cekimser: t.oySayilari?.cekimser || 0,
            katilmayan: t.oySayilari?.katilmayan || 0
          }
        });
      }
    } catch (error) {
      toast.error('Teklif bilgileri yüklenemedi');
      navigate('/dashboard/kanun-teklifleri');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('oy_')) {
      const oyKey = name.replace('oy_', '');
      setFormData(prev => ({ ...prev, oySayilari: { ...prev.oySayilari, [oyKey]: parseInt(value) || 0 } }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };


  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploadLoading(true);
    setUploadResult(null);

    try {
        const response = await axiosInstance.post(
            `/admin/kanun-teklifi/${id}/import-oylar`,
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        setUploadResult({ success: true, message: response.data.message, hatali: response.data.hatali });
        toast.success(response.data.message);
    } catch (error) {
        const msg = error.response?.data?.message || 'Yükleme başarısız';
        setUploadResult({ success: false, message: msg, hatali: 0 });
        toast.error(msg);
    } finally {
        setUploadLoading(false);
    }
};




  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.teklifNo.trim()) { toast.error('Teklif numarası gereklidir'); return; }
    if (!formData.baslik.trim()) { toast.error('Başlık gereklidir'); return; }
    if (!formData.aciklama.trim()) { toast.error('Açıklama gereklidir'); return; }
    if (!formData.gorusulmeTarihi) { toast.error('Görüşülme tarihi gereklidir'); return; }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        gorusulmeTarihi: new Date(formData.gorusulmeTarihi)
      };

      let response;
      if (isEdit) {
        response = await axiosInstance.put(`/admin/kanun-teklifi/${id}`, payload);
      } else {
        response = await axiosInstance.post('/admin/kanun-teklifi', payload);
      }

      if (response.data.success) {
        toast.success(isEdit ? 'Teklif güncellendi! ✅' : 'Teklif eklendi! ✅');
        navigate('/dashboard/kanun-teklifleri');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'İşlem başarısız');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '12px 16px',
    border: '1.5px solid #e2e8f0', borderRadius: '10px',
    fontSize: '15px', color: '#2d3748', backgroundColor: 'white',
    outline: 'none', fontFamily: 'inherit',
    boxSizing: 'border-box', transition: 'border-color 0.2s'
  };

  const labelStyle = {
    display: 'block', marginBottom: '8px',
    fontSize: '14px', fontWeight: '600', color: '#2d3748'
  };

  if (fetchLoading) {
    return (
      <AdminLayout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', color: '#64748b' }}>
          <p>Yükleniyor...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div style={{ padding: '32px', maxWidth: '800px' }}>
        {/* Başlık */}
        <div style={{ marginBottom: '28px' }}>
          <button onClick={() => navigate('/dashboard/kanun-teklifleri')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '14px', fontWeight: '500', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '12px', padding: 0 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Kanun Teklifleri
          </button>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1a1a1a', letterSpacing: '-0.5px' }}>
            {isEdit ? 'Teklifi Düzenle' : 'Yeni Teklif Ekle'}
          </h1>
        </div>

        {/* Form */}
        <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #f1f5f9', padding: '32px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <form onSubmit={handleSubmit}>

            {/* Teklif No + Tarih */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={labelStyle}>Teklif Numarası *</label>
                <input type="text" name="teklifNo" value={formData.teklifNo} onChange={handleChange}
                  placeholder="örn: 2026/142" style={inputStyle}
                  onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'} />
              </div>
              <div>
                <label style={labelStyle}>Görüşülme Tarihi *</label>
                <input type="date" name="gorusulmeTarihi" value={formData.gorusulmeTarihi} onChange={handleChange}
                  style={inputStyle}
                  onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'} />
              </div>
            </div>

            {/* Başlık */}
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Başlık *</label>
              <input type="text" name="baslik" value={formData.baslik} onChange={handleChange}
                placeholder="Kanun teklifi başlığı" style={inputStyle}
                onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'} />
            </div>

            {/* Kategori + Durum */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={labelStyle}>Kategori *</label>
                <select name="kategori" value={formData.kategori} onChange={handleChange}
                  style={{ ...inputStyle, cursor: 'pointer' }}>
                  {kategoriler.map(k => <option key={k} value={k}>{k}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Durum *</label>
                <select name="durum" value={formData.durum} onChange={handleChange}
                  style={{ ...inputStyle, cursor: 'pointer' }}>
                  <option value="GORUSLULUYOR">Görüşülüyor</option>
                  <option value="KABUL_EDILDI">Kabul Edildi</option>
                  <option value="REDDEDILDI">Reddedildi</option>
                </select>
              </div>
            </div>

            {/* Açıklama */}
            <div style={{ marginBottom: '28px' }}>
              <label style={labelStyle}>Açıklama *</label>
              <textarea name="aciklama" value={formData.aciklama} onChange={handleChange}
                placeholder="Kanun teklifi hakkında detaylı açıklama..."
                rows={5}
                style={{ ...inputStyle, resize: 'vertical', minHeight: '120px' }}
                onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'} />
            </div>

            {/* Oy Sayıları */}
            <div style={{ marginBottom: '28px' }}>
              <label style={{ ...labelStyle, marginBottom: '16px' }}>Milletvekili Oy Sayıları</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                {[
                  { key: 'kabul', label: 'Kabul', color: '#16a34a' },
                  { key: 'ret', label: 'Ret', color: '#dc2626' },
                  { key: 'cekimser', label: 'Çekimser', color: '#d97706' },
                  { key: 'katilmayan', label: 'Katılmayan', color: '#64748b' }
                ].map(({ key, label, color }) => (
                  <div key={key}>
                    <label style={{ ...labelStyle, color }}>{label}</label>
                    <input type="number" name={`oy_${key}`} value={formData.oySayilari[key]} onChange={handleChange}
                      min="0" style={{ ...inputStyle, textAlign: 'center', fontWeight: '700', color }}
                      onFocus={(e) => e.target.style.borderColor = color}
                      onBlur={(e) => e.target.style.borderColor = '#e2e8f0'} />
                  </div>
                ))}
              </div>
              <p style={{ color: '#64748b', fontSize: '13px', marginTop: '8px' }}>
                Toplam: {Object.values(formData.oySayilari).reduce((a, b) => a + b, 0)} oy
              </p>
            </div>





            {/* CSV/Excel Yükleme - Sadece düzenleme modunda */}
            {isEdit && (
              <div style={{ marginBottom: '28px', padding: '24px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <label style={{ ...labelStyle, marginBottom: '8px' }}>
                  Milletvekili Oylarını İçe Aktar (Excel/CSV)
                </label>
                <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '16px' }}>
                  Excel dosyasında şu kolonlar olmalı: <strong>Ad Soyad, Parti, İl, Oy</strong> (kabul/ret/cekimser/katilmayan)
                </p>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <input
                    type="file"
                    accept=".xlsx,.csv"
                    onChange={handleFileUpload}
                    style={{ fontSize: '14px', color: '#64748b' }}
                  />
                  {uploadLoading && (
                    <p style={{ color: '#64748b', fontSize: '13px' }}>Yükleniyor...</p>
                  )}
                </div>
                {uploadResult && (
                  <div style={{ marginTop: '12px', padding: '12px', backgroundColor: uploadResult.success ? '#f0fdf4' : '#fef2f2', borderRadius: '8px', border: `1px solid ${uploadResult.success ? '#bbf7d0' : '#fecaca'}` }}>
                    <p style={{ color: uploadResult.success ? '#16a34a' : '#dc2626', fontSize: '13px', fontWeight: '600' }}>
                      {uploadResult.message}
                    </p>
                    {uploadResult.hatali > 0 && (
                      <p style={{ color: '#64748b', fontSize: '12px', marginTop: '4px' }}>
                        {uploadResult.hatali} satırda hata oluştu
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}




            {/* Butonlar */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="button" onClick={() => navigate('/dashboard/kanun-teklifleri')}
                style={{ padding: '13px 28px', borderRadius: '10px', fontSize: '15px', fontWeight: '600', backgroundColor: '#f1f5f9', color: '#64748b', border: 'none', cursor: 'pointer' }}>
                İptal
              </button>
              <button type="submit" disabled={loading}
                style={{ padding: '13px 32px', borderRadius: '10px', fontSize: '15px', fontWeight: '600', background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)', color: 'white', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1 }}>
                {loading ? 'Kaydediliyor...' : isEdit ? 'Güncelle' : 'Teklif Ekle'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default KanunTeklifiForm;
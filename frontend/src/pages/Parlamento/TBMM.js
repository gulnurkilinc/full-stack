import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { kanunTeklifiAPI } from '../../services/kanunTeklifiAPI';

const TBMM = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  // State
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filtreleme ve sayfalama
  const [selectedKategori, setSelectedKategori] = useState('');
  const [selectedDurum, setSelectedDurum] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Kategoriler
  const kategoriler = [
    'Tümü',
    'Vergi Mevzuatı',
    'Eğitim',
    'Sağlık',
    'Ekonomi',
    'Çevre',
    'Ulaştırma',
    'Enerji',
    'Adalet',
    'Bilim ve Teknoloji',
    'Tarım',
    'Kültür ve Turizm',
    'Spor',
    'Aile ve Sosyal Hizmetler'
  ];

  // Durumlar
  const durumlar = [
    { value: '', label: 'Tümü' },
    { value: 'GORUSLULUYOR', label: 'Görüşülüyor' },
    { value: 'KABUL_EDILDI', label: 'Kabul Edildi' },
    { value: 'REDDEDILDI', label: 'Reddedildi' }
  ];

  // Veri çekme
  useEffect(() => {
    fetchProposals();
  }, [selectedKategori, selectedDurum, currentPage]);

  const fetchProposals = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: currentPage,
        limit: 12,
        sort: '-gorusulmeTarihi'
      };

      if (selectedKategori && selectedKategori !== 'Tümü') {
        params.kategori = selectedKategori;
      }

      if (selectedDurum) {
        params.durum = selectedDurum;
      }

      const data = await kanunTeklifiAPI.getAllProposals(params);
      
      setProposals(data.proposals || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);

    } catch (err) {
      console.error('Veri çekme hatası:', err);
      setError('Kanun teklifleri yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // Arama filtresi (client-side)
  const filteredProposals = proposals.filter(proposal =>
    proposal.baslik.toLowerCase().includes(searchTerm.toLowerCase()) ||
    proposal.teklifNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Durum konfigürasyonu
  const getStatusConfig = (durum) => {
    switch (durum) {
      case 'KABUL_EDILDI':
        return {
          label: 'Kabul Edildi',
          color: '#059669',
          bg: '#ecfdf5',
          border: '#a7f3d0'
        };
      case 'REDDEDILDI':
        return {
          label: 'Reddedildi',
          color: '#dc2626',
          bg: '#fef2f2',
          border: '#fecaca'
        };
      case 'GORUSLULUYOR':
        return {
          label: 'Görüşülüyor',
          color: '#d97706',
          bg: '#fffbeb',
          border: '#fde68a'
        };
      default:
        return {
          label: 'Bilinmiyor',
          color: '#6b7280',
          bg: '#f9fafb',
          border: '#e5e7eb'
        };
    }
  };

  // Sayfalama kontrolü
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Loading
  if (loading && proposals.length === 0) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
        background: theme.pageBackground
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
          <div style={{ fontSize: '18px', color: theme.textSecondary }}>
            Yükleniyor...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: theme.pageBackground,
      minHeight: '100vh',
      paddingTop: '80px',
      paddingBottom: '60px'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 32px' }}>

        {/* Header */}
        <div style={{ marginBottom: '48px' }}>
          <h1 style={{
            fontSize: '42px',
            fontWeight: '300',
            color: theme.headingColor,
            marginBottom: '16px',
            letterSpacing: '-0.5px'
          }}>
            Türkiye Büyük Millet Meclisi
          </h1>
          <p style={{
            fontSize: '16px',
            color: theme.textSecondary,
            fontWeight: '300',
            lineHeight: '1.6'
          }}>
            TBMM'de görüşülen kanun tekliflerini inceleyin, milletvekillerinin oylarını görün ve kendi görüşünüzü paylaşın.
          </p>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '24px',
          marginBottom: '48px'
        }}>
          <div style={{
            background: theme.cardBg,
            border: `1px solid ${theme.cardBorder}`,
            padding: '24px',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '32px',
              fontWeight: '300',
              color: theme.textPrimary,
              marginBottom: '8px'
            }}>
              {total}
            </div>
            <div style={{
              fontSize: '12px',
              fontWeight: '600',
              color: theme.textSecondary,
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Toplam Teklif
            </div>
          </div>

          <div style={{
            background: theme.cardBg,
            border: `1px solid ${theme.cardBorder}`,
            padding: '24px',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '32px',
              fontWeight: '300',
              color: '#059669',
              marginBottom: '8px'
            }}>
              {proposals.filter(p => p.durum === 'KABUL_EDILDI').length}
            </div>
            <div style={{
              fontSize: '12px',
              fontWeight: '600',
              color: theme.textSecondary,
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Kabul Edildi
            </div>
          </div>

          <div style={{
            background: theme.cardBg,
            border: `1px solid ${theme.cardBorder}`,
            padding: '24px',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '32px',
              fontWeight: '300',
              color: '#d97706',
              marginBottom: '8px'
            }}>
              {proposals.filter(p => p.durum === 'GORUSLULUYOR').length}
            </div>
            <div style={{
              fontSize: '12px',
              fontWeight: '600',
              color: theme.textSecondary,
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Görüşülüyor
            </div>
          </div>

          <div style={{
            background: theme.cardBg,
            border: `1px solid ${theme.cardBorder}`,
            padding: '24px',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '32px',
              fontWeight: '300',
              color: '#dc2626',
              marginBottom: '8px'
            }}>
              {proposals.filter(p => p.durum === 'REDDEDILDI').length}
            </div>
            <div style={{
              fontSize: '12px',
              fontWeight: '600',
              color: theme.textSecondary,
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Reddedildi
            </div>
          </div>
        </div>

        {/* Filters */}
        <div style={{
          background: theme.cardBg,
          border: `1px solid ${theme.cardBorder}`,
          padding: '32px',
          marginBottom: '32px'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '24px'
          }}>
            {/* Arama */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '11px',
                fontWeight: '600',
                color: theme.textSecondary,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '8px'
              }}>
                Ara
              </label>
              <input
                type="text"
                placeholder="Teklif başlığı veya numarası..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: theme.pageBackground,
                  border: `1px solid ${theme.cardBorder}`,
                  color: theme.textPrimary,
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>

            {/* Kategori */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '11px',
                fontWeight: '600',
                color: theme.textSecondary,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '8px'
              }}>
                Kategori
              </label>
              <select
                value={selectedKategori}
                onChange={(e) => {
                  setSelectedKategori(e.target.value);
                  setCurrentPage(1);
                }}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: theme.pageBackground,
                  border: `1px solid ${theme.cardBorder}`,
                  color: theme.textPrimary,
                  fontSize: '14px',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                {kategoriler.map(kat => (
                  <option key={kat} value={kat === 'Tümü' ? '' : kat}>
                    {kat}
                  </option>
                ))}
              </select>
            </div>

            {/* Durum */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '11px',
                fontWeight: '600',
                color: theme.textSecondary,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '8px'
              }}>
                Durum
              </label>
              <select
                value={selectedDurum}
                onChange={(e) => {
                  setSelectedDurum(e.target.value);
                  setCurrentPage(1);
                }}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: theme.pageBackground,
                  border: `1px solid ${theme.cardBorder}`,
                  color: theme.textPrimary,
                  fontSize: '14px',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                {durumlar.map(durum => (
                  <option key={durum.value} value={durum.value}>
                    {durum.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            padding: '16px 24px',
            marginBottom: '32px',
            color: '#dc2626',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        {/* Proposals Grid */}
        {filteredProposals.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '80px 20px',
            color: theme.textSecondary
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
            <div style={{ fontSize: '18px' }}>
              {searchTerm ? 'Arama sonucu bulunamadı' : 'Henüz kanun teklifi bulunmuyor'}
            </div>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '24px',
            marginBottom: '48px'
          }}>
            {filteredProposals.map(proposal => {
              const statusConfig = getStatusConfig(proposal.durum);
              const totalVotes = (proposal.oySayilari?.kabul || 0) +
                                (proposal.oySayilari?.ret || 0) +
                                (proposal.oySayilari?.cekimser || 0) +
                                (proposal.oySayilari?.katilmayan || 0);

              return (
                <div
                  key={proposal._id}
                  onClick={() => navigate(`/category/tbmm/kanun-teklifi/${proposal._id}`)}
                  style={{
                    background: theme.cardBg,
                    border: `1px solid ${theme.cardBorder}`,
                    padding: '24px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = theme.textPrimary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = theme.cardBorder;
                  }}
                >
                  {/* Status Badge */}
                  <div style={{
                    background: statusConfig.bg,
                    color: statusConfig.color,
                    border: `1px solid ${statusConfig.border}`,
                    padding: '4px 12px',
                    fontSize: '10px',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    display: 'inline-block',
                    marginBottom: '12px'
                  }}>
                    {statusConfig.label}
                  </div>

                  {/* Teklif No */}
                  <div style={{
                    fontSize: '12px',
                    color: theme.textSecondary,
                    marginBottom: '8px',
                    fontWeight: '500'
                  }}>
                    {proposal.teklifNo}
                  </div>

                  {/* Başlık */}
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '500',
                    color: theme.textPrimary,
                    marginBottom: '12px',
                    lineHeight: '1.4',
                    minHeight: '50px'
                  }}>
                    {proposal.baslik}
                  </h3>

                  {/* Kategori */}
                  <div style={{
                    fontSize: '11px',
                    color: theme.textSecondary,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '16px'
                  }}>
                    {proposal.kategori}
                  </div>

                  {/* Oy Dağılımı */}
                  <div style={{
                    display: 'flex',
                    height: '6px',
                    overflow: 'hidden',
                    marginBottom: '12px'
                  }}>
                    <div style={{
                      flex: proposal.oySayilari?.kabul || 0,
                      background: '#059669'
                    }}></div>
                    <div style={{
                      flex: proposal.oySayilari?.ret || 0,
                      background: '#dc2626'
                    }}></div>
                    <div style={{
                      flex: proposal.oySayilari?.cekimser || 0,
                      background: '#d97706'
                    }}></div>
                    <div style={{
                      flex: proposal.oySayilari?.katilmayan || 0,
                      background: '#6b7280'
                    }}></div>
                  </div>

                  {/* Oy Sayıları */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '12px',
                    color: theme.textSecondary
                  }}>
                    <span>
                      <strong style={{ color: '#059669' }}>
                        {proposal.oySayilari?.kabul || 0}
                      </strong> Kabul
                    </span>
                    <span>
                      <strong style={{ color: '#dc2626' }}>
                        {proposal.oySayilari?.ret || 0}
                      </strong> Ret
                    </span>
                    <span>
                      <strong style={{ color: '#d97706' }}>
                        {proposal.oySayilari?.cekimser || 0}
                      </strong> Çekimser
                    </span>
                  </div>

                  {/* Tarih */}
                  <div style={{
                    marginTop: '16px',
                    paddingTop: '16px',
                    borderTop: `1px solid ${theme.cardBorder}`,
                    fontSize: '12px',
                    color: theme.textSecondary
                  }}>
                    {new Date(proposal.gorusulmeTarihi).toLocaleDateString('tr-TR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
            marginTop: '48px'
          }}>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || loading}
              style={{
                padding: '12px 20px',
                background: currentPage === 1 ? theme.cardBg : theme.textPrimary,
                color: currentPage === 1 ? theme.textSecondary : '#ffffff',
                border: `1px solid ${theme.cardBorder}`,
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                opacity: currentPage === 1 ? 0.5 : 1
              }}
            >
              ← Önceki
            </button>

            <div style={{
              fontSize: '14px',
              color: theme.textSecondary,
              padding: '0 16px'
            }}>
              {currentPage} / {totalPages}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || loading}
              style={{
                padding: '12px 20px',
                background: currentPage === totalPages ? theme.cardBg : theme.textPrimary,
                color: currentPage === totalPages ? theme.textSecondary : '#ffffff',
                border: `1px solid ${theme.cardBorder}`,
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                opacity: currentPage === totalPages ? 0.5 : 1
              }}
            >
              Sonraki →
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default TBMM;
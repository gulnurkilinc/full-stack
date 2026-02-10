import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { kanunTeklifiAPI } from '../../services/kanunTeklifiAPI';

const KanunTeklifiDetay = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  
  // State yönetimi
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [teklifDetay, setTeklifDetay] = useState(null);
  const [partiOylari, setPartiOylari] = useState([]);
  const [milletvekilleri, setMilletvekilleri] = useState([]);
  const [toplumOylari, setToplumOylari] = useState({ kabul: 0, ret: 0, cekimser: 0 });
  const [toplamToplumOyu, setToplamToplumOyu] = useState(0);
  
  const [hoveredSeat, setHoveredSeat] = useState(null);
  const [hoveredParty, setHoveredParty] = useState(null);
  const [userVote, setUserVote] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [votingLoading, setVotingLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('genel');
  const [searchTerm, setSearchTerm] = useState('');

  // Sayfa yüklendiğinde verileri çek
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    fetchData();
    checkVoteStatus();
  }, [id]);

  // Teklif verilerini çek
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await kanunTeklifiAPI.getProposalById(id);
      
      setTeklifDetay(data.teklif);
      setPartiOylari(data.partiOylari || []);
      setMilletvekilleri(data.mvOylari || []);
      setToplumOylari(data.toplumOylari || { kabul: 0, ret: 0, cekimser: 0 });
      setToplamToplumOyu(data.toplamToplumOyu || 0);
      
    } catch (err) {
      console.error('Veri çekme hatası:', err);
      setError(err.message || 'Veriler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // Kullanıcının oy durumunu kontrol et
  const checkVoteStatus = async () => {
    try {
      const status = await kanunTeklifiAPI.checkUserVoteStatus(id);
      
      if (status.voted) {
        setHasVoted(true);
        setUserVote(status.voteType);
      }
    } catch (err) {
      // Kullanıcı giriş yapmamışsa veya başka hata varsa sessizce geç
      console.log('Oy durumu kontrol edilemedi (kullanıcı giriş yapmamış olabilir)');
    }
  };

  // Oy kullan
  const handleVote = async (oyTipi) => {
    // Giriş kontrolü
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('Oy kullanmak için giriş yapmalısınız!');
      navigate('/login');
      return;
    }

    if (hasVoted) {
      alert('Bu teklife zaten oy kullandınız!');
      return;
    }
    
    try {
      setVotingLoading(true);
      const result = await kanunTeklifiAPI.submitUserVote(id, oyTipi);
      
      setUserVote(oyTipi);
      setHasVoted(true);
      setToplumOylari(result.toplumOylari);
      setToplamToplumOyu(result.toplamToplumOyu);
      
      alert('✅ Oyunuz başarıyla kaydedildi!');
      
    } catch (err) {
      console.error('Oy kaydetme hatası:', err);
      
      if (err.message?.includes('giriş') || err.message?.includes('token')) {
        alert('Oy kullanmak için giriş yapmalısınız!');
        navigate('/login');
      } else if (err.message?.includes('zaten')) {
        alert('Bu teklife zaten oy kullandınız!');
        setHasVoted(true);
      } else {
        alert('❌ Oy kaydedilirken bir hata oluştu: ' + (err.message || 'Bilinmeyen hata'));
      }
    } finally {
      setVotingLoading(false);
    }
  };

  // Koltuk pozisyonlarını oluştur
  const generateSeats = () => {
    if (!milletvekilleri || milletvekilleri.length === 0) return [];
    
    const seats = [];
    const totalSeats = milletvekilleri.length;
    const rows = 12;
    const centerX = 400;
    const centerY = 380;
    const startRadius = 100;
    const radiusIncrement = 28;

    let seatIndex = 0;
    for (let row = 0; row < rows; row++) {
      const radius = startRadius + (row * radiusIncrement);
      const seatsInRow = Math.floor(40 + (row * 5));
      
      for (let i = 0; i < seatsInRow && seatIndex < totalSeats; i++) {
        const angle = Math.PI * (i / (seatsInRow - 1));
        const x = centerX + radius * Math.cos(angle);
        const y = centerY - radius * Math.sin(angle);
        
        const mv = milletvekilleri[seatIndex];
        if (mv) {
          seats.push({ 
            x, 
            y, 
            ...mv,
            name: mv.milletvekili?.adSoyad || 'Bilinmeyen',
            party: mv.milletvekili?.parti?.kod || 'BAĞ',
            partyName: mv.milletvekili?.parti?.ad || 'Bağımsız',
            partyColor: mv.milletvekili?.parti?.renk || '#95A5A6',
            city: mv.milletvekili?.il || 'Bilinmeyen',
            vote: mv.oyTipi || 'katilmayan'
          });
        }
        seatIndex++;
      }
    }
    return seats;
  };

  const seats = generateSeats();

  const getVoteColor = (vote) => {
    switch(vote) {
      case 'kabul': return '#059669';
      case 'ret': return '#dc2626';
      case 'cekimser': return '#d97706';
      case 'katilmayan': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getStatusConfig = () => {
    if (!teklifDetay) return { color: '#6b7280', bg: '#f9fafb', border: '#e5e7eb' };
    
    switch(teklifDetay.durum) {
      case 'KABUL_EDILDI': return { color: '#059669', bg: '#ecfdf5', border: '#a7f3d0' };
      case 'REDDEDILDI': return { color: '#dc2626', bg: '#fef2f2', border: '#fecaca' };
      case 'GORUSLULUYOR': return { color: '#d97706', bg: '#fffbeb', border: '#fde68a' };
      default: return { color: '#6b7280', bg: '#f9fafb', border: '#e5e7eb' };
    }
  };

  const filteredMilletvekilleri = seats.filter(mv => 
    mv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mv.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mv.partyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statusConfig = getStatusConfig();

  // Loading state
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        background: theme.pageBackground
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            fontSize: '48px', 
            marginBottom: '16px' 
          }}>⏳</div>
          <div style={{ 
            fontSize: '18px', 
            color: theme.textSecondary,
            fontWeight: '300'
          }}>
            Yükleniyor...
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        background: theme.pageBackground
      }}>
        <div style={{ 
          textAlign: 'center',
          maxWidth: '500px',
          padding: '40px'
        }}>
          <div style={{ 
            fontSize: '48px', 
            marginBottom: '16px' 
          }}>⚠️</div>
          <h2 style={{ 
            fontSize: '24px', 
            color: theme.textPrimary,
            marginBottom: '12px'
          }}>
            Bir Hata Oluştu
          </h2>
          <p style={{ 
            fontSize: '16px', 
            color: theme.textSecondary,
            marginBottom: '24px'
          }}>
            {error}
          </p>
          <button
            onClick={() => navigate('/category/tbmm')}
            style={{
              padding: '12px 24px',
              background: '#059669',
              color: '#ffffff',
              border: 'none',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
          >
            TBMM'ye Dön
          </button>
        </div>
      </div>
    );
  }

  // Veri yoksa
  if (!teklifDetay) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        background: theme.pageBackground
      }}>
        <div style={{ fontSize: '18px', color: theme.textSecondary }}>
          Teklif bulunamadı
        </div>
      </div>
    );
  }

  const totalVotes = (teklifDetay.oySayilari?.kabul || 0) + 
                     (teklifDetay.oySayilari?.ret || 0) + 
                     (teklifDetay.oySayilari?.cekimser || 0) + 
                     (teklifDetay.oySayilari?.katilmayan || 0);

  return (
    <div style={{ 
      background: theme.pageBackground,
      minHeight: '100vh',
      paddingTop: '80px',
      paddingBottom: '60px'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 32px' }}>
        
        {/* Breadcrumb */}
        <div style={{ 
          marginBottom: '32px',
          fontSize: '14px',
          color: theme.textSecondary,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <button
            onClick={() => navigate('/category/tbmm')}
            style={{
              background: 'none',
              border: 'none',
              color: theme.textSecondary,
              cursor: 'pointer',
              padding: '0',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = theme.textPrimary}
            onMouseLeave={(e) => e.currentTarget.style.color = theme.textSecondary}
          >
            ← Kanun Teklifleri
          </button>
        </div>

        {/* Header */}
        <div style={{
          background: theme.cardBg,
          border: `1px solid ${theme.cardBorder}`,
          borderRadius: '2px',
          padding: '48px',
          marginBottom: '32px'
        }}>
          <div style={{ 
            display: 'flex', 
            gap: '12px', 
            marginBottom: '24px',
            flexWrap: 'wrap',
            alignItems: 'center'
          }}>
            <span style={{
              background: statusConfig.bg,
              color: statusConfig.color,
              border: `1px solid ${statusConfig.border}`,
              padding: '6px 16px',
              fontSize: '11px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              {teklifDetay.durum.replace('_', ' ')}
            </span>
            <span style={{
              color: theme.textSecondary,
              fontSize: '13px',
              fontWeight: '500',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              {teklifDetay.kategori}
            </span>
          </div>

          <h1 style={{
            fontSize: '36px',
            fontWeight: '300',
            color: theme.headingColor,
            marginBottom: '24px',
            lineHeight: '1.3',
            letterSpacing: '-0.5px'
          }}>
            {teklifDetay.baslik}
          </h1>

          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '32px',
            paddingTop: '24px',
            paddingBottom: '24px',
            borderTop: `1px solid ${theme.cardBorder}`,
            borderBottom: `1px solid ${theme.cardBorder}`,
            marginBottom: '24px'
          }}>
            <div>
              <div style={{ 
                fontSize: '11px', 
                color: theme.textSecondary, 
                marginBottom: '6px',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Teklif Numarası
              </div>
              <div style={{ fontSize: '16px', fontWeight: '400', color: theme.textPrimary }}>
                {teklifDetay.teklifNo}
              </div>
            </div>
            <div>
              <div style={{ 
                fontSize: '11px', 
                color: theme.textSecondary, 
                marginBottom: '6px',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Görüşülme Tarihi
              </div>
              <div style={{ fontSize: '16px', fontWeight: '400', color: theme.textPrimary }}>
                {new Date(teklifDetay.gorusulmeTarihi).toLocaleDateString('tr-TR', { 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </div>
            </div>
          </div>

          <p style={{
            fontSize: '16px',
            color: theme.textSecondary,
            lineHeight: '1.8',
            fontWeight: '300'
          }}>
            {teklifDetay.aciklama}
          </p>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '16px',
          marginBottom: '32px'
        }}>
          {[
            { label: 'Kabul', value: teklifDetay.oySayilari?.kabul || 0, color: '#059669' },
            { label: 'Ret', value: teklifDetay.oySayilari?.ret || 0, color: '#dc2626' },
            { label: 'Çekimser', value: teklifDetay.oySayilari?.cekimser || 0, color: '#d97706' },
            { label: 'Katılmayan', value: teklifDetay.oySayilari?.katilmayan || 0, color: '#6b7280' }
          ].map((stat, idx) => (
            <div key={idx} style={{
              background: theme.cardBg,
              border: `1px solid ${theme.cardBorder}`,
              padding: '24px',
              textAlign: 'center'
            }}>
              <div style={{ 
                fontSize: '11px',
                color: theme.textSecondary,
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '12px'
              }}>
                {stat.label}
              </div>
              <div style={{ 
                fontSize: '32px', 
                fontWeight: '300', 
                color: stat.color,
                marginBottom: '8px'
              }}>
                {stat.value}
              </div>
              <div style={{
                fontSize: '13px',
                color: theme.textSecondary,
                fontWeight: '400'
              }}>
                %{totalVotes > 0 ? Math.round((stat.value / totalVotes) * 100) : 0}
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{
          borderBottom: `1px solid ${theme.cardBorder}`,
          marginBottom: '32px',
          display: 'flex',
          gap: '0'
        }}>
          {[
            { id: 'genel', label: 'GENEL GÖRÜNÜM' },
            { id: 'partiler', label: 'PARTİ DAĞILIMI' },
            { id: 'milletvekilleri', label: 'MİLLETVEKİLİ LİSTESİ' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '16px 32px',
                background: 'transparent',
                border: 'none',
                borderBottom: activeTab === tab.id ? `2px solid ${theme.textPrimary}` : '2px solid transparent',
                color: activeTab === tab.id ? theme.textPrimary : theme.textSecondary,
                fontSize: '14px',
                fontWeight: activeTab === tab.id ? '600' : '400',
                cursor: 'pointer',
                transition: 'all 0.2s',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'genel' && (
          <div style={{
            background: theme.cardBg,
            border: `1px solid ${theme.cardBorder}`,
            padding: '48px',
            marginBottom: '32px'
          }}>
            <h2 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: theme.headingColor,
              marginBottom: '32px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              textAlign: 'center'
            }}>
              Meclis Oylama Düzeni
            </h2>

            <div style={{ 
              position: 'relative', 
              width: '100%', 
              maxWidth: '900px', 
              margin: '0 auto'
            }}>
              <svg viewBox="0 0 800 450" style={{ width: '100%', height: 'auto' }}>
                <rect x="360" y="390" width="80" height="50" fill={theme.textSecondary} opacity="0.1" />
                <text x="400" y="420" textAnchor="middle" fill={theme.textSecondary} fontSize="10" fontWeight="600" letterSpacing="1">
                  BAŞKANLIK KÜRSÜSÜ
                </text>

                {seats.map((seat, index) => {
                  const isHovered = hoveredSeat === index || hoveredParty === seat.party;
                  
                  return (
                    <circle
                      key={index}
                      cx={seat.x}
                      cy={seat.y}
                      r="3"
                      fill={getVoteColor(seat.vote)}
                      opacity={isHovered ? 1 : 0.6}
                      stroke={isHovered ? theme.textPrimary : 'none'}
                      strokeWidth={isHovered ? 1 : 0}
                      style={{
                        cursor: 'pointer',
                        transition: 'all 0.1s ease'
                      }}
                      onMouseEnter={() => setHoveredSeat(index)}
                      onMouseLeave={() => setHoveredSeat(null)}
                    >
                      <title>
                        {seat.name} - {seat.partyName} - {seat.city}
                        {'\n'}Oy: {seat.vote === 'kabul' ? 'Kabul' : seat.vote === 'ret' ? 'Ret' : seat.vote === 'cekimser' ? 'Çekimser' : 'Katılmadı'}
                      </title>
                    </circle>
                  );
                })}
              </svg>

              {hoveredSeat !== null && seats[hoveredSeat] && (
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: theme.cardBg,
                  border: `1px solid ${theme.cardBorder}`,
                  padding: '12px 16px',
                  fontSize: '13px',
                  lineHeight: '1.6',
                  zIndex: 100,
                  pointerEvents: 'none',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}>
                  <div style={{ fontWeight: '600', marginBottom: '4px', color: theme.textPrimary }}>
                    {seats[hoveredSeat].name}
                  </div>
                  <div style={{ fontSize: '12px', color: theme.textSecondary }}>
                    {seats[hoveredSeat].partyName} • {seats[hoveredSeat].city}
                  </div>
                  <div style={{ 
                    marginTop: '6px', 
                    paddingTop: '6px', 
                    borderTop: `1px solid ${theme.cardBorder}`,
                    fontWeight: '600',
                    fontSize: '12px',
                    color: getVoteColor(seats[hoveredSeat].vote)
                  }}>
                    {seats[hoveredSeat].vote === 'kabul' ? 'KABUL' : 
                     seats[hoveredSeat].vote === 'ret' ? 'RET' : 
                     seats[hoveredSeat].vote === 'cekimser' ? 'ÇEKİMSER' : 'KATILMADI'}
                  </div>
                </div>
              )}
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '32px',
              marginTop: '40px',
              flexWrap: 'wrap'
            }}>
              {[
                { label: 'Kabul', color: '#059669' },
                { label: 'Ret', color: '#dc2626' },
                { label: 'Çekimser', color: '#d97706' },
                { label: 'Katılmayan', color: '#6b7280' }
              ].map(item => (
                <div key={item.label} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '12px',
                  color: theme.textSecondary,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  <span style={{
                    width: '10px',
                    height: '10px',
                    background: item.color,
                    borderRadius: '50%'
                  }}></span>
                  {item.label}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'partiler' && (
          <div style={{
            background: theme.cardBg,
            border: `1px solid ${theme.cardBorder}`,
            padding: '0',
            marginBottom: '32px'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${theme.cardBorder}` }}>
                  <th style={{ 
                    padding: '20px 32px', 
                    textAlign: 'left', 
                    fontSize: '11px', 
                    fontWeight: '600', 
                    color: theme.textSecondary,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Parti
                  </th>
                  <th style={{ 
                    padding: '20px 32px', 
                    textAlign: 'right', 
                    fontSize: '11px', 
                    fontWeight: '600', 
                    color: theme.textSecondary,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Kabul
                  </th>
                  <th style={{ 
                    padding: '20px 32px', 
                    textAlign: 'right', 
                    fontSize: '11px', 
                    fontWeight: '600', 
                    color: theme.textSecondary,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Ret
                  </th>
                  <th style={{ 
                    padding: '20px 32px', 
                    textAlign: 'right', 
                    fontSize: '11px', 
                    fontWeight: '600', 
                    color: theme.textSecondary,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Çekimser
                  </th>
                  <th style={{ 
                    padding: '20px 32px', 
                    textAlign: 'right', 
                    fontSize: '11px', 
                    fontWeight: '600', 
                    color: theme.textSecondary,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Toplam
                  </th>
                </tr>
              </thead>
              <tbody>
                {partiOylari.map((party, index) => (
                  <tr
                    key={index}
                    style={{
                      borderBottom: `1px solid ${theme.cardBorder}`,
                      transition: 'background 0.2s',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = theme.categoryBg;
                      setHoveredParty(party.kod);
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      setHoveredParty(null);
                    }}
                  >
                    <td style={{ padding: '20px 32px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{
                          width: '4px',
                          height: '24px',
                          background: party.renk,
                          display: 'inline-block'
                        }}></span>
                        <span style={{ 
                          fontSize: '15px', 
                          fontWeight: '500', 
                          color: theme.textPrimary 
                        }}>
                          {party.ad}
                        </span>
                      </div>
                    </td>
                    <td style={{ 
                      padding: '20px 32px', 
                      textAlign: 'right', 
                      fontSize: '15px', 
                      fontWeight: '400', 
                      color: '#059669' 
                    }}>
                      {party.kabul || 0}
                    </td>
                    <td style={{ 
                      padding: '20px 32px', 
                      textAlign: 'right', 
                      fontSize: '15px', 
                      fontWeight: '400', 
                      color: '#dc2626' 
                    }}>
                      {party.ret || 0}
                    </td>
                    <td style={{ 
                      padding: '20px 32px', 
                      textAlign: 'right', 
                      fontSize: '15px', 
                      fontWeight: '400', 
                      color: '#d97706' 
                    }}>
                      {party.cekimser || 0}
                    </td>
                    <td style={{ 
                      padding: '20px 32px', 
                      textAlign: 'right', 
                      fontSize: '16px', 
                      fontWeight: '600', 
                      color: theme.textPrimary 
                    }}>
                      {party.toplam || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'milletvekilleri' && (
          <div style={{
            background: theme.cardBg,
            border: `1px solid ${theme.cardBorder}`,
            marginBottom: '32px'
          }}>
            <div style={{
              padding: '24px 32px',
              borderBottom: `1px solid ${theme.cardBorder}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '16px',
              flexWrap: 'wrap'
            }}>
              <div style={{
                fontSize: '11px',
                fontWeight: '600',
                color: theme.textSecondary,
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Toplam {filteredMilletvekilleri.length} Milletvekili
              </div>
              <input
                type="text"
                placeholder="İsim, parti veya il ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  padding: '10px 16px',
                  background: theme.pageBackground,
                  border: `1px solid ${theme.cardBorder}`,
                  color: theme.textPrimary,
                  fontSize: '14px',
                  outline: 'none',
                  minWidth: '300px',
                  fontWeight: '300'
                }}
              />
            </div>

            <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ position: 'sticky', top: 0, background: theme.cardBg, zIndex: 10 }}>
                  <tr style={{ borderBottom: `1px solid ${theme.cardBorder}` }}>
                    <th style={{ 
                      padding: '16px 32px', 
                      textAlign: 'left', 
                      fontSize: '11px', 
                      fontWeight: '600', 
                      color: theme.textSecondary,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      Milletvekili
                    </th>
                    <th style={{ 
                      padding: '16px 32px', 
                      textAlign: 'left', 
                      fontSize: '11px', 
                      fontWeight: '600', 
                      color: theme.textSecondary,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      Parti
                    </th>
                    <th style={{ 
                      padding: '16px 32px', 
                      textAlign: 'left', 
                      fontSize: '11px', 
                      fontWeight: '600', 
                      color: theme.textSecondary,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      İl
                    </th>
                    <th style={{ 
                      padding: '16px 32px', 
                      textAlign: 'right', 
                      fontSize: '11px', 
                      fontWeight: '600', 
                      color: theme.textSecondary,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      Oy
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMilletvekilleri.slice(0, 100).map((mv, idx) => (
                    <tr
                      key={idx}
                      style={{
                        borderBottom: `1px solid ${theme.cardBorder}`,
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = theme.categoryBg}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ 
                        padding: '16px 32px', 
                        fontSize: '14px', 
                        fontWeight: '400', 
                        color: theme.textPrimary 
                      }}>
                        {mv.name}
                      </td>
                      <td style={{ padding: '16px 32px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{
                            width: '3px',
                            height: '16px',
                            background: mv.partyColor,
                            display: 'inline-block'
                          }}></span>
                          <span style={{ 
                            fontSize: '13px', 
                            fontWeight: '400', 
                            color: theme.textSecondary 
                          }}>
                            {mv.partyName}
                          </span>
                        </div>
                      </td>
                      <td style={{ 
                        padding: '16px 32px', 
                        fontSize: '13px', 
                        color: theme.textSecondary 
                      }}>
                        {mv.city}
                      </td>
                      <td style={{ padding: '16px 32px', textAlign: 'right' }}>
                        <span style={{
                          fontSize: '11px',
                          fontWeight: '600',
                          color: getVoteColor(mv.vote),
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>
                          {mv.vote === 'kabul' ? 'Kabul' : 
                           mv.vote === 'ret' ? 'Ret' : 
                           mv.vote === 'cekimser' ? 'Çekimser' : 'Katılmadı'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {filteredMilletvekilleri.length > 100 && (
              <div style={{ 
                padding: '16px 32px',
                borderTop: `1px solid ${theme.cardBorder}`,
                textAlign: 'center', 
                fontSize: '12px', 
                color: theme.textSecondary 
              }}>
                İlk 100 kayıt gösteriliyor
              </div>
            )}
          </div>
        )}

        {/* Community Vote */}
        <div style={{
          background: theme.cardBg,
          border: `1px solid ${theme.cardBorder}`,
          padding: '48px',
          marginBottom: '32px'
        }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: theme.headingColor,
            marginBottom: '12px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            textAlign: 'center'
          }}>
            Toplum Görüşü
          </h2>
          <p style={{
            fontSize: '14px',
            color: theme.textSecondary,
            textAlign: 'center',
            marginBottom: '32px',
            fontWeight: '300'
          }}>
            Bu kanun teklifine sen olsaydın ne oy verirdin?
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '16px',
            marginBottom: '32px',
            maxWidth: '800px',
            margin: '0 auto 32px'
          }}>
            {[
              { value: 'kabul', label: 'Kabul', color: '#059669' },
              { value: 'ret', label: 'Ret', color: '#dc2626' },
              { value: 'cekimser', label: 'Çekimser', color: '#d97706' }
            ].map(option => (
              <button
                key={option.value}
                onClick={() => handleVote(option.value)}
                disabled={hasVoted || votingLoading}
                style={{
                  padding: '20px',
                  background: userVote === option.value ? option.color : 'transparent',
                  border: `1px solid ${userVote === option.value ? option.color : theme.cardBorder}`,
                  color: userVote === option.value ? '#ffffff' : theme.textPrimary,
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: hasVoted ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  opacity: hasVoted && userVote !== option.value ? 0.5 : 1
                }}
                onMouseEnter={(e) => {
                  if (!hasVoted && userVote !== option.value) {
                    e.currentTarget.style.borderColor = option.color;
                    e.currentTarget.style.color = option.color;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!hasVoted && userVote !== option.value) {
                    e.currentTarget.style.borderColor = theme.cardBorder;
                    e.currentTarget.style.color = theme.textPrimary;
                  }
                }}
              >
                {votingLoading ? 'Kaydediliyor...' : option.label}
              </button>
            ))}
          </div>

          {hasVoted && (
            <div style={{
              textAlign: 'center',
              fontSize: '13px',
              color: theme.textSecondary,
              marginBottom: '24px',
              padding: '12px',
              background: theme.categoryBg,
              borderRadius: '4px'
            }}>
              Bu teklife daha önce oy kullandınız: <strong style={{ color: getVoteColor(userVote) }}>
                {userVote === 'kabul' ? 'KABUL' : userVote === 'ret' ? 'RET' : 'ÇEKİMSER'}
              </strong>
            </div>
          )}

          {userVote && (
            <div style={{
              maxWidth: '800px',
              margin: '0 auto',
              paddingTop: '32px',
              borderTop: `1px solid ${theme.cardBorder}`
            }}>
              <div style={{ 
                fontSize: '12px', 
                fontWeight: '600', 
                color: theme.textSecondary,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '16px'
              }}>
                Karşılaştırma
              </div>

              <div style={{ display: 'grid', gap: '16px' }}>
                <div>
                  <div style={{ 
                    fontSize: '11px', 
                    fontWeight: '600', 
                    marginBottom: '8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    color: theme.textSecondary,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    <span>Toplum Oyları</span>
                    <span>{toplamToplumOyu.toLocaleString('tr-TR')}</span>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    height: '8px', 
                    overflow: 'hidden'
                  }}>
                    <div style={{ flex: toplumOylari.kabul, background: '#059669' }}></div>
                    <div style={{ flex: toplumOylari.ret, background: '#dc2626' }}></div>
                    <div style={{ flex: toplumOylari.cekimser, background: '#d97706' }}></div>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '8px',
                    fontSize: '11px',
                    color: theme.textSecondary
                  }}>
                    <span>%{toplamToplumOyu > 0 ? Math.round((toplumOylari.kabul / toplamToplumOyu) * 100) : 0}</span>
                    <span>%{toplamToplumOyu > 0 ? Math.round((toplumOylari.ret / toplamToplumOyu) * 100) : 0}</span>
                    <span>%{toplamToplumOyu > 0 ? Math.round((toplumOylari.cekimser / toplamToplumOyu) * 100) : 0}</span>
                  </div>
                </div>

                <div>
                  <div style={{ 
                    fontSize: '11px', 
                    fontWeight: '600', 
                    marginBottom: '8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    color: theme.textSecondary,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    <span>TBMM Oyları</span>
                    <span>600</span>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    height: '8px', 
                    overflow: 'hidden'
                  }}>
                    <div style={{ flex: teklifDetay.oySayilari?.kabul || 0, background: '#059669' }}></div>
                    <div style={{ flex: teklifDetay.oySayilari?.ret || 0, background: '#dc2626' }}></div>
                    <div style={{ flex: teklifDetay.oySayilari?.cekimser || 0, background: '#d97706' }}></div>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '8px',
                    fontSize: '11px',
                    color: theme.textSecondary
                  }}>
                    <span>%{Math.round(((teklifDetay.oySayilari?.kabul || 0) / 600) * 100)}</span>
                    <span>%{Math.round(((teklifDetay.oySayilari?.ret || 0) / 600) * 100)}</span>
                    <span>%{Math.round(((teklifDetay.oySayilari?.cekimser || 0) / 600) * 100)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default KanunTeklifiDetay;
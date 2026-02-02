import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const KanunTeklifiDetay = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  
  const [hoveredSeat, setHoveredSeat] = useState(null);
  const [hoveredParty, setHoveredParty] = useState(null);
  const [hoveredMV, setHoveredMV] = useState(null);
  const [userVote, setUserVote] = useState(null);
  const [filters, setFilters] = useState({
    parties: [],
    voteTypes: [],
    search: ''
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Mock Data - Backend bağlandığında buradan gelecek
  const teklifDetay = {
    id: 1,
    title: 'Dijital Hizmet Vergisi Kanunu Teklifi',
    teklifNo: '2026/142',
    date: '2026-02-02',
    status: 'KABUL EDİLDİ', // KABUL EDİLDİ, REDDEDİLDİ, GÖRÜŞÜLÜYOR
    category: 'Vergi Mevzuatı',
    description: 'Dijital platformların Türkiye\'de sağladıkları hizmetlerden elde ettikleri gelirlerin vergilendirilmesine ilişkin kapsamlı kanun teklifi. Bu düzenleme ile büyük teknoloji şirketlerinin Türkiye\'de elde ettikleri gelirler üzerinden adil vergilendirme sağlanması hedeflenmektedir.',
    votingResults: {
      kabul: 320,
      ret: 180,
      cekimser: 50,
      katilmayan: 50
    }
  };

  // Parti verileri
  const parties = [
    { code: 'AKP', name: 'AK Parti', color: '#F7941E', kabul: 180, ret: 10, cekimser: 5, toplam: 195 },
    { code: 'CHP', name: 'CHP', color: '#ED1C24', kabul: 50, ret: 80, cekimser: 10, toplam: 140 },
    { code: 'MHP', name: 'MHP', color: '#D90B0F', kabul: 40, ret: 5, cekimser: 5, toplam: 50 },
    { code: 'IYI', name: 'İYİ Parti', color: '#00AEEF', kabul: 20, ret: 30, cekimser: 5, toplam: 55 },
    { code: 'HDP', name: 'HDP', color: '#7B3F99', kabul: 10, ret: 40, cekimser: 15, toplam: 65 },
    { code: 'DEM', name: 'DEM Parti', color: '#6B4C9A', kabul: 10, ret: 10, cekimser: 5, toplam: 25 },
    { code: 'BAG', name: 'Bağımsız', color: '#95A5A6', kabul: 10, ret: 5, cekimser: 5, toplam: 20 }
  ];

  // Milletvekili verileri (Örnek)
  const milletvekilleri = [
    { id: 1, name: 'Ahmet Yılmaz', party: 'AKP', city: 'İstanbul', vote: 'kabul', seatIndex: 0 },
    { id: 2, name: 'Mehmet Demir', party: 'CHP', city: 'Ankara', vote: 'ret', seatIndex: 1 },
    { id: 3, name: 'Ayşe Kaya', party: 'MHP', city: 'İzmir', vote: 'kabul', seatIndex: 2 },
    { id: 4, name: 'Fatma Şahin', party: 'IYI', city: 'Bursa', vote: 'cekimser', seatIndex: 3 },
    { id: 5, name: 'Ali Özkan', party: 'HDP', city: 'Diyarbakır', vote: 'ret', seatIndex: 4 },
    // ... 600 milletvekiline kadar genişletilebilir
  ];

  // Koltuk pozisyonlarını oluştur (yarım daire düzeni)
  const generateSeats = () => {
    const seats = [];
    const totalSeats = 600;
    const rows = 12; // 12 sıra
    const centerX = 300;
    const centerY = 350;
    const startRadius = 80;
    const radiusIncrement = 25;

    let seatIndex = 0;
    for (let row = 0; row < rows; row++) {
      const radius = startRadius + (row * radiusIncrement);
      const seatsInRow = Math.floor(40 + (row * 5)); // Her sırada artarak koltuk
      
      for (let i = 0; i < seatsInRow && seatIndex < totalSeats; i++) {
        const angle = Math.PI * (i / (seatsInRow - 1)); // 0 ile PI arası (yarım daire)
        const x = centerX + radius * Math.cos(angle);
        const y = centerY - radius * Math.sin(angle);
        
        // Milletvekili verisi varsa al, yoksa random oluştur
        const mv = milletvekilleri[seatIndex] || {
          id: seatIndex + 1,
          name: `Milletvekili ${seatIndex + 1}`,
          party: parties[Math.floor(Math.random() * parties.length)].code,
          city: 'İstanbul',
          vote: ['kabul', 'ret', 'cekimser', 'katilmayan'][Math.floor(Math.random() * 4)],
          seatIndex
        };
        
        seats.push({ x, y, ...mv });
        seatIndex++;
      }
    }
    return seats;
  };

  const seats = generateSeats();

  // Filtreleme fonksiyonu
  const filteredSeats = seats.filter(seat => {
    if (filters.parties.length > 0 && !filters.parties.includes(seat.party)) return false;
    if (filters.voteTypes.length > 0 && !filters.voteTypes.includes(seat.vote)) return false;
    if (filters.search && !seat.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  // Oy rengini getir
  const getVoteColor = (vote) => {
    switch(vote) {
      case 'kabul': return '#10b981';
      case 'ret': return '#ef4444';
      case 'cekimser': return '#f59e0b';
      case 'katilmayan': return '#9ca3af';
      default: return '#9ca3af';
    }
  };

  // Durum badge rengi
  const getStatusColor = () => {
    switch(teklifDetay.status) {
      case 'KABUL EDİLDİ': return '#10b981';
      case 'REDDEDİLDİ': return '#ef4444';
      case 'GÖRÜŞÜLÜYOR': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = () => {
    switch(teklifDetay.status) {
      case 'KABUL EDİLDİ': return '🟢';
      case 'REDDEDİLDİ': return '🔴';
      case 'GÖRÜŞÜLÜYOR': return '🟠';
      default: return '⚪';
    }
  };

  // Kullanıcı oyları (mock)
  const communityVotes = {
    kabul: 1245,
    ret: 892,
    cekimser: 234
  };

  const totalCommunityVotes = communityVotes.kabul + communityVotes.ret + communityVotes.cekimser;

  return (
    <div style={{ 
      background: theme.pageBackground,
      minHeight: '100vh',
      paddingTop: '100px',
      paddingBottom: '80px',
      position: 'relative',
      overflow: 'hidden',
      transition: 'background 0.4s ease'
    }}>
      {/* Background Blobs */}
      <div style={{
        position: 'absolute',
        top: '5%',
        left: '5%',
        width: '400px',
        height: '400px',
        background: theme.bgBlob1,
        borderRadius: '50%',
        filter: 'blur(80px)',
        animation: 'float 8s ease-in-out infinite',
        zIndex: 0
      }}></div>
      
      <div style={{
        position: 'absolute',
        bottom: '10%',
        right: '5%',
        width: '350px',
        height: '350px',
        background: theme.bgBlob2,
        borderRadius: '50%',
        filter: 'blur(80px)',
        animation: 'float 10s ease-in-out infinite reverse',
        zIndex: 0
      }}></div>

      <div className="container" style={{ position: 'relative', zIndex: 1, maxWidth: '1400px', margin: '0 auto', padding: '0 20px' }}>
        
        {/* Geri Dön Butonu */}
        <button
          onClick={() => navigate('/category/tbmm')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            background: theme.cardBg,
            border: `1px solid ${theme.cardBorder}`,
            borderRadius: '10px',
            color: theme.textPrimary,
            fontSize: '15px',
            fontWeight: '600',
            cursor: 'pointer',
            marginBottom: '40px',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = theme.cardBorderHover;
            e.currentTarget.style.transform = 'translateX(-4px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = theme.cardBorder;
            e.currentTarget.style.transform = 'translateX(0)';
          }}
        >
          <span>←</span>
          TBMM'ye Dön
        </button>

        {/* 1. ÜST BİLGİ ALANI */}
        <div style={{
          background: theme.cardBg,
          border: `1px solid ${theme.cardBorder}`,
          borderRadius: '20px',
          padding: '48px',
          marginBottom: '40px',
          boxShadow: theme.cardShadow
        }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap' }}>
            <span style={{
              background: theme.categoryBg,
              color: theme.categoryText,
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '600',
              border: `1px solid ${theme.categoryBorder}`,
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              {teklifDetay.category}
            </span>
            <span style={{
              background: getStatusColor(),
              color: '#ffffff',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '700',
              letterSpacing: '0.5px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
            }}>
              {getStatusIcon()} {teklifDetay.status}
            </span>
          </div>

          <h1 style={{
            fontSize: '48px',
            fontWeight: '700',
            color: theme.headingColor,
            marginBottom: '20px',
            letterSpacing: '-1px',
            lineHeight: '1.2'
          }}>
            {teklifDetay.title}
          </h1>

          <div style={{ display: 'flex', gap: '32px', marginBottom: '24px', flexWrap: 'wrap' }}>
            <div>
              <span style={{ fontSize: '14px', color: theme.textSecondary, display: 'block', marginBottom: '4px' }}>
                Teklif Numarası
              </span>
              <span style={{ fontSize: '18px', fontWeight: '600', color: theme.textPrimary }}>
                {teklifDetay.teklifNo}
              </span>
            </div>
            <div>
              <span style={{ fontSize: '14px', color: theme.textSecondary, display: 'block', marginBottom: '4px' }}>
                Görüşülme Tarihi
              </span>
              <span style={{ fontSize: '18px', fontWeight: '600', color: theme.textPrimary }}>
                {new Date(teklifDetay.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </div>
          </div>

          <p style={{
            fontSize: '17px',
            color: theme.textSecondary,
            lineHeight: '1.7',
            letterSpacing: '-0.2px'
          }}>
            {teklifDetay.description}
          </p>
        </div>

        {/* 2. GENEL OYLAMA GÖRSELİ */}
        <div style={{
          background: theme.cardBg,
          border: `1px solid ${theme.cardBorder}`,
          borderRadius: '20px',
          padding: '48px',
          marginBottom: '40px',
          boxShadow: theme.cardShadow
        }}>
          <h2 style={{
            fontSize: '32px',
            fontWeight: '600',
            color: theme.headingColor,
            marginBottom: '32px',
            letterSpacing: '-0.5px'
          }}>
            🏛️ TBMM Meclis Salonu - Oylama Dağılımı
          </h2>

          {/* Filtre & Kontrol Alanı */}
          <div style={{
            background: theme.pageBackground,
            border: `1px solid ${theme.cardBorder}`,
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '32px'
          }}>
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
              {/* Parti Filtreleri */}
              <div style={{ flex: '1', minWidth: '250px' }}>
                <label style={{ fontSize: '14px', fontWeight: '600', color: theme.textSecondary, marginBottom: '12px', display: 'block' }}>
                  Parti Filtrele
                </label>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {parties.map(party => (
                    <label key={party.code} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={filters.parties.includes(party.code)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilters({...filters, parties: [...filters.parties, party.code]});
                          } else {
                            setFilters({...filters, parties: filters.parties.filter(p => p !== party.code)});
                          }
                        }}
                        style={{ cursor: 'pointer' }}
                      />
                      <span style={{ 
                        fontSize: '13px', 
                        fontWeight: '500', 
                        color: theme.textPrimary,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <span style={{ 
                          width: '12px', 
                          height: '12px', 
                          background: party.color, 
                          borderRadius: '50%',
                          display: 'inline-block'
                        }}></span>
                        {party.code}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Oy Türü Filtreleri */}
              <div style={{ flex: '1', minWidth: '200px' }}>
                <label style={{ fontSize: '14px', fontWeight: '600', color: theme.textSecondary, marginBottom: '12px', display: 'block' }}>
                  Oy Türü
                </label>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {[
                    { value: 'kabul', label: 'Kabul', color: '#10b981' },
                    { value: 'ret', label: 'Ret', color: '#ef4444' },
                    { value: 'cekimser', label: 'Çekimser', color: '#f59e0b' },
                    { value: 'katilmayan', label: 'Katılmayan', color: '#9ca3af' }
                  ].map(voteType => (
                    <label key={voteType.value} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={filters.voteTypes.includes(voteType.value)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilters({...filters, voteTypes: [...filters.voteTypes, voteType.value]});
                          } else {
                            setFilters({...filters, voteTypes: filters.voteTypes.filter(v => v !== voteType.value)});
                          }
                        }}
                        style={{ cursor: 'pointer' }}
                      />
                      <span style={{ 
                        fontSize: '13px', 
                        fontWeight: '500', 
                        color: theme.textPrimary,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <span style={{ 
                          width: '12px', 
                          height: '12px', 
                          background: voteType.color, 
                          borderRadius: '50%',
                          display: 'inline-block'
                        }}></span>
                        {voteType.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Arama */}
              <div style={{ flex: '1', minWidth: '200px' }}>
                <label style={{ fontSize: '14px', fontWeight: '600', color: theme.textSecondary, marginBottom: '12px', display: 'block' }}>
                  Milletvekili Ara
                </label>
                <input
                  type="text"
                  placeholder="İsim ara..."
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px 16px',
                    background: theme.cardBg,
                    border: `1px solid ${theme.cardBorder}`,
                    borderRadius: '8px',
                    color: theme.textPrimary,
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            {/* Filtreleri Temizle */}
            {(filters.parties.length > 0 || filters.voteTypes.length > 0 || filters.search) && (
              <button
                onClick={() => setFilters({ parties: [], voteTypes: [], search: '' })}
                style={{
                  marginTop: '16px',
                  padding: '8px 16px',
                  background: 'transparent',
                  border: `1px solid ${theme.cardBorder}`,
                  borderRadius: '8px',
                  color: theme.textSecondary,
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#ef4444';
                  e.currentTarget.style.color = '#ef4444';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = theme.cardBorder;
                  e.currentTarget.style.color = theme.textSecondary;
                }}
              >
                Filtreleri Temizle
              </button>
            )}
          </div>

          {/* Meclis Koltuk Düzeni (SVG) */}
          <div style={{ position: 'relative', width: '100%', maxWidth: '700px', margin: '0 auto 32px' }}>
            <svg viewBox="0 0 600 400" style={{ width: '100%', height: 'auto' }}>
              {/* Kürsü (Başkan Kürsüsü) */}
              <rect x="270" y="340" width="60" height="40" fill={theme.textSecondary} opacity="0.3" rx="5" />
              <text x="300" y="365" textAnchor="middle" fill={theme.textPrimary} fontSize="12" fontWeight="600">
                KÜRSÜ
              </text>

              {/* Koltuklar */}
              {seats.map((seat, index) => {
                const isFiltered = !filteredSeats.includes(seat);
                const isHovered = hoveredSeat === index || hoveredParty === seat.party || hoveredMV === seat.id;
                const partyData = parties.find(p => p.code === seat.party);
                
                return (
                  <circle
                    key={index}
                    cx={seat.x}
                    cy={seat.y}
                    r="4"
                    fill={isFiltered ? theme.textMuted : getVoteColor(seat.vote)}
                    opacity={isFiltered ? 0.2 : (isHovered ? 1 : 0.8)}
                    stroke={isHovered ? '#ffffff' : 'none'}
                    strokeWidth={isHovered ? 2 : 0}
                    style={{
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      transform: isHovered ? 'scale(1.5)' : 'scale(1)',
                      transformOrigin: `${seat.x}px ${seat.y}px`
                    }}
                    onMouseEnter={() => setHoveredSeat(index)}
                    onMouseLeave={() => setHoveredSeat(null)}
                  >
                    <title>
                      {seat.name}
{'\n'}Parti: {partyData?.name}
{'\n'}İl: {seat.city}
{'\n'}Oy: {seat.vote === 'kabul' ? 'Kabul' : seat.vote === 'ret' ? 'Ret' : seat.vote === 'cekimser' ? 'Çekimser' : 'Katılmadı'}
                    </title>
                  </circle>
                );
              })}
            </svg>

            {/* Hover Tooltip */}
            {hoveredSeat !== null && (
              <div style={{
                position: 'absolute',
                top: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(0, 0, 0, 0.9)',
                color: '#ffffff',
                padding: '12px 16px',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: '500',
                lineHeight: '1.6',
                zIndex: 100,
                pointerEvents: 'none',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)'
              }}>
                <div style={{ fontWeight: '700', marginBottom: '4px', fontSize: '14px' }}>
                  {seats[hoveredSeat].name}
                </div>
                <div>Parti: {parties.find(p => p.code === seats[hoveredSeat].party)?.name}</div>
                <div>İl: {seats[hoveredSeat].city}</div>
                <div style={{ 
                  marginTop: '6px', 
                  paddingTop: '6px', 
                  borderTop: '1px solid rgba(255, 255, 255, 0.2)',
                  fontWeight: '600'
                }}>
                  Oy: <span style={{ color: getVoteColor(seats[hoveredSeat].vote) }}>
                    {seats[hoveredSeat].vote === 'kabul' ? 'KABUL' : 
                     seats[hoveredSeat].vote === 'ret' ? 'RET' : 
                     seats[hoveredSeat].vote === 'cekimser' ? 'ÇEKİMSER' : 'KATILMADI'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Canlı Sayaç */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '16px',
            marginTop: '32px'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              padding: '20px',
              borderRadius: '12px',
              textAlign: 'center',
              color: '#ffffff'
            }}>
              <div style={{ fontSize: '32px', fontWeight: '700', marginBottom: '4px' }}>
                {teklifDetay.votingResults.kabul}
              </div>
              <div style={{ fontSize: '13px', fontWeight: '600', opacity: 0.9 }}>
                KABUL
              </div>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              padding: '20px',
              borderRadius: '12px',
              textAlign: 'center',
              color: '#ffffff'
            }}>
              <div style={{ fontSize: '32px', fontWeight: '700', marginBottom: '4px' }}>
                {teklifDetay.votingResults.ret}
              </div>
              <div style={{ fontSize: '13px', fontWeight: '600', opacity: 0.9 }}>
                RET
              </div>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              padding: '20px',
              borderRadius: '12px',
              textAlign: 'center',
              color: '#ffffff'
            }}>
              <div style={{ fontSize: '32px', fontWeight: '700', marginBottom: '4px' }}>
                {teklifDetay.votingResults.cekimser}
              </div>
              <div style={{ fontSize: '13px', fontWeight: '600', opacity: 0.9 }}>
                ÇEKİMSER
              </div>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)',
              padding: '20px',
              borderRadius: '12px',
              textAlign: 'center',
              color: '#ffffff'
            }}>
              <div style={{ fontSize: '32px', fontWeight: '700', marginBottom: '4px' }}>
                {teklifDetay.votingResults.katilmayan}
              </div>
              <div style={{ fontSize: '13px', fontWeight: '600', opacity: 0.9 }}>
                KATILMAYAN
              </div>
            </div>
          </div>
        </div>

        {/* 3. PARTİ BAZLI OYLAMA TABLOSU */}
        <div style={{
          background: theme.cardBg,
          border: `1px solid ${theme.cardBorder}`,
          borderRadius: '20px',
          padding: '48px',
          marginBottom: '40px',
          boxShadow: theme.cardShadow
        }}>
          <h2 style={{
            fontSize: '32px',
            fontWeight: '600',
            color: theme.headingColor,
            marginBottom: '32px',
            letterSpacing: '-0.5px'
          }}>
            📊 Parti Bazlı Oylama Dağılımı
          </h2>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: `2px solid ${theme.cardBorder}` }}>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: theme.textSecondary }}>
                    Parti
                  </th>
                  <th style={{ padding: '16px', textAlign: 'center', fontSize: '14px', fontWeight: '600', color: theme.textSecondary }}>
                    Kabul
                  </th>
                  <th style={{ padding: '16px', textAlign: 'center', fontSize: '14px', fontWeight: '600', color: theme.textSecondary }}>
                    Ret
                  </th>
                  <th style={{ padding: '16px', textAlign: 'center', fontSize: '14px', fontWeight: '600', color: theme.textSecondary }}>
                    Çekimser
                  </th>
                  <th style={{ padding: '16px', textAlign: 'center', fontSize: '14px', fontWeight: '600', color: theme.textSecondary }}>
                    Toplam
                  </th>
                </tr>
              </thead>
              <tbody>
                {parties.map((party, index) => (
                  <tr
                    key={index}
                    style={{
                      borderBottom: `1px solid ${theme.cardBorder}`,
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      background: hoveredParty === party.code ? theme.categoryBg : 'transparent'
                    }}
                    onMouseEnter={() => setHoveredParty(party.code)}
                    onMouseLeave={() => setHoveredParty(null)}
                  >
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{
                          width: '16px',
                          height: '16px',
                          background: party.color,
                          borderRadius: '50%',
                          display: 'inline-block'
                        }}></span>
                        <span style={{ fontSize: '15px', fontWeight: '600', color: theme.textPrimary }}>
                          {party.name}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center', fontSize: '15px', fontWeight: '600', color: '#10b981' }}>
                      {party.kabul}
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center', fontSize: '15px', fontWeight: '600', color: '#ef4444' }}>
                      {party.ret}
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center', fontSize: '15px', fontWeight: '600', color: '#f59e0b' }}>
                      {party.cekimser}
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center', fontSize: '15px', fontWeight: '700', color: theme.textPrimary }}>
                      {party.toplam}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. MİLLETVEKİLİ BAZLI OYLAMA TABLOSU */}
        <div style={{
          background: theme.cardBg,
          border: `1px solid ${theme.cardBorder}`,
          borderRadius: '20px',
          padding: '48px',
          marginBottom: '40px',
          boxShadow: theme.cardShadow
        }}>
          <h2 style={{
            fontSize: '32px',
            fontWeight: '600',
            color: theme.headingColor,
            marginBottom: '32px',
            letterSpacing: '-0.5px'
          }}>
            👥 Milletvekili Bazlı Oylar
          </h2>

          <div style={{ overflowX: 'auto', maxHeight: '500px', overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ position: 'sticky', top: 0, background: theme.cardBg, zIndex: 10 }}>
                <tr style={{ borderBottom: `2px solid ${theme.cardBorder}` }}>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: theme.textSecondary }}>
                    Milletvekili
                  </th>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: theme.textSecondary }}>
                    Parti
                  </th>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: theme.textSecondary }}>
                    İl
                  </th>
                  <th style={{ padding: '16px', textAlign: 'center', fontSize: '14px', fontWeight: '600', color: theme.textSecondary }}>
                    Verdiği Oy
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredSeats.slice(0, 50).map((mv, index) => {
                  const partyData = parties.find(p => p.code === mv.party);
                  return (
                    <tr
                      key={index}
                      style={{
                        borderBottom: `1px solid ${theme.cardBorder}`,
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        background: hoveredMV === mv.id ? theme.categoryBg : 'transparent'
                      }}
                      onMouseEnter={() => setHoveredMV(mv.id)}
                      onMouseLeave={() => setHoveredMV(null)}
                    >
                      <td style={{ padding: '16px', fontSize: '15px', fontWeight: '500', color: theme.textPrimary }}>
                        {mv.name}
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{
                            width: '12px',
                            height: '12px',
                            background: partyData?.color,
                            borderRadius: '50%',
                            display: 'inline-block'
                          }}></span>
                          <span style={{ fontSize: '14px', fontWeight: '500', color: theme.textPrimary }}>
                            {partyData?.name}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '16px', fontSize: '14px', color: theme.textSecondary }}>
                        {mv.city}
                      </td>
                      <td style={{ padding: '16px', textAlign: 'center' }}>
                        <span style={{
                          display: 'inline-block',
                          background: getVoteColor(mv.vote),
                          color: '#ffffff',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '700',
                          letterSpacing: '0.3px'
                        }}>
                          {mv.vote === 'kabul' ? 'KABUL' : 
                           mv.vote === 'ret' ? 'RET' : 
                           mv.vote === 'cekimser' ? 'ÇEKİMSER' : 'KATILMADI'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {filteredSeats.length > 50 && (
            <div style={{ 
              marginTop: '16px', 
              textAlign: 'center', 
              fontSize: '14px', 
              color: theme.textSecondary 
            }}>
              İlk 50 milletvekili gösteriliyor. Toplam: {filteredSeats.length}
            </div>
          )}
        </div>

        {/* 5. KULLANICI KATILIM ALANI */}
        <div style={{
          background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
          border: `1px solid ${theme.cardBorder}`,
          borderRadius: '20px',
          padding: '48px',
          marginBottom: '40px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          color: '#ffffff'
        }}>
          <h2 style={{
            fontSize: '32px',
            fontWeight: '600',
            marginBottom: '16px',
            letterSpacing: '-0.5px',
            textAlign: 'center'
          }}>
            💭 Sen Olsan Ne Oy Verirdin?
          </h2>
          <p style={{
            fontSize: '16px',
            opacity: 0.9,
            textAlign: 'center',
            marginBottom: '32px',
            maxWidth: '600px',
            margin: '0 auto 32px'
          }}>
            Bu kanun teklifine sen olsan ne oy verirdin? Görüşünü bizimle paylaş!
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginBottom: '32px'
          }}>
            <button
              onClick={() => setUserVote('kabul')}
              style={{
                padding: '20px',
                background: userVote === 'kabul' 
                  ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                  : 'rgba(255, 255, 255, 0.1)',
                border: userVote === 'kabul' ? '2px solid #10b981' : '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                color: '#ffffff',
                fontSize: '16px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                if (userVote !== 'kabul') {
                  e.currentTarget.style.background = 'rgba(16, 185, 129, 0.2)';
                  e.currentTarget.style.borderColor = '#10b981';
                }
              }}
              onMouseLeave={(e) => {
                if (userVote !== 'kabul') {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                }
              }}
            >
              <span style={{ fontSize: '24px' }}>👍</span>
              KABUL
            </button>

            <button
              onClick={() => setUserVote('ret')}
              style={{
                padding: '20px',
                background: userVote === 'ret' 
                  ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                  : 'rgba(255, 255, 255, 0.1)',
                border: userVote === 'ret' ? '2px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                color: '#ffffff',
                fontSize: '16px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                if (userVote !== 'ret') {
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                  e.currentTarget.style.borderColor = '#ef4444';
                }
              }}
              onMouseLeave={(e) => {
                if (userVote !== 'ret') {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                }
              }}
            >
              <span style={{ fontSize: '24px' }}>👎</span>
              RET
            </button>

            <button
              onClick={() => setUserVote('cekimser')}
              style={{
                padding: '20px',
                background: userVote === 'cekimser' 
                  ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                  : 'rgba(255, 255, 255, 0.1)',
                border: userVote === 'cekimser' ? '2px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                color: '#ffffff',
                fontSize: '16px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                if (userVote !== 'cekimser') {
                  e.currentTarget.style.background = 'rgba(245, 158, 11, 0.2)';
                  e.currentTarget.style.borderColor = '#f59e0b';
                }
              }}
              onMouseLeave={(e) => {
                if (userVote !== 'cekimser') {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                }
              }}
            >
              <span style={{ fontSize: '24px' }}>🤍</span>
              ÇEKİMSER
            </button>
          </div>

          {userVote && (
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '24px',
              marginTop: '24px'
            }}>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '600',
                marginBottom: '20px',
                textAlign: 'center'
              }}>
                Toplum Görüşü vs TBMM Oyları
              </h3>

              <div style={{ display: 'grid', gap: '16px' }}>
                {/* Toplum */}
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', opacity: 0.9 }}>
                    Toplum Oyları ({totalCommunityVotes.toLocaleString('tr-TR')})
                  </div>
                  <div style={{ display: 'flex', gap: '2px', height: '30px', borderRadius: '8px', overflow: 'hidden' }}>
                    <div style={{
                      flex: communityVotes.kabul,
                      background: '#10b981',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: '700'
                    }}>
                      {Math.round((communityVotes.kabul / totalCommunityVotes) * 100)}%
                    </div>
                    <div style={{
                      flex: communityVotes.ret,
                      background: '#ef4444',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: '700'
                    }}>
                      {Math.round((communityVotes.ret / totalCommunityVotes) * 100)}%
                    </div>
                    <div style={{
                      flex: communityVotes.cekimser,
                      background: '#f59e0b',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: '700'
                    }}>
                      {Math.round((communityVotes.cekimser / totalCommunityVotes) * 100)}%
                    </div>
                  </div>
                </div>

                {/* TBMM */}
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', opacity: 0.9 }}>
                    TBMM Oyları (600)
                  </div>
                  <div style={{ display: 'flex', gap: '2px', height: '30px', borderRadius: '8px', overflow: 'hidden' }}>
                    <div style={{
                      flex: teklifDetay.votingResults.kabul,
                      background: '#10b981',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: '700'
                    }}>
                      {Math.round((teklifDetay.votingResults.kabul / 600) * 100)}%
                    </div>
                    <div style={{
                      flex: teklifDetay.votingResults.ret,
                      background: '#ef4444',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: '700'
                    }}>
                      {Math.round((teklifDetay.votingResults.ret / 600) * 100)}%
                    </div>
                    <div style={{
                      flex: teklifDetay.votingResults.cekimser,
                      background: '#f59e0b',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: '700'
                    }}>
                      {Math.round((teklifDetay.votingResults.cekimser / 600) * 100)}%
                    </div>
                  </div>
                </div>
              </div>

              <div style={{
                marginTop: '16px',
                padding: '12px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '8px',
                fontSize: '13px',
                textAlign: 'center',
                opacity: 0.8
              }}>
                Senin oyun: <strong style={{ color: getVoteColor(userVote) }}>
                  {userVote === 'kabul' ? '👍 KABUL' : userVote === 'ret' ? '👎 RET' : '🤍 ÇEKİMSER'}
                </strong>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-25px); }
        }
      `}</style>
    </div>
  );
};

export default KanunTeklifiDetay;
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const KanunTeklifiDetay = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  
  const [hoveredSeat, setHoveredSeat] = useState(null);
  const [hoveredParty, setHoveredParty] = useState(null);
  const [userVote, setUserVote] = useState(null);
  const [activeTab, setActiveTab] = useState('genel');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Mock Data
  const teklifDetay = {
    id: 1,
    title: 'Dijital Hizmet Vergisi Kanunu Teklifi',
    teklifNo: '2026/142',
    date: '2026-02-02',
    status: 'KABUL EDİLDİ',
    category: 'Vergi Mevzuatı',
    description: 'Dijital platformların Türkiye\'de sağladıkları hizmetlerden elde ettikleri gelirlerin vergilendirilmesine ilişkin düzenleme. Bu kanun teklifi ile büyük teknoloji şirketlerinin yerel vergi yükümlülüklerinin netleştirilmesi ve dijital ekonominin vergilendirilmesine yönelik çerçevenin oluşturulması hedeflenmektedir.',
    votingResults: {
      kabul: 320,
      ret: 180,
      cekimser: 50,
      katilmayan: 50
    }
  };

  const parties = [
    { code: 'AKP', name: 'AK Parti', color: '#F7941E', kabul: 180, ret: 10, cekimser: 5, toplam: 195 },
    { code: 'CHP', name: 'CHP', color: '#ED1C24', kabul: 50, ret: 80, cekimser: 10, toplam: 140 },
    { code: 'MHP', name: 'MHP', color: '#D90B0F', kabul: 40, ret: 5, cekimser: 5, toplam: 50 },
    { code: 'İYİ', name: 'İYİ Parti', color: '#00AEEF', kabul: 20, ret: 30, cekimser: 5, toplam: 55 },
    { code: 'HDP', name: 'HDP', color: '#7B3F99', kabul: 10, ret: 40, cekimser: 15, toplam: 65 },
    { code: 'DEM', name: 'DEM Parti', color: '#6B4C9A', kabul: 10, ret: 10, cekimser: 5, toplam: 25 },
    { code: 'BAĞ', name: 'Bağımsız', color: '#95A5A6', kabul: 10, ret: 5, cekimser: 5, toplam: 20 }
  ];

  const generateMilletvekilleri = () => {
    const firstNames = ['Ahmet', 'Mehmet', 'Ayşe', 'Fatma', 'Ali', 'Zeynep', 'Mustafa', 'Elif', 'Hasan', 'Emine'];
    const lastNames = ['Yılmaz', 'Demir', 'Kaya', 'Şahin', 'Özkan', 'Arslan', 'Çelik', 'Koç', 'Yıldız', 'Aydın'];
    const cities = ['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Diyarbakır', 'Antalya', 'Adana', 'Gaziantep', 'Konya', 'Mersin'];
    
    return Array.from({ length: 600 }, (_, i) => {
      const partyIndex = i < 195 ? 0 : i < 335 ? 1 : i < 385 ? 2 : i < 440 ? 3 : i < 505 ? 4 : i < 530 ? 5 : 6;
      const party = parties[partyIndex];
      const voteRandom = Math.random();
      let vote;
      if (voteRandom < party.kabul / party.toplam) vote = 'kabul';
      else if (voteRandom < (party.kabul + party.ret) / party.toplam) vote = 'ret';
      else vote = 'cekimser';
      
      return {
        id: i + 1,
        name: `${firstNames[i % firstNames.length]} ${lastNames[Math.floor(i / firstNames.length) % lastNames.length]}`,
        party: party.code,
        city: cities[i % cities.length],
        vote: vote,
        seatIndex: i
      };
    });
  };

  const milletvekilleri = generateMilletvekilleri();

  const generateSeats = () => {
    const seats = [];
    const totalSeats = 600;
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
        seats.push({ x, y, ...mv });
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
    switch(teklifDetay.status) {
      case 'KABUL EDİLDİ': return { color: '#059669', bg: '#ecfdf5', border: '#a7f3d0' };
      case 'REDDEDİLDİ': return { color: '#dc2626', bg: '#fef2f2', border: '#fecaca' };
      case 'GÖRÜŞÜLÜYOR': return { color: '#d97706', bg: '#fffbeb', border: '#fde68a' };
      default: return { color: '#6b7280', bg: '#f9fafb', border: '#e5e7eb' };
    }
  };

  const communityVotes = {
    kabul: 2847,
    ret: 1523,
    cekimser: 456
  };

  const totalCommunityVotes = communityVotes.kabul + communityVotes.ret + communityVotes.cekimser;
  const totalVotes = teklifDetay.votingResults.kabul + teklifDetay.votingResults.ret + teklifDetay.votingResults.cekimser + teklifDetay.votingResults.katilmayan;

  const filteredMilletvekilleri = milletvekilleri.filter(mv => 
    mv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mv.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    parties.find(p => p.code === mv.party)?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statusConfig = getStatusConfig();

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
              {teklifDetay.status}
            </span>
            <span style={{
              color: theme.textSecondary,
              fontSize: '13px',
              fontWeight: '500',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              {teklifDetay.category}
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
            {teklifDetay.title}
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
                {new Date(teklifDetay.date).toLocaleDateString('tr-TR', { 
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
            {teklifDetay.description}
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
            { label: 'Kabul', value: teklifDetay.votingResults.kabul, color: '#059669' },
            { label: 'Ret', value: teklifDetay.votingResults.ret, color: '#dc2626' },
            { label: 'Çekimser', value: teklifDetay.votingResults.cekimser, color: '#d97706' },
            { label: 'Katılmayan', value: teklifDetay.votingResults.katilmayan, color: '#6b7280' }
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
                %{Math.round((stat.value / totalVotes) * 100)}
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
                {/* Podium */}
                <rect x="360" y="390" width="80" height="50" fill={theme.textSecondary} opacity="0.1" />
                <text x="400" y="420" textAnchor="middle" fill={theme.textSecondary} fontSize="10" fontWeight="600" letterSpacing="1">
                  BAŞKANLIK KÜRSÜSÜ
                </text>

                {/* Seats */}
                {seats.map((seat, index) => {
                  const isHovered = hoveredSeat === index || hoveredParty === seat.party;
                  const partyData = parties.find(p => p.code === seat.party);
                  
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
                        {seat.name} - {partyData?.name} - {seat.city}
                        {'\n'}Oy: {seat.vote === 'kabul' ? 'Kabul' : seat.vote === 'ret' ? 'Ret' : seat.vote === 'cekimser' ? 'Çekimser' : 'Katılmadı'}
                      </title>
                    </circle>
                  );
                })}
              </svg>

              {/* Tooltip */}
              {hoveredSeat !== null && (
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
                    {parties.find(p => p.code === seats[hoveredSeat].party)?.name} • {seats[hoveredSeat].city}
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

            {/* Legend */}
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
                {parties.map((party, index) => (
                  <tr
                    key={index}
                    style={{
                      borderBottom: `1px solid ${theme.cardBorder}`,
                      transition: 'background 0.2s',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = theme.categoryBg;
                      setHoveredParty(party.code);
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
                          background: party.color,
                          display: 'inline-block'
                        }}></span>
                        <span style={{ 
                          fontSize: '15px', 
                          fontWeight: '500', 
                          color: theme.textPrimary 
                        }}>
                          {party.name}
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
                      {party.kabul}
                    </td>
                    <td style={{ 
                      padding: '20px 32px', 
                      textAlign: 'right', 
                      fontSize: '15px', 
                      fontWeight: '400', 
                      color: '#dc2626' 
                    }}>
                      {party.ret}
                    </td>
                    <td style={{ 
                      padding: '20px 32px', 
                      textAlign: 'right', 
                      fontSize: '15px', 
                      fontWeight: '400', 
                      color: '#d97706' 
                    }}>
                      {party.cekimser}
                    </td>
                    <td style={{ 
                      padding: '20px 32px', 
                      textAlign: 'right', 
                      fontSize: '16px', 
                      fontWeight: '600', 
                      color: theme.textPrimary 
                    }}>
                      {party.toplam}
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
                  {filteredMilletvekilleri.slice(0, 100).map((mv) => {
                    const partyData = parties.find(p => p.code === mv.party);
                    return (
                      <tr
                        key={mv.id}
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
                              background: partyData?.color,
                              display: 'inline-block'
                            }}></span>
                            <span style={{ 
                              fontSize: '13px', 
                              fontWeight: '400', 
                              color: theme.textSecondary 
                            }}>
                              {partyData?.name}
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
                    );
                  })}
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
                onClick={() => setUserVote(option.value)}
                style={{
                  padding: '20px',
                  background: userVote === option.value ? option.color : 'transparent',
                  border: `1px solid ${userVote === option.value ? option.color : theme.cardBorder}`,
                  color: userVote === option.value ? '#ffffff' : theme.textPrimary,
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}
                onMouseEnter={(e) => {
                  if (userVote !== option.value) {
                    e.currentTarget.style.borderColor = option.color;
                    e.currentTarget.style.color = option.color;
                  }
                }}
                onMouseLeave={(e) => {
                  if (userVote !== option.value) {
                    e.currentTarget.style.borderColor = theme.cardBorder;
                    e.currentTarget.style.color = theme.textPrimary;
                  }
                }}
              >
                {option.label}
              </button>
            ))}
          </div>

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
                    <span>{totalCommunityVotes.toLocaleString('tr-TR')}</span>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    height: '8px', 
                    overflow: 'hidden'
                  }}>
                    <div style={{ flex: communityVotes.kabul, background: '#059669' }}></div>
                    <div style={{ flex: communityVotes.ret, background: '#dc2626' }}></div>
                    <div style={{ flex: communityVotes.cekimser, background: '#d97706' }}></div>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '8px',
                    fontSize: '11px',
                    color: theme.textSecondary
                  }}>
                    <span>%{Math.round((communityVotes.kabul / totalCommunityVotes) * 100)}</span>
                    <span>%{Math.round((communityVotes.ret / totalCommunityVotes) * 100)}</span>
                    <span>%{Math.round((communityVotes.cekimser / totalCommunityVotes) * 100)}</span>
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
                    <div style={{ flex: teklifDetay.votingResults.kabul, background: '#059669' }}></div>
                    <div style={{ flex: teklifDetay.votingResults.ret, background: '#dc2626' }}></div>
                    <div style={{ flex: teklifDetay.votingResults.cekimser, background: '#d97706' }}></div>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '8px',
                    fontSize: '11px',
                    color: theme.textSecondary
                  }}>
                    <span>%{Math.round((teklifDetay.votingResults.kabul / 600) * 100)}</span>
                    <span>%{Math.round((teklifDetay.votingResults.ret / 600) * 100)}</span>
                    <span>%{Math.round((teklifDetay.votingResults.cekimser / 600) * 100)}</span>
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
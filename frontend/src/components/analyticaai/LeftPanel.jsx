import React, { useState } from 'react';

const LeftPanel = ({ onStartResearch, analysisState, colors }) => {
  const [researchType, setResearchType] = useState('');
  const [dataSources, setDataSources] = useState([]);
  const [timeRange, setTimeRange] = useState('');
  const [language, setLanguage] = useState('');
  const [geographicFocus, setGeographicFocus] = useState('');

  const researchTypes = [
    'Media Content Analysis',
    'Sentiment Analysis',
    'Discourse Analysis',
    'Comparative Analysis',
    'Exploratory Research'
  ];

  const dataSourceOptions = [
    'Uploaded Documents',
    'Text Input',
    'URL / Web Content',
    'Internal Knowledge Base'
  ];

  const handleDataSourceToggle = (source) => {
    setDataSources(prev => 
      prev.includes(source) 
        ? prev.filter(s => s !== source)
        : [...prev, source]
    );
  };

  const handleStart = () => {
    if (!researchType) {
      alert('Please select a research objective');
      return;
    }
    
    onStartResearch({
      researchType,
      dataSource: dataSources,
      timeRange,
      language,
      geographicFocus
    });
  };

  const isDisabled = analysisState !== 'idle';

  return (
    <div style={{
      backgroundColor: colors.panelBg,
      borderRadius: '16px',
      padding: '32px 24px',
      border: `1px solid ${colors.border}`,
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
      height: 'fit-content',
      position: 'sticky',
      top: '100px'
    }}>
      {/* Panel Başlığı */}
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{
          fontSize: '20px',
          fontWeight: '700',
          color: colors.text,
          marginBottom: '8px',
          letterSpacing: '-0.5px'
        }}>
          Research Setup
        </h2>
        <div style={{
          height: '2px',
          background: `linear-gradient(90deg, ${colors.border} 0%, transparent 100%)`,
          marginTop: '12px'
        }}></div>
      </div>

      {/* Research Type */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{
          display: 'block',
          fontSize: '13px',
          fontWeight: '600',
          color: colors.textSecondary,
          marginBottom: '10px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          Research Objective
        </label>
        <select
          value={researchType}
          onChange={(e) => setResearchType(e.target.value)}
          disabled={isDisabled}
          style={{
            width: '100%',
            padding: '12px 14px',
            fontSize: '14px',
            border: `1px solid ${colors.border}`,
            borderRadius: '8px',
            backgroundColor: isDisabled ? colors.background : colors.panelBg,
            color: colors.text,
            cursor: isDisabled ? 'not-allowed' : 'pointer',
            outline: 'none',
            fontWeight: '500',
            transition: 'all 0.2s ease'
          }}
        >
          <option value="">Select research type...</option>
          {researchTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        <p style={{
          fontSize: '11px',
          color: colors.textSecondary,
          marginTop: '8px',
          fontStyle: 'italic'
        }}>
          System determines methodology automatically
        </p>
      </div>

      {/* Data Source */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{
          display: 'block',
          fontSize: '13px',
          fontWeight: '600',
          color: colors.textSecondary,
          marginBottom: '10px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          Data Source
        </label>
        {dataSourceOptions.map(source => (
          <div key={source} style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '10px'
          }}>
            <input
              type="checkbox"
              id={source}
              checked={dataSources.includes(source)}
              onChange={() => handleDataSourceToggle(source)}
              disabled={isDisabled}
              style={{
                marginRight: '10px',
                cursor: isDisabled ? 'not-allowed' : 'pointer'
              }}
            />
            <label 
              htmlFor={source}
              style={{
                fontSize: '14px',
                color: colors.text,
                fontWeight: '500',
                cursor: isDisabled ? 'not-allowed' : 'pointer'
              }}
            >
              {source}
            </label>
          </div>
        ))}
        <p style={{
          fontSize: '11px',
          color: colors.textSecondary,
          marginTop: '8px',
          fontStyle: 'italic'
        }}>
          Multiple sources can be combined
        </p>
      </div>

      {/* Scope & Constraints */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{
          display: 'block',
          fontSize: '13px',
          fontWeight: '600',
          color: colors.textSecondary,
          marginBottom: '10px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          Scope & Constraints
        </label>
        
        <input
          type="text"
          placeholder="Time Range (e.g., 2020-2024)"
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          disabled={isDisabled}
          style={{
            width: '100%',
            padding: '10px 14px',
            fontSize: '14px',
            border: `1px solid ${colors.border}`,
            borderRadius: '8px',
            backgroundColor: isDisabled ? colors.background : colors.panelBg,
            color: colors.text,
            marginBottom: '10px',
            outline: 'none',
            fontWeight: '500'
          }}
        />

        <input
          type="text"
          placeholder="Language"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          disabled={isDisabled}
          style={{
            width: '100%',
            padding: '10px 14px',
            fontSize: '14px',
            border: `1px solid ${colors.border}`,
            borderRadius: '8px',
            backgroundColor: isDisabled ? colors.background : colors.panelBg,
            color: colors.text,
            marginBottom: '10px',
            outline: 'none',
            fontWeight: '500'
          }}
        />

        <input
          type="text"
          placeholder="Geographic Focus"
          value={geographicFocus}
          onChange={(e) => setGeographicFocus(e.target.value)}
          disabled={isDisabled}
          style={{
            width: '100%',
            padding: '10px 14px',
            fontSize: '14px',
            border: `1px solid ${colors.border}`,
            borderRadius: '8px',
            backgroundColor: isDisabled ? colors.background : colors.panelBg,
            color: colors.text,
            outline: 'none',
            fontWeight: '500'
          }}
        />
      </div>

      {/* Primary Action Button */}
      <button
        onClick={handleStart}
        disabled={isDisabled}
        style={{
          width: '100%',
          padding: '16px',
          fontSize: '16px',
          fontWeight: '700',
          color: 'white',
          background: isDisabled 
            ? `linear-gradient(135deg, #64748b 0%, #475569 100%)`
            : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
          border: 'none',
          borderRadius: '10px',
          cursor: isDisabled ? 'not-allowed' : 'pointer',
          letterSpacing: '-0.3px',
          boxShadow: isDisabled ? 'none' : '0 4px 12px rgba(59, 130, 246, 0.3)',
          transition: 'all 0.3s ease',
          opacity: isDisabled ? 0.6 : 1
        }}
        onMouseEnter={(e) => {
          if (!isDisabled) {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.4)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isDisabled) {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
          }
        }}
      >
        {analysisState === 'idle' ? 'Start Research' : analysisState === 'running' ? 'Analysis Running...' : 'Analysis Complete'}
      </button>

      <p style={{
        fontSize: '11px',
        color: colors.textSecondary,
        marginTop: '12px',
        textAlign: 'center',
        fontStyle: 'italic'
      }}>
        Methodology will be determined automatically
      </p>
    </div>
  );
};

export default LeftPanel;
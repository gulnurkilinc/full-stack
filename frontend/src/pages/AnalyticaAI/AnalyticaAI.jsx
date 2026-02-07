import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import LeftPanel from '../../components/analyticaai/LeftPanel';
import CoreEngine from '../../components/analyticaai/CoreEngine';
import RightPanel from '../../components/analyticaai/RightPanel';
import ReportView from '../../components/analyticaai/ReportView';

const AnalyticaAI = () => {
  const { themeName } = useTheme();
  const [analysisState, setAnalysisState] = useState('idle'); // idle, running, completed
  const [showReport, setShowReport] = useState(false);
  const [researchConfig, setResearchConfig] = useState({
    researchType: '',
    dataSource: [],
    timeRange: '',
    language: '',
    geographicFocus: ''
  });

  // Tema renklerini al
  const colors = {
    background: themeName === 'light' ? '#f8fafc' : themeName === 'dark' ? '#0f172a' : '#000000',
    panelBg: themeName === 'light' ? '#ffffff' : themeName === 'dark' ? '#1e293b' : '#0a0a0a',
    text: themeName === 'light' ? '#1e293b' : themeName === 'dark' ? '#e2e8f0' : '#e5e5e5',
    textSecondary: themeName === 'light' ? '#64748b' : themeName === 'dark' ? '#94a3b8' : '#a3a3a3',
    border: themeName === 'light' ? '#e2e8f0' : themeName === 'dark' ? '#334155' : '#262626',
  };

  const handleStartResearch = (config) => {
    setResearchConfig(config);
    setAnalysisState('running');
    
    // Simüle edilmiş analiz süreci
    setTimeout(() => {
      setAnalysisState('completed');
    }, 8000); // 8 saniye sonra tamamlanmış olsun
  };

  const handleGenerateReport = () => {
    setShowReport(true);
  };

  const handleCloseReport = () => {
    setShowReport(false);
  };

  if (showReport) {
    return <ReportView onClose={handleCloseReport} config={researchConfig} />;
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: colors.background,
      paddingTop: '80px', // Header için boşluk
      transition: 'background-color 0.3s ease'
    }}>
      <div style={{
        maxWidth: '1920px',
        margin: '0 auto',
        padding: '40px 20px',
      }}>
        {/* Ana Grid Layout - 3 Panel */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 2fr 1fr',
          gap: '24px',
          minHeight: 'calc(100vh - 160px)',
        }}>
          {/* SOL PANEL - Input & Kontroller */}
          <LeftPanel 
            onStartResearch={handleStartResearch}
            analysisState={analysisState}
            colors={colors}
          />

          {/* ORTA ALAN - Core Engine */}
          <CoreEngine 
            analysisState={analysisState}
            onGenerateReport={handleGenerateReport}
            config={researchConfig}
            colors={colors}
          />

          {/* SAĞ PANEL - Methodology & Reasoning */}
          <RightPanel 
            analysisState={analysisState}
            config={researchConfig}
            colors={colors}
          />
        </div>
      </div>
    </div>
  );
};

export default AnalyticaAI;
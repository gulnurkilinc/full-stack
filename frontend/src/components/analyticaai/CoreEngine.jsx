import React, { useState, useEffect } from 'react';

const CoreEngine = ({ analysisState, onGenerateReport, config, colors }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [logs, setLogs] = useState([]);
  const [findings, setFindings] = useState([]);

  const steps = [
    { id: 1, label: 'Input Received', icon: '🟦' },
    { id: 2, label: 'Method Selected', icon: '🟦' },
    { id: 3, label: 'Analysis in Progress', icon: '⏳' },
    { id: 4, label: 'Report Generation', icon: '⬜' }
  ];

  useEffect(() => {
    if (analysisState === 'running') {
      // Adım adım ilerleme simülasyonu
      const stepTimings = [0, 1000, 2500, 6000];
      
      stepTimings.forEach((timing, index) => {
        setTimeout(() => {
          setCurrentStep(index);
          
          // Log ekle
          const logMessages = [
            ['Data sources validated.', 'Input parameters verified.'],
            [
              `Research objective classified as ${config.researchType || 'Media Analysis'}.`,
              'Analytical framework initialized.'
            ],
            [
              'Discourse analysis framework selected.',
              'Sentiment dimensions identified.',
              'Pattern recognition in progress.',
              'Cross-referencing data points.'
            ],
            ['Preliminary analysis complete.', 'Generating structured output.']
          ];
          
          if (logMessages[index]) {
            logMessages[index].forEach((msg, i) => {
              setTimeout(() => {
                setLogs(prev => [...prev, { 
                  id: Date.now() + i, 
                  text: msg,
                  timestamp: new Date().toLocaleTimeString()
                }]);
              }, i * 500);
            });
          }
        }, timing);
      });

      // Findings simülasyonu
      setTimeout(() => {
        setFindings([
          'Dominant themes detected in dataset',
          'Sentiment distribution analyzed',
          'Notable discourse patterns identified',
          'Temporal trends mapped'
        ]);
      }, 4000);
    }
  }, [analysisState, config]);

  useEffect(() => {
    if (analysisState === 'completed') {
      setCurrentStep(3);
    }
  }, [analysisState]);

  return (
    <div style={{
      backgroundColor: colors.panelBg,
      borderRadius: '16px',
      padding: '32px',
      border: `1px solid ${colors.border}`,
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
      display: 'flex',
      flexDirection: 'column',
      gap: '28px'
    }}>
      {/* Status Header */}
      <div>
        <h2 style={{
          fontSize: '18px',
          fontWeight: '700',
          color: colors.text,
          marginBottom: '20px',
          letterSpacing: '-0.5px'
        }}>
          Analytical Process Status
        </h2>
        
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px'
        }}>
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div style={{
                flex: 1,
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '24px',
                  marginBottom: '8px',
                  opacity: index <= currentStep ? 1 : 0.3,
                  transition: 'opacity 0.5s ease'
                }}>
                  {index < currentStep ? '✅' : 
                   index === currentStep && analysisState === 'running' ? '⏳' :
                   index <= currentStep ? step.icon : '⬜'}
                </div>
                <div style={{
                  fontSize: '11px',
                  fontWeight: '600',
                  color: index <= currentStep ? colors.text : colors.textSecondary,
                  textTransform: 'uppercase',
                  letterSpacing: '0.3px',
                  transition: 'color 0.5s ease'
                }}>
                  {step.label}
                </div>
              </div>
              {index < steps.length - 1 && (
                <div style={{
                  width: '40px',
                  height: '2px',
                  backgroundColor: index < currentStep ? '#3b82f6' : colors.border,
                  transition: 'background-color 0.5s ease'
                }}></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* System Log */}
      <div style={{ flex: 1 }}>
        <h3 style={{
          fontSize: '15px',
          fontWeight: '700',
          color: colors.text,
          marginBottom: '16px',
          letterSpacing: '-0.3px'
        }}>
          Analytical Process Log
        </h3>
        
        <div style={{
          backgroundColor: colors.background,
          border: `1px solid ${colors.border}`,
          borderRadius: '8px',
          padding: '16px',
          minHeight: '200px',
          maxHeight: '300px',
          overflowY: 'auto',
          fontFamily: 'monospace',
          fontSize: '13px'
        }}>
          {logs.length === 0 ? (
            <div style={{
              color: colors.textSecondary,
              fontStyle: 'italic',
              textAlign: 'center',
              padding: '40px 20px'
            }}>
              Awaiting analysis initiation...
            </div>
          ) : (
            logs.map(log => (
              <div key={log.id} style={{
                padding: '8px 0',
                borderBottom: `1px solid ${colors.border}`,
                color: colors.text,
                display: 'flex',
                gap: '12px'
              }}>
                <span style={{ color: colors.textSecondary, minWidth: '70px' }}>
                  [{log.timestamp}]
                </span>
                <span>{log.text}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Findings Preview */}
      {findings.length > 0 && (
        <div>
          <h3 style={{
            fontSize: '15px',
            fontWeight: '700',
            color: colors.text,
            marginBottom: '16px',
            letterSpacing: '-0.3px'
          }}>
            Preliminary Findings
          </h3>
          
          <div style={{
            backgroundColor: colors.background,
            border: `1px solid ${colors.border}`,
            borderRadius: '8px',
            padding: '20px'
          }}>
            <ul style={{
              margin: 0,
              paddingLeft: '20px',
              color: colors.text,
              fontSize: '14px',
              lineHeight: '1.8'
            }}>
              {findings.map((finding, index) => (
                <li key={index} style={{ 
                  marginBottom: '8px',
                  fontWeight: '500'
                }}>
                  {finding}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Report Output Button */}
      {analysisState === 'completed' && (
        <div>
          <button
            onClick={onGenerateReport}
            style={{
              width: '100%',
              padding: '18px',
              fontSize: '16px',
              fontWeight: '700',
              color: 'white',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              letterSpacing: '-0.3px',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
            }}
          >
            Generate Structured Report
          </button>

          <div style={{
            marginTop: '16px',
            display: 'flex',
            gap: '12px',
            fontSize: '13px',
            color: colors.textSecondary,
            justifyContent: 'center',
            fontWeight: '500'
          }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
              <input type="radio" name="reportType" defaultChecked />
              Executive Summary
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
              <input type="radio" name="reportType" />
              Full Analytical Report
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
              <input type="radio" name="reportType" />
              Methodology Appendix
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoreEngine;
import React, { useState, useEffect } from 'react';

const RightPanel = ({ analysisState, config, colors }) => {
  const [methodology, setMethodology] = useState(null);
  const [assumptions, setAssumptions] = useState([]);
  const [limitations, setLimitations] = useState([]);

  useEffect(() => {
    if (analysisState === 'running' || analysisState === 'completed') {
      // Metodoloji seçimi (otomatik)
      setTimeout(() => {
        const methodologies = {
          'Media Content Analysis': 'Discourse Analysis Combined with Content Categorization',
          'Sentiment Analysis': 'Lexicon-Based Sentiment Mapping with Context Analysis',
          'Discourse Analysis': 'Critical Discourse Analysis Framework',
          'Comparative Analysis': 'Multi-Dimensional Comparative Framework',
          'Exploratory Research': 'Grounded Theory Approach with Thematic Analysis'
        };

        setMethodology({
          name: methodologies[config.researchType] || 'Hybrid Analytical Framework',
          description: 'Selected based on input characteristics and research objective.'
        });

        setAssumptions([
          'Text reflects public-facing narratives',
          'Language tone indicates sentiment alignment',
          'Source credibility assumed as neutral',
          'Data represents specified time period accurately'
        ]);

        setLimitations([
          'Analysis limited to provided data',
          'No predictive inference applied',
          'Contextual bias possible',
          'Temporal scope defined by input parameters'
        ]);
      }, 1500);
    }
  }, [analysisState, config]);

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
          Method & Reasoning
        </h2>
        <div style={{
          height: '2px',
          background: `linear-gradient(90deg, ${colors.border} 0%, transparent 100%)`,
          marginTop: '12px'
        }}></div>
      </div>

      {/* Selected Methodology */}
      {methodology ? (
        <div style={{ marginBottom: '28px' }}>
          <h3 style={{
            fontSize: '13px',
            fontWeight: '600',
            color: colors.textSecondary,
            marginBottom: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Methodology
          </h3>
          
          <div style={{
            backgroundColor: colors.background,
            border: `1px solid ${colors.border}`,
            borderRadius: '8px',
            padding: '16px'
          }}>
            <div style={{
              fontSize: '15px',
              fontWeight: '700',
              color: colors.text,
              marginBottom: '10px',
              lineHeight: '1.5'
            }}>
              {methodology.name}
            </div>
            <div style={{
              fontSize: '13px',
              color: colors.textSecondary,
              fontStyle: 'italic',
              lineHeight: '1.6'
            }}>
              {methodology.description}
            </div>
          </div>
        </div>
      ) : (
        <div style={{
          backgroundColor: colors.background,
          border: `1px dashed ${colors.border}`,
          borderRadius: '8px',
          padding: '24px',
          textAlign: 'center',
          marginBottom: '28px'
        }}>
          <div style={{
            fontSize: '13px',
            color: colors.textSecondary,
            fontStyle: 'italic'
          }}>
            Methodology will be selected upon analysis initiation
          </div>
        </div>
      )}

      {/* Analytical Assumptions */}
      {assumptions.length > 0 && (
        <div style={{ marginBottom: '28px' }}>
          <h3 style={{
            fontSize: '13px',
            fontWeight: '600',
            color: colors.textSecondary,
            marginBottom: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Assumptions
          </h3>
          
          <div style={{
            backgroundColor: colors.background,
            border: `1px solid ${colors.border}`,
            borderRadius: '8px',
            padding: '16px'
          }}>
            <ul style={{
              margin: 0,
              paddingLeft: '20px',
              fontSize: '13px',
              color: colors.text,
              lineHeight: '1.8'
            }}>
              {assumptions.map((assumption, index) => (
                <li key={index} style={{ 
                  marginBottom: '8px',
                  fontWeight: '500'
                }}>
                  {assumption}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Scope & Limitations */}
      {limitations.length > 0 && (
        <div>
          <h3 style={{
            fontSize: '13px',
            fontWeight: '600',
            color: colors.textSecondary,
            marginBottom: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Scope & Limitations
          </h3>
          
          <div style={{
            backgroundColor: colors.background,
            border: `1px solid ${colors.border}`,
            borderRadius: '8px',
            padding: '16px'
          }}>
            <ul style={{
              margin: 0,
              paddingLeft: '20px',
              fontSize: '13px',
              color: colors.text,
              lineHeight: '1.8'
            }}>
              {limitations.map((limitation, index) => (
                <li key={index} style={{ 
                  marginBottom: '8px',
                  fontWeight: '500'
                }}>
                  {limitation}
                </li>
              ))}
            </ul>
          </div>

          {/* Uyarı notu */}
          <div style={{
            marginTop: '16px',
            padding: '12px',
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: '6px',
            fontSize: '11px',
            color: colors.textSecondary,
            fontStyle: 'italic',
            lineHeight: '1.6'
          }}>
            ⚠️ Serious research tools acknowledge their limitations. Results should be interpreted within documented scope.
          </div>
        </div>
      )}
    </div>
  );
};

export default RightPanel;
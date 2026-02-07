import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const ReportView = ({ onClose, config }) => {
  const { themeName } = useTheme();

  const colors = {
    background: themeName === 'light' ? '#f8fafc' : themeName === 'dark' ? '#0f172a' : '#000000',
    panelBg: themeName === 'light' ? '#ffffff' : themeName === 'dark' ? '#1e293b' : '#0a0a0a',
    text: themeName === 'light' ? '#1e293b' : themeName === 'dark' ? '#e2e8f0' : '#e5e5e5',
    textSecondary: themeName === 'light' ? '#64748b' : themeName === 'dark' ? '#94a3b8' : '#a3a3a3',
    border: themeName === 'light' ? '#e2e8f0' : themeName === 'dark' ? '#334155' : '#262626',
  };

  const reportSections = [
    {
      number: '1',
      title: 'Research Objective',
      content: `Analysis indicates the primary research objective was defined as ${config.researchType}. The scope parameters were established to examine specified data sources within documented constraints.`
    },
    {
      number: '2',
      title: 'Methodology',
      content: 'The analytical framework employed discourse analysis combined with sentiment mapping. This methodology was selected based on input characteristics and research parameters. Data processing followed established protocols for content categorization and thematic extraction.'
    },
    {
      number: '3',
      title: 'Data Overview',
      content: `Data sources included ${config.dataSource.length > 0 ? config.dataSource.join(', ') : 'multiple inputs'}. Temporal scope ${config.timeRange ? `was limited to ${config.timeRange}` : 'was defined by available dataset'}. Geographic parameters ${config.geographicFocus ? `focused on ${config.geographicFocus}` : 'were not specified'}.`
    },
    {
      number: '4',
      title: 'Analytical Findings',
      content: 'Analysis demonstrates several dominant thematic clusters within the dataset. Sentiment distribution indicates a pattern consistent with the established analytical framework. Discourse patterns suggest alignment with documented theoretical expectations. Cross-referencing reveals temporal consistency across examined variables.'
    },
    {
      number: '5',
      title: 'Interpretation',
      content: 'Findings suggest thematic coherence within the analyzed content. Data demonstrates patterns that align with specified research parameters. The observed distribution reflects characteristics anticipated by the selected methodology. Results indicate consistency with established analytical frameworks.'
    },
    {
      number: '6',
      title: 'Conclusion',
      content: 'The analysis provides structured insights within defined parameters. Findings are constrained by documented limitations and should be interpreted accordingly. Further investigation may be warranted to extend the analytical scope. Results demonstrate methodological validity within specified constraints.'
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: colors.background,
      paddingTop: '80px',
      transition: 'background-color 0.3s ease'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '40px 20px',
      }}>
        {/* Header con tasto chiudi */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '40px'
        }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '800',
            color: colors.text,
            letterSpacing: '-1px'
          }}>
            Analytical Report
          </h1>
          
          <button
            onClick={onClose}
            style={{
              padding: '12px 24px',
              backgroundColor: colors.panelBg,
              color: colors.text,
              border: `1px solid ${colors.border}`,
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = colors.background;
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = colors.panelBg;
            }}
          >
            ← Back to Analysis
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '280px 1fr',
          gap: '40px'
        }}>
          {/* Sidebar - Table of Contents */}
          <div style={{
            position: 'sticky',
            top: '100px',
            height: 'fit-content'
          }}>
            <div style={{
              backgroundColor: colors.panelBg,
              border: `1px solid ${colors.border}`,
              borderRadius: '12px',
              padding: '24px'
            }}>
              <h3 style={{
                fontSize: '13px',
                fontWeight: '700',
                color: colors.textSecondary,
                marginBottom: '16px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Table of Contents
              </h3>
              
              <nav>
                {reportSections.map((section) => (
                  <a
                    key={section.number}
                    href={`#section-${section.number}`}
                    style={{
                      display: 'block',
                      padding: '10px 12px',
                      fontSize: '14px',
                      color: colors.text,
                      textDecoration: 'none',
                      borderRadius: '6px',
                      marginBottom: '6px',
                      fontWeight: '500',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = colors.background;
                      e.target.style.paddingLeft = '16px';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.paddingLeft = '12px';
                    }}
                  >
                    {section.number}. {section.title}
                  </a>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div>
            <div style={{
              backgroundColor: colors.panelBg,
              border: `1px solid ${colors.border}`,
              borderRadius: '12px',
              padding: '48px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
            }}>
              {/* Report Header */}
              <div style={{
                borderBottom: `2px solid ${colors.border}`,
                paddingBottom: '24px',
                marginBottom: '40px'
              }}>
                <div style={{
                  fontSize: '12px',
                  color: colors.textSecondary,
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  marginBottom: '12px'
                }}>
                  AnalyticaAI Research Report
                </div>
                <h2 style={{
                  fontSize: '28px',
                  fontWeight: '800',
                  color: colors.text,
                  marginBottom: '16px',
                  letterSpacing: '-0.5px'
                }}>
                  {config.researchType || 'Analytical Research'}
                </h2>
                <div style={{
                  fontSize: '13px',
                  color: colors.textSecondary,
                  lineHeight: '1.8'
                }}>
                  Generated: {new Date().toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>

              {/* Report Sections */}
              {reportSections.map((section) => (
                <section 
                  key={section.number}
                  id={`section-${section.number}`}
                  style={{
                    marginBottom: '48px'
                  }}
                >
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: colors.text,
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: '12px'
                  }}>
                    <span style={{
                      fontSize: '16px',
                      color: colors.textSecondary,
                      fontWeight: '600'
                    }}>
                      {section.number}.
                    </span>
                    {section.title}
                  </h3>
                  
                  <div style={{
                    fontSize: '15px',
                    color: colors.text,
                    lineHeight: '1.9',
                    fontWeight: '400',
                    textAlign: 'justify'
                  }}>
                    {section.content}
                  </div>
                </section>
              ))}

              {/* Footer Note */}
              <div style={{
                marginTop: '60px',
                paddingTop: '24px',
                borderTop: `1px solid ${colors.border}`,
                fontSize: '12px',
                color: colors.textSecondary,
                fontStyle: 'italic',
                textAlign: 'center',
                lineHeight: '1.8'
              }}>
                This report was generated by AnalyticaAI analytical framework.
                <br />
                Results are subject to documented limitations and methodological constraints.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportView;
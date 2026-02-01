import React, { createContext, useState, useEffect, useContext } from 'react';

const ThemeContext = createContext();

export const themes = {
  light: {
    name: 'Açık',
    pageBackground: 'linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)',
    cardBg: '#ffffff',
    cardBorder: '#e2e8f0',
    cardBorderHover: '#cbd5e0',
    cardShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
    cardShadowHover: '0 12px 32px rgba(0, 0, 0, 0.12)',
    headingColor: '#1a1a1a',
    textPrimary: '#1a1a1a',
    textSecondary: '#4a5568',
    textMuted: '#718096',
    categoryBg: '#f7f8fa',
    categoryBorder: '#e2e8f0',
    categoryText: '#4a5568',
    imgPlaceholderBg: '#f7f8fa',
    loaderBorder: '#e2e8f0',
    loaderTop: '#111827',
    accentGradient: 'linear-gradient(90deg, transparent 0%, #0a0e18 30%, #1f2937 50%, #0a0e18 70%, transparent 100%)',
    bgBlob1: 'radial-gradient(circle, rgba(45, 55, 72, 0.03) 0%, transparent 70%)',
    bgBlob2: 'radial-gradient(circle, rgba(26, 26, 26, 0.02) 0%, transparent 70%)',
  },
  dark: {
    name: 'Koyu',
    pageBackground: 'linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%)',
    cardBg: '#1e293b',
    cardBorder: '#334155',
    cardBorderHover: '#475569',
    cardShadow: '0 4px 16px rgba(0, 0, 0, 0.25)',
    cardShadowHover: '0 12px 32px rgba(0, 0, 0, 0.4)',
    headingColor: '#f1f5f9',
    textPrimary: '#f1f5f9',
    textSecondary: '#cbd5e0',
    textMuted: '#94a3b8',
    categoryBg: '#334155',
    categoryBorder: '#475569',
    categoryText: '#cbd5e0',
    imgPlaceholderBg: '#334155',
    loaderBorder: '#334155',
    loaderTop: '#a5b4fc',
    accentGradient: 'linear-gradient(90deg, transparent 0%, #a5b4fc 30%, #c7d2fe 50%, #a5b4fc 70%, transparent 100%)',
    bgBlob1: 'radial-gradient(circle, rgba(139, 92, 246, 0.06) 0%, transparent 70%)',
    bgBlob2: 'radial-gradient(circle, rgba(99, 102, 241, 0.05) 0%, transparent 70%)',
  },
  black: {
    name: 'Siyah',
    pageBackground: 'linear-gradient(180deg, #000000 0%, #111111 100%)',
    cardBg: '#1a1a1a',
    cardBorder: '#2a2a2a',
    cardBorderHover: '#3a3a3a',
    cardShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
    cardShadowHover: '0 12px 32px rgba(0, 0, 0, 0.6)',
    headingColor: '#e5e5e5',
    textPrimary: '#e5e5e5',
    textSecondary: '#a3a3a3',
    textMuted: '#737373',
    categoryBg: '#2a2a2a',
    categoryBorder: '#3a3a3a',
    categoryText: '#a3a3a3',
    imgPlaceholderBg: '#2a2a2a',
    loaderBorder: '#2a2a2a',
    loaderTop: '#d4d4d4',
    accentGradient: 'linear-gradient(90deg, transparent 0%, #d4d4d4 30%, #f0f0f0 50%, #d4d4d4 70%, transparent 100%)',
    bgBlob1: 'radial-gradient(circle, rgba(255, 255, 255, 0.02) 0%, transparent 70%)',
    bgBlob2: 'radial-gradient(circle, rgba(255, 255, 255, 0.015) 0%, transparent 70%)',
  },
};

export const ThemeProvider = ({ children }) => {
  const [themeName, setThemeName] = useState(() => {
    const saved = localStorage.getItem('site-theme');
    return saved && themes[saved] ? saved : 'light';
  });

  const theme = themes[themeName];

  useEffect(() => {
    localStorage.setItem('site-theme', themeName);
  }, [themeName]);

  const changeTheme = (name) => {
    if (themes[name]) setThemeName(name);
  };

  return (
    <ThemeContext.Provider value={{ theme, themeName, changeTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
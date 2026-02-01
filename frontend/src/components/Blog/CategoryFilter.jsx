import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useCategories } from '../../hooks/useCategories';

const CategoryFilter = ({ selectedCategory, onCategoryChange }) => {
  const { themeName } = useTheme();
  const { categories, loading, error } = useCategories();

  // Tema renkleri
  const containerBg = themeName === 'light' ? '#ffffff' : themeName === 'dark' ? '#1e293b' : '#1a1a1a';
  const titleColor = themeName === 'light' ? '#333333' : themeName === 'dark' ? '#f1f5f9' : '#e5e5e5';
  const buttonBg = themeName === 'light' ? '#f8f9fa' : themeName === 'dark' ? '#334155' : '#2a2a2a';
  const buttonText = themeName === 'light' ? '#495057' : themeName === 'dark' ? '#cbd5e0' : '#a3a3a3';
  const buttonHoverBg = themeName === 'light' ? '#edf2f7' : themeName === 'dark' ? '#475569' : '#333333';
  const shadowColor = themeName === 'light' ? 'rgba(0,0,0,0.1)' : themeName === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.5)';
  const skeletonColor = themeName === 'light' ? '#999999' : themeName === 'dark' ? '#94a3b8' : '#737373';

  const styles = {
    container: {
      marginBottom: '40px',
      padding: '20px',
      backgroundColor: containerBg,
      borderRadius: '8px',
      boxShadow: `0 2px 4px ${shadowColor}`,
      transition: 'all 0.3s ease'
    },
    title: {
      fontSize: '20px',
      fontWeight: '600',
      marginBottom: '20px',
      color: titleColor,
      transition: 'color 0.3s ease'
    },
    filterButtons: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '10px'
    },
    button: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '10px 16px',
      backgroundColor: buttonBg,
      border: '2px solid transparent',
      borderRadius: '6px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      color: buttonText
    },
    buttonText: {
      fontSize: '14px'
    },
    buttonCount: {
      fontSize: '12px',
      padding: '2px 8px',
      backgroundColor: 'rgba(0,0,0,0.1)',
      borderRadius: '12px',
      fontWeight: '600'
    },
    skeleton: {
      padding: '20px',
      textAlign: 'center',
      color: skeletonColor,
      fontSize: '14px'
    },
    error: {
      color: '#dc3545',
      fontSize: '14px',
      textAlign: 'center'
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.skeleton}>Kategoriler yükleniyor...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <p style={styles.error}>{error}</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Kategoriler</h3>
      
      <div style={styles.filterButtons}>
        {/* Tümü Butonu */}
        <button
          onClick={() => onCategoryChange('all')}
          className={selectedCategory === 'all' ? 'emerald-btn' : ''}
          style={selectedCategory === 'all' ? { 
            padding: '10px 16px',
            fontSize: '14px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          } : {
            ...styles.button
          }}
          onMouseEnter={(e) => {
            if (selectedCategory !== 'all') {
              e.currentTarget.style.backgroundColor = buttonHoverBg;
              e.currentTarget.style.transform = 'translateY(-2px)';
            }
          }}
          onMouseLeave={(e) => {
            if (selectedCategory !== 'all') {
              e.currentTarget.style.backgroundColor = buttonBg;
              e.currentTarget.style.transform = 'translateY(0)';
            }
          }}
        >
          <span style={styles.buttonText}>Tümü</span>
          <span style={styles.buttonCount}>
            {categories.reduce((sum, cat) => sum + cat.count, 0)}
          </span>
        </button>

        {/* Kategori Butonları */}
        {categories.map((category) => (
          <button
            key={category.name}
            onClick={() => onCategoryChange(category.name)}
            className={selectedCategory === category.name ? 'emerald-btn' : ''}
            style={selectedCategory === category.name ? { 
              padding: '10px 16px',
              fontSize: '14px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            } : {
              ...styles.button
            }}
            onMouseEnter={(e) => {
              if (selectedCategory !== category.name) {
                e.currentTarget.style.backgroundColor = buttonHoverBg;
                e.currentTarget.style.transform = 'translateY(-2px)';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedCategory !== category.name) {
                e.currentTarget.style.backgroundColor = buttonBg;
                e.currentTarget.style.transform = 'translateY(0)';
              }
            }}
          >
            <span style={styles.buttonText}>{category.name}</span>
            <span style={styles.buttonCount}>{category.count}</span>
          </button>
        ))}
      </div>

      {/* Emerald Button Styles */}
      <style>{`
        .emerald-btn {
          background: linear-gradient(135deg, #1f2937 0%, #111827 45%, #0a0e18 100%);
          color: #ffffff;
          font-weight: 600;
          border: none;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: 
            transform 0.35s cubic-bezier(0.4, 0, 0.2, 1),
            box-shadow 0.35s cubic-bezier(0.4, 0, 0.2, 1),
            background 0.35s ease;
          box-shadow: 
            0 4px 18px rgba(17, 24, 39, 0.45),
            0 1px 3px rgba(0, 0, 0, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
          letter-spacing: -0.2px;
        }

        .emerald-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -110%;
          width: 80%;
          height: 100%;
          background: linear-gradient(
            100deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.18) 40%,
            rgba(255, 255, 255, 0.22) 50%,
            rgba(255, 255, 255, 0.18) 60%,
            rgba(255, 255, 255, 0) 100%
          );
          transition: left 0.55s cubic-bezier(0.4, 0, 0.2, 1);
          pointer-events: none;
          z-index: 1;
        }

        .emerald-btn:hover {
          background: linear-gradient(135deg, #374151 0%, #1f2937 45%, #111827 100%);
          color: #ffffff;
          transform: translateY(-2px);
          box-shadow: 
            0 8px 28px rgba(17, 24, 39, 0.55),
            0 2px 6px rgba(0, 0, 0, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.25);
        }

        .emerald-btn:hover::before {
          left: 120%;
        }

        .emerald-btn:active {
          transform: translateY(0px);
          box-shadow: 
            0 2px 10px rgba(17, 24, 39, 0.4),
            0 1px 2px rgba(0, 0, 0, 0.06),
            inset 0 2px 4px rgba(0, 0, 0, 0.08);
        }
      `}</style>
    </div>
  );
};

export default CategoryFilter;
import React from 'react';
import { useCategories } from '../../hooks/useCategories';

const CategoryFilter = ({ selectedCategory, onCategoryChange }) => {
  const { categories, loading, error } = useCategories();

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
          style={{
            ...styles.button,
            ...(selectedCategory === 'all' ? styles.buttonActive : {})
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
            style={{
              ...styles.button,
              ...(selectedCategory === category.name ? styles.buttonActive : {})
            }}
          >
            <span style={styles.buttonText}>{category.name}</span>
            <span style={styles.buttonCount}>{category.count}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    marginBottom: '40px',
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  title: {
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '20px',
    color: '#333'
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
    backgroundColor: '#f8f9fa',
    border: '2px solid transparent',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    color: '#495057'
  },
  buttonActive: {
    backgroundColor: '#007bff',
    color: 'white',
    borderColor: '#0056b3'
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
    color: '#999',
    fontSize: '14px'
  },
  error: {
    color: '#dc3545',
    fontSize: '14px',
    textAlign: 'center'
  }
};

export default CategoryFilter;
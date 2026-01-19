import { useState, useEffect } from 'react';
import { fetchCategories } from '../services/blogService';

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const data = await fetchCategories();
        setCategories(data.categories || []);
      } catch (err) {
        console.error('Load categories error:', err);
        setError('Kategoriler yüklenirken hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  return { categories, loading, error };
};
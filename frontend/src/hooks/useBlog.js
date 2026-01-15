// src/hooks/useBlog.js
import { useState, useEffect } from 'react';
import axios from 'axios';

export const useBlog = (slug, isSingle = false) => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('🔍 Fetching blog with slug:', slug);

        // Backend port 4000'de çalışıyor
        const response = await axios.get(`http://localhost:4000/api/blogs/${slug}`);
        
        console.log('✅ Blog response:', response.data);

        // Backend'den { success: true, blog: {...} } dönüyor
        setBlog(response.data.blog);

      } catch (err) {
        console.error('❌ Blog fetch error:', err);
        setError(err.response?.data?.message || 'Blog yüklenirken hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchBlog();
    } else {
      setLoading(false);
      setError('Slug parametresi bulunamadı');
    }
  }, [slug]);

  return { blog, loading, error };
};
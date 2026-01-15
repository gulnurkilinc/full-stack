import axios from '../utils/axios';

/**
 * Blog API servisleri
 * Tüm blog ile ilgili API çağrıları burada toplanır
 */
export const blogService = {
  /**
   * Slug ile blog detayını getirir
   * @param {string} slug - Blog'un SEO-friendly URL'i
   * @returns {Promise} Blog verisi
   */
  getBlogBySlug: async (slug) => {
    try {
      const response = await axios.get(`/blogs/${slug}`);
      return response.data.blog;
    } catch (error) {
      // Hata yönetimi - servis katmanında
      const errorMessage = error.response?.data?.message || 'Blog yüklenemedi';
      throw new Error(errorMessage);
    }
  },

  /**
   * ID ile blog detayını getirir
   * @param {string} id - Blog'un MongoDB ID'si
   * @returns {Promise} Blog verisi
   */
  getBlogById: async (id) => {
    try {
      const response = await axios.get(`/blogs/id/${id}`);
      return response.data.blog;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Blog yüklenemedi');
    }
  },

  /**
   * Kategoriye göre ilgili blogları getirir
   * @param {string} category - Blog kategorisi
   * @param {string} excludeId - Hariç tutulacak blog ID'si
   * @returns {Promise} Blog listesi
   */
  getRelatedBlogs: async (category, excludeId) => {
    try {
      const response = await axios.get(`/blogs/category/${category}`);
      return response.data.blogs.filter(blog => blog._id !== excludeId).slice(0, 3);
    } catch (error) {
      console.error('İlgili bloglar getirilemedi:', error);
      return [];
    }
  }
};
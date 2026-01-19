import axios from '../utils/axios';

/**
 * Blog API servisleri
 * Tüm blog ile ilgili API çağrıları burada toplanır
 */
export const blogService = {
  /**
   * Tüm blogları getir (filtreleme + pagination)
   * @param {Object} params - Query parametreleri
   * @param {string} params.category - Kategori filtresi ('all' veya kategori adı)
   * @param {number} params.page - Sayfa numarası
   * @param {number} params.limit - Sayfa başına blog sayısı
   * @param {string} params.search - Arama terimi
   * @param {string} params.tags - Etiketler (virgülle ayrılmış)
   * @param {boolean} params.featured - Öne çıkan bloglar
   * @returns {Promise} Blog listesi + pagination bilgisi
   */
  getBlogs: async (params = {}) => {
    try {
      const { 
        category, 
        page = 1, 
        limit = 10, 
        search,
        tags,
        featured,
        sort = '-publishedAt'
      } = params;
      
      // Query parametrelerini oluştur
      const queryParams = new URLSearchParams({
        page,
        limit,
        status: 'published',
        sort
      });

      // Kategori filtresi (all değilse ekle)
      if (category && category !== 'all') {
        queryParams.append('category', category);
      }

      // Diğer filtreler
      if (search) {
        queryParams.append('search', search);
      }

      if (tags) {
        queryParams.append('tags', tags);
      }

      if (featured !== undefined) {
        queryParams.append('featured', featured);
      }

      const response = await axios.get(`/blogs?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Bloglar getirilemedi:', error);
      throw new Error(error.response?.data?.message || 'Bloglar yüklenemedi');
    }
  },

  /**
   * Kategorileri ve blog sayılarını getir
   * @returns {Promise} Kategori listesi + blog sayıları
   */
  getCategories: async () => {
    try {
      const response = await axios.get('/categories');
      return response.data;
    } catch (error) {
      console.error('Kategoriler getirilemedi:', error);
      throw new Error(error.response?.data?.message || 'Kategoriler yüklenemedi');
    }
  },

  /**
   * Kategori istatistiklerini getir (Bonus)
   * @returns {Promise} Kategori istatistikleri
   */
  getCategoryStats: async () => {
    try {
      const response = await axios.get('/categories/stats');
      return response.data.stats;
    } catch (error) {
      console.error('İstatistikler getirilemedi:', error);
      return [];
    }
  },

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
      const response = await axios.get(`/blogs/${id}`);
      return response.data.blog;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Blog yüklenemedi');
    }
  },

  /**
   * İlgili blogları getirir
   * @param {string} identifier - Blog ID veya slug
   * @param {number} limit - Maksimum blog sayısı
   * @returns {Promise} İlgili blog listesi
   */
  getRelatedBlogs: async (identifier, limit = 3) => {
    try {
      const response = await axios.get(`/blogs/${identifier}/related?limit=${limit}`);
      return response.data.blogs || [];
    } catch (error) {
      console.error('İlgili bloglar getirilemedi:', error);
      return [];
    }
  },

  /**
   * Kategoriye göre blogları getirir (Alternatif method)
   * @param {string} category - Blog kategorisi
   * @param {number} limit - Maksimum blog sayısı
   * @returns {Promise} Blog listesi
   */
  getBlogsByCategory: async (category, limit = 10) => {
    try {
      const response = await axios.get(`/blogs?category=${category}&limit=${limit}&status=published`);
      return response.data.blogs || [];
    } catch (error) {
      console.error('Kategori blogları getirilemedi:', error);
      return [];
    }
  },

  /**
   * Blog oluştur (Admin)
   * @param {Object} blogData - Blog verileri
   * @returns {Promise} Oluşturulan blog
   */
  createBlog: async (blogData) => {
    try {
      const response = await axios.post('/blogs', blogData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Blog oluşturulamadı');
    }
  },

  /**
   * Blog güncelle (Admin)
   * @param {string} id - Blog ID
   * @param {Object} blogData - Güncellenecek veriler
   * @returns {Promise} Güncellenen blog
   */
  updateBlog: async (id, blogData) => {
    try {
      const response = await axios.put(`/blogs/${id}`, blogData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Blog güncellenemedi');
    }
  },

  /**
   * Blog sil (Admin)
   * @param {string} id - Blog ID
   * @returns {Promise} Silme sonucu
   */
  deleteBlog: async (id) => {
    try {
      const response = await axios.delete(`/blogs/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Blog silinemedi');
    }
  },

  /**
   * Arama yap
   * @param {string} searchTerm - Arama terimi
   * @param {Object} options - Ek seçenekler
   * @returns {Promise} Arama sonuçları
   */
  searchBlogs: async (searchTerm, options = {}) => {
    try {
      const { page = 1, limit = 10, category } = options;
      
      const queryParams = new URLSearchParams({
        search: searchTerm,
        page,
        limit,
        status: 'published'
      });

      if (category && category !== 'all') {
        queryParams.append('category', category);
      }

      const response = await axios.get(`/blogs?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Arama yapılamadı:', error);
      throw new Error(error.response?.data?.message || 'Arama başarısız');
    }
  }
};

// Kısa yollar (backward compatibility için)
export const fetchBlogs = blogService.getBlogs;
export const fetchCategories = blogService.getCategories;
export const fetchBlogBySlug = blogService.getBlogBySlug;
export const fetchRelatedBlogs = blogService.getRelatedBlogs;

export default blogService;
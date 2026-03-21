import axios from 'axios';

// API Base URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

// Axios instance oluştur
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Token'ı her istekte otomatik ekle
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - Hata yönetimi
api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
); 
    

// ============================================
// KANUN TEKLİFİ API FONKSİYONLARI
// ============================================

export const kanunTeklifiAPI = {
  // Tüm kanun tekliflerini getir
  getAllProposals: async (params = {}) => {
    try {
      const response = await api.get('/kanun-teklifleri', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Tek kanun teklifi getir (ID ile)
  getProposalById: async (id) => {
    try {
      const response = await api.get(`/kanun-teklifi/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Tek kanun teklifi getir (Slug ile)
  getProposalBySlug: async (slug) => {
    try {
      const response = await api.get(`/kanun-teklifi/slug/${slug}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Kategoriye göre kanun tekliflerini getir
  getProposalsByCategory: async (kategori) => {
    try {
      const response = await api.get(`/kanun-teklifleri/kategori/${kategori}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Duruma göre kanun tekliflerini getir
  getProposalsByStatus: async (durum) => {
    try {
      const response = await api.get(`/kanun-teklifleri/durum/${durum}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Kullanıcının oy durumunu kontrol et (AUTH REQUIRED)
  checkUserVoteStatus: async (id) => {
    try {
      const response = await api.get(`/kanun-teklifi/${id}/oy-durumu`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Kullanıcı oyu kaydet (AUTH REQUIRED)
  submitUserVote: async (id, oyTipi) => {
    try {
      const response = await api.post(`/kanun-teklifi/${id}/oy`, { oyTipi });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Kullanıcının oy geçmişini getir (AUTH REQUIRED)
  getUserVotingHistory: async () => {
    try {
      const response = await api.get('/kullanici/oy-gecmisi');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default api;
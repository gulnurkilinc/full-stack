// ============================================
// API Base URL - Vite environment variable
// ============================================
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// ============================================
// API Endpoints
// ============================================
export const API_ENDPOINTS = {
  // ── Auth ──────────────────────────────────
  login:          `${API_BASE_URL}/api/login`,
  register:       `${API_BASE_URL}/api/register`,
  logout:         `${API_BASE_URL}/api/logout`,
  me:             `${API_BASE_URL}/api/me`,
  forgotPassword: `${API_BASE_URL}/api/password/forgot`,
  resetPassword:  (token) => `${API_BASE_URL}/api/password/reset/${token}`,

  // ── Blog ──────────────────────────────────
  blogs:          `${API_BASE_URL}/api/blogs`,
  blogDetail:     (slug) => `${API_BASE_URL}/api/blogs/${slug}`,
  blogSearch:     `${API_BASE_URL}/api/blogs/search`,
  blogCreate:     `${API_BASE_URL}/api/blogs`,
  blogUpdate:     (id) => `${API_BASE_URL}/api/blogs/${id}`,
  blogDelete:     (id) => `${API_BASE_URL}/api/blogs/${id}`,

  // ── User ──────────────────────────────────
  profile:        `${API_BASE_URL}/api/profile`,
  updateProfile:  `${API_BASE_URL}/api/profile/update`,
  changePassword: `${API_BASE_URL}/api/password/change`,
  allUsers:       `${API_BASE_URL}/api/admin/users`,
  userDetail:     (id) => `${API_BASE_URL}/api/admin/users/${id}`,
  userRole:       (id) => `${API_BASE_URL}/api/admin/users/${id}/role`,
  deleteUser:     (id) => `${API_BASE_URL}/api/admin/users/${id}`,

  // ── Contact ───────────────────────────────
  contact:        `${API_BASE_URL}/api/contact`,

  // ── Kanun Teklifi ─────────────────────────
  kanunTeklifleri: `${API_BASE_URL}/api/kanun-teklifleri`,
  kanunOy:         (id) => `${API_BASE_URL}/api/kanun-teklifi/${id}/oy`,
};

// ============================================
// Fetch helper - Token'lı istekler için
// ============================================
export const apiFetch = async (url, options = {}) => {
  try {
    const token = localStorage.getItem('token');

    const response = await fetch(url, {
      ...options,
      credentials: 'include', // Cookie gönder
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }), // Token varsa ekle
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      // 401 → localStorage temizle
      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
      throw new Error(data.message || 'Bir hata oluştu');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
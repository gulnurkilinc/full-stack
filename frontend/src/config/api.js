// API Base URL
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

// API Endpoints
export const API_ENDPOINTS = {
  // Blog endpoints
  blogs: `${API_BASE_URL}/api/blogs`,
  blogDetail: (slug) => `${API_BASE_URL}/api/blogs/${slug}`,
  blogSearch: `${API_BASE_URL}/api/blogs/search`,
  
  // Auth endpoints
  login: `${API_BASE_URL}/api/login`,
  register: `${API_BASE_URL}/api/register`,
  
  // Contact endpoint
  contact: `${API_BASE_URL}/api/contact`,
};

// Fetch helper with error handling
export const apiFetch = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Bir hata oluştu');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
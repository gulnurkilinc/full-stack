import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

// Login action
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      console.log('🔐 Attempting login:', credentials.email);

      const response = await axios.post(`${API_URL}/login`, credentials);

      console.log('✅ Login successful:', response.data);

      // Token ve user'ı localStorage'a kaydet
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      console.log('💾 Data saved to localStorage');

      return response.data;
    } catch (error) {
      console.error('❌ Login error:', error);
      return rejectWithValue(error.response?.data?.message || 'Giriş başarısız');
    }
  }
);

// Register action
export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/register`, userData);
      
      // Token ve user'ı localStorage'a kaydet
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Kayıt başarısız');
    }
  }
);

// Logout action
export const logout = createAsyncThunk(
  'auth/logout',
  async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return null;
  }
);

// Initial state - localStorage'dan yükle
const token = localStorage.getItem('token');
const user = localStorage.getItem('user');

const initialState = {
  user: user ? JSON.parse(user) : null,
  token: token || null,
  isAuthenticated: !!token,
  loading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    }
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;

        console.log('🎯 Redux state updated:', {
          user: action.payload.user,
          role: action.payload.user.role
        });

        // Admin kontrolü ve yönlendirme
        if (action.payload.user.role === 'admin') {
          console.log('🚀 Redirecting admin to dashboard...');
          window.location.href = '/dashboard/blogs/create';
        } else {
          console.log('🏠 Redirecting user to home...');
          window.location.href = '/';
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload;
        state.user = null;
        state.token = null;
      });

    // Register
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
        
        // Kayıt sonrası ana sayfaya yönlendir
        window.location.href = '/';
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Logout
    builder
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
        
        // Logout sonrası login sayfasına yönlendir
        window.location.href = '/login';
      });
  }
});

export const { clearError, setUser } = authSlice.actions;
export default authSlice.reducer;

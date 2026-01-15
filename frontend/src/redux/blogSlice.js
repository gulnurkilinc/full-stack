import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

// Tüm blogları getir
export const fetchBlogs = createAsyncThunk(
  'blogs/fetchBlogs',
  async (params = {}, { rejectWithValue }) => {
    try {
      const { page = 1, limit = 10, category, status = 'published' } = params;
      
      const response = await axios.get(`${API_URL}/blogs`, {
        params: { page, limit, category, status }
      });

      console.log('✅ Fetch blogs response:', response.data);

      // Backend'den { success: true, blogs: [...], pagination: {...} } geliyor
      return response.data;
    } catch (error) {
      console.error('❌ Fetch blogs error:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Öne çıkan blogları getir
export const fetchFeaturedBlogs = createAsyncThunk(
  'blogs/fetchFeaturedBlogs',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/blogs`, {
        params: { 
          featured: true, 
          status: 'published',
          limit: 5 
        }
      });

      console.log('✅ Fetch featured blogs response:', response.data);

      return response.data;
    } catch (error) {
      console.error('❌ Fetch featured blogs error:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Tek blog getir
export const fetchBlogBySlug = createAsyncThunk(
  'blogs/fetchBlogBySlug',
  async (slug, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/blogs/${slug}`);
      
      console.log('✅ Fetch blog by slug response:', response.data);

      // Backend'den { success: true, blog: {...} } geliyor
      return response.data.blog;
    } catch (error) {
      console.error('❌ Fetch blog by slug error:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Initial state
const initialState = {
  blogs: [],
  featuredBlogs: [],
  currentBlog: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  },
  loading: false,
  error: null
};

// Slice
const blogSlice = createSlice({
  name: 'blogs',
  initialState,
  reducers: {
    clearCurrentBlog: (state) => {
      state.currentBlog = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Fetch Blogs
    builder
      .addCase(fetchBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = action.payload.blogs || [];
        state.pagination = action.payload.pagination || initialState.pagination;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Bloglar yüklenirken hata oluştu';
      });

    // Fetch Featured Blogs
    builder
      .addCase(fetchFeaturedBlogs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFeaturedBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.featuredBlogs = action.payload.blogs || [];
      })
      .addCase(fetchFeaturedBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Öne çıkan bloglar yüklenirken hata oluştu';
      });

    // Fetch Blog by Slug
    builder
      .addCase(fetchBlogBySlug.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBlog = action.payload;
      })
      .addCase(fetchBlogBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Blog yüklenirken hata oluştu';
      });
  }
});

export const { clearCurrentBlog, clearError } = blogSlice.actions;
export default blogSlice.reducer;
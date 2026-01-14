import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../utils/axios';

// Tüm blogları getir
export const fetchBlogs = createAsyncThunk(
    'blogs/fetchBlogs',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('/blogs');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Tek blog getir
export const fetchBlogBySlug = createAsyncThunk(
    'blogs/fetchBlogBySlug',
    async (slug, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/blogs/${slug}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Öne çıkan blogları getir
export const fetchFeaturedBlogs = createAsyncThunk(
    'blogs/fetchFeaturedBlogs',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('/blogs/featured');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const blogSlice = createSlice({
    name: 'blogs',
    initialState: {
        blogs: [],
        currentBlog: null,
        featuredBlogs: [],
        loading: false,
        error: null,
        totalBlogs: 0
    },
    reducers: {
        clearCurrentBlog: (state) => {
            state.currentBlog = null;
        }
    },
    extraReducers: (builder) => {
        // Fetch all blogs
        builder.addCase(fetchBlogs.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchBlogs.fulfilled, (state, action) => {
            state.loading = false;
            state.blogs = action.payload.blogs;
            state.totalBlogs = action.payload.blogsCount;
        });
        builder.addCase(fetchBlogs.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message || 'Bloglar yüklenemedi';
        });

        // Fetch single blog
        builder.addCase(fetchBlogBySlug.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchBlogBySlug.fulfilled, (state, action) => {
            state.loading = false;
            state.currentBlog = action.payload.blog;
        });
        builder.addCase(fetchBlogBySlug.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message || 'Blog yüklenemedi';
        });

        // Fetch featured blogs
        builder.addCase(fetchFeaturedBlogs.fulfilled, (state, action) => {
            state.featuredBlogs = action.payload.blogs;
        });
    }
});

export const { clearCurrentBlog } = blogSlice.actions;
export default blogSlice.reducer;
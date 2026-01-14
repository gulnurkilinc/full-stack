import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../utils/axios';

// Kayıt olma
export const register = createAsyncThunk(
    'auth/register',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post('/register', userData);
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Kayıt başarısız' });
        }
    }
);

// Giriş yapma
export const login = createAsyncThunk(
    'auth/login',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post('/login', userData);
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Giriş başarısız' });
        }
    }
);

// Çıkış yapma
export const logout = createAsyncThunk(
    'auth/logout',
    async () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        await axios.get('/logout');
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: JSON.parse(localStorage.getItem('user')) || null,
        token: localStorage.getItem('token') || null,
        loading: false,
        error: null,
        isAuthenticated: !!localStorage.getItem('token')
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        // Register
        builder.addCase(register.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(register.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
        });
        builder.addCase(register.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message || 'Kayıt başarısız';
        });

        // Login
        builder.addCase(login.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(login.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
        });
        builder.addCase(login.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message || 'Giriş başarısız';
        });

        // Logout
        builder.addCase(logout.fulfilled, (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
        });
    }
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
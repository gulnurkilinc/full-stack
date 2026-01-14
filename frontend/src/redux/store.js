import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import blogReducer from './blogSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        blogs: blogReducer
    }
});

export default store;
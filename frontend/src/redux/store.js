import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import blogReducer from './blogSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    blogs: blogReducer
  },
  devTools: import.meta.env.MODE !== 'production'
});

export default store;
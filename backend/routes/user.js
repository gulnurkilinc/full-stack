const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');

const {
    register,
    login,
    logout,
    getProfile,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
    applyForAuthor,
    getAllUsers,
    getUserDetail,
    updateUserRole,
    deleteUser,
    getUserByUsername,
    verifyEmail,
    refreshToken,
    getSessions,
    deleteSession
} = require('../controllers/user.js');

// Mevcut middleware isimlerini kullan
const { 
    authMiddleware, 
    isAdmin, 
    isAuthorOrAdmin 
} = require('../middleware/authMiddleware.js');

// ============================================
// PUBLIC ROUTES - Giriş gerektirmez
// ============================================
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/password/forgot', forgotPassword);
router.put('/password/reset/:token', resetPassword);
router.post('/verify-email/:token', verifyEmail);
router.post('/refresh-token', refreshToken);
router.get('/sessions', authMiddleware, getSessions);
router.delete('/sessions/:sessionId', authMiddleware, deleteSession);

// ============================================
// PROTECTED ROUTES - Giriş gerektirir
// ============================================
router.get('/me', authMiddleware, getProfile);
router.put('/profile/update', authMiddleware, upload.single('avatar'), updateProfile);
router.put('/password/change', authMiddleware, changePassword);
router.post('/apply-author', authMiddleware, applyForAuthor);

// ============================================
// ADMIN ROUTES - Sadece admin erişebilir
// ============================================
router.get('/admin/users', authMiddleware, isAdmin, getAllUsers);
router.get('/admin/users/:id', authMiddleware, isAdmin, getUserDetail);
router.put('/admin/users/:id/role', authMiddleware, isAdmin, updateUserRole);
router.delete('/admin/users/:id', authMiddleware, isAdmin, deleteUser);
router.get('/user/:username', authMiddleware, getUserByUsername);

module.exports = router;
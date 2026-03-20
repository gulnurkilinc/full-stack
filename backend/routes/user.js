const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const passport = require('../config/passport');

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
    getActivityLogs,
    getStats,
    deleteSession,
    verifyLoginCode,
    toggle2FA
} = require('../controllers/user.js');

// Mevcut middleware isimlerini kullan
const { 
    authMiddleware, 
    isAdmin, 
    isAuthorOrAdmin 
} = require('../middleware/authMiddleware.js');

const { ipBlockMiddleware } = require('../middleware/ipBlock');
const { registerLimiter, loginLimiter, forgotPasswordLimiter } = require('../middleware/rateLimiter');

// ============================================
// PUBLIC ROUTES - Giriş gerektirmez
// ============================================
router.post('/register', register);
router.post('/login', ipBlockMiddleware, loginLimiter, login);
router.post('/logout', logout);
router.post('/password/forgot', forgotPassword);
router.put('/password/reset/:token', resetPassword);
router.post('/verify-email/:token', verifyEmail);
router.post('/refresh-token', refreshToken);
router.get('/sessions', authMiddleware, getSessions);
router.delete('/sessions/:sessionId', authMiddleware, deleteSession);
router.post('/2fa/verify', verifyLoginCode);
router.post('/2fa/toggle', authMiddleware, toggle2FA);
router.get('/admin/stats', authMiddleware, isAdmin, getStats);
// Google OAuth
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: `${process.env.FRONTEND_URL}/login?error=google_failed` }),
    async (req, res) => {
        try {
            const user = req.user;

            // 2FA kontrolü
            if (user.twoFactorEnabled) {
                const code = Math.floor(100000 + Math.random() * 900000).toString();
                user.twoFactorCode = code;
                user.twoFactorExpire = new Date(Date.now() + 10 * 60 * 1000);
                await user.save({ validateBeforeSave: false });

                const sendEmail = require('../utils/sendEmail');
                await sendEmail({
                    to: user.email,
                    subject: 'Giriş Doğrulama Kodu',
                    html: `<h2>Merhaba ${user.name},</h2><p>Giriş doğrulama kodunuz:</p><h1 style="letter-spacing:8px;color:#111827;">${code}</h1><p>Bu kod <strong>10 dakika</strong> geçerlidir.</p>`
                });

                return res.redirect(`${process.env.FRONTEND_URL}/login?twoFactor=true&userId=${user._id}`);
            }

            const token = user.generateToken();
            const refreshToken = user.generateRefreshToken();

            user.refreshToken = refreshToken;
            await user.save({ validateBeforeSave: false });

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict'
            });

            // Frontend'e yönlendir
            res.redirect(`${process.env.FRONTEND_URL}/auth/google/success?token=${token}&user=${encodeURIComponent(JSON.stringify({
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar
            }))}`);
        } catch (error) {
            res.redirect(`${process.env.FRONTEND_URL}/login?error=google_failed`);
        }
    }
);

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
router.get('/admin/activity-logs', authMiddleware, isAdmin, getActivityLogs);

module.exports = router;
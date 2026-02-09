const express = require('express');
const router = express.Router();

// Controllers
const {
    getAllProposals,
    getProposalById,
    getProposalBySlug,
    getProposalsByCategory,
    getProposalsByStatus,
    checkUserVoteStatus,
    submitUserVote,
    getUserVotingHistory,
    createProposal,
    updateProposal,
    deleteProposal
} = require('../controllers/kanunTeklifiController');

// Middleware
const { authMiddleware, isAdmin } = require('../middleware/authMiddleware');

// ============================================
// PUBLIC ROUTES
// ============================================

// Tüm kanun tekliflerini listele
// GET /api/kanun-teklifleri
router.get('/kanun-teklifleri', getAllProposals);

// Tek kanun teklifi getir (ID ile)
// GET /api/kanun-teklifi/:id
router.get('/kanun-teklifi/:id', getProposalById);

// Tek kanun teklifi getir (Slug ile)
// GET /api/kanun-teklifi/slug/:slug
router.get('/kanun-teklifi/slug/:slug', getProposalBySlug);

// Kategoriye göre kanun tekliflerini getir
// GET /api/kanun-teklifleri/kategori/:kategori
router.get('/kanun-teklifleri/kategori/:kategori', getProposalsByCategory);

// Duruma göre kanun tekliflerini getir
// GET /api/kanun-teklifleri/durum/:durum
router.get('/kanun-teklifleri/durum/:durum', getProposalsByStatus);

// ============================================
// USER ROUTES (AUTH REQUIRED)
// ============================================

// Kullanıcının oy durumunu kontrol et
// GET /api/kanun-teklifi/:id/oy-durumu
router.get('/kanun-teklifi/:id/oy-durumu', authMiddleware, checkUserVoteStatus);

// Kullanıcı oyu kaydet
// POST /api/kanun-teklifi/:id/oy
// Body: { oyTipi: "kabul" | "ret" | "cekimser" }
router.post('/kanun-teklifi/:id/oy', authMiddleware, submitUserVote);

// Kullanıcının oy geçmişini getir
// GET /api/kullanici/oy-gecmisi
router.get('/kullanici/oy-gecmisi', authMiddleware, getUserVotingHistory);

// ============================================
// ADMIN ROUTES
// ============================================

// Kanun teklifi oluştur
// POST /api/admin/kanun-teklifi
router.post('/admin/kanun-teklifi', authMiddleware, isAdmin, createProposal);

// Kanun teklifini güncelle
// PUT /api/admin/kanun-teklifi/:id
router.put('/admin/kanun-teklifi/:id', authMiddleware, isAdmin, updateProposal);

// Kanun teklifini sil
// DELETE /api/admin/kanun-teklifi/:id
router.delete('/admin/kanun-teklifi/:id', authMiddleware, isAdmin, deleteProposal);

module.exports = router;
const express = require("express");
const router = express.Router();
const {
  getAllBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
  getRelatedBlogs,
  getCategories, 
  getCategoryStats,
  searchBlogs
} = require("../controllers/blogController");

// Middleware'leri import et
const { authMiddleware } = require("../middleware/authMiddleware");
const { adminMiddleware } = require("../middleware/adminMiddleware");

// ============================================
// PUBLIC ROUTES - Herkes erişebilir
// ============================================

// Tüm blogları getir (filtreleme, pagination destekli)
router.get("/blogs", getAllBlogs);

// Blog ara
router.get("/blogs/search", searchBlogs);

// Tek blog getir (slug veya ID ile)
router.get("/blogs/:identifier", getBlogBySlug);

// İlgili blogları getir
router.get("/blogs/:identifier/related", getRelatedBlogs);

router.get("/categories", getCategories);

router.get("/categories/stats", getCategoryStats);

// ============================================
// PROTECTED ROUTES - Sadece Admin
// ============================================

// Yeni blog oluştur (Sadece admin)
router.post("/blogs", authMiddleware, adminMiddleware, createBlog);

// Blog güncelle (Sadece admin)
router.put("/blogs/:id", authMiddleware, adminMiddleware, updateBlog);

// Blog sil (Sadece admin)
router.delete("/blogs/:id", authMiddleware, adminMiddleware, deleteBlog);

module.exports = router;
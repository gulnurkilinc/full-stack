const express = require("express");
const router = express.Router();
const {
  getAllBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
  getRelatedBlogs
} = require("../controllers/blogController");

// Public routes
router.get("/blogs", getAllBlogs);
router.get("/blogs/:identifier", getBlogBySlug); // Slug veya ID ile
router.get("/blogs/:identifier/related", getRelatedBlogs);

// Protected routes (Auth middleware eklenecek)
router.post("/blogs", createBlog); // Auth middleware ekle: authMiddleware,
router.put("/blogs/:id", updateBlog); // Auth middleware ekle
router.delete("/blogs/:id", deleteBlog); // Auth middleware ekle

module.exports = router;
const express = require("express");
const {
    allBlogs,
    detailBlog,
    featuredBlogs,
    popularBlogs,
    topRatedBlogs,
    getBlogsByCategory,
    getBlogsByTag,
    createReview,
    likeBlog,
    createBlog,
    updateBlog,
    deleteBlog,
    publishBlog,
    approveComment,
    deleteComment
} = require("../controllers/blog.js");
const { authenticateUser, authorizeAuthor, authorizeAdmin } = require("../middleware/auth.js");

const router = express.Router();

// Genel kullanıcı routes (giriş gerektirmeyen)
router.get("/blogs", allBlogs);
router.get("/blogs/featured", featuredBlogs);
router.get("/blogs/popular", popularBlogs);
router.get("/blogs/top-rated", topRatedBlogs);
router.get("/blogs/category/:category", getBlogsByCategory);
router.get("/blogs/tag/:tag", getBlogsByTag);
router.get("/blogs/:slug", detailBlog);

// Giriş gerektiren routes
router.post("/blogs/review", authenticateUser, createReview);
router.put("/blogs/:id/like", authenticateUser, likeBlog);

// Yazar/Admin routes (blog oluşturma, güncelleme)
router.post("/admin/blogs/new", authenticateUser, authorizeAuthor, createBlog);
router.put("/admin/blogs/:id", authenticateUser, authorizeAuthor, updateBlog);
router.delete("/admin/blogs/:id", authenticateUser, authorizeAuthor, deleteBlog);

// Sadece Admin routes
router.put("/admin/blogs/:id/publish", authenticateUser, authorizeAdmin, publishBlog);
router.put("/admin/blogs/:blogId/comments/:commentId/approve", authenticateUser, authorizeAdmin, approveComment);
router.delete("/admin/blogs/:blogId/comments/:commentId", authenticateUser, authorizeAdmin, deleteComment);

module.exports = router;
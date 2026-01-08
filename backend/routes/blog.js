const express = require("express");
const {
    allBlogs,
    detailBlog,
    featuredBlogs,
    popularBlogs,
    addComment,
    likeBlog,
    createBlog,
    updateBlog,
    deleteBlog,
    publishBlog,
    approveComment,
    deleteComment
} = require("../controllers/blog.js");

const router = express.Router();

// Genel kullanıcı routes (herkes erişebilir)
router.get("/blogs", allBlogs);
router.get("/blogs/featured", featuredBlogs);
router.get("/blogs/popular", popularBlogs);
router.get("/blogs/:slug", detailBlog);
router.post("/blogs/:id/comment", addComment);
router.put("/blogs/:id/like", likeBlog);

// Admin routes (authentication middleware eklenecek)
router.post("/admin/blogs/new", createBlog);
router.put("/admin/blogs/:id", updateBlog);
router.delete("/admin/blogs/:id", deleteBlog);
router.put("/admin/blogs/:id/publish", publishBlog);
router.put("/admin/blogs/:blogId/comments/:commentId/approve", approveComment);
router.delete("/admin/blogs/:blogId/comments/:commentId", deleteComment);

module.exports = router;
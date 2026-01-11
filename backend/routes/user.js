const express = require("express");
const {
    register,
    login,
    logout,
    getProfile,
    updateProfile,
    changePassword,
    applyForAuthor,
    forgotPassword,     
    resetPassword,
    getAllUsers,
    getUserDetail,
    updateUserRole,
    deleteUser
} = require("../controllers/user.js");
const { authenticateUser, authorizeAdmin } = require("../middleware/auth.js");

const router = express.Router();

// Genel kullanıcı routes (giriş gerektirmeyen)
router.post("/register", register);
router.post("/login", login);
router.post("/password/forgot", forgotPassword);        // YENİ
router.put("/password/reset/:token", resetPassword);

// Giriş gerektiren routes
router.get("/logout", authenticateUser, logout);
router.get("/profile", authenticateUser, getProfile);
router.put("/profile/update", authenticateUser, updateProfile);
router.put("/password/change", authenticateUser, changePassword);
router.post("/apply-author", authenticateUser, applyForAuthor);

// Admin routes (admin yetkisi gerekli)
router.get("/admin/users", authenticateUser, authorizeAdmin, getAllUsers);
router.get("/admin/users/:id", authenticateUser, authorizeAdmin, getUserDetail);
router.put("/admin/users/:id/role", authenticateUser, authorizeAdmin, updateUserRole);
router.delete("/admin/users/:id", authenticateUser, authorizeAdmin, deleteUser);

module.exports = router;
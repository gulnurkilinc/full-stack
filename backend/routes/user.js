const express = require("express");
const {
    register,
    login,
    logout,
    getProfile,
    updateProfile,
    changePassword,
    applyForAuthor,
    getAllUsers,
    getUserDetail,
    updateUserRole,
    deleteUser
} = require("../controllers/user.js");

const router = express.Router();

// Genel kullanıcı routes
router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/profile", getProfile); // Auth middleware eklenecek
router.put("/profile/update", updateProfile); // Auth middleware eklenecek
router.put("/password/change", changePassword); // Auth middleware eklenecek
router.post("/apply-author", applyForAuthor); // Auth middleware eklenecek

// Admin routes
router.get("/admin/users", getAllUsers); // Admin middleware eklenecek
router.get("/admin/users/:id", getUserDetail); // Admin middleware eklenecek
router.put("/admin/users/:id/role", updateUserRole); // Admin middleware eklenecek
router.delete("/admin/users/:id", deleteUser); // Admin middleware eklenecek

module.exports = router;
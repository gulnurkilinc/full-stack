const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('🔐 Login attempt:', email);

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email ve şifre gereklidir"
      });
    }

    const user = await User.findOne({ email }).select("+password");
    console.log('👤 User found:', !!user);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Geçersiz email veya şifre"
      });
    }

    const isPasswordMatch = await user.comparePassword(password);
    console.log('🔑 Password match:', isPasswordMatch);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Geçersiz email veya şifre"
      });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || "7d" }
    );

    console.log('✅ Login successful:', user.email);

    res.status(200).json({
      success: true,
      message: "Giriş başarılı",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({
      success: false,
      message: "Giriş yapılırken hata oluştu"
    });
  }
});

module.exports = router;
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email ve şifre gereklidir"
      });
    }

    // Kullanıcıyı bul (şifreyi de getir)
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Geçersiz email veya şifre"
      });
    }

    // Şifreyi kontrol et
    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Geçersiz email veya şifre"
      });
    }

    // JWT token oluştur
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || "7d" }
    );

    // Başarılı response
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
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Giriş yapılırken hata oluştu"
    });
  }
});

// Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Tüm alanlar gereklidir"
      });
    }

    // Email zaten var mı kontrol et
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Bu email adresi zaten kullanılıyor"
      });
    }

    // Kullanıcı oluştur
    const user = await User.create({
      name,
      email,
      password,
      role: "user" // Varsayılan role
    });

    // JWT token oluştur
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || "7d" }
    );

    res.status(201).json({
      success: true,
      message: "Kayıt başarılı",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      success: false,
      message: "Kayıt olurken hata oluştu"
    });
  }
});

module.exports = router;
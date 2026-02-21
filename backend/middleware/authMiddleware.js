const jwt = require("jsonwebtoken");
const User = require("../models/user");

/**
 * Authentication Middleware
 * Kullanıcının giriş yapmış olup olmadığını kontrol eder
 */
exports.authMiddleware = async (req, res, next) => {
  try {
    // Authorization: Bearer TOKEN
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Yetkilendirme token'ı bulunamadı"
      });
    }

    const token = authHeader.split(" ")[1];

    // Token doğrulama
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Kullanıcıyı bul (şifre hariç)
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Kullanıcı bulunamadı"
      });
    }

    // Request objesine kullanıcıyı ekle
    req.user = user;
    next();

  } catch (error) {
    console.error("❌ Auth Middleware Error:", error.message);

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Geçersiz token"
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token süresi dolmuş"
      });
    }

    return res.status(500).json({
      success: false,
      message: "Yetkilendirme sırasında bir hata oluştu"
    });
  }
};

/**
 * Admin yetkisi kontrolü
 */
exports.isAdmin = (req, res, next) => {
  if (req.user?.role === "admin") {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: "Bu işlem için admin yetkisi gereklidir"
  });
};

/**
 * Author veya Admin yetkisi kontrolü
 */
exports.isAuthorOrAdmin = (req, res, next) => {
  if (req.user && ["admin", "author"].includes(req.user.role)) {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: "Bu işlem için yazar veya admin yetkisi gereklidir"
  });
};

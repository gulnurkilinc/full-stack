const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.authMiddleware = async (req, res, next) => {
  try {
    // Token'ı header'dan al
    const token = req.headers.authorization?.split(" ")[1]; // "Bearer TOKEN"

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Yetkilendirme token'ı bulunamadı"
      });
    }

    // Token'ı doğrula
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Kullanıcıyı veritabanından bul
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Kullanıcı bulunamadı"
      });
    }

    // Kullanıcıyı req'e ekle
    req.user = user;
    next();

  } catch (error) {
    console.error("Auth middleware error:", error);
    
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
      message: "Yetkilendirme hatası"
    });
  }
};
exports.adminMiddleware = (req, res, next) => {
  try {
    // authMiddleware'den gelen user kontrolü
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Kullanıcı bulunamadı"
      });
    }

    // Admin yetkisi kontrolü
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Bu işlem için admin yetkisi gereklidir"
      });
    }

    next();

  } catch (error) {
    console.error("Admin middleware error:", error);
    return res.status(500).json({
      success: false,
      message: "Yetkilendirme hatası"
    });
  }
};
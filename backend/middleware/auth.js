const jwt = require("jsonwebtoken");
const User = require("../models/user.js");

// Kullanıcı giriş kontrolü
exports.authenticateUser = async (req, res, next) => {
    try {
        const { token } = req.cookies;

        // Token header'dan da alınabilir (Bearer token)
        const authHeader = req.headers.authorization;
        const bearerToken = authHeader && authHeader.startsWith('Bearer ') 
            ? authHeader.substring(7) 
            : null;

        const authToken = token || bearerToken;

        if (!authToken) {
            return res.status(401).json({
                success: false,
                message: "Lütfen önce giriş yapın"
            });
        }

        // Token doğrula
        const decoded = jwt.verify(authToken, process.env.JWT_SECRET);

        // Kullanıcıyı bul
        req.user = await User.findById(decoded.id);

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Kullanıcı bulunamadı"
            });
        }

        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: "Geçersiz token. Lütfen tekrar giriş yapın"
        });
    }
};

// Yazar yetkisi kontrolü
exports.authorizeAuthor = (req, res, next) => {
    if (req.user.role !== 'author' && req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: "Bu işlem için yazar yetkisi gereklidir"
        });
    }
    next();
};

// Admin yetkisi kontrolü
exports.authorizeAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: "Bu işlem için admin yetkisi gereklidir"
        });
    }
    next();
};

// Roller kontrolü (birden fazla rol için)
exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `${req.user.role} rolü bu işlemi yapma yetkisine sahip değil`
            });
        }
        next();
    };
};
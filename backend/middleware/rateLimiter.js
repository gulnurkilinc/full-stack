const rateLimit = require('express-rate-limit');

// İletişim formu için rate limiter
exports.contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 3, // Maksimum 3 istek
  message: {
    success: false,
    message: 'Çok fazla istek gönderdiniz. Lütfen 15 dakika sonra tekrar deneyin.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Genel API rate limiter
exports.apiRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 dakika
  max: 100,
  message: {
    success: false,
    message: 'Çok fazla istek. Lütfen daha sonra tekrar deneyin.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Register için rate limiter
exports.registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 saat
  max: 5, // Maksimum 5 kayıt
  message: {
    success: false,
    message: 'Çok fazla kayıt denemesi. Lütfen 1 saat sonra tekrar deneyin.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Login için rate limiter
exports.loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 10, // Maksimum 10 deneme
  message: {
    success: false,
    message: 'Çok fazla giriş denemesi. Lütfen 15 dakika sonra tekrar deneyin.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Şifre sıfırlama için rate limiter
exports.forgotPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 saat
  max: 3, // Maksimum 3 istek
  message: {
    success: false,
    message: 'Çok fazla şifre sıfırlama isteği. Lütfen 1 saat sonra tekrar deneyin.'
  },
  standardHeaders: true,
  legacyHeaders: false
});
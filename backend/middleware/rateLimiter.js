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
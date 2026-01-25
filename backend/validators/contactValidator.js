const { body } = require('express-validator');

// Validation kuralları
exports.contactValidationRules = [
  body('adSoyad')
    .trim()
    .notEmpty().withMessage('Ad Soyad alanı zorunludur')
    .isLength({ min: 3, max: 100 })
    .withMessage('Ad Soyad 3-100 karakter arasında olmalıdır')
    .matches(/^[a-zA-ZğüşöçİĞÜŞÖÇ\s]+$/)
    .withMessage('Ad Soyad sadece harf içermelidir'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('E-posta alanı zorunludur')
    .isEmail().withMessage('Geçerli bir e-posta adresi giriniz')
    .normalizeEmail(),
  
  body('konu')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Konu en fazla 200 karakter olabilir'),
  
  body('mesaj')
    .trim()
    .notEmpty().withMessage('Mesaj alanı zorunludur')
    .isLength({ min: 10, max: 2000 })
    .withMessage('Mesaj 10-2000 karakter arasında olmalıdır')
];
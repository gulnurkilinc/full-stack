const express = require('express');
const router = express.Router();
const {
  createContact,
  getAllContacts,
  getContactById,
  deleteContact
} = require('../controllers/contactController');
const { contactValidationRules } = require('../validators/contactValidator');
const { contactLimiter } = require('../middleware/rateLimiter');

// @route   POST /api/contact
// @desc    Yeni iletişim mesajı gönder
// @access  Public
router.post(
  '/',
  contactLimiter,              // Rate limiting
  contactValidationRules,       // Validation rules
  createContact                 // Controller
);

// @route   GET /api/contact
// @desc    Tüm mesajları getir (Admin)
// @access  Private/Admin (şimdilik public, sonra auth eklenebilir)
router.get('/', getAllContacts);

// @route   GET /api/contact/:id
// @desc    Tek mesaj getir (Admin)
// @access  Private/Admin
router.get('/:id', getContactById);

// @route   DELETE /api/contact/:id
// @desc    Mesaj sil (Admin)
// @access  Private/Admin
router.delete('/:id', deleteContact);

module.exports = router;
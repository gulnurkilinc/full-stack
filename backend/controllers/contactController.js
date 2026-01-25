const Contact = require('../models/Contact');
const { validationResult } = require('express-validator');

// @desc    Yeni iletişim mesajı oluştur
// @route   POST /api/contact
// @access  Public
exports.createContact = async (req, res, next) => {
  try {
    // Validation hatalarını kontrol et
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array().map(err => ({
          field: err.path,
          message: err.msg
        }))
      });
    }
    
    // Request body'den verileri al
    const { adSoyad, email, konu, mesaj } = req.body;
    
    // IP adresini al (opsiyonel - spam takibi için)
    const ipAddress = req.ip || req.connection.remoteAddress;
    
    // Yeni mesaj oluştur
    const contact = await Contact.create({
      adSoyad,
      email,
      konu: konu || 'Genel',
      mesaj,
      ipAddress
    });
    
    // Başarılı yanıt
    res.status(201).json({
      success: true,
      message: 'Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.',
      data: {
        id: contact._id,
        adSoyad: contact.adSoyad,
        email: contact.email,
        createdAt: contact.createdAt
      }
    });
    
    // TODO: Burada admin'e e-posta bildirimi gönderilebilir
    // await sendEmailNotification(contact);
    
  } catch (error) {
    next(error); // Error handler'a gönder
  }
};

// @desc    Tüm mesajları getir (Admin için)
// @route   GET /api/contact
// @access  Private/Admin (şimdilik public)
exports.getAllContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find()
      .sort({ createdAt: -1 })
      .select('-ipAddress'); // IP adresini gizle
    
    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Tek bir mesajı getir (Admin için)
// @route   GET /api/contact/:id
// @access  Private/Admin
exports.getContactById = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Mesaj bulunamadı'
      });
    }
    
    // Mesajı "okundu" olarak işaretle
    contact.durum = 'okundu';
    await contact.save();
    
    res.status(200).json({
      success: true,
      data: contact
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mesajı sil (Admin için)
// @route   DELETE /api/contact/:id
// @access  Private/Admin
exports.deleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdDelete(req.params.id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Mesaj bulunamadı'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Mesaj silindi'
    });
  } catch (error) {
    next(error);
  }
};
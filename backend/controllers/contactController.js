const Contact = require('../models/Contact');
const { validationResult } = require('express-validator');
const sendEmail = require('../utils/sendEmail');

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

    // ✅ DEĞİŞKENLERİ ÖNCE TANIMLA
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

    // ✅ E-POSTA GÖNDERİMİ (değişkenler tanımlandıktan sonra)
    try {
      await sendEmail({
        to: process.env.EMAIL_TO,
        subject: `🔔 Yeni İletişim: ${konu || 'Genel'}`,
        replyTo: email,
        html: `
          <div style="font-family: Arial; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
            <h2 style="color: #007bff;">📧 Yeni İletişim Mesajı</h2>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p><strong>👤 Ad Soyad:</strong> ${adSoyad}</p>
              <p><strong>📧 E-posta:</strong> ${email}</p>
              <p><strong>📌 Konu:</strong> ${konu || 'Genel'}</p>
              <p><strong>📅 Tarih:</strong> ${new Date().toLocaleString('tr-TR')}</p>
            </div>
            <div style="background: #fff; padding: 15px; border-left: 4px solid #007bff;">
              <h3>💬 Mesaj:</h3>
              <p style="white-space: pre-wrap;">${mesaj}</p>
            </div>
            <p style="margin-top: 20px; font-size: 12px; color: #999;">
              Yanıtlamak için: ${email}
            </p>
          </div>
        `
      });
      console.log('✅ E-posta gönderildi');
    } catch (emailError) {
      console.error('❌ E-posta hatası:', emailError);
      // E-posta hatası olsa bile mesajı veritabanına kaydettik, devam et
    }
    
    // Başarılı yanıt (tek bir kez gönder)
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
    const contact = await Contact.findByIdAndDelete(req.params.id); // ✅ findByIdDelete -> findByIdAndDelete
    
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
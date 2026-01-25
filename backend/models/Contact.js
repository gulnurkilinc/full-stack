const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  adSoyad: {
    type: String,
    required: [true, 'Ad Soyad alanı zorunludur'],
    trim: true,
    minlength: [3, 'Ad Soyad en az 3 karakter olmalıdır'],
    maxlength: [100, 'Ad Soyad en fazla 100 karakter olabilir']
  },
  
  email: {
    type: String,
    required: [true, 'E-posta alanı zorunludur'],
    trim: true,
    lowercase: true,
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      'Geçerli bir e-posta adresi giriniz'
    ]
    // index: true KALDIRILDI - sadece schema.index() kullanacağız
  },
  
  konu: {
    type: String,
    trim: true,
    maxlength: [200, 'Konu en fazla 200 karakter olabilir'],
    default: 'Genel'
  },
  
  mesaj: {
    type: String,
    required: [true, 'Mesaj alanı zorunludur'],
    trim: true,
    minlength: [10, 'Mesaj en az 10 karakter olmalıdır'],
    maxlength: [2000, 'Mesaj en fazla 2000 karakter olabilir']
  },
  
  durum: {
    type: String,
    enum: ['bekliyor', 'okundu', 'cevaplandi'],
    default: 'bekliyor'
  },
  
  ipAddress: {
    type: String,
    default: null
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index oluştur (tek bir yerde tanımla)
contactSchema.index({ email: 1, createdAt: -1 });

module.exports = mongoose.model('Contact', contactSchema);
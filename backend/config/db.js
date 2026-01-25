const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // .env dosyasından MONGODB_URI'yi al
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      throw new Error("MONGODB_URI .env dosyasında tanımlı değil!");
    }
    
    // MongoDB bağlantısı - ESKİ SEÇENEKLERİ KALDIRDIK
    const conn = await mongoose.connect(mongoURI);
    
    console.log("✅ MongoDB Bağlantısı Başarılı !!!");
    console.log(`📍 Host: ${conn.connection.host}`);
    console.log(`📂 Database: ${conn.connection.name}`);
    
    // Bağlantı hataları için listener
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB Bağlantı Hatası:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB Bağlantısı Kesildi');
    });
    
  } catch (err) {
    console.log("❌ MongoDB connection error:");
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
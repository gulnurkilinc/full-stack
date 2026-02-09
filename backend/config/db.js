const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error("MONGODB_URI .env dosyasında tanımlı değil!");
    }

    // MongoDB bağlantısı
    const conn = await mongoose.connect(mongoURI);

    console.log("✅ MongoDB Bağlantısı Başarılı");
    console.log(`📍 Host: ${conn.connection.host}`);
    console.log(`📂 Database: ${conn.connection.name}`);

    // Bağlantı event'leri (sadece 1 kez tanımlanır)
    mongoose.connection.once("open", () => {
      console.log("🔗 MongoDB bağlantısı aktif");
    });

    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB Runtime Hatası:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️ MongoDB bağlantısı koptu");
    });

    // Uygulama kapatılırken bağlantıyı düzgün kapat
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("🔌 MongoDB bağlantısı kapatıldı (App Terminated)");
      process.exit(0);
    });

  } catch (err) {
    console.error("❌ MongoDB bağlantı kurulamadı:");
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;

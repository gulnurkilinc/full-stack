require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const db = require('./config/db');
const http = require('http'); // ← YENİ
const { Server } = require('socket.io'); // ← YENİ

const app = express();
const server = http.createServer(app); // ← YENİ

// ============================================
// SOCKET.IO SETUP
// ============================================
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Socket.io bağlantı yönetimi
io.on('connection', (socket) => {
  console.log('🔌 Yeni kullanıcı bağlandı:', socket.id);

  socket.on('disconnect', () => {
    console.log('❌ Kullanıcı ayrıldı:', socket.id);
  });
});

// Socket.io'yu app'e ekle (controller'lar kullanabilsin)
app.set('io', io);

// ============================================
// SECURITY MIDDLEWARES
// ============================================

app.use(helmet());

app.use(cors({
  origin: process.env.FRONTEND_URL || process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(cookieParser());
app.use(xss());
app.use(mongoSanitize());

// ============================================
// REQUEST LOGGING
// ============================================
app.use((req, res, next) => {
  console.log(`📝 ${req.method} ${req.path}`);
  next();
});

// ============================================
// DATABASE CONNECTION
// ============================================
db();

// ============================================
// HEALTH CHECK
// ============================================
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server çalışıyor',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    socketConnections: io.engine.clientsCount // ← YENİ
  });
});

// ============================================
// TEST ROUTES
// ============================================

app.get('/api/create-admin', async (req, res) => {
  try {
    const User = require('./models/user.js');
    const bcrypt = require('bcryptjs');
    
    await User.deleteMany({ email: 'admin@blog.com' });
    console.log('🗑️ Eski admin silindi');
    
    const hashedPassword = await bcrypt.hash('admin123', 10);
    console.log('🔐 Şifre hashlendi');

    const result = await User.collection.insertOne({
      name: 'Admin User',
      email: 'admin@blog.com',
      password: hashedPassword,
      role: 'admin',
      isVerified: true,
      isActive: true,
      avatar: {
        public_id: 'default_avatar',
        url: 'https://ui-avatars.com/api/?name=Admin&background=007bff&color=fff&size=200'
      },
      bio: '',
      socialLinks: { twitter: '', linkedin: '', github: '', website: '' },
      lastLogin: null,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log('✅ Admin oluşturuldu:', result.insertedId);

    res.status(200).json({
      success: true,
      message: '✅ Admin kullanıcı başarıyla oluşturuldu!',
      credentials: {
        email: 'admin@blog.com',
        password: 'admin123'
      }
    });
    
  } catch (error) {
    console.error('❌ Create admin error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

app.get('/api/update-categories', async (req, res) => {
  try {
    const Blog = require('./models/blog.js');
    
    const categoryMap = {
      'Teknoloji': 'Teknoloji Analizi',
      'Sağlık': 'Sağlık Araştırmaları',
      'Dünya': 'Küresel Trendler',
      'Bilim': 'Bilimsel İncelemeler',
      'Ekonomi': 'Ekonomi ve Finans',
      'Eğitim': 'Eğitim ve Gelişim',
      'Spor': 'Spor Analizleri',
      'Kültür': 'Kültür ve Toplum',
      'Sanat': 'Sanat ve Tasarım',
      'Seyahat': 'Seyahat ve Keşif',
      'Yemek': 'Gastronomi Araştırmaları'
    };

    let updateCount = 0;
    
    for (const [oldCat, newCat] of Object.entries(categoryMap)) {
      const result = await Blog.updateMany(
        { category: oldCat },
        { $set: { category: newCat } }
      );
      updateCount += result.modifiedCount;
      console.log(`✅ ${oldCat} → ${newCat}: ${result.modifiedCount} blog güncellendi`);
    }
    
    res.status(200).json({
      success: true,
      message: `✅ Kategoriler güncellendi!`,
      updatedCount: updateCount
    });
  } catch (error) {
    console.error('❌ Update categories error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

app.get('/api/seed-blogs', async (req, res) => {
  try {
    const Blog = require('./models/blog.js');
    
    await Blog.deleteMany({});
    
    const blogs = await Blog.insertMany([
      {
        title: 'Yapay Zeka ve Gelecek: Derinlemesine Analiz',
        slug: 'yapay-zeka-ve-gelecek',
        content: '<h2>Yapay Zeka Nedir?</h2><p>Yapay zeka teknolojisi son yıllarda inanılmaz bir hızla gelişiyor...</p>',
        excerpt: 'Yapay zeka teknolojisinin gelecekte nasıl bir rol oynayacağına dair kapsamlı araştırma ve analizler.',
        category: 'Teknoloji Analizi',
        tags: ['yapay zeka', 'teknoloji', 'gelecek', 'analiz'],
        coverImage: {
          public_id: 'sample1',
          url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800'
        },
        author: '65a1234567890abcdef12345',
        status: 'published',
        featured: true,
        publishedAt: new Date()
      }
    ]);
    
    res.status(200).json({
      success: true,
      message: `✅ ${blogs.length} analiz başarıyla eklendi!`,
      count: blogs.length,
      blogs
    });
  } catch (error) {
    console.error('❌ Seed blogs error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// ============================================
// IMPORT ROUTES
// ============================================
console.log('🚀 kanunTeklifi.js routes dosyası yüklendi!');
console.log('🔗 Kanun teklifi routes yüklendi!');

const blogRoutes = require('./routes/blog.js');
const userRoutes = require('./routes/user.js');
const contactRoutes = require('./routes/contact.js');
const kanunTeklifiRoutes = require('./routes/kanunTeklifi.js');

const { apiRateLimiter } = require('./middleware/rateLimiter');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// ============================================
// RATE LIMITING
// ============================================
app.use('/api/blogs', apiRateLimiter);
app.use('/api/login', apiRateLimiter);
app.use('/api/register', apiRateLimiter);
app.use('/api/kanun-teklifi', apiRateLimiter);

// ============================================
// API ROUTES
// ============================================
app.use('/api', blogRoutes);
app.use('/api', userRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api', kanunTeklifiRoutes);

// ============================================
// ANA SAYFA
// ============================================
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: '✅ Blog API çalışıyor!',
    version: '1.0.0',
    socketConnections: io.engine.clientsCount, // ← YENİ
    endpoints: {
      health: 'GET /api/health',
      'Admin oluştur': 'GET /api/create-admin',
      'Kategorileri Güncelle': 'GET /api/update-categories',
      'Yeni analizler ekle': 'GET /api/seed-blogs',
      'Analizler': 'GET /api/blogs',
      'Login': 'POST /api/login',
      'İletişim': 'POST /api/contact',
      'Kanun Teklifleri': 'GET /api/kanun-teklifleri',
      'Oy Kullan': 'POST /api/kanun-teklifi/:id/oy'
    },
    status: 'running',
    environment: process.env.NODE_ENV || 'development'
  });
});

// ============================================
// ERROR HANDLERS
// ============================================
app.use(notFound);
app.use(errorHandler);

// ============================================
// SERVER BAŞLAT - DEĞİŞTİRİLDİ!
// ============================================
const PORT = process.env.PORT || 4000;

// ❌ ESKI: app.listen yerine
// ✅ YENİ: server.listen kullan (Socket.io için)
server.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════╗
║   🚀 Blog API Server                      ║
║   ✅ Server running on port ${PORT}          ║
║   📍 http://localhost:${PORT}                ║
║   🌍 Environment: ${process.env.NODE_ENV || 'development'}              ║
║   🔒 Security: Enabled                    ║
║   🔗 Frontend: ${process.env.FRONTEND_URL}  ║
║   🔴 Socket.io: ACTIVE                    ║
╚════════════════════════════════════════════╝
  `);
  console.log('📋 Endpoints:');
  console.log('   - GET  /api/create-admin');
  console.log('   - GET  /api/update-categories');
  console.log('   - GET  /api/seed-blogs');
  console.log('   - GET  /api/blogs');
  console.log('   - POST /api/login');
  console.log('   - POST /api/contact');
  console.log('   - GET  /api/kanun-teklifleri (YENİ)');
  console.log('   - POST /api/kanun-teklifi/:id/oy (YENİ)');
  console.log('   - 🔴 WebSocket: READY');
});

process.on('SIGTERM', () => {
  console.log('👋 SIGTERM: closing server');
  server.close(() => console.log('🔴 Server closed'));
});

process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});
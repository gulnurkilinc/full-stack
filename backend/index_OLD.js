require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const xss = require('xss-clean');
const db = require('./config/db');

const app = express();

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
    timestamp: new Date().toISOString()
  });
});

// ============================================
// IMPORT ROUTES
// ============================================
const blogRoutes = require('./routes/blog.js');
const userRoutes = require('./routes/user.js');
const contactRoutes = require('./routes/contact.js');
const kanunTeklifiRoutes = require('./routes/kanunTeklifi.js');

// Import middlewares
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
// ROUTES
// ============================================
console.log('🔗 Kanun teklifi routes yüklendi!');
app.use('/api', kanunTeklifiRoutes);
app.use('/api', blogRoutes);
app.use('/api', userRoutes);
app.use('/api/contact', contactRoutes);

// ============================================
// DEV ONLY ROUTES - Production'da kapalı
// ============================================
if (process.env.NODE_ENV === 'development') {
  console.log('🛠️  Development route\'ları aktif: /api/create-admin, /api/seed-blogs, /api/update-categories');

  // DEV ROUTE - Admin kullanıcı oluştur
  app.get('/api/create-admin', async (req, res) => {
    try {
      const User = require('./models/user.js');

      await User.deleteMany({ email: 'admin@blog.com' });
      console.log('🗑️ Eski admin silindi');

      // User.create() kullan → pre('save') hook çalışır → şifre otomatik hash'lenir
      const admin = await User.create({
        name: 'Admin User',
        email: 'admin@blog.com',
        password: 'admin123',
        role: 'admin',
        isVerified: true,
        isActive: true,
        avatar: {
          public_id: 'default_avatar',
          url: 'https://ui-avatars.com/api/?name=Admin&background=007bff&color=fff&size=200'
        }
      });

      console.log('✅ Admin oluşturuldu:', admin._id);

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
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // DEV ROUTE - Mevcut blogların kategorilerini güncelle
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
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // DEV ROUTE - Örnek bloglar ekle
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
          coverImage: { public_id: 'sample1', url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800' },
          author: '65a1234567890abcdef12345',
          status: 'published',
          featured: true,
          publishedAt: new Date()
        },
        {
          title: 'Sağlıklı Yaşam: Bilimsel Araştırmalar',
          slug: 'saglikli-yasam-arastirmalari',
          content: '<h2>Dengeli Beslenme</h2><p>Dengeli beslenme ve düzenli egzersiz sağlıklı bir yaşamın temel taşlarıdır...</p>',
          excerpt: 'Dengeli beslenme ve düzenli egzersizle sağlıklı bir yaşam: Bilimsel veriler ışığında detaylı inceleme.',
          category: 'Sağlık Araştırmaları',
          tags: ['sağlık', 'beslenme', 'spor', 'araştırma'],
          coverImage: { public_id: 'sample2', url: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800' },
          author: '65a1234567890abcdef12345',
          status: 'published',
          featured: false,
          publishedAt: new Date()
        },
        {
          title: 'Küresel İklim Değişikliği: Trend Analizi',
          slug: 'kuresel-iklim-degisikligi-analizi',
          content: '<h2>İklim Krizi</h2><p>İklim değişikliği dünyamızın en büyük tehdididir...</p>',
          excerpt: 'İklim değişikliği ve dünya üzerindeki etkileri: Güncel verilerle kapsamlı trend analizi.',
          category: 'Küresel Trendler',
          tags: ['iklim', 'çevre', 'doğa', 'analiz'],
          coverImage: { public_id: 'sample3', url: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800' },
          author: '65a1234567890abcdef12345',
          status: 'published',
          featured: true,
          publishedAt: new Date()
        },
        {
          title: 'Kripto Para Piyasası: Ekonomik Analiz',
          slug: 'kripto-para-ekonomik-analiz',
          content: '<h2>Bitcoin ve Blockchain</h2><p>Kripto para piyasası son yıllarda büyük dalgalanmalar yaşadı...</p>',
          excerpt: 'Kripto para piyasalarının ekonomik analizi: Trendler, fırsatlar ve riskler.',
          category: 'Ekonomi ve Finans',
          tags: ['kripto', 'ekonomi', 'finans', 'analiz'],
          coverImage: { public_id: 'sample5', url: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800' },
          author: '65a1234567890abcdef12345',
          status: 'published',
          featured: true,
          publishedAt: new Date()
        },
        {
          title: 'Toplumsal Değişim: Kültürel Analiz',
          slug: 'toplumsal-degisim-analizi',
          content: '<h2>Modern Toplum</h2><p>Dijitalleşme toplumsal yapıyı nasıl etkiliyor?</p>',
          excerpt: 'Dijital çağda toplumsal değişim ve kültürel dönüşüm üzerine sosyolojik inceleme.',
          category: 'Kültür ve Toplum',
          tags: ['toplum', 'kültür', 'değişim', 'sosyoloji'],
          coverImage: { public_id: 'sample11', url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800' },
          author: '65a1234567890abcdef12345',
          status: 'published',
          featured: true,
          publishedAt: new Date()
        }
      ]);

      res.status(200).json({
        success: true,
        message: `✅ ${blogs.length} analiz başarıyla eklendi!`,
        count: blogs.length
      });
    } catch (error) {
      console.error('❌ Seed blogs error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  });
}

// ============================================
// ANA SAYFA
// ============================================
app.get('/', (req, res) => {
  res.status(200).json({
    message: '✅ API çalışıyor!',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    status: 'running',
    endpoints: {
      health: 'GET /api/health',
      blogs: 'GET /api/blogs',
      login: 'POST /api/login',
      register: 'POST /api/register',
      contact: 'POST /api/contact',
      kanunTeklifleri: 'GET /api/kanun-teklifleri',
      // Dev route'ları sadece development'ta göster
      ...(process.env.NODE_ENV === 'development' && {
        'DEV - Admin oluştur': 'GET /api/create-admin',
        'DEV - Kategorileri Güncelle': 'GET /api/update-categories',
        'DEV - Blog ekle': 'GET /api/seed-blogs',
      })
    }
  });
});

// ============================================
// ERROR HANDLERS
// ============================================
app.use(notFound);
app.use(errorHandler);

// ============================================
// SERVER BAŞLAT
// ============================================
const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════╗
║   🚀 API Server                           ║
║   ✅ Server running on port ${PORT}          ║
║   📍 http://localhost:${PORT}                ║
║   🌍 Environment: ${process.env.NODE_ENV || 'development'}              ║
║   🔒 Security: Enabled                    ║
║   🔗 Frontend: ${process.env.FRONTEND_URL}  ║
╚════════════════════════════════════════════╝
  `);

  console.log('📋 Aktif Endpoints:');
  console.log('   - GET  /api/blogs');
  console.log('   - POST /api/login');
  console.log('   - POST /api/register');
  console.log('   - POST /api/logout');
  console.log('   - GET  /api/me');
  console.log('   - POST /api/contact');
  console.log('   - GET  /api/kanun-teklifleri');

  if (process.env.NODE_ENV === 'development') {
    console.log('\n🛠️  DEV Endpoints (production\'da kapalı):');
    console.log('   - GET  /api/create-admin');
    console.log('   - GET  /api/update-categories');
    console.log('   - GET  /api/seed-blogs');
  }
});

process.on('SIGTERM', () => {
  console.log('👋 SIGTERM: closing server');
  server.close(() => console.log('🔴 Server closed'));
});



process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});
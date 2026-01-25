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

// Helmet - HTTP header güvenliği
app.use(helmet());

// CORS - Güncellenmiş ayarlar
app.use(cors({
  origin: process.env.FRONTEND_URL || process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser
app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(cookieParser());

// Data sanitization against XSS
app.use(xss());

// ============================================
// REQUEST LOGGING (Development)
// ============================================
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`📝 ${req.method} ${req.path}`);
    next();
  });
}

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
// TEST ROUTES
// ============================================

// TEST ROUTE - Admin kullanıcı oluştur
app.get('/api/create-admin', async (req, res) => {
  try {
    const User = require('./models/User.js');
    const bcrypt = require('bcryptjs');
    
    // ÖNCEKİ ADMINI SİL
    await User.deleteMany({ email: 'admin@blog.com' });
    console.log('🗑️ Eski admin silindi');
    
    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash('admin123', 10);
    console.log('🔐 Şifre hashlendi');

    // Doğrudan MongoDB'ye yaz
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

// TEST ROUTE - Blog eklemek için
app.get('/api/seed-blogs', async (req, res) => {
  try {
    const Blog = require('./models/blog.js');
    
    await Blog.deleteMany({});
    
    const blogs = await Blog.insertMany([
      {
        title: 'Yapay Zeka ve Gelecek',
        slug: 'yapay-zeka-ve-gelecek',
        content: '<h2>Yapay Zeka Nedir?</h2><p>Yapay zeka teknolojisi son yıllarda inanılmaz bir hızla gelişiyor. ChatGPT, DALL-E ve diğer AI modelleri hayatımızı değiştiriyor...</p><h3>Gelecekte Neler Bizi Bekliyor?</h3><p>Uzmanlar 2030\'a kadar yapay zekanın birçok sektörü tamamen değiştireceğini öngörüyor. Otonom araçlar, tıbbi teşhis sistemleri ve kişiselleştirilmiş eğitim platformları sadece başlangıç...</p>',
        excerpt: 'Yapay zeka teknolojisinin gelecekte nasıl bir rol oynayacağını keşfedin.',
        category: 'Teknoloji',
        tags: ['yapay zeka', 'teknoloji', 'gelecek'],
        coverImage: {
          public_id: 'sample1',
          url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800'
        },
        author: '65a1234567890abcdef12345',
        status: 'published',
        featured: true,
        publishedAt: new Date()
      },
      {
        title: 'Sağlıklı Yaşam İpuçları',
        slug: 'saglikli-yasam-ipuclari',
        content: '<h2>Dengeli Beslenme</h2><p>Dengeli beslenme ve düzenli egzersiz sağlıklı bir yaşamın temel taşlarıdır. Her gün en az 30 dakika yürüyüş yapın...</p><h3>Egzersiz Önerileri</h3><p>Haftada en az 3 gün orta tempolu egzersiz yapmanız önerilir. Yüzme, koşu ve bisiklet gibi aktiviteler idealdir.</p>',
        excerpt: 'Dengeli beslenme ve düzenli egzersizle sağlıklı bir yaşam sürdürün.',
        category: 'Sağlık',
        tags: ['sağlık', 'beslenme', 'spor'],
        coverImage: {
          public_id: 'sample2',
          url: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800'
        },
        author: '65a1234567890abcdef12345',
        status: 'published',
        featured: false,
        publishedAt: new Date()
      },
      {
        title: 'Küresel Isınma ve Etkileri',
        slug: 'kuresel-isinma-ve-etkileri',
        content: '<h2>İklim Krizi</h2><p>İklim değişikliği dünyamızın en büyük tehdididir. Bilim insanları uyarıyor: Hemen harekete geçmeliyiz...</p>',
        excerpt: 'İklim değişikliği ve dünya üzerindeki etkileri hakkında bilmeniz gerekenler.',
        category: 'Dünya',
        tags: ['iklim', 'çevre', 'doğa'],
        coverImage: {
          public_id: 'sample3',
          url: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800'
        },
        author: '65a1234567890abcdef12345',
        status: 'published',
        featured: true,
        publishedAt: new Date()
      },
      {
        title: 'Uzayda Yeni Keşifler',
        slug: 'uzayda-yeni-kesifler',
        content: '<h2>Mars Misyonu</h2><p>NASA ve SpaceX uzay keşfinde yeni bir çağ başlattı. Mars\'a insanlı görev planları hızla ilerliyor...</p>',
        excerpt: 'NASA ve diğer uzay ajanslarının son keşiflerini öğrenin.',
        category: 'Bilim',
        tags: ['uzay', 'bilim', 'keşif'],
        coverImage: {
          public_id: 'sample4',
          url: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=800'
        },
        author: '65a1234567890abcdef12345',
        status: 'published',
        featured: false,
        publishedAt: new Date()
      }
    ]);
    
    res.status(200).json({
      success: true,
      message: `✅ ${blogs.length} blog başarıyla eklendi!`,
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
const blogRoutes = require('./routes/blog.js');
const userRoutes = require('./routes/user.js');
const contactRoutes = require('./routes/contact.js');

// Import middlewares
const { apiRateLimiter } = require('./middleware/rateLimiter');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// ============================================
// RATE LIMITING
// ============================================
app.use('/api/blogs', apiRateLimiter);
app.use('/api/login', apiRateLimiter);
app.use('/api/register', apiRateLimiter);

// ============================================
// API ROUTES
// ============================================
app.use('/api', blogRoutes);
app.use('/api', userRoutes);
app.use('/api/contact', contactRoutes);

// ============================================
// ANA SAYFA
// ============================================
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: '✅ Blog API çalışıyor!',
    version: '1.0.0',
    endpoints: {
      health: 'GET /api/health',
      'Admin oluştur': 'GET /api/create-admin',
      'Blog ekle': 'GET /api/seed-blogs',
      'Bloglar': 'GET /api/blogs',
      'Login': 'POST /api/login',
      'İletişim': 'POST /api/contact'
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
// SERVER BAŞLAT
// ============================================
const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════╗
║   🚀 Blog API Server                      ║
║   ✅ Server running on port ${PORT}          ║
║   📍 http://localhost:${PORT}                ║
║   🌍 Environment: ${process.env.NODE_ENV || 'development'}              ║
║   🔒 Security: Enabled                    ║
║   🔗 Frontend: ${process.env.FRONTEND_URL}  ║
╚════════════════════════════════════════════╝
  `);
  console.log('📋 Endpoints:');
  console.log('   - GET  /api/create-admin');
  console.log('   - GET  /api/seed-blogs');
  console.log('   - GET  /api/blogs');
  console.log('   - POST /api/login');
  console.log('   - POST /api/contact');
});

process.on('SIGTERM', () => {
  console.log('👋 SIGTERM: closing server');
  server.close(() => console.log('🔴 Server closed'));
});

process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});
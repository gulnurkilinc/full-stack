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

// TEST ROUTE - Mevcut blogların kategorilerini güncelle
app.get('/api/update-categories', async (req, res) => {
  try {
    const Blog = require('./models/blog.js');
    
    // Kategori mapping (eski → yeni)
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
    
    // Her eski kategori için güncelleme yap
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

// TEST ROUTE - Yeni analizler ekle
app.get('/api/seed-blogs', async (req, res) => {
  try {
    const Blog = require('./models/blog.js');
    
    await Blog.deleteMany({});
    
    const blogs = await Blog.insertMany([
      {
        title: 'Yapay Zeka ve Gelecek: Derinlemesine Analiz',
        slug: 'yapay-zeka-ve-gelecek',
        content: '<h2>Yapay Zeka Nedir?</h2><p>Yapay zeka teknolojisi son yıllarda inanılmaz bir hızla gelişiyor. ChatGPT, DALL-E ve diğer AI modelleri hayatımızı değiştiriyor...</p><h3>Gelecekte Neler Bizi Bekliyor?</h3><p>Uzmanlar 2030\'a kadar yapay zekanın birçok sektörü tamamen değiştireceğini öngörüyor. Otonom araçlar, tıbbi teşhis sistemleri ve kişiselleştirilmiş eğitim platformları sadece başlangıç...</p>',
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
      },
      {
        title: 'Sağlıklı Yaşam: Bilimsel Araştırmalar',
        slug: 'saglikli-yasam-arastirmalari',
        content: '<h2>Dengeli Beslenme</h2><p>Dengeli beslenme ve düzenli egzersiz sağlıklı bir yaşamın temel taşlarıdır. Her gün en az 30 dakika yürüyüş yapın...</p><h3>Egzersiz Önerileri</h3><p>Haftada en az 3 gün orta tempolu egzersiz yapmanız önerilir. Yüzme, koşu ve bisiklet gibi aktiviteler idealdir.</p>',
        excerpt: 'Dengeli beslenme ve düzenli egzersizle sağlıklı bir yaşam: Bilimsel veriler ışığında detaylı inceleme.',
        category: 'Sağlık Araştırmaları',
        tags: ['sağlık', 'beslenme', 'spor', 'araştırma'],
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
        title: 'Küresel İklim Değişikliği: Trend Analizi',
        slug: 'kuresel-iklim-degisikligi-analizi',
        content: '<h2>İklim Krizi</h2><p>İklim değişikliği dünyamızın en büyük tehdididir. Bilim insanları uyarıyor: Hemen harekete geçmeliyiz...</p>',
        excerpt: 'İklim değişikliği ve dünya üzerindeki etkileri: Güncel verilerle kapsamlı trend analizi.',
        category: 'Küresel Trendler',
        tags: ['iklim', 'çevre', 'doğa', 'analiz'],
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
        title: 'Uzay Keşfi: Bilimsel İncelemeler',
        slug: 'uzay-kesfi-bilimsel-inceleme',
        content: '<h2>Mars Misyonu</h2><p>NASA ve SpaceX uzay keşfinde yeni bir çağ başlattı. Mars\'a insanlı görev planları hızla ilerliyor...</p>',
        excerpt: 'NASA ve diğer uzay ajanslarının son keşifleri üzerine bilimsel değerlendirmeler ve analizler.',
        category: 'Bilimsel İncelemeler',
        tags: ['uzay', 'bilim', 'keşif', 'araştırma'],
        coverImage: {
          public_id: 'sample4',
          url: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=800'
        },
        author: '65a1234567890abcdef12345',
        status: 'published',
        featured: false,
        publishedAt: new Date()
      },
      {
        title: 'Kripto Para Piyasası: Ekonomik Analiz',
        slug: 'kripto-para-ekonomik-analiz',
        content: '<h2>Bitcoin ve Blockchain</h2><p>Kripto para piyasası son yıllarda büyük dalgalanmalar yaşadı. Uzmanlar 2025 için ne öngörüyor?</p>',
        excerpt: 'Kripto para piyasalarının ekonomik analizi: Trendler, fırsatlar ve riskler.',
        category: 'Ekonomi ve Finans',
        tags: ['kripto', 'ekonomi', 'finans', 'analiz'],
        coverImage: {
          public_id: 'sample5',
          url: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800'
        },
        author: '65a1234567890abcdef12345',
        status: 'published',
        featured: true,
        publishedAt: new Date()
      },
      {
        title: 'Dijital Öğrenme: Eğitim Trendleri',
        slug: 'dijital-ogrenme-trendleri',
        content: '<h2>Online Eğitim</h2><p>Pandemi sonrası dijital öğrenme platformları hızla yaygınlaştı. Gelecek nesil eğitim nasıl olacak?</p>',
        excerpt: 'Dijital öğrenme platformlarının eğitimdeki rolü ve gelecek trendleri üzerine araştırma.',
        category: 'Eğitim ve Gelişim',
        tags: ['eğitim', 'dijital', 'öğrenme', 'trend'],
        coverImage: {
          public_id: 'sample6',
          url: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800'
        },
        author: '65a1234567890abcdef12345',
        status: 'published',
        featured: false,
        publishedAt: new Date()
      },
      {
        title: 'Futbol Taktik Analizi: 2025 Trendleri',
        slug: 'futbol-taktik-analizi',
        content: '<h2>Modern Futbol</h2><p>Top futbolu artık sadece yetenekle değil, veri analiziyle de kazanılıyor.</p>',
        excerpt: 'Futbol taktiklerinin evrimi ve veri analitiği: Detaylı spor araştırması.',
        category: 'Spor Analizleri',
        tags: ['futbol', 'spor', 'taktik', 'analiz'],
        coverImage: {
          public_id: 'sample7',
          url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800'
        },
        author: '65a1234567890abcdef12345',
        status: 'published',
        featured: false,
        publishedAt: new Date()
      },
      {
        title: 'Rönesans Sanatı: Tarihsel Analiz',
        slug: 'ronesans-sanati-analizi',
        content: '<h2>Sanat ve Tasarım</h2><p>Rönesans dönemi sanatının günümüz tasarımına etkileri nelerdir?</p>',
        excerpt: 'Rönesans döneminin sanat ve tasarım üzerindeki kalıcı etkileri: Derinlemesine inceleme.',
        category: 'Sanat ve Tasarım',
        tags: ['sanat', 'rönesans', 'tasarım', 'tarih'],
        coverImage: {
          public_id: 'sample8',
          url: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800'
        },
        author: '65a1234567890abcdef12345',
        status: 'published',
        featured: true,
        publishedAt: new Date()
      },
      {
        title: 'Japon Mutfağı: Gastronomi Araştırması',
        slug: 'japon-mutfagi-arastirmasi',
        content: '<h2>Sushi ve Ötesi</h2><p>Japon mutfağının dünya gastronomisindeki yeri ve önemi.</p>',
        excerpt: 'Japon mutfağının kültürel ve gastronomik değeri üzerine kapsamlı araştırma.',
        category: 'Gastronomi Araştırmaları',
        tags: ['gastronomi', 'japon', 'mutfak', 'kültür'],
        coverImage: {
          public_id: 'sample9',
          url: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800'
        },
        author: '65a1234567890abcdef12345',
        status: 'published',
        featured: false,
        publishedAt: new Date()
      },
      {
        title: 'Sürdürülebilir Turizm: Seyahat Trendleri',
        slug: 'surdurulebilir-turizm-trendleri',
        content: '<h2>Eko-Turizm</h2><p>Çevre dostu seyahat alternatifleri hızla yaygınlaşıyor.</p>',
        excerpt: 'Sürdürülebilir turizm ve eko-seyahat trendlerinin analizi: Gelecek nesil turizm.',
        category: 'Seyahat ve Keşif',
        tags: ['turizm', 'seyahat', 'sürdürülebilirlik', 'eko'],
        coverImage: {
          public_id: 'sample10',
          url: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800'
        },
        author: '65a1234567890abcdef12345',
        status: 'published',
        featured: false,
        publishedAt: new Date()
      },
      {
        title: 'Toplumsal Değişim: Kültürel Analiz',
        slug: 'toplumsal-degisim-analizi',
        content: '<h2>Modern Toplum</h2><p>Dijitalleşme toplumsal yapıyı nasıl etkiliyor?</p>',
        excerpt: 'Dijital çağda toplumsal değişim ve kültürel dönüşüm üzerine sosyolojik inceleme.',
        category: 'Kültür ve Toplum',
        tags: ['toplum', 'kültür', 'değişim', 'sosyoloji'],
        coverImage: {
          public_id: 'sample11',
          url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800'
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
const blogRoutes = require('./routes/blog.js');
const userRoutes = require('./routes/user.js');
const contactRoutes = require('./routes/contact.js');
const kanunTeklifiRoutes = require('./routes/kanunTeklifi.js'); // YENİ

// Import middlewares
const { apiRateLimiter } = require('./middleware/rateLimiter');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// ============================================
// RATE LIMITING
// ============================================
app.use('/api/blogs', apiRateLimiter);
app.use('/api/login', apiRateLimiter);
app.use('/api/register', apiRateLimiter);
app.use('/api/kanun-teklifi', apiRateLimiter); // YENİ

// ============================================
// API ROUTES
// ============================================
app.use('/api', blogRoutes);
app.use('/api', userRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api', kanunTeklifiRoutes); // YENİ: Kanun Teklifi Routes

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
      'Kategorileri Güncelle': 'GET /api/update-categories',
      'Yeni analizler ekle': 'GET /api/seed-blogs',
      'Analizler': 'GET /api/blogs',
      'Login': 'POST /api/login',
      'İletişim': 'POST /api/contact',
      'Kanun Teklifleri': 'GET /api/kanun-teklifleri', // YENİ
      'Oy Kullan': 'POST /api/kanun-teklifi/:id/oy' // YENİ
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
  console.log('   - GET  /api/update-categories');
  console.log('   - GET  /api/seed-blogs');
  console.log('   - GET  /api/blogs');
  console.log('   - POST /api/login');
  console.log('   - POST /api/contact');
  console.log('   - GET  /api/kanun-teklifleri (YENİ)');
  console.log('   - POST /api/kanun-teklifi/:id/oy (YENİ)');
});

process.on('SIGTERM', () => {
  console.log('👋 SIGTERM: closing server');
  server.close(() => console.log('🔴 Server closed'));
});

process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});
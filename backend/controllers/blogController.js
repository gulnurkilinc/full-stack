const Blog = require("../models/blog");
const mongoose = require("mongoose");

// Tüm analizleri getir (filtreleme, pagination, sorting)
exports.getAllBlogs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 17, // Frontend ile uyumlu (17 analiz)
      category,
      tags,
      status = "published",
      featured,
      search,
      sort = "-createdAt" // Varsayılan sıralama (en yeni)
    } = req.query;

    // Filtreleme objesi
    const filter = { status };

    // Kategori filtresi
    if (category && category !== 'all') {
      filter.category = category;
    }

    // Diğer filtreler
    if (featured !== undefined) {
      filter.featured = featured === "true";
    }
    
    if (tags) {
      filter.tags = { $in: tags.split(",") };
    }
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
        { excerpt: { $regex: search, $options: "i" } }
      ];
    }

    // Pagination hesaplamaları
    const currentPage = parseInt(page);
    const itemsPerPage = parseInt(limit);
    const skip = (currentPage - 1) * itemsPerPage;

    // Veri çekme
    const blogs = await Blog.find(filter)
      .populate("author", "name email avatar")
      .sort(sort)
      .skip(skip)
      .limit(itemsPerPage)
      .lean();

    const totalBlogs = await Blog.countDocuments(filter);
    const totalPages = Math.ceil(totalBlogs / itemsPerPage);

    // Frontend ile uyumlu response formatı
    res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs, // Frontend 'data' bekliyor
      pagination: {
        currentPage,
        totalPages,
        totalBlogs,
        limit: itemsPerPage,
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1,
        nextPage: currentPage < totalPages ? currentPage + 1 : null,
        prevPage: currentPage > 1 ? currentPage - 1 : null
      },
      filter: {
        category: category || 'all',
        status,
        search: search || null
      }
    });
  } catch (error) {
    console.error("❌ Get all blogs error:", error);
    res.status(500).json({
      success: false,
      message: "Analizler getirilirken hata oluştu",
      error: error.message
    });
  }
};

// Kategorileri ve analiz sayılarını getir
exports.getCategories = async (req, res) => {
  try {
    // Tüm kategorileri ve analiz sayılarını al
    const categoryCounts = await Blog.aggregate([
      { $match: { status: 'published' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Enum'dan tüm kategorileri al
    const allCategories = Blog.schema.path('category').enumValues || [
      "Teknoloji Analizi",
      "Sağlık Araştırmaları", 
      "Küresel Trendler", 
      "Bilimsel İncelemeler", 
      "Ekonomi ve Finans",
      "Eğitim ve Gelişim", 
      "Spor Analizleri", 
      "Kültür ve Toplum", 
      "Sanat ve Tasarım",
      "Seyahat ve Keşif",
      "Gastronomi Araştırmaları"
    ];

    // Her kategori için count ekle
    const categories = allCategories.map(category => {
      const found = categoryCounts.find(c => c._id === category);
      return {
        name: category,
        count: found ? found.count : 0,
        slug: category.toLowerCase()
          .replace(/ı/g, 'i')
          .replace(/ğ/g, 'g')
          .replace(/ü/g, 'u')
          .replace(/ş/g, 's')
          .replace(/ö/g, 'o')
          .replace(/ç/g, 'c')
          .replace(/\s+/g, '-')
      };
    });

    // Toplam analiz sayısı
    const totalBlogs = await Blog.countDocuments({ status: 'published' });

    res.status(200).json({
      success: true,
      categories,
      total: totalBlogs
    });
  } catch (error) {
    console.error("❌ Get categories error:", error);
    res.status(500).json({
      success: false,
      message: "Kategoriler getirilirken hata oluştu",
      error: error.message
    });
  }
};

// Tek analiz getir (ID veya SLUG ile)
exports.getBlogBySlug = async (req, res) => {
  try {
    const { identifier } = req.params;

    let blog;

    // ObjectId formatında mı kontrol et
    if (mongoose.Types.ObjectId.isValid(identifier) && identifier.length === 24) {
      blog = await Blog.findById(identifier)
        .populate("author", "name email avatar");
    } else {
      // Slug ile ara
      blog = await Blog.findOne({ slug: identifier })
        .populate("author", "name email avatar");
    }

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Analiz bulunamadı"
      });
    }

    // Görüntülenme sayısını artır
    blog.viewCount += 1;
    await blog.save();

    res.status(200).json({
      success: true,
      blog
    });
  } catch (error) {
    console.error("❌ Get blog error:", error);
    res.status(500).json({
      success: false,
      message: "Analiz getirilirken hata oluştu",
      error: error.message
    });
  }
};

// Yeni analiz oluştur
exports.createBlog = async (req, res) => {
  try {
    const blogData = {
      ...req.body,
      author: req.user?._id || "65a1234567890abcdef12345"
    };

    const blog = await Blog.create(blogData);

    res.status(201).json({
      success: true,
      message: "Analiz başarıyla oluşturuldu",
      blog
    });
  } catch (error) {
    console.error("❌ Create blog error:", error);
    res.status(400).json({
      success: false,
      message: "Analiz oluşturulurken hata oluştu",
      error: error.message
    });
  }
};

// Analiz güncelle
exports.updateBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Analiz bulunamadı"
      });
    }

    res.status(200).json({
      success: true,
      message: "Analiz başarıyla güncellendi",
      blog
    });
  } catch (error) {
    console.error("❌ Update blog error:", error);
    res.status(400).json({
      success: false,
      message: "Analiz güncellenirken hata oluştu",
      error: error.message
    });
  }
};

// Analiz sil
exports.deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findByIdAndDelete(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Analiz bulunamadı"
      });
    }

    res.status(200).json({
      success: true,
      message: "Analiz başarıyla silindi"
    });
  } catch (error) {
    console.error("❌ Delete blog error:", error);
    res.status(500).json({
      success: false,
      message: "Analiz silinirken hata oluştu",
      error: error.message
    });
  }
};

// İlgili analizleri getir
exports.getRelatedBlogs = async (req, res) => {
  try {
    const { identifier } = req.params;
    const limit = parseInt(req.query.limit) || 3;

    // Önce ana analizi bul
    let mainBlog;
    if (mongoose.Types.ObjectId.isValid(identifier) && identifier.length === 24) {
      mainBlog = await Blog.findById(identifier);
    } else {
      mainBlog = await Blog.findOne({ slug: identifier });
    }

    if (!mainBlog) {
      return res.status(404).json({
        success: false,
        message: "Analiz bulunamadı"
      });
    }

    // Aynı kategorideki diğer analizleri getir
    const relatedBlogs = await Blog.find({
      _id: { $ne: mainBlog._id },
      category: mainBlog.category,
      status: "published"
    })
      .populate("author", "name avatar")
      .sort({ publishedAt: -1 })
      .limit(limit)
      .lean();

    res.status(200).json({
      success: true,
      blogs: relatedBlogs
    });
  } catch (error) {
    console.error("❌ Get related blogs error:", error);
    res.status(500).json({
      success: false,
      message: "İlgili analizler getirilirken hata oluştu",
      error: error.message
    });
  }
};

// Kategori bazlı istatistikler
exports.getCategoryStats = async (req, res) => {
  try {
    const stats = await Blog.aggregate([
      { $match: { status: 'published' } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalViews: { $sum: '$viewCount' },
          avgViews: { $avg: '$viewCount' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      success: true,
      stats
    });
  } catch (error) {
    console.error("❌ Get category stats error:", error);
    res.status(500).json({
      success: false,
      message: "İstatistikler getirilirken hata oluştu",
      error: error.message
    });
  }
};

// Analiz ara (Search)
exports.searchBlogs = async (req, res) => {
  try {
    const { q, page = 1, limit = 17 } = req.query;

    // Arama metni kontrolü
    if (!q || q.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Arama metni gereklidir'
      });
    }

    const searchText = q.trim();

    console.log('🔍 Searching blogs with query:', searchText);

    // Arama filtresi - title, content, excerpt, tags
    const searchFilter = {
      status: 'published',
      $or: [
        { title: { $regex: searchText, $options: 'i' } },
        { content: { $regex: searchText, $options: 'i' } },
        { excerpt: { $regex: searchText, $options: 'i' } },
        { tags: { $in: [new RegExp(searchText, 'i')] } }
      ]
    };

    // Pagination
    const currentPage = parseInt(page);
    const itemsPerPage = parseInt(limit);
    const skip = (currentPage - 1) * itemsPerPage;

    // Arama yap
    const blogs = await Blog.find(searchFilter)
      .populate('author', 'name email avatar')
      .sort('-createdAt')
      .skip(skip)
      .limit(itemsPerPage)
      .lean();

    const totalBlogs = await Blog.countDocuments(searchFilter);
    const totalPages = Math.ceil(totalBlogs / itemsPerPage);

    console.log(`✅ Found ${totalBlogs} blogs matching "${searchText}"`);

    res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs,
      pagination: {
        currentPage,
        totalPages,
        totalBlogs,
        limit: itemsPerPage,
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1,
        nextPage: currentPage < totalPages ? currentPage + 1 : null,
        prevPage: currentPage > 1 ? currentPage - 1 : null
      },
      searchQuery: searchText
    });
  } catch (error) {
    console.error('❌ Search blogs error:', error);
    res.status(500).json({
      success: false,
      message: 'Arama yapılırken hata oluştu',
      error: error.message
    });
  }
};
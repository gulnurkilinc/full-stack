const Blog = require("../models/blog");
const mongoose = require("mongoose");

// Tüm blogları getir (filtreleme, pagination, sorting)
exports.getAllBlogs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category, // Kategori filtresi
      tags,
      status = "published",
      featured,
      search,
      sort = "-publishedAt" // Varsayılan sıralama
    } = req.query;

    // Filtreleme objesi
    const filter = { status };

    // Kategori filtresi (önemli: 'all' değilse ekle)
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
        { content: { $regex: search, $options: "i" } }
      ];
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Veri çekme
    const blogs = await Blog.find(filter)
      .populate("author", "name email avatar")
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean(); // Performans optimizasyonu

    const total = await Blog.countDocuments(filter);

    res.status(200).json({
      success: true,
      blogs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
        hasNextPage: skip + blogs.length < total,
        hasPrevPage: parseInt(page) > 1
      },
      filter: {
        category: category || 'all',
        status
      }
    });
  } catch (error) {
    console.error("Get all blogs error:", error);
    res.status(500).json({
      success: false,
      message: "Bloglar getirilirken hata oluştu",
      error: error.message
    });
  }
};

// Kategorileri ve blog sayılarını getir (YENİ)
exports.getCategories = async (req, res) => {
  try {
    // Tüm kategorileri ve blog sayılarını al
    const categoryCounts = await Blog.aggregate([
      { $match: { status: 'published' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Enum'dan tüm kategorileri al
    const allCategories = Blog.schema.path('category').enumValues || [
      "Teknoloji", "Sağlık", "Dünya", "Bilim", 
      "Ekonomi", "Eğitim", "Spor", "Kültür", "Sanat"
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

    // Toplam blog sayısı
    const totalBlogs = await Blog.countDocuments({ status: 'published' });

    res.status(200).json({
      success: true,
      categories,
      total: totalBlogs
    });
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({
      success: false,
      message: "Kategoriler getirilirken hata oluştu",
      error: error.message
    });
  }
};

// Tek blog getir (ID veya SLUG ile)
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
        message: "Blog bulunamadı"
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
    console.error("Get blog error:", error);
    res.status(500).json({
      success: false,
      message: "Blog getirilirken hata oluştu",
      error: error.message
    });
  }
};

// Yeni blog oluştur
exports.createBlog = async (req, res) => {
  try {
    const blogData = {
      ...req.body,
      author: req.user?._id || "65a1234567890abcdef12345" // Auth middleware'den gelecek
    };

    const blog = await Blog.create(blogData);

    res.status(201).json({
      success: true,
      message: "Blog başarıyla oluşturuldu",
      blog
    });
  } catch (error) {
    console.error("Create blog error:", error);
    res.status(400).json({
      success: false,
      message: "Blog oluşturulurken hata oluştu",
      error: error.message
    });
  }
};

// Blog güncelle
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
        message: "Blog bulunamadı"
      });
    }

    res.status(200).json({
      success: true,
      message: "Blog başarıyla güncellendi",
      blog
    });
  } catch (error) {
    console.error("Update blog error:", error);
    res.status(400).json({
      success: false,
      message: "Blog güncellenirken hata oluştu",
      error: error.message
    });
  }
};

// Blog sil
exports.deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findByIdAndDelete(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog bulunamadı"
      });
    }

    res.status(200).json({
      success: true,
      message: "Blog başarıyla silindi"
    });
  } catch (error) {
    console.error("Delete blog error:", error);
    res.status(500).json({
      success: false,
      message: "Blog silinirken hata oluştu",
      error: error.message
    });
  }
};

// İlgili blogları getir
exports.getRelatedBlogs = async (req, res) => {
  try {
    const { identifier } = req.params;
    const limit = parseInt(req.query.limit) || 3;

    // Önce ana blogu bul
    let mainBlog;
    if (mongoose.Types.ObjectId.isValid(identifier) && identifier.length === 24) {
      mainBlog = await Blog.findById(identifier);
    } else {
      mainBlog = await Blog.findOne({ slug: identifier });
    }

    if (!mainBlog) {
      return res.status(404).json({
        success: false,
        message: "Blog bulunamadı"
      });
    }

    // Aynı kategorideki diğer blogları getir
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
    console.error("Get related blogs error:", error);
    res.status(500).json({
      success: false,
      message: "İlgili bloglar getirilirken hata oluştu",
      error: error.message
    });
  }
};

// Kategori bazlı istatistikler (YENİ - Bonus)
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
    console.error("Get category stats error:", error);
    res.status(500).json({
      success: false,
      message: "İstatistikler getirilirken hata oluştu",
      error: error.message
    });
  }
};
const Blog = require("../models/Blog");
const mongoose = require("mongoose");

// Tüm blogları getir (filtreleme, pagination, sorting)
exports.getAllBlogs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      tags,
      status = "published",
      featured,
      search
    } = req.query;

    // Filtreleme
    const filter = {};
    
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (featured !== undefined) filter.featured = featured === "true";
    if (tags) filter.tags = { $in: tags.split(",") };
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
      .populate("author", "name email profileImage")
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Blog.countDocuments(filter);

    res.status(200).json({
      success: true,
      blogs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
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

// Tek blog getir (ID veya SLUG ile)
exports.getBlogBySlug = async (req, res) => {
  try {
    const { identifier } = req.params;

    let blog;

    // ObjectId formatında mı kontrol et
    if (mongoose.Types.ObjectId.isValid(identifier) && identifier.length === 24) {
      blog = await Blog.findById(identifier).populate("author", "name email profileImage");
    } else {
      // Slug ile ara
      blog = await Blog.findOne({ slug: identifier }).populate("author", "name email profileImage");
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
    if (mongoose.Types.ObjectId.isValid(identifier)) {
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
      .populate("author", "name profileImage")
      .sort({ publishedAt: -1 })
      .limit(limit);

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
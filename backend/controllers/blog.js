const Blog = require("../models/blog.js");

// Tüm blog yazılarını getir (filtreleme ve sayfalama ile)
const allBlogs = async (req, res) => {
    try {
        const { category, tag, status, page = 1, limit = 10 } = req.query;
        
        const filter = {};
        
        if (category) filter.category = category;
        if (tag) filter.tags = tag;
        if (status) filter.status = status;
        
        const blogs = await Blog.find(filter)
            .populate('author', 'name email')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);
        
        const count = await Blog.countDocuments(filter);
        
        res.status(200).json({
            success: true,
            blogs,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            total: count
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Tek blog yazısını getir (slug ile)
const detailBlog = async (req, res) => {
    try {
        const blog = await Blog.findOne({ slug: req.params.slug })
            .populate('author', 'name email')
            .populate('comments.user', 'name');
        
        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog yazısı bulunamadı"
            });
        }
        
        // Görüntülenme sayısını artır
        blog.views += 1;
        await blog.save();
        
        res.status(200).json({
            success: true,
            blog
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Öne çıkan blog yazılarını getir
const featuredBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({ featured: true, status: 'published' })
            .populate('author', 'name email')
            .sort({ createdAt: -1 })
            .limit(5);
        
        res.status(200).json({
            success: true,
            blogs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// En çok okunan blog yazıları
const popularBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({ status: 'published' })
            .populate('author', 'name email')
            .sort({ views: -1 })
            .limit(10);
        
        res.status(200).json({
            success: true,
            blogs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Blog yazısına yorum yap
const addComment = async (req, res) => {
    try {
        const { name, email, comment } = req.body;
        const blog = await Blog.findById(req.params.id);
        
        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog yazısı bulunamadı"
            });
        }
        
        blog.comments.push({
            user: req.user._id, // Kullanıcı giriş yaptıysa
            name,
            email,
            comment
        });
        
        await blog.save();
        
        res.status(201).json({
            success: true,
            message: "Yorum başarıyla eklendi. Onay bekliyor."
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Blog yazısını beğen
const likeBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        
        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog yazısı bulunamadı"
            });
        }
        
        blog.likes += 1;
        await blog.save();
        
        res.status(200).json({
            success: true,
            likes: blog.likes
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ============= ADMIN İŞLEMLERİ =============

// Blog yazısı oluştur
const createBlog = async (req, res) => {
    try {
        req.body.author = req.user._id; // Giriş yapmış kullanıcı
        
        const blog = await Blog.create(req.body);
        
        res.status(201).json({
            success: true,
            blog
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Blog yazısını güncelle
const updateBlog = async (req, res) => {
    try {
        let blog = await Blog.findById(req.params.id);
        
        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog yazısı bulunamadı"
            });
        }
        
        blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        
        res.status(200).json({
            success: true,
            blog
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Blog yazısını sil
const deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        
        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog yazısı bulunamadı"
            });
        }
        
        await blog.deleteOne();
        
        res.status(200).json({
            success: true,
            message: "Blog yazısı başarıyla silindi"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Blog yazısını yayınla
const publishBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        
        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog yazısı bulunamadı"
            });
        }
        
        blog.status = 'published';
        blog.publishedAt = Date.now();
        await blog.save();
        
        res.status(200).json({
            success: true,
            message: "Blog yazısı yayınlandı",
            blog
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Yorumu onayla
const approveComment = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.blogId);
        
        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog yazısı bulunamadı"
            });
        }
        
        const comment = blog.comments.id(req.params.commentId);
        
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Yorum bulunamadı"
            });
        }
        
        comment.approved = true;
        await blog.save();
        
        res.status(200).json({
            success: true,
            message: "Yorum onaylandı"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Yorumu sil
const deleteComment = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.blogId);
        
        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog yazısı bulunamadı"
            });
        }
        
        blog.comments.pull(req.params.commentId);
        await blog.save();
        
        res.status(200).json({
            success: true,
            message: "Yorum silindi"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    // Genel
    allBlogs,
    detailBlog,
    featuredBlogs,
    popularBlogs,
    addComment,
    likeBlog,
    
    // Admin
    createBlog,
    updateBlog,
    deleteBlog,
    publishBlog,
    approveComment,
    deleteComment
};
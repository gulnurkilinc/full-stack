const Blog = require("../models/Blog.js");
const BlogFilter = require("../utils/blogFilter.js");

// Tüm blog yazılarını getir (filtreleme, arama, sayfalama ile)
const allBlogs = async (req, res) => {
    try {
        const resultPerPage = 10;
        
        const blogsCount = await Blog.countDocuments();
        
        const blogFilter = new BlogFilter(Blog.find(), req.query)
            .search()
            .filter()
            .sort();
        
        let blogs = await blogFilter.query;
        let filteredBlogsCount = blogs.length;
        
        blogFilter.pagination(resultPerPage);
        blogs = await blogFilter.query.clone()
            .populate('author', 'name email');
        
        res.status(200).json({
            success: true,
            blogs,
            blogsCount,
            filteredBlogsCount,
            resultPerPage,
            currentPage: Number(req.query.page) || 1
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
            count: blogs.length,
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
            count: blogs.length,
            blogs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// En yüksek puanlı bloglar
const topRatedBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({ status: 'published' })
            .populate('author', 'name email')
            .sort({ rating: -1 })
            .limit(10);
        
        res.status(200).json({
            success: true,
            count: blogs.length,
            blogs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Kategoriye göre blogları getir
const getBlogsByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const resultPerPage = 10;
        
        const blogFilter = new BlogFilter(
            Blog.find({ category, status: 'published' }), 
            req.query
        )
            .search()
            .sort()
            .pagination(resultPerPage);
        
        const blogs = await blogFilter.query.populate('author', 'name email');
        const count = await Blog.countDocuments({ category, status: 'published' });
        
        res.status(200).json({
            success: true,
            category,
            count,
            blogs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Etikete göre blogları getir
const getBlogsByTag = async (req, res) => {
    try {
        const { tag } = req.params;
        const resultPerPage = 10;
        
        const blogFilter = new BlogFilter(
            Blog.find({ tags: tag, status: 'published' }), 
            req.query
        )
            .search()
            .sort()
            .pagination(resultPerPage);
        
        const blogs = await blogFilter.query.populate('author', 'name email');
        const count = await Blog.countDocuments({ tags: tag, status: 'published' });
        
        res.status(200).json({
            success: true,
            tag,
            count,
            blogs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Blog yazısına yorum ve puan ekle (YENI)
const createReview = async (req, res) => {
    try {
        const { blogId, comment, rating } = req.body;

        // Yorum objesi oluştur
        const review = {
            user: req.user._id,
            name: req.user.name,
            email: req.user.email,
            comment,
            rating: Number(rating)
        };

        // Blog'u bul
        const blog = await Blog.findById(blogId);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog yazısı bulunamadı"
            });
        }

        // Kullanıcı daha önce yorum yaptı mı kontrol et
        const isReviewed = blog.comments.find(
            rev => rev.user.toString() === req.user._id.toString()
        );

        if (isReviewed) {
            // Varolan yorumu güncelle
            blog.comments.forEach(rev => {
                if (rev.user.toString() === req.user._id.toString()) {
                    rev.comment = comment;
                    rev.rating = rating;
                }
            });
        } else {
            // Yeni yorum ekle
            blog.comments.push(review);
            blog.numOfReviews = blog.comments.length;
        }

        // Ortalama puanı hesapla
        let avg = 0;
        blog.comments.forEach(rev => {
            avg += rev.rating;
        });

        blog.rating = avg / blog.comments.length;

        // Kaydet
        await blog.save({ validateBeforeSave: false });

        res.status(200).json({
            success: true,
            message: "Yorumunuz başarıyla eklendi"
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
        req.body.author = req.user?._id;
        
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
        
        const comments = blog.comments.filter(
            comment => comment._id.toString() !== req.params.commentId.toString()
        );

        // Yorumları güncelle
        blog.comments = comments;
        
        // Yorum sayısını güncelle
        blog.numOfReviews = comments.length;

        // Ortalama puanı yeniden hesapla
        let avg = 0;
        comments.forEach(rev => {
            avg += rev.rating;
        });

        blog.rating = comments.length > 0 ? avg / comments.length : 0;

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
    topRatedBlogs,
    getBlogsByCategory,
    getBlogsByTag,
    createReview,
    likeBlog,
    
    // Admin
    createBlog,
    updateBlog,
    deleteBlog,
    publishBlog,
    approveComment,
    deleteComment
};
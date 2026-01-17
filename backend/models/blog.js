const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Blog başlığı gereklidir"],
      trim: true,
      maxlength: [200, "Başlık en fazla 200 karakter olabilir"]
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true
    },
    content: {
      type: String,
      required: [true, "Blog içeriği gereklidir"]
    },
    excerpt: {
      type: String,
      maxlength: [500, "Özet en fazla 500 karakter olabilir"]
    },
    coverImage: {
      public_id: String,
      url: String
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    category: {
      type: String,
      required: [true, "Kategori gereklidir"],
      enum: ["Teknoloji", "Sağlık", "Dünya", "Bilim", "Ekonomi", "Eğitim", "Spor", "Kültür", "Sanat"]
    },
    tags: [{
      type: String,
      lowercase: true,
      trim: true
    }],
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft"
    },
    featured: {
      type: Boolean,
      default: false
    },
    viewCount: {
      type: Number,
      default: 0
    },
    publishedAt: {
      type: Date,
      default: null
    },
    metaTitle: {
      type: String,
      maxlength: [70, "Meta title en fazla 70 karakter olabilir"]
    },
    metaDescription: {
      type: String,
      maxlength: [160, "Meta description en fazla 160 karakter olabilir"]
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Index'ler (performans için)
blogSchema.index({ slug: 1 });
blogSchema.index({ status: 1, publishedAt: -1 });
blogSchema.index({ category: 1 });
blogSchema.index({ tags: 1 });
blogSchema.index({ author: 1 });

// Virtuals
blogSchema.virtual('readingTime').get(function() {
  if (!this.content) return 0;
  const words = this.content.trim().split(/\s+/).length;
  return Math.ceil(words / 200); // 200 kelime/dakika
});

// Static methods
blogSchema.statics.findPublished = function() {
  return this.find({ status: 'published' }).sort({ publishedAt: -1 });
};

blogSchema.statics.findFeatured = function() {
  return this.find({ status: 'published', featured: true }).sort({ publishedAt: -1 });
};

blogSchema.statics.findByCategory = function(category) {
  return this.find({ status: 'published', category }).sort({ publishedAt: -1 });
};

// ÖNEMLİ: Model cache kontrolü
module.exports = mongoose.models.Blog || mongoose.model("Blog", blogSchema);

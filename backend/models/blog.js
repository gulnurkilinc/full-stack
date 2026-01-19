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
      index: true // ÖNEMLİ: Performans için index
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
      enum: {
        values: [
          "Teknoloji", 
          "Sağlık", 
          "Dünya", 
          "Bilim", 
          "Ekonomi", 
          "Eğitim", 
          "Spor", 
          "Kültür", 
          "Sanat",
          "Seyahat",
          "Yemek"
        ],
        message: '{VALUE} geçerli bir kategori değil'
      },
      index: true // ÖNEMLİ: Kategori sorguları için index
    },
    tags: [{
      type: String,
      lowercase: true,
      trim: true
    }],
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
      index: true
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

// Compound Index - Status + Category + PublishedAt (performans için)
blogSchema.index({ status: 1, category: 1, publishedAt: -1 });

// Virtual: Okunma süresi
blogSchema.virtual('readingTime').get(function() {
  if (!this.content) return 0;
  const words = this.content.trim().split(/\s+/).length;
  return Math.ceil(words / 200);
});

// Static method: Kategoriye göre blog sayısı
blogSchema.statics.countByCategory = async function() {
  return await this.aggregate([
    { $match: { status: 'published' } },
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);
};

module.exports = mongoose.models.Blog || mongoose.model("Blog", blogSchema);
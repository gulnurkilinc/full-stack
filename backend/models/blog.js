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
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// ÖNEMLİ: Slug middleware'ini kaldırdık
// Çünkü seed-blogs route'unda zaten slug veriyoruz
// Eğer otomatik slug istersen, slugify paketini yükle ve aşağıdaki kodu kullan

// Index'ler
blogSchema.index({ slug: 1 });
blogSchema.index({ status: 1, publishedAt: -1 });
blogSchema.index({ category: 1 });
blogSchema.index({ tags: 1 });

module.exports = mongoose.model("Blog", blogSchema);
const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
   title: {
      type: String,
      required: true,
      trim: true
   },
   slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
   },
   content: {
      type: String,
      required: true
   },
   excerpt: {
      type: String,
      required: true,
      maxlength: 200
   },
   category: {
      type: String,
      required: true,
      enum: ['Teknoloji', 'Sağlık', 'Eğitim', 'Spor', 'Ekonomi', 'Kültür', 'Dünya', 'Diğer']
   },
   tags: [
      {
         type: String,
         trim: true
      }
   ],
   coverImage: {
      public_id: {
         type: String,
         required: true
      },
      url: {
         type: String,
         required: true
      }
   },
   images: [
      {
         public_id: {
            type: String
         },
         url: {
            type: String
         }
      }
   ],
   author: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true
   },
   status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft'
   },
   views: {
      type: Number,
      default: 0
   },
   likes: {
      type: Number,
      default: 0
   },
   featured: {
      type: Boolean,
      default: false
   },
   publishedAt: {
      type: Date
   },
   comments: [
      {
         user: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: true
         },
         name: {
            type: String,
            required: true
         },
         email: {
            type: String,
            required: true
         },
         comment: {
            type: String,
            required: true
         },
         approved: {
            type: Boolean,
            default: false
         },
         createdAt: {
            type: Date,
            default: Date.now
         }
      }
   ]
}, { 
   timestamps: true 
});

// Slug'dan önce URL-friendly hale getir
blogSchema.pre('save', function(next) {
   if (this.isModified('title')) {
      this.slug = this.title
         .toLowerCase()
         .replace(/[^a-z0-9ğüşıöçĞÜŞİÖÇ\s-]/g, '')
         .replace(/\s+/g, '-')
         .replace(/-+/g, '-')
         .trim();
   }
   next();
});

module.exports = mongoose.model("Blog", blogSchema);
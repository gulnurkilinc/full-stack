const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Lütfen isminizi girin"],
        trim: true,
        maxLength: [50, "İsim en fazla 50 karakter olabilir"]
    },
    email: {
        type: String,
        required: [true, "Lütfen email adresinizi girin"],
        unique: true,
        lowercase: true,
        trim: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Lütfen geçerli bir email adresi girin"
        ]
    },
    password: {
        type: String,
        required: [true, "Lütfen şifrenizi girin"],
        minLength: [6, "Şifreniz en az 6 karakter olmalıdır"],
        select: false
    },
    avatar: {
        public_id: {
            type: String,
            default: "default_avatar"
        },
        url: {
            type: String,
            default: "https://ui-avatars.com/api/?name=User&background=007bff&color=fff&size=200"
        }
    },
    role: {
        type: String,
        enum: {
            values: ['user', 'author', 'admin'],
            message: 'Geçersiz rol: {VALUE}'
        },
        default: "user"
    },
    bio: {
        type: String,
        maxLength: [500, "Bio en fazla 500 karakter olabilir"],
        default: ""
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    emailVerificationToken: String,
    emailVerificationExpire: Date,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: {
        type: Date,
        default: null
    },
    socialLinks: {
        twitter: { type: String, default: "" },
        linkedin: { type: String, default: "" },
        github: { type: String, default: "" },
        website: { type: String, default: "" }
    }
}, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// ============================================
// MIDDLEWARE: Şifreyi hashle
// ============================================
userSchema.pre('save', async function(next) {
    // Şifre değişmediyse devam et
    if (!this.isModified('password')) {
        return next();
    }
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next(); // ← BURADA VAR
    } catch (error) {
        next(error);
    }
});

// ============================================
// MIDDLEWARE: Email değiştiğinde doğrulama sıfırla
// ============================================
userSchema.pre('save', function(next) {
    if (this.isModified('email') && !this.isNew) {
        this.isVerified = false;
    }
    next(); // ← BURADA OLMALI!
});

// ============================================
// METHODS: JWT Token oluştur
// ============================================
userSchema.methods.generateToken = function() {
    return jwt.sign(
        { 
            id: this._id,
            email: this.email,
            role: this.role
        }, 
        process.env.JWT_SECRET, 
        {
            expiresIn: process.env.JWT_EXPIRE || '7d'
        }
    );
};

// ============================================
// METHODS: Şifre kontrolü
// ============================================
userSchema.methods.comparePassword = async function(enteredPassword) {
    try {
        return await bcrypt.compare(enteredPassword, this.password);
    } catch (error) {
        throw new Error('Şifre karşılaştırma hatası');
    }
};

// ============================================
// METHODS: Şifre sıfırlama token'ı
// ============================================
userSchema.methods.getResetPasswordToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    return resetToken;
};

// ============================================
// METHODS: Email doğrulama token'ı
// ============================================
userSchema.methods.getEmailVerificationToken = function() {
    const verificationToken = crypto.randomBytes(32).toString('hex');
    this.emailVerificationToken = crypto
        .createHash('sha256')
        .update(verificationToken)
        .digest('hex');
    this.emailVerificationExpire = Date.now() + 24 * 60 * 60 * 1000;
    return verificationToken;
};

// ============================================
// METHODS: Son giriş güncelle
// ============================================
userSchema.methods.updateLastLogin = function() {
    this.lastLogin = new Date();
    return this.save({ validateBeforeSave: false });
};

// ============================================
// STATIC METHODS
// ============================================
userSchema.statics.findByEmailWithPassword = function(email) {
    return this.findOne({ email }).select('+password');
};

userSchema.statics.findActiveUsers = function() {
    return this.find({ isActive: true, isVerified: true });
};

userSchema.statics.findAdmins = function() {
    return this.find({ role: 'admin', isActive: true });
};

// ============================================
// VIRTUALS
// ============================================
userSchema.virtual('blogCount', {
    ref: 'Blog',
    localField: '_id',
    foreignField: 'author',
    count: true
});

// ============================================
// INDEXES
// ============================================
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1, isVerified: 1 });
userSchema.index({ createdAt: -1 });

// ============================================
// EXPORT
// ============================================
module.exports = mongoose.models.User || mongoose.model("User", userSchema);
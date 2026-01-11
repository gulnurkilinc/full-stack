const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Lütfen isminizi girin"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Lütfen email adresinizi girin"],
        unique: true,
        lowercase: true,
        trim: true
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
            default: "https://via.placeholder.com/150"
        }
    },
    role: {
        type: String,
        enum: ['user', 'author', 'admin'],
        default: "user"
    },
    bio: {
        type: String,
        maxLength: 500,
        default: ""
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
}, { timestamps: true });

// Şifreyi kaydetmeden önce hashle
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

// JWT Token oluştur
userSchema.methods.generateToken = function() {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '7d'
    });
};

// Şifre kontrolü
userSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Şifre sıfırlama token'ı oluştur
userSchema.methods.getResetPasswordToken = function() {
    // Token oluştur
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Token'ı hashle ve kaydet
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    // Token geçerlilik süresi (15 dakika)
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    return resetToken;
};

module.exports = mongoose.model("User", userSchema);
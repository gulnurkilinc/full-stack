const User = require("../models/user.js");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail.js");
const bcrypt = require('bcryptjs');
const { trackFailedLogin, clearFailedLogin } = require('../middleware/ipBlock');

// ============================================
// YARDIMCI: Şifre kural kontrolü
// ============================================
const validatePassword = (password) => {
    if (!password || password.length < 8) {
        return "Şifre en az 8 karakter olmalıdır";
    }
    if (!/[A-Z]/.test(password)) {
        return "Şifre en az 1 büyük harf içermelidir";
    }
    if (!/[a-z]/.test(password)) {
        return "Şifre en az 1 küçük harf içermelidir";
    }
    if (!/[0-9]/.test(password)) {
        return "Şifre en az 1 rakam içermelidir";
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
        return "Şifre en az 1 özel karakter içermelidir (!@#$%^&*)";
    }
    return null; // null = geçerli
};

// ============================================
// YARDIMCI: Geçici email engeli
// ============================================
const BLOCKED_EMAIL_DOMAINS = [
    'tempmail.com', 'guerrillamail.com', 'mailinator.com',
    'yopmail.com', 'throwaway.email', 'sharklasers.com',
    'trashmail.com', 'maildrop.cc'
];

const isBlockedEmail = (email) => {
    const domain = email.split('@')[1]?.toLowerCase();
    return BLOCKED_EMAIL_DOMAINS.includes(domain);
};

// ============================================
// Kullanıcı kaydı
// ============================================
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // ── Alan kontrolü ──────────────────────────
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Lütfen tüm alanları doldurun"
            });
        }

        // ── İsim kontrolü ──────────────────────────
        if (name.trim().length < 2) {
            return res.status(400).json({
                success: false,
                message: "İsim en az 2 karakter olmalıdır"
            });
        }

        // ── Geçici email kontrolü ───────────────────
        if (isBlockedEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Geçici email adresleri kabul edilmemektedir"
            });
        }

        // ── Şifre kural kontrolü ────────────────────
        const passwordError = validatePassword(password);
        if (passwordError) {
            return res.status(400).json({
                success: false,
                message: passwordError
            });
        }

        // ── Email tekrar kontrolü ───────────────────
        const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Bu email adresi zaten kayıtlı"
            });
        }

        // ── Kullanıcı oluştur ───────────────────────
        const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password,
    avatar: {
        public_id: "default_avatar",
        url: `https://ui-avatars.com/api/?name=${encodeURIComponent(name.trim())}&background=007bff&color=fff&size=200`
    }
});
        const verificationToken = user.getEmailVerificationToken();
await user.save({ validateBeforeSave: false });

const verifyUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;

try {
    await sendEmail({
        to: user.email,
        subject: 'Email Adresinizi Doğrulayın',
        html: `
            <h2>Merhaba ${user.name},</h2>
            <p>Hesabınızı doğrulamak için aşağıdaki linke tıklayın:</p>
            <a href="${verifyUrl}" style="background:#111827;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;margin:16px 0;">
                Email Adresimi Doğrula
            </a>
            <p>Bu link 24 saat geçerlidir.</p>
            <p>Bu isteği siz yapmadıysanız bu emaili görmezden gelebilirsiniz.</p>
        `
    });
} catch (emailError) {
    user.emailVerificationToken = undefined;
    user.emailVerificationExpire = undefined;
    await user.save({ validateBeforeSave: false });
}

const token = user.generateToken();

res.status(201).json({
    success: true,
    message: "Kayıt başarılı",
    user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
    },
    token
});

    } catch (error) {
        console.error('❌ Register HATA:', error.message);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// Kullanıcı girişi - Brute Force Korumalı
// ============================================
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Lütfen email ve şifrenizi girin"
            });
        }

        // loginAttempts ve lockUntil'i de getir
        const user = await User.findOne({ email })
    .select('+password +loginAttempts +lockUntil +twoFactorEnabled +twoFactorCode +twoFactorExpire');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Geçersiz email veya şifre"
            });
        }

        // ── Hesap aktif mi? ─────────────────────────
        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: "Hesabınız devre dışı bırakılmıştır. Destek ile iletişime geçin."
            });
        }

        // ── Hesap kilitli mi? ───────────────────────
        if (user.isLocked()) {
            const remainingMs = user.lockUntil - Date.now();
            const remainingMin = Math.ceil(remainingMs / 60000);
            return res.status(423).json({
                success: false,
                message: `Çok fazla hatalı deneme. ${remainingMin} dakika sonra tekrar deneyin.`
            });
        }

        // ── Şifre kontrolü ─────────────────────────
        const isPasswordMatched = await user.comparePassword(password);

        if (!isPasswordMatched) {
            await user.incrementLoginAttempts();
            trackFailedLogin(req.ip || req.connection.remoteAddress || '');

            const attemptsLeft = 5 - user.loginAttempts;
            const message = attemptsLeft > 0
                ? `Geçersiz email veya şifre. ${attemptsLeft} deneme hakkınız kaldı.`
                : "Çok fazla hatalı deneme. Hesabınız 15 dakika kilitlendi.";

            return res.status(401).json({
                success: false,
                message
            });
        }

        // ── Başarılı giriş → sıfırla ────────────────
        await user.resetLoginAttempts();

        await user.resetLoginAttempts();
console.log('2FA enabled:', user.twoFactorEnabled);

        clearFailedLogin(req.ip || req.connection.remoteAddress || '');

        const { rememberMe } = req.body;
const tokenExpire = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;

const token = user.generateToken(rememberMe);
const refreshToken = user.generateRefreshToken();

user.refreshToken = refreshToken;

// Cihaz bilgisi kaydet
const sessionId = crypto.randomBytes(16).toString('hex');
const userAgent = req.headers['user-agent'] || '';
const ip = req.ip || req.connection.remoteAddress || '';

// Basit tarayıcı/cihaz tespiti
const browser = userAgent.includes('Chrome') ? 'Chrome'
    : userAgent.includes('Firefox') ? 'Firefox'
    : userAgent.includes('Safari') ? 'Safari'
    : userAgent.includes('Edge') ? 'Edge'
    : 'Bilinmeyen Tarayıcı';

const device = userAgent.includes('Mobile') ? '📱 Mobil'
    : userAgent.includes('Tablet') ? '📱 Tablet'
    : '🖥️ Masaüstü';

// Max 5 oturum tut
if (user.sessions.length >= 5) {
    user.sessions.shift();
}

user.sessions.push({ sessionId, device, browser, ip });
await user.save({ validateBeforeSave: false });

res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
});

res.cookie('token', token, {
    httpOnly: true,
    expires: new Date(Date.now() + tokenExpire),
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
});

       // 2FA kontrolü
        if (user.twoFactorEnabled) {
            const code = Math.floor(100000 + Math.random() * 900000).toString();
            user.twoFactorCode = code;
            user.twoFactorExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 dakika
            await user.save({ validateBeforeSave: false });

            await sendEmail({
                to: user.email,
                subject: 'Giriş Doğrulama Kodu',
                html: `
                    <h2>Merhaba ${user.name},</h2>
                    <p>Giriş doğrulama kodunuz:</p>
                    <h1 style="letter-spacing: 8px; color: #111827;">${code}</h1>
                    <p>Bu kod <strong>10 dakika</strong> geçerlidir.</p>
                    <p>Bu isteği siz yapmadıysanız şifrenizi hemen değiştirin.</p>
                `
            });

            return res.status(200).json({
                success: true,
                twoFactorRequired: true,
                message: "Doğrulama kodu emailinize gönderildi",
                userId: user._id
            });
        }

        res.status(200).json({
            success: true,
            message: "Giriş başarılı",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                lastLogin: user.lastLogin,
                twoFactorEnabled: user.twoFactorEnabled
            },
            token
        });

    } catch (error) {
        console.error('❌ Login HATA:', error.message);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// Çıkış - Cookie temizle
// ============================================
const logout = async (req, res) => {
    try {
        // Refresh token'ı veritabanından sil
        if (req.user?.id) {
            await User.findByIdAndUpdate(req.user.id, { refreshToken: null });
        }

        res.cookie('token', '', {
            httpOnly: true,
            expires: new Date(0),
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });
        res.cookie('refreshToken', '', {
            httpOnly: true,
            expires: new Date(0),
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });
        res.status(200).json({ success: true, message: 'Başarıyla çıkış yapıldı' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ============================================
// Kullanıcı profili
// ============================================
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ============================================
// Profil güncelle
// ============================================
const updateProfile = async (req, res) => {
    try {
        const { name, email, bio, username } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ success: false, message: "Kullanıcı bulunamadı" });
        }

        // Avatar yükleme ← BURAYA EKLE
        if (req.file) {
            if (user.avatar?.public_id && user.avatar.public_id !== 'default_avatar') {
                const cloudinary = require('../config/cloudinary');
                await cloudinary.uploader.destroy(user.avatar.public_id);
            }
            user.avatar = {
                public_id: req.file.filename,
                url: req.file.path
            };
        }

        if (name) user.name = name.trim();
        if (email) user.email = email.toLowerCase().trim();
        if (bio !== undefined) user.bio = bio;
        if (username !== undefined) {
            if (username === '') {
                user.username = null;
            } else {
                const existing = await User.findOne({ username: username.toLowerCase().trim() });
                if (existing && existing._id.toString() !== req.user.id) {
                    return res.status(400).json({ success: false, message: "Bu kullanıcı adı zaten alınmış" });
                }
                user.username = username.toLowerCase().trim();
            }
        }

        await user.save();

        res.status(200).json({ success: true, message: "Profil güncellendi", user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ============================================
// Şifre değiştir
// ============================================
const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id).select('+password');

        if (!user) {
            return res.status(404).json({ success: false, message: "Kullanıcı bulunamadı" });
        }

        const isPasswordMatched = await user.comparePassword(oldPassword);
        if (!isPasswordMatched) {
            return res.status(400).json({ success: false, message: "Eski şifreniz yanlış" });
        }

        // Yeni şifre kural kontrolü
        const passwordError = validatePassword(newPassword);
        if (passwordError) {
            return res.status(400).json({ success: false, message: passwordError });
        }

        // Şifre geçmişi kontrolü
        for (const old of user.passwordHistory) {
            const isSame = await user.comparePassword(newPassword);
            if (isSame) {
                return res.status(400).json({ success: false, message: "Son 3 şifrenizden birini kullanamazsınız" });
            }
        }

        // Şifre geçmişine ekle (max 3 tut)
        user.passwordHistory.push({ password: user.password });
        if (user.passwordHistory.length > 3) {
            user.passwordHistory.shift();
        }

        user.password = newPassword;
        await user.save();

        res.status(200).json({ success: true, message: "Şifreniz başarıyla değiştirildi" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ============================================
// Şifre sıfırlama isteği
// ============================================
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Bu email adresi ile kayıtlı kullanıcı bulunamadı"
            });
        }

        const resetToken = user.getResetPasswordToken();
        await user.save({ validateBeforeSave: false });

        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        const message = `
            Merhaba ${user.name},
            
            Şifre sıfırlama talebiniz alındı. Şifrenizi sıfırlamak için aşağıdaki linke tıklayın:
            
            ${resetUrl}
            
            Bu linki talep etmediyseniz, bu e-postayı görmezden gelebilirsiniz.
            Bu link 15 dakika geçerlidir.
            
            İyi günler
        `;

        try {
            await sendEmail({
                to: user.email,
                subject: 'Şifre Sıfırlama Talebi',
                html: `<p>${message.replace(/\n/g, '<br>')}</p>`
            });

            res.status(200).json({
                success: true,
                message: `Şifre sıfırlama linki ${user.email} adresine gönderildi`
            });
        } catch (emailError) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save({ validateBeforeSave: false });

            return res.status(500).json({
                success: false,
                message: "Email gönderilemedi. Lütfen daha sonra tekrar deneyin"
            });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ============================================
// Şifreyi sıfırla
// ============================================
const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password, confirmPassword } = req.body;

        if (!password || !confirmPassword) {
            return res.status(400).json({ success: false, message: "Lütfen tüm alanları doldurun" });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ success: false, message: "Şifreler eşleşmiyor" });
        }

        // Şifre kural kontrolü
        const passwordError = validatePassword(password);
        if (passwordError) {
            return res.status(400).json({ success: false, message: passwordError });
        }

        const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "Geçersiz veya süresi dolmuş token" });
        }

        // Şifre geçmişi kontrolü
        for (const old of user.passwordHistory) {
            const isSame = await bcrypt.compare(password, old.password);
            if (isSame) {
                return res.status(400).json({ success: false, message: "Son 3 şifrenizden birini kullanamazsınız" });
            }
        }

        // Şifre geçmişine ekle (max 3 tut)
        user.passwordHistory.push({ password: user.password });
        if (user.passwordHistory.length > 3) {
            user.passwordHistory.shift();
        }

        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        const authToken = user.generateToken();

        userSchema.methods.generateRefreshToken = function() {
    return jwt.sign(
        { id: this._id },
        process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
        { expiresIn: '30d' }
    );
};

        res.cookie('token', authToken, {
            httpOnly: true,
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        res.status(200).json({
            success: true,
            message: "Şifreniz başarıyla değiştirildi",
            user: { id: user._id, name: user.name, email: user.email, role: user.role },
            token: authToken
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ============================================
// Kullanıcı profili (username ile - public)
// ============================================
const getUserByUsername = async (req, res) => {
    try {
        const username = req.params.username.toLowerCase();
const user = await User.findOne({ username })
            .select('name bio role avatar createdAt');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Kullanıcı bulunamadı"
            });
        }

        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ============================================
// Yazar olma başvurusu
// ============================================
const applyForAuthor = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: "Kullanıcı bulunamadı" });
        }
        if (user.role === 'author' || user.role === 'admin') {
            return res.status(400).json({ success: false, message: "Zaten yazar yetkisine sahipsiniz" });
        }
        res.status(200).json({
            success: true,
            message: "Yazar başvurunuz alındı. En kısa sürede değerlendirilecektir."
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ============================================
// ADMIN: Tüm kullanıcıları getir
// ============================================
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json({ success: true, count: users.length, users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ============================================
// ADMIN: Tek kullanıcı detayı
// ============================================
const getUserDetail = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: "Kullanıcı bulunamadı" });
        }
        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ============================================
// ADMIN: Kullanıcı rolü güncelle
// ============================================
const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: "Kullanıcı bulunamadı" });
        }
        user.role = role;
        await user.save();
        res.status(200).json({ success: true, message: "Kullanıcı rolü güncellendi", user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ============================================
// ADMIN: Kullanıcı sil
// ============================================
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: "Kullanıcı bulunamadı" });
        }
        await user.deleteOne();
        res.status(200).json({ success: true, message: "Kullanıcı silindi" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ============================================
// Refresh Token
// ============================================
const refreshToken = async (req, res) => {
    try {
        const token = req.cookies.refreshToken;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Refresh token bulunamadı"
            });
        }

        // Token'ı doğrula
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);

        // Kullanıcıyı bul ve token'ı kontrol et
        const user = await User.findById(decoded.id);

        if (!user || user.refreshToken !== token) {
            return res.status(401).json({
                success: false,
                message: "Geçersiz refresh token"
            });
        }

        // Yeni access token oluştur
        const newToken = user.generateToken();

        res.status(200).json({
            success: true,
            token: newToken
        });

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Refresh token geçersiz veya süresi dolmuş"
        });
    }
};

// ============================================
// Oturumları getir
// ============================================
const getSessions = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json({ success: true, sessions: user.sessions });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ============================================
// Oturumu sil
// ============================================
const deleteSession = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        user.sessions = user.sessions.filter(s => s.sessionId !== req.params.sessionId);
        await user.save({ validateBeforeSave: false });
        res.status(200).json({ success: true, message: "Oturum kapatıldı" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
// ============================================
// Email doğrulama
// ============================================
const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;

        const emailVerificationToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        const user = await User.findOne({
            emailVerificationToken,
            emailVerificationExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Geçersiz veya süresi dolmuş doğrulama linki"
            });
        }

        user.isVerified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationExpire = undefined;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Email adresiniz başarıyla doğrulandı"
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ============================================
// 2FA Kodu Doğrula
// ============================================
const verifyLoginCode = async (req, res) => {
    try {
        const { userId, code } = req.body;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "Kullanıcı bulunamadı" });
        }

        if (!user.twoFactorCode || user.twoFactorExpire < Date.now()) {
            return res.status(400).json({ success: false, message: "Kod süresi dolmuş. Tekrar giriş yapın." });
        }

        if (user.twoFactorCode !== code) {
            return res.status(400).json({ success: false, message: "Geçersiz kod" });
        }

        // Kodu temizle
        user.twoFactorCode = null;
        user.twoFactorExpire = null;

        const token = user.generateToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        res.status(200).json({
            success: true,
            message: "Giriş başarılı",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                lastLogin: user.lastLogin
            },
            token
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ============================================
// 2FA Aç/Kapat
// ============================================
const toggle2FA = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ success: false, message: "Kullanıcı bulunamadı" });
        }

        user.twoFactorEnabled = !user.twoFactorEnabled;
        await user.save({ validateBeforeSave: false });

        res.status(200).json({
            success: true,
            message: user.twoFactorEnabled ? "2FA aktif edildi" : "2FA devre dışı bırakıldı",
            twoFactorEnabled: user.twoFactorEnabled
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getStats = async (req, res) => {
    try {
        const Blog = require('../models/blog.js');

        const totalUsers = await User.countDocuments();
        const totalBlogs = await Blog.countDocuments();
        const publishedBlogs = await Blog.countDocuments({ status: 'published' });

        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        const newUsersThisMonth = await User.countDocuments({ createdAt: { $gte: startOfMonth } });

        const userCount   = await User.countDocuments({ role: 'user' });
        const authorCount = await User.countDocuments({ role: 'author' });
        const adminCount  = await User.countDocuments({ role: 'admin' });

        const recentUsers = await User.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('name email role avatar createdAt');

        const topBlogs = await Blog.find({ status: 'published' })
            .sort({ views: -1 })
            .limit(5)
            .select('title slug views createdAt');

        res.status(200).json({
            success: true,
            stats: {
                totalUsers,
                totalBlogs,
                publishedBlogs,
                newUsersThisMonth,
                roles: { user: userCount, author: authorCount, admin: adminCount },
                recentUsers,
                topBlogs
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    register,
    login,
    logout,
    getProfile,
    updateProfile,
    changePassword,
    applyForAuthor,
    forgotPassword,
    resetPassword,
    getAllUsers,
    getUserDetail,
    updateUserRole,
    deleteUser,
    getUserByUsername,
    verifyEmail,
    refreshToken,
    getSessions,
    deleteSession,
    verifyLoginCode,
    toggle2FA,
    getStats
};
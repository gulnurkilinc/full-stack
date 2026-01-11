const User = require("../models/user.js");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail.js");

// Kullanıcı kaydı
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Email kontrolü
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                success: false,
                message: "Bu email adresi zaten kayıtlı"
            });
        }

        // Kullanıcı oluştur
        user = await User.create({
            name,
            email,
            password,
            avatar: {
                public_id: "default_avatar",
                url: "https://via.placeholder.com/150"
            }
        });

        // Token oluştur
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
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Kullanıcı girişi (güncellenmiş)
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Lütfen email ve şifrenizi girin"
            });
        }

        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Geçersiz email veya şifre"
            });
        }

        const isPasswordMatched = await user.comparePassword(password);

        if (!isPasswordMatched) {
            return res.status(401).json({
                success: false,
                message: "Geçersiz email veya şifre"
            });
        }

        const token = user.generateToken();

        // Cookie'ye token ekle
        res.cookie('token', token, {
            httpOnly: true,
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 gün
            secure: process.env.NODE_ENV === 'production'
        });

        res.status(200).json({
            success: true,
            message: "Giriş başarılı",
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
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Çıkış
const logout = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            message: "Başarıyla çıkış yapıldı"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Kullanıcı profili
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Profil güncelle
const updateProfile = async (req, res) => {
    try {
        const { name, email, bio } = req.body;

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Kullanıcı bulunamadı"
            });
        }

        if (name) user.name = name;
        if (email) user.email = email;
        if (bio) user.bio = bio;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Profil güncellendi",
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Şifre değiştir
const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        const user = await User.findById(req.user.id).select('+password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Kullanıcı bulunamadı"
            });
        }

        // Eski şifre kontrolü
        const isPasswordMatched = await user.comparePassword(oldPassword);

        if (!isPasswordMatched) {
            return res.status(400).json({
                success: false,
                message: "Eski şifreniz yanlış"
            });
        }

        user.password = newPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Şifreniz başarıyla değiştirildi"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};





// Şifre sıfırlama isteği (email gönder)
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

        // Reset token oluştur
        const resetToken = user.getResetPasswordToken();

        await user.save({ validateBeforeSave: false });

        // Reset URL oluştur
        const resetUrl = `${req.protocol}://${req.get('host')}/api/password/reset/${resetToken}`;
        
        // Frontend kullanıyorsanız:
        // const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        const message = `
            Merhaba ${user.name},
            
            Şifre sıfırlama talebiniz alındı. Şifrenizi sıfırlamak için aşağıdaki linke tıklayın:
            
            ${resetUrl}
            
            Bu linki talep etmediyseniz, bu e-postayı görmezden gelebilirsiniz.
            
            Bu link 15 dakika geçerlidir.
            
            İyi günler,
            Blog Ekibi
        `;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Şifre Sıfırlama Talebi',
                message
            });

            res.status(200).json({
                success: true,
                message: `Şifre sıfırlama linki ${user.email} adresine gönderildi`
            });
        } catch (error) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;

            await user.save({ validateBeforeSave: false });

            return res.status(500).json({
                success: false,
                message: "Email gönderilemedi. Lütfen daha sonra tekrar deneyin"
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Şifreyi sıfırla
const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password, confirmPassword } = req.body;

        // Şifreleri kontrol et
        if (!password || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Lütfen tüm alanları doldurun"
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Şifreler eşleşmiyor"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Şifre en az 6 karakter olmalıdır"
            });
        }

        // Token'ı hashle
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        // Kullanıcıyı bul
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Geçersiz veya süresi dolmuş token"
            });
        }

        // Yeni şifreyi kaydet
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        // Token oluştur ve giriş yap
        const authToken = user.generateToken();

        res.cookie('token', authToken, {
            httpOnly: true,
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            secure: process.env.NODE_ENV === 'production'
        });

        res.status(200).json({
            success: true,
            message: "Şifreniz başarıyla değiştirildi",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            token: authToken
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};






// Yazar olma başvurusu
const applyForAuthor = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Kullanıcı bulunamadı"
            });
        }

        if (user.role === 'author' || user.role === 'admin') {
            return res.status(400).json({
                success: false,
                message: "Zaten yazar yetkisine sahipsiniz"
            });
        }

        res.status(200).json({
            success: true,
            message: "Yazar başvurunuz alındı. En kısa sürede değerlendirilecektir."
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ============= ADMIN İŞLEMLERİ =============

// Tüm kullanıcıları getir
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();

        res.status(200).json({
            success: true,
            count: users.length,
            users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Tek kullanıcı detayı
const getUserDetail = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Kullanıcı bulunamadı"
            });
        }

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Kullanıcı rolü güncelle (Admin)
const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Kullanıcı bulunamadı"
            });
        }

        user.role = role;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Kullanıcı rolü güncellendi",
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Kullanıcı sil (Admin)
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Kullanıcı bulunamadı"
            });
        }

        await user.deleteOne();

        res.status(200).json({
            success: true,
            message: "Kullanıcı silindi"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
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
    
    // Admin
    getAllUsers,
    getUserDetail,
    updateUserRole,
    deleteUser
};
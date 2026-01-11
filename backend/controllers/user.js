const User = require("../models/user.js");

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

// Kullanıcı girişi
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Email ve şifre kontrolü
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Lütfen email ve şifrenizi girin"
            });
        }

        // Kullanıcıyı bul (şifre ile birlikte)
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Geçersiz email veya şifre"
            });
        }

        // Şifre kontrolü
        const isPasswordMatched = await user.comparePassword(password);

        if (!isPasswordMatched) {
            return res.status(401).json({
                success: false,
                message: "Geçersiz email veya şifre"
            });
        }

        // Token oluştur
        const token = user.generateToken();

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
    
    // Admin
    getAllUsers,
    getUserDetail,
    updateUserRole,
    deleteUser
};
const KanunTeklifi = require("../models/KanunTeklifi");
const Parti = require("../models/Parti");
const Milletvekili = require("../models/Milletvekili");
const MvOy = require("../models/MvOy");
const KullaniciOy = require("../models/KullaniciOy");

// ============================================
// GENEL İŞLEMLER (PUBLIC)
// ============================================

// Tüm kanun tekliflerini listele
const getAllProposals = async (req, res) => {
    try {
        const { kategori, durum, page = 1, limit = 10, sort = '-gorusulmeTarihi' } = req.query;
        
        const query = { aktif: true };
        
        if (kategori) query.kategori = kategori;
        if (durum) query.durum = durum;
        
        const skip = (page - 1) * limit;
        
        const [proposals, total] = await Promise.all([
            KanunTeklifi.find(query)
                .sort(sort)
                .skip(skip)
                .limit(parseInt(limit)),
            KanunTeklifi.countDocuments(query)
        ]);
        
        res.status(200).json({
            success: true,
            count: proposals.length,
            total,
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit),
            proposals
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Tek bir kanun teklifinin detayını getir (ID ile)
const getProposalById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const teklif = await KanunTeklifi.findById(id);
        
        if (!teklif) {
            return res.status(404).json({
                success: false,
                message: "Kanun teklifi bulunamadı"
            });
        }
        
        // Parti bazlı oy dağılımı
        const partiOylari = await MvOy.getPartyVotingStats(id);
        
        // Milletvekili oyları
        const mvOylari = await MvOy.findByProposal(id);
        
        // Toplum oyları istatistikleri
        const toplumOyStats = await KullaniciOy.getVotingStats(id);
        
        res.status(200).json({
            success: true,
            teklif,
            partiOylari,
            mvOylari,
            toplumOylari: toplumOyStats.voteCounts,
            toplumOyYuzdeleri: toplumOyStats.percentages,
            toplamToplumOyu: toplumOyStats.totalVotes
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Slug ile kanun teklifi getir
const getProposalBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        
        const teklif = await KanunTeklifi.findBySlug(slug);
        
        if (!teklif) {
            return res.status(404).json({
                success: false,
                message: "Kanun teklifi bulunamadı"
            });
        }
        
        // Parti bazlı oy dağılımı
        const partiOylari = await MvOy.getPartyVotingStats(teklif._id);
        
        // Milletvekili oyları
        const mvOylari = await MvOy.findByProposal(teklif._id);
        
        // Toplum oyları istatistikleri
        const toplumOyStats = await KullaniciOy.getVotingStats(teklif._id);
        
        res.status(200).json({
            success: true,
            teklif,
            partiOylari,
            mvOylari,
            toplumOylari: toplumOyStats.voteCounts,
            toplumOyYuzdeleri: toplumOyStats.percentages,
            toplamToplumOyu: toplumOyStats.totalVotes
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Kategoriye göre kanun tekliflerini getir
const getProposalsByCategory = async (req, res) => {
    try {
        const { kategori } = req.params;
        
        const proposals = await KanunTeklifi.findByCategory(kategori);
        
        res.status(200).json({
            success: true,
            kategori,
            count: proposals.length,
            proposals
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Duruma göre kanun tekliflerini getir
const getProposalsByStatus = async (req, res) => {
    try {
        const { durum } = req.params;
        
        const proposals = await KanunTeklifi.findByStatus(durum);
        
        res.status(200).json({
            success: true,
            durum,
            count: proposals.length,
            proposals
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// KULLANICI OY İŞLEMLERİ (AUTH REQUIRED)
// ============================================

// Kullanıcının oy durumunu kontrol et
const checkUserVoteStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const kullaniciId = req.user._id;
        
        const oy = await KullaniciOy.getUserVote(id, kullaniciId);
        
        if (oy) {
            return res.status(200).json({
                success: true,
                voted: true,
                voteType: oy.oyTipi,
                votedAt: oy.oyZamani
            });
        }
        
        res.status(200).json({
            success: true,
            voted: false
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Kullanıcı oyu kaydet
const submitUserVote = async (req, res) => {
    try {
        const { id } = req.params;
        const kullaniciId = req.user._id;
        const { oyTipi } = req.body;
        
        // Validasyon
        if (!['kabul', 'ret', 'cekimser'].includes(oyTipi)) {
            return res.status(400).json({
                success: false,
                message: 'Geçersiz oy tipi. Kabul edilenler: kabul, ret, cekimser'
            });
        }
        
        // Teklif var mı kontrol et
        const teklif = await KanunTeklifi.findById(id);
        if (!teklif) {
            return res.status(404).json({
                success: false,
                message: "Kanun teklifi bulunamadı"
            });
        }
        
        // Daha önce oy kullanmış mı kontrol et
        const mevcutOy = await KullaniciOy.getUserVote(id, kullaniciId);
        
        if (mevcutOy) {
            return res.status(403).json({
                success: false,
                message: 'Bu teklife zaten oy kullandınız',
                voted: true,
                existingVote: mevcutOy.oyTipi
            });
        }
        
        // IP kontrolü (opsiyonel - ekstra güvenlik)
        const ipAdresi = req.ip || req.connection.remoteAddress;
        const ipVoted = await KullaniciOy.hasIPVoted(id, ipAdresi);
        
        if (ipVoted) {
            return res.status(403).json({
                success: false,
                message: 'Bu IP adresinden son 24 saat içinde oy kullanıldı',
                ipBlocked: true
            });
        }
        
        // Yeni oy oluştur
        const yeniOy = await KullaniciOy.create({
            teklif: id,
            kullanici: kullaniciId,
            oyTipi,
            ipAdresi,
            userAgent: req.headers['user-agent']
        });
        
        // Güncel istatistikleri getir
        const toplumOyStats = await KullaniciOy.getVotingStats(id);
        
        res.status(201).json({
            success: true,
            message: 'Oyunuz başarıyla kaydedildi',
            userVote: oyTipi,
            toplumOylari: toplumOyStats.voteCounts,
            toplumOyYuzdeleri: toplumOyStats.percentages,
            toplamToplumOyu: toplumOyStats.totalVotes
        });
    } catch (error) {
        // Duplicate key error (zaten oy kullanmış)
        if (error.code === 11000) {
            return res.status(403).json({
                success: false,
                message: 'Bu teklife zaten oy kullandınız',
                voted: true
            });
        }
        
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Kullanıcının oy geçmişini getir
const getUserVotingHistory = async (req, res) => {
    try {
        const kullaniciId = req.user._id;
        
        const votingHistory = await KullaniciOy.getUserVotingHistory(kullaniciId);
        
        res.status(200).json({
            success: true,
            count: votingHistory.length,
            votingHistory
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// ADMIN İŞLEMLERİ
// ============================================

// Kanun teklifi oluştur
const createProposal = async (req, res) => {
    try {
        const proposal = await KanunTeklifi.create(req.body);
        
        res.status(201).json({
            success: true,
            message: 'Kanun teklifi başarıyla oluşturuldu',
            proposal
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Kanun teklifini güncelle
const updateProposal = async (req, res) => {
    try {
        const { id } = req.params;
        
        const proposal = await KanunTeklifi.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!proposal) {
            return res.status(404).json({
                success: false,
                message: "Kanun teklifi bulunamadı"
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Kanun teklifi başarıyla güncellendi',
            proposal
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Kanun teklifini sil (soft delete)
const deleteProposal = async (req, res) => {
    try {
        const { id } = req.params;
        
        const proposal = await KanunTeklifi.findByIdAndUpdate(
            id,
            { aktif: false },
            { new: true }
        );
        
        if (!proposal) {
            return res.status(404).json({
                success: false,
                message: "Kanun teklifi bulunamadı"
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Kanun teklifi başarıyla silindi'
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
    getAllProposals,
    getProposalById,
    getProposalBySlug,
    getProposalsByCategory,
    getProposalsByStatus,
    
    // Kullanıcı Oy İşlemleri
    checkUserVoteStatus,
    submitUserVote,
    getUserVotingHistory,
    
    // Admin
    createProposal,
    updateProposal,
    deleteProposal
};
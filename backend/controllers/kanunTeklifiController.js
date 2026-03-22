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
        console.error('❌ getAllProposals hatası:', error);
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
        
        console.log('📝 getProposalById çağrıldı');
        console.log('🆔 Teklif ID:', id);
        
        // ID formatı kontrolü
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            console.log('❌ Geçersiz ID formatı');
            return res.status(400).json({
                success: false,
                message: "Geçersiz ID formatı"
            });
        }
        
        console.log('🔍 Teklif aranıyor...');
        const teklif = await KanunTeklifi.findById(id);
        
        if (!teklif) {
            console.log('❌ Teklif bulunamadı');
            return res.status(404).json({
                success: false,
                message: "Kanun teklifi bulunamadı"
            });
        }
        
        console.log('✅ Teklif bulundu:', teklif.baslik);
        
        // Parti bazlı oy dağılımı
        console.log('🎨 Parti oyları getiriliyor...');
        const partiOylari = await MvOy.getPartyVotingStats(id);
        console.log('✅ Parti oyları:', partiOylari.length, 'parti');
        
        // Milletvekili oyları
        console.log('👥 MV oyları getiriliyor...');
        const mvOylari = await MvOy.findByProposal(id);
        console.log('✅ MV oyları:', mvOylari.length, 'oy');
        
        // Toplum oyları istatistikleri
        console.log('📊 Toplum oyları getiriliyor...');
        const toplumOyStats = await KullaniciOy.getVotingStats(id);
        console.log('✅ Toplum oyları:', toplumOyStats.totalVotes, 'oy');
        
        console.log('🎉 Response hazırlanıyor...');
        res.status(200).json({
            success: true,
            teklif,
            partiOylari,
            mvOylari,
            toplumOylari: toplumOyStats.voteCounts,
            toplumOyYuzdeleri: toplumOyStats.percentages,
            toplamToplumOyu: toplumOyStats.totalVotes
        });
        console.log('✅ Response gönderildi!');
    } catch (error) {
        console.error('❌ getProposalById hatası:', error.message);
        console.error('Stack:', error.stack);
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
        
        console.log('📝 getProposalBySlug çağrıldı, slug:', slug);
        
        const teklif = await KanunTeklifi.findBySlug(slug);
        
        if (!teklif) {
            console.log('❌ Teklif bulunamadı (slug)');
            return res.status(404).json({
                success: false,
                message: "Kanun teklifi bulunamadı"
            });
        }
        
        console.log('✅ Teklif bulundu (slug):', teklif.baslik);
        
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
        console.error('❌ getProposalBySlug hatası:', error);
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
        
        console.log('📝 getProposalsByCategory çağrıldı, kategori:', kategori);
        
        const proposals = await KanunTeklifi.find({ 
            kategori, 
            aktif: true 
        }).sort({ gorusulmeTarihi: -1 });
        
        res.status(200).json({
            success: true,
            kategori,
            count: proposals.length,
            proposals
        });
    } catch (error) {
        console.error('❌ getProposalsByCategory hatası:', error);
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
        
        console.log('📝 getProposalsByStatus çağrıldı, durum:', durum);
        
        const proposals = await KanunTeklifi.find({ 
            durum, 
            aktif: true 
        }).sort({ gorusulmeTarihi: -1 });
        
        res.status(200).json({
            success: true,
            durum,
            count: proposals.length,
            proposals
        });
    } catch (error) {
        console.error('❌ getProposalsByStatus hatası:', error);
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
        
        console.log('📝 checkUserVoteStatus çağrıldı, teklif:', id, 'kullanıcı:', kullaniciId);
        
        const oy = await KullaniciOy.getUserVote(id, kullaniciId);
        
        if (oy) {
            console.log('✅ Kullanıcı daha önce oy kullanmış:', oy.oyTipi);
            return res.status(200).json({
                success: true,
                voted: true,
                voteType: oy.oyTipi,
                votedAt: oy.oyZamani
            });
        }
        
        console.log('✅ Kullanıcı henüz oy kullanmamış');
        res.status(200).json({
            success: true,
            voted: false
        });
    } catch (error) {
        console.error('❌ checkUserVoteStatus hatası:', error);
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
        
        console.log('📝 submitUserVote çağrıldı');
        console.log('Teklif:', id, 'Kullanıcı:', kullaniciId, 'Oy:', oyTipi);
        
        // Validasyon
        if (!['kabul', 'ret', 'cekimser'].includes(oyTipi)) {
            console.log('❌ Geçersiz oy tipi');
            return res.status(400).json({
                success: false,
                message: 'Geçersiz oy tipi. Kabul edilenler: kabul, ret, cekimser'
            });
        }
        
        // Teklif var mı kontrol et
        const teklif = await KanunTeklifi.findById(id);
        if (!teklif) {
            console.log('❌ Teklif bulunamadı');
            return res.status(404).json({
                success: false,
                message: "Kanun teklifi bulunamadı"
            });
        }
        
        // Daha önce oy kullanmış mı kontrol et
        const mevcutOy = await KullaniciOy.getUserVote(id, kullaniciId);
        
        if (mevcutOy) {
            console.log('❌ Kullanıcı zaten oy kullanmış');
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
            console.log('❌ Bu IP son 24 saatte oy kullanmış');
            return res.status(403).json({
                success: false,
                message: 'Bu IP adresinden son 24 saat içinde oy kullanıldı',
                ipBlocked: true
            });
        }
        
        // Yeni oy oluştur
        console.log('✅ Oy kaydediliyor...');
        const yeniOy = await KullaniciOy.create({
            teklif: id,
            kullanici: kullaniciId,
            oyTipi,
            ipAdresi,
            userAgent: req.headers['user-agent']
        });
        
        console.log('✅ Oy kaydedildi!');
        
        // Güncel istatistikleri getir
        const toplumOyStats = await KullaniciOy.getVotingStats(id);
        
        // ✅ YENİ: Socket.io ile tüm bağlı kullanıcılara bildir
        const io = req.app.get('io');
        if (io) {
            io.emit('voteUpdate', {
                teklifId: id,
                toplumOylari: toplumOyStats.voteCounts,
                toplamToplumOyu: toplumOyStats.totalVotes,
                yeniOy: oyTipi
            });
            console.log('📡 Socket.io: Oy güncellemesi yayınlandı');
        }
        
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
            console.log('❌ Duplicate key error (zaten oy kullanmış)');
            return res.status(403).json({
                success: false,
                message: 'Bu teklife zaten oy kullandınız',
                voted: true
            });
        }
        
        console.error('❌ submitUserVote hatası:', error);
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
        
        console.log('📝 getUserVotingHistory çağrıldı, kullanıcı:', kullaniciId);
        
        const votingHistory = await KullaniciOy.getUserVotingHistory(kullaniciId);
        
        console.log('✅ Oy geçmişi bulundu:', votingHistory.length, 'oy');
        
        res.status(200).json({
            success: true,
            count: votingHistory.length,
            votingHistory
        });
    } catch (error) {
        console.error('❌ getUserVotingHistory hatası:', error);
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
        console.log('📝 createProposal çağrıldı');
        
        const proposal = await KanunTeklifi.create(req.body);
        
        console.log('✅ Teklif oluşturuldu:', proposal.baslik);
        
        res.status(201).json({
            success: true,
            message: 'Kanun teklifi başarıyla oluşturuldu',
            proposal
        });
    } catch (error) {
        console.error('❌ createProposal hatası:', error);
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
        
        console.log('📝 updateProposal çağrıldı, ID:', id);
        
        const proposal = await KanunTeklifi.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!proposal) {
            console.log('❌ Teklif bulunamadı');
            return res.status(404).json({
                success: false,
                message: "Kanun teklifi bulunamadı"
            });
        }
        
        console.log('✅ Teklif güncellendi:', proposal.baslik);
        
        res.status(200).json({
            success: true,
            message: 'Kanun teklifi başarıyla güncellendi',
            proposal
        });
    } catch (error) {
        console.error('❌ updateProposal hatası:', error);
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
        
        console.log('📝 deleteProposal çağrıldı, ID:', id);
        
        const proposal = await KanunTeklifi.findByIdAndUpdate(
            id,
            { aktif: false },
            { new: true }
        );
        
        if (!proposal) {
            console.log('❌ Teklif bulunamadı');
            return res.status(404).json({
                success: false,
                message: "Kanun teklifi bulunamadı"
            });
        }
        
        console.log('✅ Teklif silindi (soft delete):', proposal.baslik);
        
        res.status(200).json({
            success: true,
            message: 'Kanun teklifi başarıyla silindi'
        });
    } catch (error) {
        console.error('❌ deleteProposal hatası:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// Milletvekili oylarını Excel/CSV ile içe aktar
// ============================================
const importMilletvekilOylari = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Lütfen bir Excel veya CSV dosyası yükleyin'
            });
        }

        const XLSX = require('xlsx');
        
        // Dosyayı oku
        const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(sheet);

        if (rows.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Dosya boş veya okunamıyor'
            });
        }

        // Teklif var mı kontrol et
        const teklif = await KanunTeklifi.findById(id);
        if (!teklif) {
            return res.status(404).json({
                success: false,
                message: 'Kanun teklifi bulunamadı'
            });
        }

        // Eski milletvekili oylarını ve milletvekillerini temizle
        await MvOy.deleteMany({ teklif: id });
        await Milletvekili.deleteMany({});

        let basarili = 0;
        let hatali = 0;
        const hatalar = [];

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];

            try {
                // Kolon isimlerini normalize et
                const adSoyad = row['Ad Soyad'] || row['adSoyad'] || row['ad_soyad'] || row['İsim'] || '';
                const partiKod = row['Parti'] || row['parti'] || row['Parti Kodu'] || '';
                const il = row['İl'] || row['il'] || row['Şehir'] || '';
                const oyTipi = (row['Oy'] || row['oy'] || row['Oy Tipi'] || 'katilmayan').toLowerCase().trim();

                if (!adSoyad) {
                    hatali++;
                    hatalar.push(`Satır ${i + 2}: Ad Soyad boş`);
                    continue;
                }

                // Oy tipini doğrula
                const gecerliOylar = ['kabul', 'ret', 'cekimser', 'katilmayan'];
                const normalizedOy = gecerliOylar.includes(oyTipi) ? oyTipi : 'katilmayan';

                // Parti bul veya oluştur
                let parti = await Parti.findOne({ 
                    $or: [
                        { kod: partiKod.toUpperCase() },
                        { ad: partiKod }
                    ]
                });

                if (!parti && partiKod) {
                    parti = await Parti.create({
                        kod: partiKod.toUpperCase().slice(0, 10),
                        ad: partiKod,
                        renk: '#95A5A6',
                        toplamMV: 1
                    });
                }

                // Milletvekili oluştur
                const mv = await Milletvekili.create({
                    adSoyad: adSoyad.trim(),
                    parti: parti?._id || null,
                    il: il.trim() || 'Bilinmeyen',
                    koltukIndex: i
                });

                // Oy oluştur
                await MvOy.create({
                    teklif: id,
                    milletvekili: mv._id,
                    oyTipi: normalizedOy,
                    oyZamani: teklif.gorusulmeTarihi || new Date()
                });

                basarili++;
            } catch (rowError) {
                hatali++;
                hatalar.push(`Satır ${i + 2}: ${rowError.message}`);
            }
        }

        // Teklif oy sayılarını güncelle
        await teklif.updateVoteCount();

        res.status(200).json({
            success: true,
            message: `${basarili} milletvekili oyu başarıyla içe aktarıldı`,
            basarili,
            hatali,
            hatalar: hatalar.slice(0, 10) // İlk 10 hatayı göster
        });

    } catch (error) {
        console.error('❌ importMilletvekilOylari hatası:', error);
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
    deleteProposal,
    importMilletvekilOylari
};
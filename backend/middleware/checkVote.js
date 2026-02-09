const KullaniciOy = require("../models/KullaniciOy");

// Kullanıcının daha önce oy kullanıp kullanmadığını kontrol et
exports.checkIfUserVoted = async (req, res, next) => {
    try {
        const { id } = req.params; // teklif ID
        const kullaniciId = req.user._id;
        
        const existingVote = await KullaniciOy.getUserVote(id, kullaniciId);
        
        if (existingVote) {
            return res.status(403).json({
                success: false,
                message: 'Bu teklife zaten oy kullandınız',
                voted: true,
                voteType: existingVote.oyTipi,
                votedAt: existingVote.oyZamani
            });
        }
        
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Oy kontrolü yapılırken bir hata oluştu',
            error: error.message
        });
    }
};

// IP bazlı oy kontrolü (opsiyonel - ekstra güvenlik)
exports.checkIPVote = async (req, res, next) => {
    try {
        const { id } = req.params; // teklif ID
        const ipAdresi = req.ip || req.connection.remoteAddress;
        
        const ipVoted = await KullaniciOy.hasIPVoted(id, ipAdresi);
        
        if (ipVoted) {
            return res.status(403).json({
                success: false,
                message: 'Bu IP adresinden son 24 saat içinde oy kullanıldı',
                ipBlocked: true
            });
        }
        
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'IP kontrolü yapılırken bir hata oluştu',
            error: error.message
        });
    }
};

// Oy tipini validate et
exports.validateVoteType = (req, res, next) => {
    const { oyTipi } = req.body;
    
    if (!oyTipi) {
        return res.status(400).json({
            success: false,
            message: 'Oy tipi gereklidir'
        });
    }
    
    const validVoteTypes = ['kabul', 'ret', 'cekimser'];
    
    if (!validVoteTypes.includes(oyTipi)) {
        return res.status(400).json({
            success: false,
            message: `Geçersiz oy tipi. Kabul edilenler: ${validVoteTypes.join(', ')}`
        });
    }
    
    next();
};
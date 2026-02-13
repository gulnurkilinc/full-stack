const mongoose = require("mongoose");

const kullaniciOySchema = new mongoose.Schema({
    teklif: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'KanunTeklifi',
        required: [true, "Teklif bilgisi gereklidir"]
    },
    kullanici: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Kullanıcı bilgisi gereklidir"]
    },
    oyTipi: {
        type: String,
        required: [true, "Oy tipi gereklidir"],
        enum: {
            values: ['kabul', 'ret', 'cekimser'],
            message: 'Geçersiz oy tipi: {VALUE}'
        }
    },
    ipAdresi: {
        type: String,
        required: false
    },
    userAgent: {
        type: String,
        required: false
    },
    oyZamani: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

kullaniciOySchema.index({ teklif: 1, kullanici: 1 }, { unique: true });
kullaniciOySchema.index({ teklif: 1, oyTipi: 1 });
kullaniciOySchema.index({ kullanici: 1 });
kullaniciOySchema.index({ oyZamani: -1 });
kullaniciOySchema.index({ teklif: 1, ipAdresi: 1 });

kullaniciOySchema.statics.findByProposal = function(teklifId) {
    return this.find({ teklif: teklifId })
        .populate('kullanici', 'name email')
        .sort({ oyZamani: -1 });
};

kullaniciOySchema.statics.countByProposal = async function(teklifId) {
    // ✅ DÜZELTME: new mongoose.Types.ObjectId(teklifId) kullan
    const votes = await this.aggregate([
        { $match: { teklif: new mongoose.Types.ObjectId(teklifId) } },
        { $group: { _id: '$oyTipi', count: { $sum: 1 } } }
    ]);
    
    const result = { kabul: 0, ret: 0, cekimser: 0 };
    votes.forEach(vote => {
        result[vote._id] = vote.count;
    });
    
    return result;
};

kullaniciOySchema.statics.getUserVote = async function(teklifId, kullaniciId) {
    return this.findOne({ 
        teklif: teklifId, 
        kullanici: kullaniciId 
    });
};

kullaniciOySchema.statics.hasUserVoted = async function(teklifId, kullaniciId) {
    const vote = await this.findOne({ 
        teklif: teklifId, 
        kullanici: kullaniciId 
    });
    return vote !== null;
};

kullaniciOySchema.statics.hasIPVoted = async function(teklifId, ipAdresi) {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const vote = await this.findOne({ 
        teklif: teklifId, 
        ipAdresi: ipAdresi,
        oyZamani: { $gte: oneDayAgo }
    });
    return vote !== null;
};

kullaniciOySchema.statics.getVotingStats = async function(teklifId) {
    const [voteCounts, totalVotes, recentVotes] = await Promise.all([
        this.countByProposal(teklifId),
        this.countDocuments({ teklif: teklifId }),
        this.find({ teklif: teklifId })
            .sort({ oyZamani: -1 })
            .limit(10)
            .populate('kullanici', 'name')
    ]);
    
    return {
        voteCounts,
        totalVotes,
        recentVotes,
        percentages: {
            kabul: totalVotes > 0 ? Math.round((voteCounts.kabul / totalVotes) * 100) : 0,
            ret: totalVotes > 0 ? Math.round((voteCounts.ret / totalVotes) * 100) : 0,
            cekimser: totalVotes > 0 ? Math.round((voteCounts.cekimser / totalVotes) * 100) : 0
        }
    };
};

kullaniciOySchema.statics.getUserVotingHistory = function(kullaniciId) {
    return this.find({ kullanici: kullaniciId })
        .populate('teklif', 'teklifNo baslik kategori durum')
        .sort({ oyZamani: -1 });
};

module.exports = mongoose.models.KullaniciOy || mongoose.model("KullaniciOy", kullaniciOySchema);
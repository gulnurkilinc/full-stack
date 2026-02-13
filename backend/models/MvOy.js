const mongoose = require("mongoose");

const mvOySchema = new mongoose.Schema({
    teklif: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'KanunTeklifi',
        required: [true, "Teklif bilgisi gereklidir"]
    },
    milletvekili: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Milletvekili',
        required: [true, "Milletvekili bilgisi gereklidir"]
    },
    oyTipi: {
        type: String,
        required: [true, "Oy tipi gereklidir"],
        enum: {
            values: ['kabul', 'ret', 'cekimser', 'katilmayan'],
            message: 'Geçersiz oy tipi: {VALUE}'
        }
    },
    oyZamani: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

mvOySchema.index({ teklif: 1, milletvekili: 1 }, { unique: true });
mvOySchema.index({ teklif: 1, oyTipi: 1 });
mvOySchema.index({ milletvekili: 1 });

mvOySchema.statics.findByProposal = function(teklifId) {
    return this.find({ teklif: teklifId })
        .populate({
            path: 'milletvekili',
            select: 'adSoyad parti il koltukIndex',
            populate: {
                path: 'parti',
                select: 'kod ad renk'
            }
        });
};

// ✅ DÜZELTME: Basitleştirilmiş aggregate query
mvOySchema.statics.getPartyVotingStats = async function(teklifId) {
    try {
        console.log('🔍 getPartyVotingStats çağrıldı, ID:', teklifId);
        
        // İlk önce basit sorgu ile test et
        const allVotes = await this.find({ teklif: new mongoose.Types.ObjectId(teklifId) })
            .populate({
                path: 'milletvekili',
                populate: {
                    path: 'parti'
                }
            });
        
        console.log('✅ Toplam oy sayısı:', allVotes.length);
        
        // Manuel gruplama
        const partyStats = {};
        
        allVotes.forEach(vote => {
            if (!vote.milletvekili || !vote.milletvekili.parti) return;
            
            const party = vote.milletvekili.parti;
            const partyId = party._id.toString();
            
            if (!partyStats[partyId]) {
                partyStats[partyId] = {
                    _id: party._id,
                    kod: party.kod,
                    ad: party.ad,
                    renk: party.renk,
                    toplam: party.toplamMV,
                    kabul: 0,
                    ret: 0,
                    cekimser: 0
                };
            }
            
            if (vote.oyTipi === 'kabul') partyStats[partyId].kabul++;
            else if (vote.oyTipi === 'ret') partyStats[partyId].ret++;
            else if (vote.oyTipi === 'cekimser') partyStats[partyId].cekimser++;
        });
        
        const result = Object.values(partyStats).sort((a, b) => b.toplam - a.toplam);
        
        console.log('✅ Parti istatistikleri hazır:', result.length);
        return result;
        
    } catch (error) {
        console.error('❌ getPartyVotingStats hatası:', error);
        throw error;
    }
};

mvOySchema.post('save', async function() {
    const KanunTeklifi = mongoose.model('KanunTeklifi');
    const teklif = await KanunTeklifi.findById(this.teklif);
    if (teklif) {
        await teklif.updateVoteCount();
    }
});

module.exports = mongoose.models.MvOy || mongoose.model("MvOy", mvOySchema);
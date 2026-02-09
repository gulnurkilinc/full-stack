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

mvOySchema.statics.getPartyVotingStats = async function(teklifId) {
    return this.aggregate([
        { $match: { teklif: mongoose.Types.ObjectId(teklifId) } },
        {
            $lookup: {
                from: 'milletvekilleri',
                localField: 'milletvekili',
                foreignField: '_id',
                as: 'mvData'
            }
        },
        { $unwind: '$mvData' },
        {
            $lookup: {
                from: 'partiler',
                localField: 'mvData.parti',
                foreignField: '_id',
                as: 'partiData'
            }
        },
        { $unwind: '$partiData' },
        {
            $group: {
                _id: '$partiData._id',
                kod: { $first: '$partiData.kod' },
                ad: { $first: '$partiData.ad' },
                renk: { $first: '$partiData.renk' },
                toplam: { $first: '$partiData.toplamMV' },
                oylar: {
                    $push: { oyTipi: '$oyTipi' }
                }
            }
        },
        {
            $project: {
                kod: 1,
                ad: 1,
                renk: 1,
                toplam: 1,
                kabul: {
                    $size: {
                        $filter: {
                            input: '$oylar',
                            cond: { $eq: ['$$this.oyTipi', 'kabul'] }
                        }
                    }
                },
                ret: {
                    $size: {
                        $filter: {
                            input: '$oylar',
                            cond: { $eq: ['$$this.oyTipi', 'ret'] }
                        }
                    }
                },
                cekimser: {
                    $size: {
                        $filter: {
                            input: '$oylar',
                            cond: { $eq: ['$$this.oyTipi', 'cekimser'] }
                        }
                    }
                }
            }
        },
        { $sort: { toplam: -1 } }
    ]);
};

mvOySchema.post('save', async function() {
    const KanunTeklifi = mongoose.model('KanunTeklifi');
    const teklif = await KanunTeklifi.findById(this.teklif);
    if (teklif) {
        await teklif.updateVoteCount();
    }
});

module.exports = mongoose.models.MvOy || mongoose.model("MvOy", mvOySchema);
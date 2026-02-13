const mongoose = require("mongoose");

const kanunTeklifiSchema = new mongoose.Schema({
    teklifNo: {
        type: String,
        required: [true, "Teklif numarası gereklidir"],
        unique: true,
        trim: true
    },
    baslik: {
        type: String,
        required: [true, "Başlık gereklidir"],
        trim: true,
        maxLength: [500, "Başlık en fazla 500 karakter olabilir"]
    },
    kategori: {
        type: String,
        required: [true, "Kategori gereklidir"],
        enum: {
            values: [
                'Vergi Mevzuatı', 'Eğitim', 'Sağlık', 'Ekonomi', 'Çevre', 
                'Ulaştırma', 'Enerji', 'Adalet', 'Dış İlişkiler', 'Savunma',
                'İç Güvenlik', 'Tarım', 'Kültür ve Turizm', 'Spor',
                'Bilim ve Teknoloji', 'İletişim', 'Sosyal Güvenlik',
                'Aile ve Sosyal Hizmetler', 'Diğer'
            ],
            message: 'Geçersiz kategori: {VALUE}'
        }
    },
    aciklama: {
        type: String,
        required: [true, "Açıklama gereklidir"],
        trim: true
    },
    durum: {
        type: String,
        enum: ['KABUL_EDILDI', 'REDDEDILDI', 'GORUSLULUYOR'],
        default: 'GORUSLULUYOR'
    },
    gorusulmeTarihi: {
        type: Date,
        required: [true, "Görüşülme tarihi gereklidir"]
    },
    oySayilari: {
        kabul: { type: Number, default: 0 },
        ret: { type: Number, default: 0 },
        cekimser: { type: Number, default: 0 },
        katilmayan: { type: Number, default: 0 }
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true
    },
    aktif: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// ✅ DÜZELTME: async function kullan, next() kaldır
kanunTeklifiSchema.pre('save', async function() {
    if (this.isModified('baslik') || !this.slug) {
        const turkishMap = {
            'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
            'Ç': 'c', 'Ğ': 'g', 'İ': 'i', 'Ö': 'o', 'Ş': 's', 'Ü': 'u'
        };
        
        let slug = this.baslik.toLowerCase();
        Object.keys(turkishMap).forEach(key => {
            slug = slug.replace(new RegExp(key, 'g'), turkishMap[key]);
        });
        
        slug = slug.replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
        this.slug = slug + '-' + this.teklifNo.replace('/', '-');
    }
});

kanunTeklifiSchema.virtual('mvOylari', {
    ref: 'MvOy',
    localField: '_id',
    foreignField: 'teklif'
});

kanunTeklifiSchema.virtual('kullaniciOylari', {
    ref: 'KullaniciOy',
    localField: '_id',
    foreignField: 'teklif'
});

kanunTeklifiSchema.index({ teklifNo: 1 });
kanunTeklifiSchema.index({ slug: 1 });
kanunTeklifiSchema.index({ kategori: 1 });
kanunTeklifiSchema.index({ durum: 1 });

kanunTeklifiSchema.statics.findBySlug = function(slug) {
    return this.findOne({ slug, aktif: true });
};

kanunTeklifiSchema.methods.updateVoteCount = async function() {
    const MvOy = mongoose.model('MvOy');
    const voteCounts = await MvOy.aggregate([
        { $match: { teklif: this._id } },
        { $group: { _id: '$oyTipi', count: { $sum: 1 } } }
    ]);
    
    this.oySayilari = { kabul: 0, ret: 0, cekimser: 0, katilmayan: 0 };
    voteCounts.forEach(vote => {
        this.oySayilari[vote._id] = vote.count;
    });
    
    return this.save({ validateBeforeSave: false });
};

module.exports = mongoose.models.KanunTeklifi || mongoose.model("KanunTeklifi", kanunTeklifiSchema);
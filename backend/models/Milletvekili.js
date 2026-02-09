const mongoose = require("mongoose");

const milletvekiliSchema = new mongoose.Schema({
    adSoyad: {
        type: String,
        required: [true, "Ad soyad gereklidir"],
        trim: true,
        maxLength: [200, "Ad soyad en fazla 200 karakter olabilir"]
    },
    parti: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Parti',
        required: [true, "Parti bilgisi gereklidir"]
    },
    il: {
        type: String,
        required: [true, "İl bilgisi gereklidir"],
        trim: true
    },
    koltukIndex: {
        type: Number,
        required: [true, "Koltuk index gereklidir"],
        min: [0, "Koltuk index 0'dan küçük olamaz"],
        max: [599, "Koltuk index 599'dan büyük olamaz"],
        unique: true
    },
    fotograf: {
        public_id: { type: String, default: "" },
        url: { 
            type: String, 
            default: "https://ui-avatars.com/api/?name=MV&background=6b7280&color=fff&size=200" 
        }
    },
    bio: {
        type: String,
        maxLength: [1000, "Bio en fazla 1000 karakter olabilir"],
        default: ""
    },
    donemSayisi: {
        type: Number,
        default: 1,
        min: [1, "Dönem sayısı en az 1 olmalıdır"]
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

milletvekiliSchema.virtual('oylar', {
    ref: 'MvOy',
    localField: '_id',
    foreignField: 'milletvekili'
});

milletvekiliSchema.index({ parti: 1 });
milletvekiliSchema.index({ il: 1 });
milletvekiliSchema.index({ koltukIndex: 1 });
milletvekiliSchema.index({ aktif: 1 });

milletvekiliSchema.statics.findByParty = function(partiId) {
    return this.find({ parti: partiId, aktif: true })
        .populate('parti', 'kod ad renk')
        .sort({ adSoyad: 1 });
};

milletvekiliSchema.statics.findByCity = function(il) {
    return this.find({ il, aktif: true })
        .populate('parti', 'kod ad renk')
        .sort({ adSoyad: 1 });
};

milletvekiliSchema.post('save', async function() {
    const Parti = mongoose.model('Parti');
    const parti = await Parti.findById(this.parti);
    if (parti) {
        await parti.updateMVCount();
    }
});

milletvekiliSchema.post('remove', async function() {
    const Parti = mongoose.model('Parti');
    const parti = await Parti.findById(this.parti);
    if (parti) {
        await parti.updateMVCount();
    }
});

module.exports = mongoose.models.Milletvekili || mongoose.model("Milletvekili", milletvekiliSchema);
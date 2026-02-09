const mongoose = require("mongoose");

const partiSchema = new mongoose.Schema({
    kod: {
        type: String,
        required: [true, "Parti kodu gereklidir"],
        unique: true,
        uppercase: true,
        trim: true,
        maxLength: [10, "Parti kodu en fazla 10 karakter olabilir"]
    },
    ad: {
        type: String,
        required: [true, "Parti adı gereklidir"],
        trim: true,
        maxLength: [100, "Parti adı en fazla 100 karakter olabilir"]
    },
    renk: {
        type: String,
        required: [true, "Parti rengi gereklidir"],
        match: [/^#[0-9A-F]{6}$/i, "Geçerli bir HEX renk kodu girin (örn: #FF0000)"]
    },
    toplamMV: {
        type: Number,
        default: 0,
        min: [0, "Milletvekili sayısı negatif olamaz"]
    },
    logo: {
        public_id: { type: String, default: "" },
        url: { type: String, default: "" }
    },
    aciklama: {
        type: String,
        maxLength: [500, "Açıklama en fazla 500 karakter olabilir"],
        default: ""
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

partiSchema.virtual('milletvekilleri', {
    ref: 'Milletvekili',
    localField: '_id',
    foreignField: 'parti'
});

partiSchema.index({ kod: 1 });
partiSchema.index({ aktif: 1 });

partiSchema.statics.findActiveParties = function() {
    return this.find({ aktif: true }).sort({ toplamMV: -1 });
};

partiSchema.statics.findByCode = function(kod) {
    return this.findOne({ kod: kod.toUpperCase(), aktif: true });
};

partiSchema.methods.updateMVCount = async function() {
    const Milletvekili = mongoose.model('Milletvekili');
    const count = await Milletvekili.countDocuments({ parti: this._id });
    this.toplamMV = count;
    return this.save({ validateBeforeSave: false });
};

module.exports = mongoose.models.Parti || mongoose.model("Parti", partiSchema);
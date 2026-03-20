const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userName: { type: String },
    userEmail: { type: String },
    action: { type: String, required: true },
    details: { type: String, default: '' },
    ip: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.ActivityLog || mongoose.model('ActivityLog', activityLogSchema);
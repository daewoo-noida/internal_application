const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
        type: String,
        enum: ['payment', 'client', 'reimbursement', 'user', 'system'],
        default: 'system'
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'ClientMaster' },
    paymentId: { type: mongoose.Schema.Types.ObjectId },
    isRead: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);
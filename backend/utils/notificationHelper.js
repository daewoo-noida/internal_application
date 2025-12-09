const Notification = require('../models/Notification');


exports.createNotification = async (data) => {
    try {
        const notification = new Notification({
            title: data.title,
            message: data.message,
            type: data.type || 'system',
            userId: data.userId,
            clientId: data.clientId,
            paymentId: data.paymentId,
            isAdmin: data.isAdmin !== undefined ? data.isAdmin : true
        });
        await notification.save();
        return notification;
    } catch (err) {
        console.error('Notification creation error:', err);
    }
};

// Get admin notifications
exports.getAdminNotifications = async (limit = 10) => {
    return await Notification.find({ isAdmin: true })
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate('userId', 'name email')
        .populate('clientId', 'name');
};

// Get unread count for admin
exports.getAdminUnreadCount = async () => {
    return await Notification.countDocuments({
        isAdmin: true,
        isRead: false
    });
};
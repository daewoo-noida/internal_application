const Notification = require('../models/Notification');
const { getAdminNotifications, getAdminUnreadCount } = require('../utils/notificationHelper');

exports.getNotifications = async (req, res) => {
    try {
        const notifications = await getAdminNotifications(20);
        res.json({ success: true, notifications });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};


exports.getUnreadCount = async (req, res) => {
    try {
        const count = await getAdminUnreadCount();
        res.json({ success: true, count });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};


exports.markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findByIdAndUpdate(
            req.params.id,
            { isRead: true },
            { new: true }
        );
        res.json({ success: true, notification });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};


exports.markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { isAdmin: true, isRead: false },
            { isRead: true }
        );
        res.json({ success: true, message: 'All notifications marked as read' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};


exports.deleteNotification = async (req, res) => {
    try {
        await Notification.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Notification deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
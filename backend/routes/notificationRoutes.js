// /routes/notificationRoutes.js
const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { protect, isAdmin } = require('../middleware/auth');


router.get('/', protect, isAdmin, notificationController.getNotifications);
router.get('/unread-count', protect, isAdmin, notificationController.getUnreadCount);
router.put('/:id/read', protect, isAdmin, notificationController.markAsRead);
router.put('/read-all', protect, isAdmin, notificationController.markAllAsRead);
router.delete('/:id', protect, isAdmin, notificationController.deleteNotification);

module.exports = router;
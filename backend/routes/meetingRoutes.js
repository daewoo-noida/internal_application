const express = require('express');
const router = express.Router();
const meetingController = require('../controllers/meetingController');
const { protect, isAdmin } = require('../middleware/auth'); // Destructure both

// Public route for email responses (no auth required)
router.get('/email-response', meetingController.handleEmailResponse);

// Admin routes (require auth AND admin role)
router.post('/create', protect, isAdmin, meetingController.createMeeting);
router.get('/admin', protect, isAdmin, meetingController.getAdminMeetings);
router.get('/salespersons', protect, isAdmin, meetingController.getSalesPersons);
router.delete('/:meetingId', protect, isAdmin, meetingController.deleteMeeting);
router.get('/stats', protect, isAdmin, meetingController.getMeetingStats);

// User routes (require auth - for sales users)
router.get('/user', protect, meetingController.getUserMeetings);
router.put('/:meetingId/response', protect, meetingController.updateResponse);

module.exports = router;
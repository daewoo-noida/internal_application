const express = require('express');
const router = express.Router();
const Reimbursement = require('../models/Reimbursement');
const User = require('../models/User');
const multer = require('multer');
const path = require('path');
const { protect } = require('../middleware/auth');

// Configure storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/reimbursements/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }
});

// Create reimbursement
router.post('/create', protect, upload.fields([
    { name: 'screenshot', maxCount: 1 },
    { name: 'bill', maxCount: 1 }
]), async (req, res) => {
    try {
        const reimbursement = new Reimbursement({
            user: req.user.id,
            ...req.body,
            status: 'pending'
        });

        if (req.files['screenshot']) {
            reimbursement.screenshot = req.files['screenshot'][0].path;
        }

        if (req.files['bill']) {
            reimbursement.bill = req.files['bill'][0].path;
        }

        await reimbursement.save();

        res.json({
            success: true,
            message: 'Reimbursement submitted successfully',
            data: reimbursement
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// Get user's reimbursements
router.get('/user', protect, async (req, res) => {
    try {
        const reimbursements = await Reimbursement.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .populate('user', 'name email')
            .populate('verifiedBy', 'name email');

        res.json({
            success: true,
            data: reimbursements
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// Get all reimbursements (admin)
router.get('/all', protect, async (req, res) => {
    try {
        // Check admin role
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        const { status } = req.query;
        const query = {};

        if (status && status !== 'all') {
            query.status = status;
        }

        const reimbursements = await Reimbursement.find(query)
            .sort({ createdAt: -1 })
            .populate('user', 'name email designation')
            .populate('verifiedBy', 'name email');

        res.json({
            success: true,
            data: reimbursements
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// Verify reimbursement (admin)
router.put('/:id/verify', protect, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        const { status, adminNotes } = req.body;

        if (!['approved', 'rejected', 'paid'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status'
            });
        }

        const reimbursement = await Reimbursement.findById(req.params.id);

        if (!reimbursement) {
            return res.status(404).json({
                success: false,
                message: 'Reimbursement not found'
            });
        }

        reimbursement.status = status;
        reimbursement.verifiedBy = req.user.id;
        reimbursement.verifiedAt = Date.now();
        reimbursement.adminNotes = adminNotes || '';

        if (status === 'paid') {
            reimbursement.paymentDate = Date.now();
        }

        await reimbursement.save();

        res.json({
            success: true,
            message: `Reimbursement ${status} successfully`,
            data: reimbursement
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// Get stats (admin)
router.get('/stats', protect, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        const stats = await Reimbursement.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                    totalAmount: { $sum: '$amount' }
                }
            }
        ]);

        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});


// @route   DELETE /api/reimbursement/:id
// @desc    Delete reimbursement request (user can delete pending requests)
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const reimbursement = await Reimbursement.findById(req.params.id);

        if (!reimbursement) {
            return res.status(404).json({
                success: false,
                message: 'Reimbursement not found'
            });
        }

        // Check if user owns the request or is admin
        if (reimbursement.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this request'
            });
        }

        // Only allow deletion of pending requests
        if (reimbursement.status !== 'pending' && req.user.role !== 'admin') {
            return res.status(400).json({
                success: false,
                message: 'Only pending requests can be deleted'
            });
        }

        await reimbursement.deleteOne();

        res.json({
            success: true,
            message: 'Reimbursement deleted successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});


module.exports = router;
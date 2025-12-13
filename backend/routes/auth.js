const express = require('express');
const router = express.Router();
const { signup, login, getAllUser, resendOtp, verifyOtp, getProfile, updateProfile, updateProfileImage } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const ImpersonationSession = require("../models/ImpersonationSession");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const multer = require("multer");
const path = require("path");

// Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) =>
        cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });


router.post('/signup', signup);
router.post('/login', login);
router.post("/resend-otp", resendOtp);
router.post("/verify-otp", verifyOtp);
router.get("/user", protect, getAllUser);

router.get("/profile", protect, getProfile);
router.put("/update-profile", protect, updateProfile);
router.put("/profile-image", protect, upload.single("image"), updateProfileImage);



router.post("/impersonate/:userId", protect, async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Access denied. Admin only."
            });
        }

        const { userId } = req.params;
        const adminId = req.user.id;

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Don't allow impersonating other admins
        if (user.role === "admin") {
            return res.status(400).json({
                success: false,
                message: "Cannot impersonate other admins"
            });
        }

        // Generate unique token
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

        // Save impersonation session
        const impersonationSession = new ImpersonationSession({
            adminId,
            userId,
            token,
            expiresAt,
            isActive: true
        });
        await impersonationSession.save();

        res.json({
            success: true,
            token,
            expiresAt,
            message: "Impersonation token generated"
        });

    } catch (error) {
        console.error("Impersonation error:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});

// Login with impersonation token
router.post("/impersonate-login", async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({
                success: false,
                message: "Token is required"
            });
        }

        // Find valid session
        const session = await ImpersonationSession.findOne({
            token,
            isActive: true,
            expiresAt: { $gt: new Date() }
        })
            .populate("userId", "name email phone designation role profileImage")
            .populate("adminId", "name email");

        if (!session) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token"
            });
        }

        // Get user details
        const user = session.userId;

        // Generate login token for the user
        const loginToken = jwt.sign(
            {
                id: user._id,
                role: user.role,
                isImpersonating: true,
                originalAdminId: session.adminId._id
            },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
        );

        // Update session
        session.lastUsed = new Date();
        await session.save();

        res.json({
            success: true,
            token: loginToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                designation: user.designation,
                role: user.role,
                profileImage: user.profileImage
            },
            isImpersonating: true,
            originalUser: {
                id: session.adminId._id,
                name: session.adminId.name,
                email: session.adminId.email
            }
        });

    } catch (error) {
        console.error("Impersonation login error:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});

// Exit impersonation
router.post("/exit-impersonation", protect, async (req, res) => {
    try {
        const userId = req.user.id;

        // Deactivate any active impersonation session for this user
        await ImpersonationSession.findOneAndUpdate(
            { userId, isActive: true },
            {
                isActive: false,
                endedAt: new Date()
            }
        );

        res.json({
            success: true,
            message: "Impersonation ended successfully"
        });

    } catch (error) {
        console.error("Exit impersonation error:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});

// Get active impersonation sessions (admin view)
router.get("/impersonation-sessions", protect, async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

        const sessions = await ImpersonationSession.find({ adminId: req.user.id })
            .populate("userId", "name email")
            .sort({ createdAt: -1 })
            .limit(50);

        res.json({
            success: true,
            sessions
        });

    } catch (error) {
        console.error("Get sessions error:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});


module.exports = router;
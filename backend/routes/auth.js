const express = require('express');
const router = express.Router();
const { signup, login, getAllUser, resendOtp, verifyOtp, getProfile, updateProfile, updateProfileImage } = require('../controllers/authController');
const { protect } = require('../middleware/auth');


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

module.exports = router;
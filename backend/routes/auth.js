// routes/auth.js
const express = require('express');
const router = express.Router();
const { signup, login, getAllUser } = require('../controllers/authController');
const { protect } = require('../middleware/auth');


router.post('/signup', signup);
router.post('/login', login);

router.get("/user", protect, getAllUser);


module.exports = router;
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");
const jwt = require('jsonwebtoken');


const { welcomeEmail, otpEmail, resendOtpEmail } = require("../utils/emailTemplates");

exports.signup = async (req, res) => {
  try {
    const { name, email, password, phone, designation } = req.body;

    if (!name || !email || !password || !phone || !designation) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const allowedDomains = [
      "@theebg.com",
      "@daewooappliances.in",
      "@ebikego.in"
    ];

    const emailLower = email.toLowerCase();
    const isAllowed = allowedDomains.some(domain =>
      emailLower.endsWith(domain)
    );

    if (!isAllowed) {
      return res.status(400).json({
        message: `Email must be one of: ${allowedDomains.join(", ")}`
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // OTP GENERATION
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 min

    const newUser = new User({
      name,
      email,
      phone,
      designation,
      password: hashedPassword,
      role: "Sales",
      otp,
      otpExpires: otpExpiry,
      isVerified: false
    });

    await newUser.save();

    // SEND OTP EMAIL ✔ using template
    await sendEmail(
      email,
      "Your Daewoo Verification OTP",
      otpEmail({ name, otp })
    );

    res.status(201).json({
      message: "Signup successful. OTP sent to your email.",
      success: true
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "User not found" });
    if (user.isVerified) return res.status(400).json({ message: "Already verified" });
    if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });
    if (user.otpExpires < Date.now()) return res.status(400).json({ message: "OTP expired" });


    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    await sendEmail(
      email,
      "Welcome to Daewoo Sales Portal",
      welcomeEmail({
        name: user.name,
        email: user.email,
        password: user.password,
        loginUrl: "https://daewooebg.com/login"
      })
    );

    res.json({ success: true, message: "OTP verified successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    // SEND RESEND EMAIL ✔ using template
    await sendEmail(
      email,
      "Your New OTP - Daewoo",
      resendOtpEmail({ name: user.name, otp })
    );

    res.json({ success: true, message: "OTP resent successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};




exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Wrong password" });

    // BLOCK LOGIN IF NOT VERIFIED
    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Your email is not verified. Please verify using the OTP sent to your email."
      });
    }

    // Generate Token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        designation: user.designation,
        role: user.role,
      },
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllUser = async (req, res) => {
  try {
    const users = await User.find({ role: "Sales" }).select("-password");
    res.json({ success: true, data: users });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Server Error", err });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const updates = {
      name: req.body.name,
      phone: req.body.phone,
      gender: req.body.gender,
      dob: req.body.dob,
      officeBranch: req.body.officeBranch
    };

    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
    }).select("-password");

    res.json({ success: true, user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Update failed" });
  }
};

exports.updateProfileImage = async (req, res) => {
  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

  await User.findByIdAndUpdate(req.user.id, { profileImage: imageUrl });

  res.json({
    success: true,
    imageUrl,
    message: "Profile image updated!",
  });
};

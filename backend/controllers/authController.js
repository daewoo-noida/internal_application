const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Client = require("../models/ClientMaster");

exports.signup = async (req, res) => {
  try {
    const { name, email, password, phone, designation } = req.body;

    if (!name || !email || !password || !phone || !designation) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check email domain allowed
    const allowedDomains = [
      "@theebg.com",
      "@daewooappliances.com",
      "@ebikego.in"
    ];

    const emailLower = email.toLowerCase();
    const isAllowed = allowedDomains.some(domain => emailLower.endsWith(domain));

    if (!isAllowed) {
      return res.status(400).json({
        message: `Email must be one of: ${allowedDomains.join(", ")}`
      });
    }

    // Check if email exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      phone,
      designation,
      password: hashedPassword,
      role: "Sales"
    });

    await newUser.save();

    res.status(201).json({
      message: "Signup successful",
      success: true
    });

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

    if (!user.isVerified && user.role === "Sales") {
      return res.status(403).json({
        success: false,
        message: "Your account is not verified yet. Please contact admin."
      });
    }


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
  } catch {
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

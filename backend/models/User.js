const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    name: { type: String, required: true },

    designation: { type: String, required: true },

    email: { type: String, required: true, unique: true, lowercase: true },

    phone: { type: String, required: true },

    password: { type: String, required: true },

    role: { type: String, enum: ["Sales", "admin"], default: "Sales" },

    createdAt: { type: Date, default: Date.now },
    isVerified: {
        type: Boolean,
        default: false
    },
    otp: String,
    otpExpires: Date,
    gender: { type: String },
    dob: { type: String },
    officeBranch: { type: String },
    profileImage: String
});

module.exports = mongoose.model("User", userSchema);

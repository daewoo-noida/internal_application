const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    name: { type: String, required: true },

    designation: { type: String, required: true },

    email: { type: String, required: true, unique: true, lowercase: true },

    phone: { type: String, required: true },

    password: { type: String, required: true },
    plainPassword: { type: String },
    role: { type: String, enum: ["Sales", "admin"], default: "Sales" },

    createdAt: { type: Date, default: Date.now },
    isVerified: {
        type: Boolean,
        default: false
    },
    otp: String,
    otpExpires: Date,
    gender: { type: String, default: "" },
    dob: { type: String, default: "" },
    officeBranch: { type: String, default: "" },
    profileImage: { type: String, default: "" },
    profileCompleted: {
        type: Boolean,
        default: false
    },
});

module.exports = mongoose.model("User", userSchema);

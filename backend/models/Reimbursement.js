const mongoose = require("mongoose");

const reimbursementSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    reason: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    category: {
        type: String,
        enum: ["travel", "food", "meeting", "office", "software", "misc"],
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ["upi", "card", "cash", "bank"],
        required: true
    },
    vendor: { type: String, default: "" },
    notes: { type: String, default: "" },
    bankDetails: { type: String, required: true },
    screenshot: { type: String },
    bill: { type: String },


    status: {
        type: String,
        enum: ["pending", "approved", "rejected", "paid"],
        default: "pending"
    },


    verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    verifiedAt: { type: Date },
    adminNotes: { type: String, default: "" },
    paymentDate: { type: Date },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Reimbursement", reimbursementSchema);
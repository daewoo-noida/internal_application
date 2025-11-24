const mongoose = require("mongoose");

const ClientMasterSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    phone: { type: String, required: true },
    altPhone: { type: String },

    territory: { type: String },
    country: { type: String, default: "India" },
    state: { type: String },
    district: { type: String },
    city: { type: String },
    streetAddress: { type: String },
    pin: { type: String },

    adharImages: [{ filename: String, path: String }],
    panImage: { filename: String, path: String },
    companyPanImage: { filename: String, path: String },
    gst: { type: String },
    addressProof: { filename: String, path: String },

    // Office Details (linked to actual User model)
    officeBranch: { type: String },

    bda: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    bde: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    bdm: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    leadSource: { type: String },

    // Payment
    dealAmount: { type: Number, default: 0 },
    tokenReceivedAmount: { type: Number, default: 0 },
    tokenDate: { type: Date },
    receivedPercent: { type: Number, default: 0 },
    remainPercent: { type: Number, default: 100 },
    balanceAmount: { type: Number, default: 0 },

    paymentProof: { filename: String, path: String },
    modeOfPayment: { type: String },

    additionalCommitment: { type: String },
    remark: { type: String },

    // Who created the client (Sales User)
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("ClientMaster", ClientMasterSchema);

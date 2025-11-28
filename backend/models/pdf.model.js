const mongoose = require("mongoose");

const pdfSchema = new mongoose.Schema({
    title: { type: String, required: true },
    fileName: { type: String, required: true },
    category: { type: String, default: "general" },
    uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("PDF", pdfSchema);

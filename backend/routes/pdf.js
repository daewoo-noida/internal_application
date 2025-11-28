const express = require("express");
const router = express.Router();
const upload = require("../middleware/pdfUpload");
const PDF = require("../models/pdf.model");
const fs = require("fs");
const path = require("path");

// 📌 Upload PDF
router.post("/upload", upload.single("pdf"), async (req, res) => {
    try {
        const pdf = new PDF({
            title: req.body.title,
            fileName: req.file.filename,
            category: req.body.category || "general",
        });

        await pdf.save();

        res.json({ success: true, message: "PDF uploaded", pdf });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// 📌 Get all PDFs
router.get("/", async (req, res) => {
    const pdfs = await PDF.find().sort({ uploadedAt: -1 });
    res.json(pdfs);
});

// 📌 Delete PDF
router.delete("/:id", async (req, res) => {
    try {
        const pdf = await PDF.findById(req.params.id);
        if (!pdf) return res.status(404).json({ message: "Not found" });

        const filePath = path.join(
            __dirname,
            "../uploads/franchisePdf",
            pdf.fileName
        );

        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

        await pdf.deleteOne();

        res.json({ success: true, message: "PDF deleted" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;

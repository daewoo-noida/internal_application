const express = require("express");
const router = express.Router();
const FileNode = require("../models/FileNode");
const upload = require("../middleware/fileUpload");
const fs = require("fs");
const path = require("path");

/********************************
  CREATE FOLDER
********************************/
router.post("/folder", async (req, res) => {
    try {
        const { name, parent } = req.body;

        const folder = await FileNode.create({
            name,
            type: "folder",
            parent: parent || null
        });

        if (parent) {
            await FileNode.findByIdAndUpdate(parent, {
                $push: { children: folder._id }
            });
        }

        res.json({ success: true, folder });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

/********************************
  UPLOAD FILE
********************************/
router.post("/upload", upload.single("file"), async (req, res) => {
    try {
        const { parent } = req.body;

        const fileNode = await FileNode.create({
            name: req.file.originalname,
            type: "file",
            parent: parent || null,
            filePath: req.file.filename
        });

        if (parent) {
            await FileNode.findByIdAndUpdate(parent, {
                $push: { children: fileNode._id }
            });
        }

        res.json({ success: true, file: fileNode });
    } catch (err) {
        res.status(500).json({ message: "Upload failed" });
    }
});

/********************************
  GET WHOLE TREE
********************************/
router.get("/tree", async (req, res) => {
    const nodes = await FileNode.find().lean();
    res.json(nodes);
});

/********************************
  DELETE FILE / FOLDER RECURSIVE
********************************/
async function deleteRecursively(id) {
    const node = await FileNode.findById(id);

    if (!node) return;

    // If folder → delete children
    if (node.type === "folder") {
        for (const child of node.children) {
            await deleteRecursively(child);
        }
    }

    // If file → delete file from system
    if (node.type === "file" && node.filePath) {
        const fileLoc = path.join(__dirname, "../uploads/files", node.filePath);
        if (fs.existsSync(fileLoc)) fs.unlinkSync(fileLoc);
    }

    await node.deleteOne();
}

router.delete("/:id", async (req, res) => {
    try {
        await deleteRecursively(req.params.id);
        res.json({ success: true, message: "Deleted" });
    } catch (err) {
        res.status(500).json({ message: "Delete failed" });
    }
});

/********************************
  RENAME FILE / FOLDER
********************************/
router.put("/rename/:id", async (req, res) => {
    try {
        const { name } = req.body;
        await FileNode.findByIdAndUpdate(req.params.id, { name });
        res.json({ success: true });
    } catch {
        res.status(500).json({ message: "Rename failed" });
    }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const articleController = require("../controllers/articleController");
const { protect, isAdmin } = require("../middleware/auth");

// Public routes (for users)
router.get("/published", articleController.getPublishedArticles);
router.get("/:id", articleController.getArticleById);

// Admin only routes
router.post("/", protect, isAdmin, articleController.createArticle);
router.get("/", protect, isAdmin, articleController.getAllArticles);
router.put("/:id", protect, isAdmin, articleController.updateArticle);
router.delete("/:id", protect, isAdmin, articleController.deleteArticle);
router.put("/:id/status", protect, isAdmin, articleController.updateArticleStatus);

module.exports = router;
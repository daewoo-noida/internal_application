const Article = require("../models/Article");
const { create } = require("../models/User");


exports.createArticle = async (req, res) => {
    try {
        // console.log("=== CREATE ARTICLE REQUEST ===");
        // console.log("User ID:", req.user?._id);
        // console.log("Request Body:", req.body);
        // console.log("User Role:", req.user?.role);

        const { title, description, articleLink, status = "published" } = req.body;

        // Validation
        if (!title || !description || !articleLink) {
            return res.status(400).json({
                success: false,
                message: "Title, description, and article link are required"
            });
        }

        const article = new Article({
            title,
            description,
            articleLink,
            createdBy: req.user._id,
            status
        });

        // console.log("Article to save:", article);

        const savedArticle = await article.save();

        // console.log("Article saved successfully:", savedArticle._id);

        res.status(201).json({
            success: true,
            message: "Article created successfully",
            data: savedArticle
        });
    } catch (error) {
        // console.error("=== ARTICLE CREATION ERROR ===");
        // console.error("Error name:", error.name);
        // console.error("Error message:", error.message);
        // console.error("Full error:", error);

        // Handle specific MongoDB errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: "Validation Error",
                errors: Object.values(error.errors).map(err => err.message)
            });
        }

        if (error.name === 'MongoError' && error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Duplicate entry error"
            });
        }

        res.status(500).json({
            success: false,
            message: "Error creating article",
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};
// Get all published articles (for users)
exports.getPublishedArticles = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = "", all = false } = req.query;

        const query = {
            status: "published",
            ...(search && {
                $or: [
                    { title: { $regex: search, $options: "i" } },
                    { description: { $regex: search, $options: "i" } }
                ]
            })
        };

        let articles;
        let total;

        if (all === 'true') {
            // Get all articles without pagination
            articles = await Article.find(query)
                .sort({ publishedAt: -1, createdAt: -1 })
                .select("title description articleLink publishedAt createdAt updatedAt")
                .populate("createdBy", "name");

            total = articles.length;
        } else {
            // Get articles with pagination (default behavior)
            articles = await Article.find(query)
                .sort({ publishedAt: -1, createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(parseInt(limit))
                .select("title description articleLink publishedAt createdAt updatedAt")
                .populate("createdBy", "name");

            total = await Article.countDocuments(query);
        }

        res.status(200).json({
            success: true,
            data: articles,
            pagination: all !== 'true' ? {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                itemsPerPage: parseInt(limit)
            } : null
        });
    } catch (error) {
        console.error("Error fetching articles:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching articles",
            error: error.message
        });
    }
};

// Get all articles with filter (Admin only)
exports.getAllArticles = async (req, res) => {
    try {
        const { status, page = 1, limit = 10, search = "" } = req.query;

        let query = {};

        if (status) query.status = status;

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } }
            ];
        }

        const articles = await Article.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .populate("createdBy", "name email");

        const total = await Article.countDocuments(query);

        res.status(200).json({
            success: true,
            data: articles,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                itemsPerPage: parseInt(limit)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching articles",
            error: error.message
        });
    }
};

// Get single article by ID
exports.getArticleById = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id)
            .populate("createdBy", "name email");

        if (!article) {
            return res.status(404).json({
                success: false,
                message: "Article not found"
            });
        }

        // Increment views or track clicks if needed
        // article.views += 1;
        // await article.save();

        res.status(200).json({
            success: true,
            data: article
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching article",
            error: error.message
        });
    }
};

// Update article (Admin only)
exports.updateArticle = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const article = await Article.findByIdAndUpdate(
            id,
            { ...updateData, updatedAt: Date.now() },
            { new: true, runValidators: true }
        );

        if (!article) {
            return res.status(404).json({
                success: false,
                message: "Article not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Article updated successfully",
            data: article
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating article",
            error: error.message
        });
    }
};

// Delete article (Admin only)
exports.deleteArticle = async (req, res) => {
    try {
        const article = await Article.findByIdAndDelete(req.params.id);

        if (!article) {
            return res.status(404).json({
                success: false,
                message: "Article not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Article deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting article",
            error: error.message
        });
    }
};

// Update article status (Admin only)
exports.updateArticleStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!["draft", "published", "archived"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status"
            });
        }

        const article = await Article.findByIdAndUpdate(
            id,
            { status, updatedAt: Date.now() },
            { new: true }
        );

        if (!article) {
            return res.status(404).json({
                success: false,
                message: "Article not found"
            });
        }

        res.status(200).json({
            success: true,
            message: `Article ${status} successfully`,
            data: article
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating article status",
            error: error.message
        });
    }
};
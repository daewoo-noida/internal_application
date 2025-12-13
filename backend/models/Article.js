const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
        trim: true,
        maxlength: [200, "Title cannot exceed 200 characters"]
    },
    description: {
        type: String,
        required: [true, "Description is required"],
        maxlength: [500, "Description cannot exceed 500 characters"]
    },
    articleLink: {
        type: String,
        required: [true, "Article link is required"],
        validate: {
            validator: function (v) {
                return /^(https?:\/\/)/.test(v);
            },
            message: "Please provide a valid URL starting with http:// or https://"
        }
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    status: {
        type: String,
        enum: ["draft", "published", "archived"],
        default: "published"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,

});


module.exports = mongoose.model("Article", articleSchema);
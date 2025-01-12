const mongoose = require("mongoose")

const tokenSchema = new mongoose.Schema({
    _userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    refreshToken: {
        type: [String],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
},{timestamps: true});

module.exports = mongoose.model("Token", tokenSchema);

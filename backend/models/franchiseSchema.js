const mongoose = require('mongoose');

const franchiseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    type: { type: String, enum: ['master', 'ddp', 'signature'], required: true },
    status: { type: String, enum: ['Available', 'Booked'], required: true },
    image: { type: String, required: true },
    description: { type: String, default: '' },
    region: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Franchise', franchiseSchema);
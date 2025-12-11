const express = require('express');
const router = express.Router();
const Franchise = require('../models/franchiseSchema');

// Get all franchises
router.get('/', async (req, res) => {
    try {
        const { type, status, search } = req.query;
        let query = {};

        if (type) query.type = type;
        if (status) query.status = status;
        if (search) {
            query.title = { $regex: search, $options: 'i' };
        }

        const franchises = await Franchise.find(query).sort({ createdAt: -1 });
        res.json(franchises);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get single franchise
router.get('/:id', async (req, res) => {
    try {
        const franchise = await Franchise.findById(req.params.id);
        if (!franchise) return res.status(404).json({ error: 'Not found' });
        res.json(franchise);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create franchise
router.post('/', async (req, res) => {
    try {
        const franchise = new Franchise(req.body);
        await franchise.save();
        res.status(201).json(franchise);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update franchise
router.put('/:id', async (req, res) => {
    try {
        const franchise = await Franchise.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedAt: Date.now() },
            { new: true }
        );
        res.json(franchise);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete franchise
router.delete('/:id', async (req, res) => {
    try {
        await Franchise.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
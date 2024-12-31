const express = require('express');
const router = express.Router();
const Address = require('../models/Address');

// Get all addresses
router.get('/', async (req, res) => {
    try {
        const addresses = await Address.find();
        res.json(addresses);
    } catch (error) {
        console.error("Error getting addresses:", error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Create a new address
router.post('/', async (req, res) => {
    try {
        const newAddress = new Address(req.body);
        const savedAddress = await newAddress.save();
        res.status(201).json(savedAddress); // Send 201 Created on success
    } catch (error) {
        console.error("Error creating address:", error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Server Error' });
    }
});

// Get a specific address by ID
router.get('/:id', async (req, res) => {
    try {
        const address = await Address.findById(req.params.id);
        if (!address) {
            return res.status(404).json({ message: 'Address not found' });
        }
        res.json(address);
    } catch (error) {
        console.error("Error getting address:", error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Update an address by ID
router.put('/:id', async (req, res) => {
    try {
        const updatedAddress = await Address.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedAddress) {
            return res.status(404).json({ message: 'Address not found' });
        }
        res.json(updatedAddress);
    } catch (error) {
        console.error("Error updating address:", error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Server Error' });
    }
});

// Delete an address by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedAddress = await Address.findByIdAndDelete(req.params.id);
        if (!deletedAddress) {
            return res.status(404).json({ message: 'Address not found' });
        }
        res.json({ message: 'Address deleted' });
    } catch (error) {
        console.error("Error deleting address:", error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
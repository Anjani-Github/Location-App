// backend/models/Address.js
const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    houseNumber: { type: String, required: true },
    apartment: { type: String, required: true },
    area: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    category: { type: String, required: true },
});

module.exports = mongoose.model('Address', addressSchema);
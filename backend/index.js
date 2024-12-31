const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const addressRoutes = require('./routes/addressRoutes');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// MongoDB Connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        process.exit(1); // Important: Exit process on connection error
    }
};

connectDB();

// CORS configuration (Important!)
// For development, you can use a wider configuration:
app.use(cors({
    origin: 'http://localhost:3000', // Allow requests from your frontend
    credentials: true
}));

// For production, restrict to your actual domain:
// app.use(cors({
//     origin: 'https://your-production-domain.com', // Replace with your domain
//     credentials: true
// }));

app.use(bodyParser.json());

// Routes
app.use('/api/address', addressRoutes);

// Error handling middleware (Important: Place AFTER routes)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(port, () => console.log(`Server listening on port ${port}`));
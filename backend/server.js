import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import TransactionHashCode from './transaction.js';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from project root (one level up from backend)
// Load .env from project root (one level up from backend) for local dev
dotenv.config({ path: path.resolve(__dirname, '../.env') });
// Also try loading from current directory (standard behavior)
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MANGO_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));

// Booking Schema
const bookingSchema = new mongoose.Schema({
    walletAddress: { type: String, required: true },
    movieName: { type: String, required: true },
    location: String,
    date: String,
    time: String,
    seats: [String],
    amount: Number,
    poster: String,
    transactionHash: String,
    tokenId: String, // Added Token ID
    createdAt: { type: Date, default: Date.now }
});

const Booking = mongoose.model('Booking', bookingSchema);

// Refund Schema
const refundSchema = new mongoose.Schema({
    walletAddress: { type: String, required: true },
    movieName: { type: String, required: true },
    location: String,
    date: String,
    time: String,
    seats: String,
    amount: Number,
    poster: String,
    status: { type: String, default: 'Pending' }, // Pending, Processed, Rejected
    transactionHash: String,
    tokenId: String, // Added Token ID
    createdAt: { type: Date, default: Date.now }
});

const Refund = mongoose.model('Refund', refundSchema);

// Routes

// Save Booking
app.post('/api/bookings', async (req, res) => {
    try {
        const newBooking = new Booking(req.body);
        await newBooking.save();
        res.status(201).json({ message: 'Booking saved successfully', booking: newBooking });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// Get Bookings by Wallet
app.get('/api/bookings/:walletAddress', async (req, res) => {
    try {
        const bookings = await Booking.find({ walletAddress: req.params.walletAddress }).sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// Save Refund Request
app.post('/api/refund', async (req, res) => {
    try {
        const { transactionHash } = req.body;

        // Check for existing refund request
        const existingRefund = await Refund.findOne({ transactionHash });
        if (existingRefund) {
            return res.status(400).json({ message: 'Refund already requested for this transaction' });
        }

        const newRefund = new Refund(req.body);
        await newRefund.save();
        res.status(201).json({ message: 'Refund request saved successfully', refund: newRefund });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// Get Refunds by Wallet
app.get('/api/refunds/:walletAddress', async (req, res) => {
    try {
        const refunds = await Refund.find({ walletAddress: req.params.walletAddress }).sort({ createdAt: -1 });
        res.json(refunds);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// Check Refund Status by Hash
app.get('/api/refund/check/:txHash', async (req, res) => {
    try {
        const refund = await Refund.findOne({ transactionHash: req.params.txHash });
        if (refund) {
            return res.json({ exists: true, status: refund.status, refund });
        }
        res.json({ exists: false });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// Save Transaction Hash (Enhanced)
app.post('/api/transaction-hash', async (req, res) => {
    try {
        const { walletAddress, transactionHash, movieName, amount, poster, location, date, time, seats, tokenId } = req.body;
        const newTransaction = new TransactionHashCode({
            walletAddress,
            transactionHash,
            movieName,
            amount,
            poster,
            location,
            date,
            time,
            seats,
            tokenId // Save Token ID
        });
        await newTransaction.save();
        res.status(201).json({ message: 'Transaction hash saved successfully', transaction: newTransaction });
    } catch (error) {
        console.error('Error saving transaction hash:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// Get Transaction Hashes by Wallet
app.get('/api/transaction-hash/:walletAddress', async (req, res) => {
    try {
        const transactions = await TransactionHashCode.find({ walletAddress: req.params.walletAddress }).sort({ createdAt: -1 });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});



app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

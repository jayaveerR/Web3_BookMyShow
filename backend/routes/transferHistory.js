import express from 'express';
import TransferHistory from '../models/TransferHistory.js';

const router = express.Router();

// Get all transfer history for a wallet (both sent and received)
router.get('/:walletAddress', async (req, res) => {
    try {
        const { walletAddress } = req.params;
        const transfers = await TransferHistory.find({
            $or: [
                { from: walletAddress },
                { to: walletAddress }
            ]
        }).sort({ timestamp: -1 });

        res.json(transfers);
    } catch (error) {
        console.error('Error fetching transfer history:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// Get sent transfers for a wallet
router.get('/:walletAddress/sent', async (req, res) => {
    try {
        const { walletAddress } = req.params;
        const transfers = await TransferHistory.find({
            from: walletAddress
        }).sort({ timestamp: -1 });

        res.json(transfers);
    } catch (error) {
        console.error('Error fetching sent transfers:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// Get received transfers for a wallet
router.get('/:walletAddress/received', async (req, res) => {
    try {
        const { walletAddress } = req.params;
        const transfers = await TransferHistory.find({
            to: walletAddress
        }).sort({ timestamp: -1 });

        res.json(transfers);
    } catch (error) {
        console.error('Error fetching received transfers:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// Record a new transfer
router.post('/', async (req, res) => {
    try {
        const {
            transactionHash,
            from,
            to,
            tokenId,
            movieName,
            seats,
            poster,
            location,
            date,
            time,
            transferType,
            price,
            commission,
            status,
            blockchainData
        } = req.body;

        // Check if transfer already exists
        const existingTransfer = await TransferHistory.findOne({ transactionHash });
        if (existingTransfer) {
            return res.status(400).json({
                message: 'Transfer already recorded for this transaction hash'
            });
        }

        const newTransfer = new TransferHistory({
            transactionHash,
            from,
            to,
            tokenId,
            movieName,
            seats,
            poster,
            location,
            date,
            time,
            transferType: transferType || 'gift',
            price: price || 0,
            commission: commission || 0,
            status: status || 'completed',
            blockchainData
        });

        await newTransfer.save();
        res.status(201).json({
            message: 'Transfer recorded successfully',
            transfer: newTransfer
        });
    } catch (error) {
        console.error('Error recording transfer:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// Get transfer by transaction hash
router.get('/hash/:txHash', async (req, res) => {
    try {
        const transfer = await TransferHistory.findOne({
            transactionHash: req.params.txHash
        });

        if (!transfer) {
            return res.status(404).json({ message: 'Transfer not found' });
        }

        res.json(transfer);
    } catch (error) {
        console.error('Error fetching transfer by hash:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

export default router;

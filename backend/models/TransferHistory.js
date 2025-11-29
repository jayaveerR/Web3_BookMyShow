import mongoose from 'mongoose';

const TransferHistorySchema = new mongoose.Schema({
    transactionHash: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    from: {
        type: String,
        required: true,
        index: true
    },
    to: {
        type: String,
        required: true,
        index: true
    },
    tokenId: String,
    movieName: { type: String, required: true },
    seats: String,
    poster: String,
    location: String,
    date: String,
    time: String,
    transferType: {
        type: String,
        enum: ['gift', 'sale', 'trade'],
        default: 'gift'
    },
    price: { type: Number, default: 0 },
    commission: { type: Number, default: 0 },
    timestamp: { type: Date, default: Date.now },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'completed'
    },
    blockchainData: {
        version: Number,
        vmStatus: String,
        gasUsed: Number
    }
});

// Indexes for efficient queries
TransferHistorySchema.index({ from: 1, timestamp: -1 });
TransferHistorySchema.index({ to: 1, timestamp: -1 });
TransferHistorySchema.index({ transactionHash: 1 });

const TransferHistory = mongoose.model('TransferHistory', TransferHistorySchema);

export default TransferHistory;

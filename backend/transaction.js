import mongoose from 'mongoose';

const transactionHashCodeSchema = new mongoose.Schema({
    walletAddress: { type: String, required: true },
    transactionHash: { type: String, required: true },
    movieName: String,
    amount: Number,
    poster: String,
    location: String,
    date: String,
    time: String,
    seats: [String],
    createdAt: { type: Date, default: Date.now }
}, { collection: 'Transaction_Hash_Code' });

const TransactionHashCode = mongoose.model('TransactionHashCode', transactionHashCodeSchema);

export default TransactionHashCode;

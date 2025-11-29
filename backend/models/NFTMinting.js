import mongoose from 'mongoose';

const nftMintingSchema = new mongoose.Schema({
    walletAddress: { type: String, required: true },
    transactionHash: { type: String, required: true },
    tokenId: { type: String },
    movieName: { type: String, required: true },
    poster: String,
    location: String,
    date: String,
    time: String,
    seats: [String],
    price: Number,
    createdAt: { type: Date, default: Date.now }
}, { collection: 'NFTMinting' });

const NFTMinting = mongoose.model('NFTMinting', nftMintingSchema);

export default NFTMinting;

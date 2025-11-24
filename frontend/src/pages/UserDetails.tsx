import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { movies } from "@/data/movies";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Ticket, Wallet } from "lucide-react";
import { toast } from "sonner";
import { uploadFileToIPFS, uploadJSONToIPFS } from "@/utils/ipfs";
import { getCurrentDateIST } from "@/utils/date";

const UserDetails = () => {
    const navigate = useNavigate();
    const [bookingData, setBookingData] = useState<any>(null);
    const [movie, setMovie] = useState<any>(null);
    const [walletAddress, setWalletAddress] = useState("");

    useEffect(() => {
        const data = sessionStorage.getItem("bookingData");
        const savedWallet = localStorage.getItem("walletAddress") || "";
        setWalletAddress(savedWallet);

        if (data) {
            const parsedData = JSON.parse(data);
            setBookingData(parsedData);
            const foundMovie = movies.find((m) => m.id === Number(parsedData.movieId));
            setMovie(foundMovie);
        } else {
            navigate("/");
        }
    }, [navigate]);

    const handleMint = async () => {
        const aptos = (window as any).aptos;
        if (!aptos) {
            toast.error("Petra Wallet not found!");
            return;
        }

        if (!movie || !bookingData) return;

        try {
            toast.loading("Uploading to IPFS...");

            // 1. Upload Image to IPFS
            const response = await fetch(movie.poster);
            const blob = await response.blob();
            const imageIpfsUrl = await uploadFileToIPFS(blob);
            console.log("Image uploaded to IPFS:", imageIpfsUrl);

            // 2. Create Metadata
            const seatsString = bookingData.seats.map((s: any) => `${s.id}`).join(", ");
            const time = localStorage.getItem("selectedShowTime") || "6:00 PM";
            const date = getCurrentDateIST();

            const metadata = {
                name: `${movie.title} Ticket`,
                description: `Ticket for ${movie.title} at ${movie.location} on ${date} ${time}. Seats: ${seatsString}`,
                image: imageIpfsUrl
            };

            // 3. Upload Metadata to IPFS
            const metadataIpfsUrl = await uploadJSONToIPFS(metadata);
            console.log("Metadata uploaded to IPFS:", metadataIpfsUrl);
            toast.dismiss();

            // 4. Mint NFT
            const moduleAddress = import.meta.env.VITE_APTOS_ADDRESS;

            const transaction = {
                function: `${moduleAddress}::NftMintV3::mint_ticket`,
                type_arguments: [],
                arguments: [
                    movie.title,       // movie_name
                    movie.location,    // location
                    date,              // date
                    time,              // time
                    seatsString,       // seats
                    metadataIpfsUrl    // poster_url (now passing metadata URI)
                ],
            };

            const pendingTransaction = await aptos.signAndSubmitTransaction(transaction);
            console.log("Mint Transaction Pending:", pendingTransaction);

            // Wait for transaction confirmation using custom polling
            toast.loading("Confirming transaction...");

            const waitForTransaction = async (txnHash: string) => {
                let attempts = 0;
                while (attempts < 20) {
                    try {
                        const response = await fetch(`https://fullnode.testnet.aptoslabs.com/v1/transactions/by_hash/${txnHash}`);
                        if (response.ok) {
                            const data = await response.json();
                            if (data.type === "pending_transaction") {
                                await new Promise(resolve => setTimeout(resolve, 1000));
                                attempts++;
                                continue;
                            }
                            if (data.success) {
                                return data;
                            } else {
                                throw new Error("Transaction failed on-chain");
                            }
                        }
                    } catch (e) {
                        console.error("Error checking tx:", e);
                    }
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    attempts++;
                }
                throw new Error("Transaction confirmation timed out");
            };

            const confirmedTxn = await waitForTransaction(pendingTransaction.hash);
            toast.dismiss();

            // Attempt to extract Token ID (Object Address) from changes
            let realTokenId = "";
            try {
                if (confirmedTxn && confirmedTxn.changes) {
                    const tokenChange = confirmedTxn.changes.find((change: any) =>
                        change.type === "write_resource" &&
                        (change.data.type.includes("0x4::token::Token") || change.data.type.includes("token::Token"))
                    );
                    if (tokenChange) {
                        realTokenId = tokenChange.address;
                        console.log("Found Token ID:", realTokenId);
                    }
                }
            } catch (e) {
                console.error("Error parsing token ID:", e);
            }

            // Save final ticket data to sessionStorage for the success page
            const ticketData = {
                ...bookingData,
                movieTitle: movie.title,
                moviePoster: movie.poster,
                location: movie.location,
                date: date,
                time: time,
                wallet: walletAddress,
                txnHash: pendingTransaction.hash,
                tokenId: realTokenId, // Store the real ID
                nftMetadata: metadataIpfsUrl,
                seats: seatsString // Ensure seats string is passed
            };
            sessionStorage.setItem("ticketData", JSON.stringify(ticketData));

            toast.success("Minting Successful! Redirecting...");
            setTimeout(() => {
                navigate("/ticket-success");
            }, 1500);

        } catch (error: any) {
            console.error("Minting failed", error);
            toast.dismiss();
            toast.error(`Minting Failed: ${error.message || "Unknown error"}`);
        }
    };

    if (!bookingData || !movie) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-white text-black">
            <Navbar />
            <div className="max-w-7xl mx-auto pt-24 px-4 sm:px-6 lg:px-8 pb-12">

                {/* Ticket Content */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
                    <div className="grid lg:grid-cols-2 gap-0">
                        {/* Left Side - Movie Banner */}
                        <div className="relative h-[600px] bg-black flex items-center justify-center overflow-hidden">
                            <img
                                src={movie.poster}
                                alt={movie.title}
                                className="w-full h-full object-contain"
                            />
                        </div>

                        {/* Right Side - Booking Details */}
                        <div className="p-8 flex flex-col justify-between bg-white text-black">
                            <div>
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
                                        <p className="text-lg text-gray-600">{movie.genre}</p>
                                    </div>
                                    <div className="bg-black text-white px-3 py-1 rounded-full text-xs font-bold">
                                        UNPAID
                                    </div>
                                </div>

                                <p className="text-gray-600 text-sm mb-8 line-clamp-3">{movie.description}</p>

                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <MapPin className="w-6 h-6 text-black mt-1" />
                                        <div>
                                            <p className="text-sm text-gray-500">Theatre</p>
                                            <p className="font-semibold text-lg">{movie.location}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-8">
                                        <div className="flex items-start gap-4">
                                            <Calendar className="w-6 h-6 text-black mt-1" />
                                            <div>
                                                <p className="text-sm text-gray-500">Date</p>
                                                <p className="font-semibold text-lg">{getCurrentDateIST()}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4">
                                            <Clock className="w-6 h-6 text-black mt-1" />
                                            <div>
                                                <p className="text-sm text-gray-500">Time</p>
                                                <p className="font-semibold text-lg">{localStorage.getItem("selectedShowTime") || "6:00 PM"}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <Ticket className="w-6 h-6 text-black mt-1" />
                                        <div>
                                            <p className="text-sm text-gray-500">Seats</p>
                                            <div className="flex flex-wrap gap-2 mt-1">
                                                {bookingData.seats.map((seat: any) => (
                                                    <span key={seat.id} className="font-semibold text-lg">
                                                        {seat.id} ({seat.section})
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Wallet Address Display */}
                                    <div className="flex items-start gap-4 pt-4 border-t border-gray-100">
                                        <Wallet className="w-6 h-6 text-black mt-1" />
                                        <div className="w-full">
                                            <p className="text-sm text-gray-500 mb-1">Wallet Address</p>
                                            <input
                                                type="text"
                                                value={walletAddress}
                                                onChange={(e) => setWalletAddress(e.target.value)}
                                                className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm font-mono text-black focus:outline-none focus:border-black transition-colors"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-8 border-t border-gray-100">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-gray-600 text-lg">Total Amount</span>
                                    <span className="text-4xl font-bold text-black">{bookingData.totalApt} APT</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Button */}
                <div className="mt-8 flex flex-col items-center">
                    <Button
                        onClick={handleMint}
                        variant="outline"
                        className="w-full max-w-md h-14 text-lg border-2 border-black text-black hover:bg-black hover:text-white rounded-xl transition-all uppercase tracking-wider font-bold"
                    >
                        Mint NFT Ticket
                    </Button>
                    <p className="text-center text-sm text-gray-400 mt-4">
                        By clicking confirm, you agree to mint this ticket as an NFT on the Aptos blockchain.
                    </p>
                </div>

            </div>
        </div>
    );
};

export default UserDetails;

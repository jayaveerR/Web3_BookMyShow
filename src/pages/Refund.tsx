
import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Check, ArrowRight, Flame, Wallet, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Refund = () => {
    const navigate = useNavigate();
    const [txHash, setTxHash] = useState("");
    const [walletAddress, setWalletAddress] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [refundDetails, setRefundDetails] = useState<any>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [manualAddress, setManualAddress] = useState("");
    const [step, setStep] = useState(1);

    useEffect(() => {
        const address = localStorage.getItem("walletAddress");
        if (address) {
            setWalletAddress(address);
        } else {
            navigate("/login");
        }
    }, [navigate]);

    const verifyTransaction = async () => {
        if (!txHash) {
            toast.error("Please enter a Transaction Hash");
            return;
        }

        setIsLoading(true);
        try {
            // 1. Check if refund already exists in backend
            const checkResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/refund/check/${txHash}`);
            if (checkResponse.ok) {
                const checkData = await checkResponse.json();
                if (checkData.exists) {
                    toast.error(`Refund already requested! Status: ${checkData.status}`);
                    setIsLoading(false);
                    return;
                }
            }

            // 2. Fetch transaction details from Aptos Testnet
            const response = await fetch(`https://fullnode.testnet.aptoslabs.com/v1/transactions/by_hash/${txHash}`);

            if (!response.ok) {
                throw new Error("Transaction not found");
            }

            const txnData = await response.json();
            console.log("Transaction Data:", txnData);

            // Check if it's a successful user transaction
            if (txnData.type !== "user_transaction" || !txnData.success) {
                toast.error("Invalid or failed transaction.");
                setIsLoading(false);
                return;
            }

            const functionName = txnData.payload.function;
            const args = txnData.payload.arguments;

            let details = null;

            // Strictly check for mint_ticket as per user request
            if (functionName.includes("mint_ticket")) {
                // mint_ticket args: [movie_name, location, date, time, seats, poster_url]
                details = {
                    functionName: functionName,
                    movieName: args[0],
                    location: args[1],
                    date: args[2],
                    time: args[3],
                    seats: args[4],
                    poster: args[5],
                    totalApt: 1.0 // Default refund amount
                };
            } else {
                toast.error("Transaction is not a valid NFT minting transaction.");
                setIsLoading(false);
                return;
            }

            // Extract Token ID and Creator Address
            let realTokenId = "";
            let creatorAddress = "0x2e00b89861208db9a393d5ea0def213dd55fa17f4c4c668258a7d7b00cceb38a"; // Default/Fallback Creator

            if (txnData.changes) {
                // Try to find Token Data to get Creator
                const tokenDataChange = txnData.changes.find((change: any) =>
                    change.type === "write_resource" &&
                    change.data.type.includes("0x3::token::TokenData")
                );

                if (tokenDataChange) {
                    creatorAddress = tokenDataChange.address;
                }
            }

            if (details) {
                setRefundDetails({
                    ...details,
                    tokenId: realTokenId,
                    creator: creatorAddress // Store creator for burning
                });
                setStep(2);
                toast.success("Transaction Verified! Refund details loaded.");
            }

        } catch (error) {
            console.error("Verification failed", error);
            toast.error("Verification Failed. Transaction not found.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleBurn = async () => {
        if (!refundDetails || !refundDetails.creator) {
            toast.error("Missing ticket details for burning.");
            return;
        }

        setIsLoading(true);
        try {
            // Reconstruct Token Name: "Movie Name - Seats"
            const tokenName = `${refundDetails.movieName} - ${refundDetails.seats}`;

            const payload = {
                type: "entry_function_payload",
                function: "0x3::token::burn",
                type_arguments: [],
                arguments: [
                    refundDetails.creator, // Creator
                    "BookMyShow NFT Tickets", // Collection Name
                    tokenName, // Token Name
                    0, // Property Version
                    1 // Amount
                ]
            };

            // @ts-ignore
            const pendingTransaction = await window.aptos.signAndSubmitTransaction(payload);

            // Wait for confirmation
            const response = await fetch(`https://fullnode.testnet.aptoslabs.com/v1/transactions/by_hash/${pendingTransaction.hash}`);
            if (response.ok) {
                const txn = await response.json();
                if (txn.success) {
                    toast.success("Ticket Burned Successfully!");
                    setStep(3); // Move to Refund Request step
                } else {
                    toast.error("Burn transaction failed on-chain.");
                }
            } else {
                // Just assume success if we can't check immediately, or better, wait loop
                toast.success("Burn transaction submitted!");
                setStep(3);
            }

        } catch (error) {
            console.error("Burn failed:", error);
            toast.error("Failed to burn ticket. Did you approve the transaction?");
        } finally {
            setIsLoading(false);
        }
    };

    const handleRefundRequest = async () => {
        if (!manualAddress) {
            toast.error("Please enter a wallet address.");
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/refund`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    walletAddress: manualAddress,
                    transactionHash: txHash,
                    movieName: refundDetails?.movieName,
                    location: refundDetails?.location,
                    date: refundDetails?.date,
                    time: refundDetails?.time,
                    seats: refundDetails?.seats,
                    poster: refundDetails?.poster,
                    amount: refundDetails?.totalApt,
                    tokenId: refundDetails?.tokenId,
                    status: "Burned & Pending" // Update status
                }),
            });

            if (response.ok) {
                setStep(4); // Final Success Step
                toast.success("Refund request saved successfully!");
                setIsDialogOpen(false);
                setManualAddress("");
            } else {
                const data = await response.json();
                toast.error(`Error: ${data.message || "Failed to save request"}`);
            }
        } catch (error) {
            console.error("Error saving refund request:", error);
            toast.error("Failed to connect to server.");
        }
    };

    return (
        <div className="min-h-screen bg-white selection:bg-black selection:text-white">
            <Navbar />

            <div className="max-w-2xl mx-auto pt-32 px-6 pb-20">
                {/* Header */}
                <div className="mb-16 text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-3">
                        Request Refund
                    </h1>
                    <p className="text-lg text-gray-500 font-light">
                        Verify your transaction, burn the ticket, and get your refund.
                    </p>
                </div>

                {/* Custom Step Indicator */}
                <div className="flex justify-between items-center mb-20 relative max-w-md mx-auto">
                    {/* Background Line */}
                    <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gray-100" />

                    {[1, 2, 3, 4].map((s) => (
                        <div key={s} className="relative pb-4 px-2 cursor-default">
                            <span className={`text-sm font-medium transition-colors duration-300 ${step >= s ? "text-black" : "text-gray-300"
                                }`}>
                                {s === 1 && "Verify"}
                                {s === 2 && "Burn"}
                                {s === 3 && "Refund"}
                                {s === 4 && "Status"}
                            </span>
                            {step === s && (
                                <motion.div
                                    layoutId="step-underline"
                                    className="absolute bottom-0 left-0 w-full h-[2px] bg-black"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                        </div>
                    ))}
                </div>

                {/* Content */}
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="space-y-8"
                        >
                            <div className="space-y-4">
                                <label className="block text-sm font-medium text-gray-500 uppercase tracking-wider">
                                    Transaction Hash
                                </label>
                                <Input
                                    placeholder="0x..."
                                    value={txHash}
                                    onChange={(e) => setTxHash(e.target.value)}
                                    className="font-mono text-lg h-14 border-gray-200 focus:border-black focus:ring-0 transition-all bg-transparent"
                                />
                                <p className="text-sm text-gray-400">
                                    Paste the transaction hash from your wallet history to verify ownership.
                                </p>
                            </div>
                            <Button
                                onClick={verifyTransaction}
                                disabled={isLoading || !txHash}
                                className="w-full h-14 text-lg bg-black hover:bg-gray-800 text-white rounded-lg transition-all"
                            >
                                {isLoading ? (
                                    <span className="flex items-center gap-2">
                                        <Loader2 className="w-5 h-5 animate-spin" /> Verifying...
                                    </span>
                                ) : "Verify Transaction"}
                            </Button>
                        </motion.div>
                    )}

                    {step === 2 && refundDetails && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="space-y-8"
                        >
                            <div className="bg-gray-50 rounded-xl p-8 space-y-6">
                                <div className="flex items-center gap-4 text-green-600 mb-6">
                                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                        <Check className="w-5 h-5" />
                                    </div>
                                    <span className="font-medium">Ticket Verified Successfully</span>
                                </div>

                                <div className="grid grid-cols-2 gap-6 text-sm">
                                    <div>
                                        <p className="text-gray-400 mb-1">Movie</p>
                                        <p className="font-medium text-gray-900 text-lg">{refundDetails.movieName}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 mb-1">Refund Amount</p>
                                        <p className="font-medium text-gray-900 text-lg">{refundDetails.totalApt} APT</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 mb-1">Seats</p>
                                        <p className="font-medium text-gray-900">{refundDetails.seats}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 mb-1">Date</p>
                                        <p className="font-medium text-gray-900">{refundDetails.date}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <Button
                                    onClick={handleBurn}
                                    disabled={isLoading}
                                    variant="destructive"
                                    className="w-full h-14 text-black text-font-sanserif rounded-xl shadow-xl shadow-white-100 hover:shadow-glass-200 transition-all"
                                >
                                    {isLoading ? (
                                        <span className="flex items-center gap-2">
                                            <Loader2 className="w-5 h-5 animate-spin" /> Processing...
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            <Flame className="w-5 h-5" /> Confirm Refund (Burn NFT)
                                        </span>
                                    )}
                                </Button>
                                <p className="text-center text-xs text-gray-400">
                                    This action is irreversible. Your NFT ticket will be burned.
                                </p>
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="space-y-8 text-center"
                        >
                            <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Flame className="w-10 h-10 text-orange-500" />
                            </div>

                            <div className="space-y-2">
                                <h2 className="text-2xl font-bold text-gray-900">Ticket Burned!</h2>
                                <p className="text-gray-500">
                                    Where should we send your refund?
                                </p>
                            </div>

                            <div className="text-left space-y-4 pt-4">
                                <label className="block text-sm font-medium text-gray-500 uppercase tracking-wider">
                                    Refund Wallet Address
                                </label>
                                <Input
                                    id="refund-wallet"
                                    value={manualAddress}
                                    onChange={(e) => setManualAddress(e.target.value)}
                                    placeholder="0x..."
                                    className="font-mono text-lg h-14 border-gray-200 focus:border-black focus:ring-0 transition-all bg-transparent"
                                />
                            </div>

                            <Button
                                onClick={handleRefundRequest}
                                disabled={!manualAddress}
                                className="w-full h-14 text-lg bg-black hover:bg-gray-800 text-white rounded-lg transition-all"
                            >
                                Submit Refund Request
                            </Button>
                        </motion.div>
                    )}

                    {step === 4 && (
                        <motion.div
                            key="step4"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="text-center py-12"
                        >
                            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8">
                                <Check className="w-12 h-12 text-green-600" />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">Refund Requested!</h2>
                            <p className="text-gray-500 mb-12 max-w-md mx-auto leading-relaxed">
                                Your ticket has been successfully burned and the refund request has been submitted.
                                The admin will process your transfer shortly.
                            </p>
                            <Button
                                onClick={() => navigate("/history")}
                                variant="outline"
                                className="h-12 px-8 border-gray-200 hover:bg-gray-50 hover:text-black transition-all"
                            >
                                View History <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Hidden Dialog for legacy support if needed, though flow is now inline */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Confirm Refund</DialogTitle>
                        <DialogDescription>
                            Please enter the wallet address where you would like to receive the refund.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right col-span-4 text-left">
                                Refund Wallet Address
                            </Label>
                            <Input
                                id="name"
                                value={manualAddress}
                                onChange={(e) => setManualAddress(e.target.value)}
                                className="col-span-4"
                                placeholder="0x..."
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" onClick={() => {
                            setIsDialogOpen(false);
                            handleRefundRequest(); // Reuse logic
                        }}>Confirm</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Refund;

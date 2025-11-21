import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { movies } from "../data/movies";
import { getCurrentDateIST } from "@/utils/date";

// ================= SECTION DATA =================
interface Section {
    name: string;
    apt: number;
    rows: string[];
    seatsPerRow: number;
}

const sections: Section[] = [
    { name: "Premium BALCONY", apt: 1, rows: ["A", "B", "C"], seatsPerRow: 18 },
    { name: "Premium SOFA", apt: 1, rows: ["A", "B", "C", "D"], seatsPerRow: 18 },
    { name: "Premium FIRST CLASS", apt: 1, rows: ["A", "B", "C", "D", "E", "F", "G", "H"], seatsPerRow: 18 },
    { name: "NonPremium SECOND CLASS", apt: 1, rows: ["A", "B", "C", "D"], seatsPerRow: 18 },
];

// ================= TYPES =================
interface Seat {
    id: string;
    status: "available" | "selected" | "sold";
    section: string;
    price: number;
}

// ================= SEAT POPUP =================
function SeatPopup({
    onClose,
    setSeatLimit,
    seatLimit,
}: {
    onClose: () => void;
    setSeatLimit: (n: number) => void;
    seatLimit: number;
}) {
    const seatImages = [
        "https://i.pinimg.com/1200x/d3/42/fb/d342fbd25901b9b2427c46c4d3b2d653.jpg", // cycle
        "https://i.pinimg.com/1200x/0e/e3/46/0ee34603488d70a9159f55aeb0a2ff67.jpg", // bike
        "https://i.pinimg.com/736x/d5/70/e1/d570e11f367af2884eeed4318244cf6d.jpg", // auto
        "https://i.pinimg.com/736x/bd/2d/4f/bd2d4f06db84582ed5926508e5cd2223.jpg", // car
    ];
    const transportNames = ["Cycle", "Bike", "Auto", "Car"];
    const seatLimits = [1, 2, 3, 4];
    const [currentImg, setCurrentImg] = useState(0);

    useEffect(() => {
        const index = seatLimits.indexOf(seatLimit);
        if (index >= 0) setCurrentImg(index);
    }, [seatLimit]);

    const handleTransportChange = (index: number) => {
        setCurrentImg(index);
        setSeatLimit(seatLimits[index]);
    };

    return (
        <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <motion.div
                className="relative max-w-md mx-auto bg-white rounded-xl shadow-lg p-6 text-center"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                <h2 className="text-lg font-semibold mb-4">How many seats?</h2>
                <div className="mb-4">
                    <img src={seatImages[currentImg]} alt="transport" className="w-32 h-32 mx-auto object-contain" />
                </div>
                <div className="flex justify-center gap-4 mb-4">
                    {transportNames.map((name, index) => (
                        <button
                            key={index}
                            onClick={() => handleTransportChange(index)}
                            className={`text-base font-normal px-2 py-1 border-b-2 transition ${currentImg === index
                                ? "border-red-500 text-red-500"
                                : "border-transparent text-gray-700 hover:text-black"
                                }`}
                        >
                            {name}
                        </button>
                    ))}
                </div>
                {/* Premium Options */}{" "}
                <div className="flex justify-between border-t border-gray-200 pt-4 mb-4 text-sm">
                    {" "}
                    <div>
                        {" "}
                        <p className="font-semibold">PREMIUM BALCONY</p> <p className="text-gray-600">1 APT</p>{" "}
                        <p className="text-yellow-500">FILLING FAST</p>{" "}
                    </div>{" "}
                    <div>
                        {" "}
                        <p className="font-semibold">PREMIUM SOFA</p> <p className="text-gray-600">1 APT</p>{" "}
                        <p className="text-green-500">AVAILABLE</p>{" "}
                    </div>{" "}
                    <div>
                        {" "}
                        <p className="font-semibold">PREMIUM FIRST CLASS</p> <p className="text-gray-600">1 APT</p>{" "}
                        <p className="text-green-500">AVAILABLE</p>{" "}
                    </div>{" "}
                </div>
                <button
                    onClick={onClose}
                    className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition"
                >
                    Select Seats
                </button>
            </motion.div>
        </motion.div>
    );
}

// ================= MAIN COMPONENT =================
export default function BookingFlow() {
    const navigate = useNavigate();
    const { id } = useParams(); // Get movie ID from URL
    const [seats, setSeats] = useState<Record<string, Seat[]>>({});
    const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
    const [showAlert, setShowAlert] = useState<string | null>(null);
    const [showPopup, setShowPopup] = useState(true);
    const [seatLimit, setSeatLimit] = useState(1);
    const [rewardBalance, setRewardBalance] = useState(0);
    const [useRewards, setUseRewards] = useState(false);

    // init seats with random sold
    useEffect(() => {
        const generatedSeats: Record<string, Seat[]> = {};
        sections.forEach((section) => {
            generatedSeats[section.name] = section.rows.flatMap((row) =>
                Array.from({ length: section.seatsPerRow }, (_, i) => {
                    const seatId = `${row}${i + 1}`;
                    const isSold = Math.random() < 0.2; // 20% random sold
                    return {
                        id: seatId,
                        status: isSold ? "sold" : "available",
                        section: section.name,
                        price: section.apt,
                    };
                })
            );
        });
        setSeats(generatedSeats);

        // Load rewards
        const savedRewards = parseFloat(localStorage.getItem("userRewards") || "0");
        setRewardBalance(savedRewards);
    }, []);

    // toggle seat
    const toggleSeat = (sectionName: string, seatId: string) => {
        const seat = seats[sectionName].find((s) => s.id === seatId);
        if (!seat || seat.status === "sold") return;

        const alreadySelected = selectedSeats.find((s) => s.id === seatId);

        if (alreadySelected) {
            setSeats((prev) => ({
                ...prev,
                [sectionName]: prev[sectionName].map((s) => (s.id === seatId ? { ...s, status: "available" } : s)),
            }));
            setSelectedSeats((prev) => prev.filter((s) => s.id !== seatId));
        } else {
            if (selectedSeats.length >= seatLimit) {
                setShowAlert(`You can only select ${seatLimit} seat(s) 🚫`);
                setTimeout(() => setShowAlert(null), 2000);
                return;
            }
            setSeats((prev) => ({
                ...prev,
                [sectionName]: prev[sectionName].map((s) => (s.id === seatId ? { ...s, status: "selected" } : s)),
            }));
            setSelectedSeats((prev) => [...prev, { ...seat, status: "selected" }]);
        }
    };

    const totalApt = selectedSeats.reduce((sum, s) => sum + s.price, 0);
    const discount = useRewards ? Math.min(totalApt, rewardBalance) : 0;
    const finalPrice = Math.max(0, totalApt - discount);

    const handlePayAndContinue = async () => {
        if (selectedSeats.length === 0) {
            setShowAlert("Please select at least 1 seat 🚨");
            setTimeout(() => setShowAlert(null), 2000);
            return;
        }

        // Check if Petra wallet is present
        const aptos = (window as any).aptos;
        if (!aptos) {
            setShowAlert("Petra Wallet not found! 🚫");
            setTimeout(() => setShowAlert(null), 2000);
            window.open("https://petra.app/", "_blank");
            return;
        }

        try {
            const seatNumbers = selectedSeats.map(s => s.id).join(",");
            // 1 APT = 100,000,000 Octas
            // 1 APT = 100,000,000 Octas
            const priceInOctas = Math.floor(finalPrice * 100_000_000);

            // Smart Contract Details
            const moduleAddress = "0xeeccc2d73cad08f9be2e6b3c3d394b3677bdff0350b68ec45f95b3bcaec1f8b1";
            const treasuryAddress = "0x7d467845ae28ea6b0adf38546c6fd0a1ba70733ed825a10c32d5a456bedb7d46";

            // Get movie details
            const movie = movies.find((m) => m.id === Number(id));
            const movieName = movie ? movie.title : "Unknown Movie";
            const location = movie ? movie.location : "Annapurna Theatre, Mangalagiri"; // Default fallback
            const date = getCurrentDateIST();

            const transaction = {
                function: `${moduleAddress}::TicketBooking::book_ticket_v5`,
                type_arguments: [],
                arguments: [
                    movieName,       // movie_name
                    treasuryAddress, // treasury_address
                    location,        // location
                    date,            // date
                    seatNumbers,     // seat_number
                    priceInOctas.toString() // price
                ],
            };

            const pendingTransaction = await aptos.signAndSubmitTransaction(transaction);
            console.log("Transaction Pending:", pendingTransaction);

            // Save booking to backend
            try {
                const bookingPayload = {
                    walletAddress: localStorage.getItem("walletAddress"),
                    movieName: movieName,
                    location: location,
                    date: date,
                    time: "6:00 PM",
                    seats: selectedSeats.map(s => s.id),
                    amount: finalPrice,
                    poster: movie?.poster,
                    transactionHash: pendingTransaction.hash
                };

                await fetch('http://localhost:5000/api/bookings', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(bookingPayload),
                });

                // Save transaction hash to separate collection
                await fetch('http://localhost:5000/api/transaction-hash', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        walletAddress: localStorage.getItem("walletAddress"),
                        transactionHash: pendingTransaction.hash,
                        movieName: movieName,
                        amount: finalPrice,
                        poster: movie?.poster,
                        location: location,
                        date: date,
                        time: "6:00 PM",
                        seats: selectedSeats.map(s => s.id)
                    }),
                });
            } catch (error) {
                console.error("Failed to save booking to backend:", error);
            }

            // Optimistically proceed or wait for confirmation (here we proceed)
            const seatsWithPrice = selectedSeats.map((seat) => ({
                section: seat.section,
                id: seat.id,
                price: seat.price,
            }));
            const data = { seats: seatsWithPrice, totalApt, movieId: id, txnHash: pendingTransaction.hash };
            sessionStorage.setItem("bookingData", JSON.stringify(data));

            // Award Rewards
            // Award Rewards & Deduct Used Rewards
            const rewardAmount = 0.001;
            let currentRewards = parseFloat(localStorage.getItem("userRewards") || "0");

            // Deduct used rewards first
            if (useRewards) {
                currentRewards -= discount;
            }

            // Add new rewards
            const newRewards = (currentRewards + rewardAmount).toFixed(3);
            localStorage.setItem("userRewards", newRewards);
            window.dispatchEvent(new Event("rewardsUpdated"));

            setShowAlert(`Booking Successful! You earned ${rewardAmount} APT Rewards! 🎉`);
            await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for alert

            navigate("/userdetails");

        } catch (error) {
            console.error("Transaction failed", error);
            setShowAlert("Transaction Failed ❌");
            setTimeout(() => setShowAlert(null), 2000);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />

            {/* Show Popup First */}
            <AnimatePresence>
                {showPopup && (
                    <SeatPopup onClose={() => setShowPopup(false)} setSeatLimit={setSeatLimit} seatLimit={seatLimit} />
                )}
            </AnimatePresence>

            {/* Seat Layout */}
            {!showPopup && (
                <div className="max-w-6xl mx-auto p-4 pt-28">
                    {/* Movie Screen */}
                    <div className="mb-6 flex justify-center">
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/7994/7994691.png"
                            alt="Movie Screen"
                            className="h-12 object-contain"
                        />
                    </div>

                    {/* Edit Ticket Button - Moved to Top */}
                    <div className="flex justify-end mb-4 px-4">
                        <button
                            onClick={() => setShowPopup(true)}
                            className="text-sm flex items-center gap-2 text-red-500 border border-red-500 px-4 py-2 rounded-lg hover:bg-red-50 transition"
                        >
                            <span className="text-lg">✎</span> Edit Ticket
                        </button>
                    </div>

                    {sections.map((section) => (
                        <div key={section.name} className="mb-8">
                            <h2 className="text-center text-sm text-gray-700 mb-2">
                                {section.name} • {section.apt} APT
                            </h2>
                            <div className="space-y-2">
                                {section.rows.map((row) => (
                                    <div key={row} className="flex items-center justify-center gap-3">
                                        <span className="w-6 text-xs text-gray-600">{row}</span>
                                        <div className="flex gap-6">
                                            <div className="flex gap-1">
                                                {seats[section.name]
                                                    ?.filter((s) => s.id.startsWith(row))
                                                    .slice(0, 9)
                                                    .map((seat) => (
                                                        <button
                                                            key={seat.id}
                                                            onClick={() => toggleSeat(section.name, seat.id)}
                                                            className={`w-7 h-7 rounded-sm text-[10px] flex items-center justify-center border ${seat.status === "available"
                                                                ? "bg-white border-green-400 text-green-600 hover:bg-green-100"
                                                                : seat.status === "selected"
                                                                    ? "bg-green-500 text-white"
                                                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                                }`}
                                                        >
                                                            {seat.id.replace(row, "")}
                                                        </button>
                                                    ))}
                                            </div>
                                            <div className="flex gap-1">
                                                {seats[section.name]
                                                    ?.filter((s) => s.id.startsWith(row))
                                                    .slice(9)
                                                    .map((seat) => (
                                                        <button
                                                            key={seat.id}
                                                            onClick={() => toggleSeat(section.name, seat.id)}
                                                            className={`w-7 h-7 rounded-sm text-[10px] flex items-center justify-center border ${seat.status === "available"
                                                                ? "bg-white border-green-400 text-green-600 hover:bg-green-100"
                                                                : seat.status === "selected"
                                                                    ? "bg-green-500 text-white"
                                                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                                }`}
                                                        >
                                                            {seat.id.replace(row, "")}
                                                        </button>
                                                    ))}
                                            </div>
                                        </div>
                                        <span className="w-6 text-xs text-gray-600">{row}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* Legend */}
                    <div className="flex justify-center gap-6 mt-6 mb-4 text-sm">
                        <div className="flex items-center gap-2">
                            <span className="w-5 h-5 bg-white border-green-400 border"></span> Available
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-5 h-5 bg-green-500"></span> Selected
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-5 h-5 bg-gray-300"></span> Sold
                        </div>
                    </div>

                    {/* Reward Redemption */}
                    {rewardBalance > 0 && (
                        <div className="bg-white p-4 rounded-lg shadow-sm mb-4 border border-yellow-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-semibold text-gray-800">Redeem Rewards</p>
                                    <p className="text-sm text-gray-500">Available: {rewardBalance.toFixed(3)} APT</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={useRewards}
                                        onChange={(e) => setUseRewards(e.target.checked)}
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
                                </label>
                            </div>
                            {useRewards && (
                                <p className="text-green-600 text-sm mt-2">
                                    - {discount.toFixed(3)} APT applied!
                                </p>
                            )}
                        </div>
                    )}

                    {/* Continue Button */}
                    <div className="mt-6 mb-10">
                        <button
                            onClick={handlePayAndContinue}
                            className="w-full border border-black text-black py-3 rounded-lg text-lg font-semibold shadow-lg transition-transform transform active:scale-95"
                        >
                            Pay {finalPrice.toFixed(3)} APT | Continue
                        </button>
                    </div>
                </div>
            )}

            {/* Alert */}
            <AnimatePresence>
                {showAlert && (
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 50, opacity: 0 }}
                        className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-2 rounded-lg shadow"
                    >
                        {showAlert}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

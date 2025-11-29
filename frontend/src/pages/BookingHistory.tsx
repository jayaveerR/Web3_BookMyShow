import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Copy, Check, ExternalLink, Clock, Ticket } from "lucide-react";

interface Booking {
  _id: string;
  walletAddress: string;
  movieName: string;
  location: string;
  date: string;
  time: string;
  seats: string[];
  amount: number;
  poster: string;
  transactionHash: string;
  tokenId?: string;
  createdAt: string;
}

interface Refund {
  _id: string;
  walletAddress: string;
  movieName: string;
  amount: number;
  status: string;
  transactionHash: string;
  createdAt: string;
  poster?: string;
  location?: string;
  date?: string;
  time?: string;
  seats?: string;
}

interface TransactionHash {
  _id: string;
  walletAddress: string;
  transactionHash: string;
  movieName: string;
  amount: number;
  poster: string;
  location?: string;
  date?: string;
  time?: string;
  seats?: string[];
  createdAt: string;
}

interface NFTMinting {
  _id: string;
  walletAddress: string;
  transactionHash: string;
  tokenId: string;
  movieName: string;
  poster: string;
  location?: string;
  date?: string;
  time?: string;
  seats?: string[];
  price?: number;
  createdAt: string;
}

const BookingHistory = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [refunds, setRefunds] = useState<Refund[]>([]);
  const [transactions, setTransactions] = useState<TransactionHash[]>([]);
  const [nftMintings, setNftMintings] = useState<NFTMinting[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'bookings' | 'refunds' | 'transactions' | 'nftMinting'>('bookings');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      const walletAddress = localStorage.getItem("walletAddress");
      console.log("Fetching history for wallet:", walletAddress);

      if (!walletAddress) {
        setLoading(false);
        return;
      }

      try {
        // Fetch Bookings
        const bookingsResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/bookings/${walletAddress}`);
        if (bookingsResponse.ok) {
          const bookingsData = await bookingsResponse.json();
          setBookings(bookingsData);
        }

        // Fetch Refunds
        const refundsResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/refunds/${walletAddress}`);
        if (refundsResponse.ok) {
          const refundsData = await refundsResponse.json();
          setRefunds(refundsData);
        }

        // Fetch Transaction Hashes (Transaction_Hash_Code)
        const txResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/transaction-hash/${walletAddress}`);
        if (txResponse.ok) {
          const txData = await txResponse.json();
          setTransactions(txData);
        }

        // Fetch NFT Minting History
        const nftResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/nft-minting/${walletAddress}`);
        if (nftResponse.ok) {
          const nftData = await nftResponse.json();
          setNftMintings(nftData);
        }

      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(text);
    toast.success("Transaction Hash Copied!");
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="max-w-6xl mx-auto pt-24 px-4 pb-12">
        <h1 className="text-3xl font-bold mb-2">My Activity</h1>
        <p className="text-sm text-muted-foreground mb-8 font-mono">
          Connected Wallet: {localStorage.getItem("walletAddress") || "Not Connected"}
        </p>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-border overflow-x-auto">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`pb-2 px-4 text-sm font-medium transition-colors relative whitespace-nowrap ${activeTab === 'bookings' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
          >
            Bookings
            {activeTab === 'bookings' && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('refunds')}
            className={`pb-2 px-4 text-sm font-medium transition-colors relative whitespace-nowrap ${activeTab === 'refunds' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
          >
            Refunds
            {activeTab === 'refunds' && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`pb-2 px-4 text-sm font-medium transition-colors relative whitespace-nowrap ${activeTab === 'transactions' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
          >
            Transaction History
            {activeTab === 'transactions' && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('nftMinting')}
            className={`pb-2 px-4 text-sm font-medium transition-colors relative whitespace-nowrap ${activeTab === 'nftMinting' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
          >
            NFT Minting
            {activeTab === 'nftMinting' && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              bookings.length > 0 ? (
                bookings.map((booking) => (
                  <motion.div
                    key={booking._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-card rounded-lg border border-border p-6 flex gap-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="w-24 h-36 flex-shrink-0 bg-muted rounded-md overflow-hidden">
                      <img src={booking.poster} alt={booking.movieName} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-semibold mb-2">{booking.movieName}</h3>
                          <p className="text-muted-foreground text-sm mb-1">{booking.location}</p>
                          <p className="text-muted-foreground text-sm mb-4">
                            {booking.date} at {booking.time}
                          </p>
                          <p className="text-xs font-mono font-bold text-primary bg-primary/10 inline-block px-2 py-1 rounded break-all">
                            ID: {booking.tokenId ? booking.tokenId : `#NFT-${booking.transactionHash.slice(-6).toUpperCase()}`}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                            Confirmed
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between items-end mt-4 pt-4 border-t border-border">
                        <div>
                          <p className="text-sm font-medium">Seats: {booking.seats.join(", ")}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-xs text-muted-foreground font-mono">
                              Tx: {booking.transactionHash.slice(0, 6)}...{booking.transactionHash.slice(-4)}
                            </p>
                            <button
                              onClick={() => copyToClipboard(booking.transactionHash)}
                              className="text-muted-foreground hover:text-foreground transition-colors"
                              title="Copy Transaction Hash"
                            >
                              {copiedHash === booking.transactionHash ? <Check size={12} /> : <Copy size={12} />}
                            </button>
                          </div>
                        </div>
                        <p className="text-lg font-bold">{booking.amount} APT</p>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-12 border border-dashed border-border rounded-lg">
                  <p className="text-muted-foreground">No bookings found</p>
                </div>
              )
            )}

            {/* Refunds Tab */}
            {activeTab === 'refunds' && (
              refunds.length > 0 ? (
                refunds.map((refund) => (
                  <motion.div
                    key={refund._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-card rounded-lg border border-border p-6 flex gap-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                    {/* Movie Poster */}
                    <div className="w-24 h-36 flex-shrink-0 bg-muted rounded-md overflow-hidden">
                      <img
                        src={refund.poster?.startsWith('ipfs://')
                          ? refund.poster.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/')
                          : (refund.poster || "/placeholder.svg")}
                        alt={refund.movieName}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-semibold mb-2">{refund.movieName}</h3>
                          <p className="text-muted-foreground text-sm mb-1">{refund.location || "Location N/A"}</p>
                          <p className="text-muted-foreground text-sm mb-4">
                            {refund.date || "Date N/A"} at {refund.time || "Time N/A"}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={`inline-block text-xs px-2 py-1 rounded-full font-medium ${refund.status === 'Processed' ? 'bg-green-100 text-green-800' :
                            refund.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                            {refund.status}
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between items-end mt-4 pt-4 border-t border-border">
                        <div>
                          <p className="text-sm font-medium">Seats: {refund.seats || "N/A"}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-xs text-muted-foreground font-mono">
                              Tx: {refund.transactionHash.slice(0, 6)}...{refund.transactionHash.slice(-4)}
                            </p>
                            <button
                              onClick={() => copyToClipboard(refund.transactionHash)}
                              className="text-muted-foreground hover:text-foreground transition-colors"
                              title="Copy Transaction Hash"
                            >
                              {copiedHash === refund.transactionHash ? <Check size={12} /> : <Copy size={12} />}
                            </button>
                          </div>
                        </div>
                        <p className="text-lg font-bold">{refund.amount} APT</p>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-12 border border-dashed border-border rounded-lg">
                  <p className="text-muted-foreground">No refund requests found</p>
                </div>
              )
            )}

            {/* Transactions Tab */}
            {activeTab === 'transactions' && (
              transactions.length > 0 ? (
                transactions.map((tx) => (
                  <motion.div
                    key={tx._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-card rounded-lg border border-border p-6 flex gap-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="w-24 h-36 flex-shrink-0 bg-muted rounded-md overflow-hidden">
                      <img src={tx.poster} alt={tx.movieName} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-semibold mb-2">{tx.movieName}</h3>
                          <p className="text-muted-foreground text-sm mb-1">{tx.location}</p>
                          <p className="text-muted-foreground text-sm mb-2">
                            {tx.date} • {tx.time}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium bg-blue-100 text-blue-800">
                              <Clock size={14} />
                              Transaction
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold">{tx.amount} APT</p>
                          <p className="text-xs text-muted-foreground mt-1">{formatDate(tx.createdAt)}</p>
                        </div>
                      </div>

                      <div className="flex justify-between items-end mt-4 pt-4 border-t border-border">
                        <div className="text-sm">
                          <p className="text-sm font-medium">Seats: {Array.isArray(tx.seats) ? tx.seats.join(", ") : tx.seats}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <a
                            href={`https://explorer.aptoslabs.com/txn/${tx.transactionHash}?network=testnet`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs text-primary hover:underline"
                          >
                            View on Explorer <ExternalLink size={12} />
                          </a>
                          <button
                            onClick={() => copyToClipboard(tx.transactionHash)}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                            title="Copy Transaction Hash"
                          >
                            {copiedHash === tx.transactionHash ? <Check size={12} /> : <Copy size={12} />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-12 border border-dashed border-border rounded-lg">
                  <p className="text-muted-foreground">No transaction history found</p>
                </div>
              )
            )}

            {/* NFT Minting Tab */}
            {activeTab === 'nftMinting' && (
              nftMintings.length > 0 ? (
                nftMintings.map((mint) => (
                  <motion.div
                    key={mint._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-card rounded-lg border border-border p-6 flex gap-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="w-24 h-36 flex-shrink-0 bg-muted rounded-md overflow-hidden">
                      <img src={mint.poster} alt={mint.movieName} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-semibold mb-2">{mint.movieName}</h3>
                          <p className="text-muted-foreground text-sm mb-1">{mint.location}</p>
                          <p className="text-muted-foreground text-sm mb-2">
                            {mint.date} • {mint.time}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium bg-purple-100 text-purple-800">
                              <Ticket size={14} />
                              NFT Minted
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold">{mint.price || 0} APT</p>
                          <p className="text-xs text-muted-foreground mt-1">{formatDate(mint.createdAt)}</p>
                        </div>
                      </div>

                      <div className="flex justify-between items-end mt-4 pt-4 border-t border-border">
                        <div className="text-sm">
                          <p className="text-sm font-medium">Seats: {Array.isArray(mint.seats) ? mint.seats.join(", ") : mint.seats}</p>
                          <p className="text-xs text-muted-foreground font-mono mt-1">Token ID: {mint.tokenId}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <a
                            href={`https://explorer.aptoslabs.com/txn/${mint.transactionHash}?network=testnet`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs text-primary hover:underline"
                          >
                            View on Explorer <ExternalLink size={12} />
                          </a>
                          <button
                            onClick={() => copyToClipboard(mint.transactionHash)}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                            title="Copy Transaction Hash"
                          >
                            {copiedHash === mint.transactionHash ? <Check size={12} /> : <Copy size={12} />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-12 border border-dashed border-border rounded-lg">
                  <p className="text-muted-foreground">No NFT minting history found</p>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingHistory;

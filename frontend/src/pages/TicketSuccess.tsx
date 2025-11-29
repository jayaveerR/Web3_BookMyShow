import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { CheckCircle, Download, Share2, Ticket, Copy } from "lucide-react";
import movie1 from "@/assets/movie-1.jpg";

const TicketSuccess = () => {
  const navigate = useNavigate();
  const [ticketData, setTicketData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = sessionStorage.getItem("ticketData");
    if (data) {
      try {
        const parsedData = JSON.parse(data);
        setTicketData(parsedData);

        // Check if already saved to avoid duplicates on refresh
        const isSaved = sessionStorage.getItem("nftSaved");
        if (!isSaved && parsedData.txnHash) {
          saveNftToBackend(parsedData);
        }
      } catch (e) {
        console.error("Error parsing ticket data:", e);
      }
    } else {
      console.warn("No ticket data found in sessionStorage");
    }
    setLoading(false);
  }, []);

  const saveNftToBackend = async (data: any) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/nft-minting`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: data.wallet,
          transactionHash: data.txnHash,
          movieName: data.movieTitle,
          poster: data.moviePoster,
          metadataUrl: data.nftMetadata,
          seats: data.seats,
          date: data.date,
          time: data.time,
          location: data.location,
          tokenId: data.tokenId || `NFT-${data.txnHash?.slice(-8).toUpperCase()}`, // Send Token ID or fallback
          price: data.totalApt || 0
        }),
      });

      // Also save to general Transaction History
      await fetch(`${import.meta.env.VITE_API_URL}/api/transaction-hash`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: data.wallet,
          transactionHash: data.txnHash,
          movieName: data.movieTitle + " (NFT Mint)",
          amount: 0,
          poster: data.moviePoster,
          location: data.location,
          date: data.date,
          time: data.time,
          seats: data.seats,
          tokenId: data.tokenId // Send Token ID
        }),
      });
      // Also save to Transfer History (for Transaction History page)
      await fetch(`${import.meta.env.VITE_API_URL}/api/transfers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactionHash: data.txnHash,
          from: "0x0000000000000000000000000000000000000000000000000000000000000000", // Minted from null address
          to: data.wallet,
          tokenId: data.tokenId,
          movieName: data.movieTitle,
          seats: Array.isArray(data.seats) ? data.seats.map((s: any) => s.id || s).join(", ") : data.seats,
          poster: data.moviePoster,
          location: data.location,
          date: data.date,
          time: data.time,
          transferType: 'gift', // Minting treated as a gift/receive
          price: data.totalApt || 0,
          commission: 0,
          status: 'completed'
        }),
      });

      sessionStorage.setItem("nftSaved", "true");
      console.log("NFT details saved to MongoDB and Transfer History");
    } catch (error) {
      console.error("Failed to save NFT details:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!ticketData) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">No Ticket Found</h1>
        <p className="text-muted-foreground mb-8">We couldn't find your ticket details. Please try booking again.</p>
        <Button onClick={() => navigate("/")}>Go Home</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <CheckCircle className="h-20 w-20 mx-auto mb-4 text-green-600" />
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Booking Successful!
          </h1>
          <p className="text-muted-foreground">
            Your NFT ticket has been minted and sent to your wallet
          </p>
        </div>

        {/* Ticket Canvas - Movie Poster + Details */}
        <div className="bg-card rounded-lg border-2 border-border overflow-hidden mb-6">
          <div className="grid md:grid-cols-2">
            {/* Left Side - Movie Poster */}
            <div className="relative h-full min-h-[500px] bg-black flex items-center justify-center overflow-hidden">
              <img
                src={ticketData.moviePoster || movie1}
                alt={ticketData.movieTitle || "Movie Poster"}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Right Side - Ticket Details */}
            <div className="p-8 flex flex-col justify-between bg-white">
              <div>
                <div className="bg-gradient-to-br from-cinema-hero to-secondary p-4 rounded-lg text-center mb-6 relative group">
                  <p className="text-sm text-muted-foreground mb-1">NFT Token ID</p>
                  <div className="flex items-center justify-center gap-2">
                    <p className="text-lg font-mono font-bold text-foreground break-all">
                      {ticketData.tokenId ? ticketData.tokenId : (ticketData.txnHash ? `#NFT-${ticketData.txnHash.slice(-6).toUpperCase()}` : "Pending...")}
                    </p>
                    {ticketData.tokenId && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => {
                          navigator.clipboard.writeText(ticketData.tokenId);
                          // toast.success("Token ID Copied!"); // Assuming toast is available or just silent copy
                        }}
                        title="Copy Token ID"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                  {ticketData.tokenId && (
                    <a
                      href={`https://explorer.aptoslabs.com/token/${ticketData.tokenId}/0?network=testnet`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline mt-1 block"
                    >
                      View on Explorer
                    </a>
                  )}
                </div>

                <div className="space-y-4 text-sm">
                  <div>
                    <p className="text-muted-foreground mb-1">Movie</p>
                    <p className="font-bold text-foreground text-xl">{ticketData.movieTitle || "Unknown Movie"}</p>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="text-muted-foreground mb-1">Theatre</p>
                      <p className="font-semibold text-foreground">{ticketData.location || "Unknown Location"}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-muted-foreground mb-1">Date</p>
                      <p className="font-semibold text-foreground">{ticketData.date || "N/A"}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-muted-foreground mb-1">Show Time</p>
                      <p className="font-semibold text-foreground">{ticketData.time || "N/A"}</p>
                    </div>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-muted-foreground mb-1">Seats</p>
                    <div className="flex flex-wrap gap-2">
                      {ticketData.seats?.length ? (
                        // Handle both array of objects (from booking) and string (from storage if saved differently)
                        Array.isArray(ticketData.seats) ?
                          ticketData.seats.map((s: any) => (
                            <span key={s.id || s} className="px-2 py-1 bg-white border border-gray-200 rounded text-xs font-medium">
                              {s.id || s}
                            </span>
                          )) : (
                            <span className="px-2 py-1 bg-white border border-gray-200 rounded text-xs font-medium">
                              {ticketData.seats}
                            </span>
                          )
                      ) : (
                        <span className="text-xs text-muted-foreground">No seats selected</span>
                      )}
                    </div>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-muted-foreground mb-1">Wallet Address</p>
                    <p className="font-mono text-xs font-semibold text-foreground break-all">
                      {ticketData.wallet || "Not Connected"}
                    </p>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-muted-foreground mb-1">Transaction Hash</p>
                    {ticketData.txnHash ? (
                      <a
                        href={`https://explorer.aptoslabs.com/txn/${ticketData.txnHash}?network=testnet`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-xs font-semibold text-primary hover:underline break-all"
                      >
                        {ticketData.txnHash}
                      </a>
                    ) : (
                      <p className="text-xs text-muted-foreground">Not Available</p>
                    )}
                  </div>

                  <div className="pt-4 border-t border-border mt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Amount Paid</span>
                      <span className="text-3xl font-bold text-cinema-price">{ticketData.totalApt || 0} APT</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* QR Code */}
              <div className="mt-6 text-center">
                <div className="inline-block p-2 bg-white border border-gray-200 rounded-lg">
                  <div className="w-24 h-24 bg-gray-900 flex items-center justify-center text-white text-xs">
                    [QR CODE]
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Scan at entrance</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button className="h-12" variant="default">
            <Ticket className="h-4 w-4 mr-2" />
            NFT Mint
          </Button>

          <Button className="h-12" variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>

          <Button className="h-12" variant="outline">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>

          <Button
            className="h-12"
            variant="outline"
            onClick={() => navigate("/history")}
          >
            History
          </Button>
        </div>

        {/* Info */}
        <div className="mt-8 p-4 bg-cinema-hero rounded-lg border border-border">
          <h3 className="font-semibold text-foreground mb-2">What's Next?</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Your NFT ticket is now in your Petra Wallet</li>
            <li>• You can transfer it to others if needed</li>
            <li>• Show the QR code at the theatre entrance</li>
            <li>• Earn reward points for this booking</li>
          </ul>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TicketSuccess;

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { CheckCircle, Download, Share2, Ticket } from "lucide-react";
import movie1 from "@/assets/movie-1.jpg";

const TicketSuccess = () => {
  const navigate = useNavigate();
  const [showTime, setShowTime] = useState("");
  const [walletAddress, setWalletAddress] = useState("");

  useEffect(() => {
    const savedTime = localStorage.getItem("selectedShowTime") || "6:00 PM";
    const wallet = localStorage.getItem("walletConnected") || "0x12a...89f";
    setShowTime(savedTime);
    setWalletAddress(wallet);
  }, []);

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
            <div className="relative">
              <img
                src={movie1}
                alt="Shadow Warriors"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Right Side - Ticket Details */}
            <div className="p-6 space-y-4">
              <div className="bg-gradient-to-br from-cinema-hero to-secondary p-4 rounded-lg text-center">
                <p className="text-sm text-muted-foreground mb-1">NFT Ticket ID</p>
                <p className="text-lg font-mono font-bold text-foreground">
                  #NFT-2025-00123
                </p>
              </div>

              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Movie</p>
                  <p className="font-semibold text-foreground text-lg">Shadow Warriors</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Theatre</p>
                  <p className="font-semibold text-foreground">Annapurna Theatre, Mangalagiri</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-muted-foreground mb-1">Date</p>
                    <p className="font-semibold text-foreground">Jan 20, 2025</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Show Time</p>
                    <p className="font-semibold text-foreground">{showTime}</p>
                  </div>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Wallet Address</p>
                  <p className="font-mono text-xs font-semibold text-foreground break-all">
                    {walletAddress}
                  </p>
                </div>
                <div className="pt-3 border-t border-border">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Amount Paid</span>
                    <span className="text-2xl font-bold text-cinema-price">2 APT</span>
                  </div>
                </div>
              </div>

              {/* QR Code */}
              <div className="bg-cinema-hero p-6 rounded-lg text-center border border-border">
                <div className="w-32 h-32 mx-auto bg-white rounded-lg flex items-center justify-center border-2 border-border">
                  <p className="text-sm text-muted-foreground">QR Code</p>
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  Show at theatre entrance
                </p>
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

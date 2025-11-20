import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { CheckCircle, Download, Share2 } from "lucide-react";

const TicketSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <CheckCircle className="h-20 w-20 mx-auto mb-4 text-green-600" />
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Booking Successful!
          </h1>
          <p className="text-muted-foreground">
            Your NFT ticket has been minted and sent to your wallet
          </p>
        </div>

        {/* Ticket Card */}
        <div className="bg-card rounded-lg border border-border overflow-hidden mb-6">
          <div className="bg-gradient-to-br from-cinema-hero to-secondary p-6 text-center">
            <p className="text-sm text-muted-foreground mb-1">NFT Ticket ID</p>
            <p className="text-lg font-mono font-bold text-foreground">
              #NFT-2025-00123
            </p>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">Movie</p>
                <p className="font-semibold text-foreground">Shadow Warriors</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Date & Time</p>
                <p className="font-semibold text-foreground">Jan 20, 6:00 PM</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Theatre</p>
                <p className="font-semibold text-foreground">Annapurna Theatre</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Location</p>
                <p className="font-semibold text-foreground">Mangalagiri</p>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Amount Paid</span>
                <span className="text-xl font-bold text-cinema-price">2 APT</span>
              </div>
            </div>
          </div>

          {/* QR Code Placeholder */}
          <div className="bg-cinema-hero p-8 text-center border-t border-border">
            <div className="w-48 h-48 mx-auto bg-white rounded-lg flex items-center justify-center border-2 border-border">
              <p className="text-sm text-muted-foreground">QR Code</p>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Show this QR code at the theatre entrance
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button className="w-full h-12" variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download Ticket
          </Button>
          
          <Button className="w-full h-12" variant="outline">
            <Share2 className="h-4 w-4 mr-2" />
            Share Ticket
          </Button>
          
          <Button 
            className="w-full h-12"
            onClick={() => navigate("/history")}
          >
            View Booking History
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

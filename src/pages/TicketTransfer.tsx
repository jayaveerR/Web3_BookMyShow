import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Send, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const TicketTransfer = () => {
  const [receiverAddress, setReceiverAddress] = useState("");
  const [isTransferring, setIsTransferring] = useState(false);

  const handleTransfer = async () => {
    if (!receiverAddress) {
      toast.error("Please enter a receiver address");
      return;
    }

    setIsTransferring(true);
    
    // Mock transfer - in production, integrate with blockchain
    setTimeout(() => {
      setIsTransferring(false);
      toast.success("Ticket transferred successfully!", {
        description: "The NFT ticket has been sent to the receiver's wallet",
        icon: <CheckCircle className="h-5 w-5" />,
      });
      setReceiverAddress("");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <Send className="h-16 w-16 mx-auto mb-4 text-foreground" />
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Transfer Ticket
          </h1>
          <p className="text-muted-foreground">
            Send your NFT ticket to another wallet
          </p>
        </div>

        <div className="bg-card p-8 rounded-lg border border-border space-y-6">
          <div className="space-y-2">
            <Label htmlFor="receiver">Receiver Wallet Address</Label>
            <Input
              id="receiver"
              type="text"
              placeholder="0x..."
              value={receiverAddress}
              onChange={(e) => setReceiverAddress(e.target.value)}
              className="font-mono"
            />
            <p className="text-xs text-muted-foreground">
              Enter the Aptos wallet address of the recipient
            </p>
          </div>

          <Button
            className="w-full h-12"
            onClick={handleTransfer}
            disabled={isTransferring}
          >
            {isTransferring ? "Transferring..." : "Transfer Ticket"}
          </Button>

          <div className="pt-4 border-t border-border">
            <h3 className="font-semibold text-foreground mb-2">Important Notes:</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• This action requires wallet signature confirmation</li>
              <li>• Once transferred, the ticket cannot be recovered</li>
              <li>• Ensure the receiver address is correct</li>
              <li>• Transfer is instant and on-chain</li>
            </ul>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TicketTransfer;

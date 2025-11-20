import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ScanLine, CheckCircle, XCircle } from "lucide-react";

const TicketScanner = () => {
  const [scanStatus, setScanStatus] = useState<"idle" | "valid" | "invalid">("idle");
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = () => {
    setIsScanning(true);
    
    // Mock scan - in production, integrate with QR scanner and blockchain validation
    setTimeout(() => {
      const isValid = Math.random() > 0.3; // 70% chance of valid ticket
      setScanStatus(isValid ? "valid" : "invalid");
      setIsScanning(false);
    }, 1500);
  };

  const resetScanner = () => {
    setScanStatus("idle");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <ScanLine className="h-16 w-16 mx-auto mb-4 text-foreground" />
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Ticket Scanner
          </h1>
          <p className="text-muted-foreground">
            For theatre staff - Validate NFT tickets
          </p>
        </div>

        <div className="bg-card p-8 rounded-lg border border-border">
          {/* Scanner Area */}
          <div className="relative aspect-square max-w-md mx-auto mb-8">
            <div className="absolute inset-0 border-4 border-foreground rounded-lg overflow-hidden">
              <div className="w-full h-full bg-cinema-hero flex items-center justify-center">
                {scanStatus === "idle" && (
                  <ScanLine className="h-24 w-24 text-muted-foreground animate-pulse" />
                )}
                {scanStatus === "valid" && (
                  <div className="text-center">
                    <CheckCircle className="h-24 w-24 text-green-600 mx-auto mb-4" />
                    <p className="text-2xl font-bold text-green-600">VALID TICKET</p>
                  </div>
                )}
                {scanStatus === "invalid" && (
                  <div className="text-center">
                    <XCircle className="h-24 w-24 text-red-600 mx-auto mb-4" />
                    <p className="text-2xl font-bold text-red-600">INVALID TICKET</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Scanning animation overlay */}
            {isScanning && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="h-1 bg-cinema-price animate-scan" />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {scanStatus === "idle" && (
              <Button
                className="w-full h-12"
                onClick={handleScan}
                disabled={isScanning}
              >
                {isScanning ? "Scanning..." : "Scan QR Code"}
              </Button>
            )}
            
            {scanStatus !== "idle" && (
              <Button
                variant="outline"
                className="w-full h-12"
                onClick={resetScanner}
              >
                Scan Another Ticket
              </Button>
            )}
          </div>

          {/* Instructions */}
          <div className="mt-8 pt-6 border-t border-border">
            <h3 className="font-semibold text-foreground mb-3">How to use:</h3>
            <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
              <li>Ask the customer to show their NFT ticket QR code</li>
              <li>Click "Scan QR Code" button</li>
              <li>Point camera at the QR code</li>
              <li>System will validate ticket on blockchain</li>
              <li>Allow entry if ticket is valid</li>
            </ol>
          </div>
        </div>
      </div>

      <Footer />
      
      <style>{`
        @keyframes scan {
          0% { transform: translateY(0); }
          100% { transform: translateY(100vh); }
        }
        .animate-scan {
          animation: scan 1.5s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default TicketScanner;

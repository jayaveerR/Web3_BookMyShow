import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Film, Wallet } from "lucide-react";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const [isConnecting, setIsConnecting] = useState(false);

  // Check if already connected
  useEffect(() => {
    const walletAddress = localStorage.getItem("walletAddress");
    if (walletAddress) {
      navigate("/");
    }
  }, [navigate]);

  const handleConnectWallet = async () => {
    setIsConnecting(true);

    try {
      // Integrated Petra Wallet connection
      const petra = (window as any).aptos;
      if (!petra) {
        toast.error("Petra Wallet not found. Please install it first.");
        window.open("https://petra.app/", "_blank");
        setIsConnecting(false);
        return;
      }

      const response = await petra.connect();
      const address = response.address;

      localStorage.setItem("walletAddress", address);
      localStorage.setItem("isWalletConnected", "true");

      toast.success("Wallet Connected Successfully!", {
        description: `Address: ${address.slice(0, 6)}...${address.slice(-4)}`,
      });

      // Redirect to homepage
      navigate("/");
    } catch (error) {
      console.error("Wallet connection error:", error);
      toast.error("Failed to connect wallet. Please try again.");
      setIsConnecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo and Branding */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <Film className="h-16 w-16 text-foreground" />
          </div>

          <h1 className="text-4xl font-bold text-foreground mb-3">
            BookMyShow Web3
          </h1>

          <div className="flex items-center justify-center space-x-2 mb-2">
            <div className="h-px w-12 bg-border"></div>
            <p className="text-lg text-muted-foreground font-medium">
              Annapurna Theatre
            </p>
            <div className="h-px w-12 bg-border"></div>
          </div>

          <p className="text-sm text-muted-foreground">
            Mangalagiri • NFT Tickets on Aptos
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-card border border-border rounded-lg p-8 shadow-sm">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              Welcome Back
            </h2>
            <p className="text-sm text-muted-foreground">
              Connect your Petra Wallet to continue
            </p>
          </div>

          {/* Connect Wallet Button */}
          <Button
            className="w-full h-14 text-lg"
            onClick={handleConnectWallet}
            disabled={isConnecting}
          >
            <Wallet className="h-5 w-5 mr-2" />
            {isConnecting ? "Connecting..." : "Connect Petra Wallet"}
          </Button>

          {/* Info Section */}
          <div className="mt-8 pt-6 border-t border-border">
            <h3 className="font-semibold text-foreground mb-3 text-sm">
              Why Connect Wallet?
            </h3>
            <ul className="text-xs text-muted-foreground space-y-2">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Secure blockchain-powered NFT tickets</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Transfer tickets to friends seamlessly</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Earn rewards with every booking</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>View complete booking history on-chain</span>
              </li>
            </ul>
          </div>

          {/* Install Petra */}
          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground mb-2">
              Don't have Petra Wallet?
            </p>
            <a
              href="https://petra.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-foreground hover:underline font-medium"
            >
              Install Petra Wallet →
            </a>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            By connecting, you agree to our Terms of Service
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

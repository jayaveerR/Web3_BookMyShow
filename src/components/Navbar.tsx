import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Film, Award, Menu, X, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const Navbar = () => {
  const navigate = useNavigate();
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Check wallet connection status on mount
  useEffect(() => {
    const connected = localStorage.getItem("isWalletConnected") === "true";
    const address = localStorage.getItem("walletAddress");
    if (connected && address) {
      setIsConnected(true);
      setWalletAddress(address);
    }
  }, []);

  const handleWalletConnect = () => {
    if (!isConnected) {
      // Redirect to login page
      navigate("/login");
    }
  };

  const handleDisconnect = () => {
    localStorage.removeItem("walletAddress");
    localStorage.removeItem("isWalletConnected");
    setIsConnected(false);
    setWalletAddress("");
    toast.success("Wallet disconnected");
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <Film className="h-8 w-8" />
            <span className="text-xl font-bold">CineTicket</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {isConnected && (
              <Link to="/rewards">
                <Button variant="default" className="flex items-center space-x-2">
                  <Award className="h-4 w-4" />
                  <span>Rewards</span>
                </Button>
              </Link>
            )}
            
            {isConnected ? (
              <div className="flex items-center space-x-2">
                <Button variant="outline" className="min-w-[140px]">
                  {walletAddress}
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={handleDisconnect}
                  title="Disconnect Wallet"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button 
                variant="outline" 
                onClick={handleWalletConnect}
                className="min-w-[160px]"
              >
                Connect Petra Wallet
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-3 border-t border-border">
            {isConnected && (
              <Link to="/rewards" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="default" className="w-full flex items-center justify-center space-x-2">
                  <Award className="h-4 w-4" />
                  <span>Rewards</span>
                </Button>
              </Link>
            )}
            
            {isConnected ? (
              <>
                <Button variant="outline" className="w-full">
                  {walletAddress}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    handleDisconnect();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center space-x-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Disconnect</span>
                </Button>
              </>
            ) : (
              <Button 
                variant="outline" 
                onClick={() => {
                  handleWalletConnect();
                  setMobileMenuOpen(false);
                }}
                className="w-full"
              >
                Connect Petra Wallet
              </Button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Film, Award, Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleWalletConnect = () => {
    // Mock wallet connection - in production, integrate with Petra Wallet
    if (!isConnected) {
      const mockAddress = "0x12a...89f";
      setWalletAddress(mockAddress);
      setIsConnected(true);
    } else {
      setIsConnected(false);
      setWalletAddress("");
    }
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
            <Link to="/rewards">
              <Button variant="default" className="flex items-center space-x-2">
                <Award className="h-4 w-4" />
                <span>Rewards</span>
              </Button>
            </Link>
            
            <Button 
              variant="outline" 
              onClick={handleWalletConnect}
              className="min-w-[160px]"
            >
              {isConnected ? walletAddress : "Connect Petra Wallet"}
            </Button>
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
            <Link to="/rewards" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="default" className="w-full flex items-center justify-center space-x-2">
                <Award className="h-4 w-4" />
                <span>Rewards</span>
              </Button>
            </Link>
            
            <Button 
              variant="outline" 
              onClick={handleWalletConnect}
              className="w-full"
            >
              {isConnected ? walletAddress : "Connect Petra Wallet"}
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

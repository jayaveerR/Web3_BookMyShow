import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Film, Award, Menu, X, LogOut, Search, MapPin, Clapperboard, Tv, Music, Trophy, Calendar, Zap, Copy, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const navigate = useNavigate();
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [location, setLocation] = useState("Mangalagiri");
  const [rewardBalance, setRewardBalance] = useState("0");

  // Check wallet connection status on mount
  useEffect(() => {
    const connected = localStorage.getItem("isWalletConnected") === "true";
    const address = localStorage.getItem("walletAddress");
    const rewards = localStorage.getItem("userRewards") || "0";

    if (connected && address) {
      setIsConnected(true);
      setWalletAddress(address);
      setRewardBalance(rewards);

      // Fetch latest rewards from backend
      fetch(`${import.meta.env.VITE_API_URL}/api/rewards/${address}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setRewardBalance(data.rewards);
            localStorage.setItem("userRewards", data.rewards);
          }
        })
        .catch(err => console.error("Failed to fetch rewards:", err));
    }

    const handleRewardsUpdate = () => {
      const newRewards = localStorage.getItem("userRewards") || "0";
      setRewardBalance(newRewards);
    };

    window.addEventListener("rewardsUpdated", handleRewardsUpdate);
    return () => window.removeEventListener("rewardsUpdated", handleRewardsUpdate);
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

  const handleCopyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      toast.success("Address copied");
    }
  };

  const formatAddress = (address: string) => {
    if (!address) return "";
    if (address.length <= 12) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
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

          {/* Center Section - Search & Location */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search Bar */}
            <div className={`flex items-center transition-all duration-300 ${isSearchOpen ? "w-64" : "w-10"}`}>
              {isSearchOpen ? (
                <div className="relative w-full">
                  <input
                    type="text"
                    placeholder="Search movies..."
                    className="w-full pl-3 pr-10 py-1.5 text-sm bg-secondary border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                    autoFocus
                    onBlur={() => setIsSearchOpen(false)}
                  />
                  <button
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => setIsSearchOpen(false)}
                  >
                    <X className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
              ) : (
                <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)}>
                  <Search className="h-5 w-5" />
                </Button>
              )}
            </div>

            {/* Location Selector */}
            <div className="relative group">
              <Button variant="ghost" className="flex items-center space-x-1">
                <MapPin className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">{location}</span>
              </Button>

              {/* Dropdown */}
              <div className="absolute top-full right-0 mt-2 w-48 bg-card border border-border rounded-md shadow-lg overflow-hidden hidden group-hover:block animate-in fade-in zoom-in-95 duration-200">
                <div className="py-1">
                  {["Mangalagiri", "Vijayawada", "Guntur", "Hyderabad"].map((loc) => (
                    <button
                      key={loc}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-secondary transition-colors"
                      onClick={() => setLocation(loc)}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {isConnected && (
              <>
                {/* History Button */}
                <Link to="/history">
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 text-black hover:text-primary hover:bg-black/10 transition-colors"
                  >
                    <Clock className="h-5 w-5" />
                    <span className="hidden md:inline">History</span>
                  </Button>
                </Link>

                {/* Rewards Button */}
                <Link to="/rewards">
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 text-black  hover:text-primary hover:bg-white/10 transition-colors"
                  >
                    <div className="relative">

                    </div>
                    <span className="hidden md:inline">Rewards: {rewardBalance} APT</span>
                  </Button>
                </Link>

                <Link to="/refund">
                  <Button variant="outline" className="flex items-center space-x-2 border-red-500 text-red-500 hover:bg-red-50">
                    <span>Refund</span>
                  </Button>
                </Link>
              </>
            )}

            {isConnected ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="min-w-[140px]">
                    {formatAddress(walletAddress)}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleCopyAddress} className="cursor-pointer">
                    <Copy className="mr-2 h-4 w-4" />
                    <span>Copy Address</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDisconnect} className="cursor-pointer text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Disconnect</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
          <div className="md:hidden py-4 space-y-3 border-t border-border bg-background px-4 h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="space-y-2 pb-4 border-b border-border">
              <Link to="/movies" className="flex items-center space-x-2 py-2 hover:text-primary" onClick={() => setMobileMenuOpen(false)}>
                <Clapperboard className="h-4 w-4" />
                <span>Movies</span>
              </Link>
              <Link to="/stream" className="flex items-center space-x-2 py-2 hover:text-primary" onClick={() => setMobileMenuOpen(false)}>
                <Tv className="h-4 w-4" />
                <span>Stream</span>
              </Link>
              <Link to="/events" className="flex items-center space-x-2 py-2 hover:text-primary" onClick={() => setMobileMenuOpen(false)}>
                <Calendar className="h-4 w-4" />
                <span>Events</span>
              </Link>
              <Link to="/sports" className="flex items-center space-x-2 py-2 hover:text-primary" onClick={() => setMobileMenuOpen(false)}>
                <Trophy className="h-4 w-4" />
                <span>Sports</span>
              </Link>
              <Link to="/activities" className="flex items-center space-x-2 py-2 hover:text-primary" onClick={() => setMobileMenuOpen(false)}>
                <Zap className="h-4 w-4" />
                <span>Activities</span>
              </Link>
              <Link to="/buzz" className="flex items-center space-x-2 py-2 hover:text-primary" onClick={() => setMobileMenuOpen(false)}>
                <Music className="h-4 w-4" />
                <span>Buzz</span>
              </Link>
            </div>

            <div className="space-y-2 pb-4 border-b border-border text-sm text-muted-foreground">
              <Link to="/list-your-show" className="block py-2 hover:text-foreground" onClick={() => setMobileMenuOpen(false)}>ListYourShow</Link>
              <Link to="/corporates" className="block py-2 hover:text-foreground" onClick={() => setMobileMenuOpen(false)}>Corporates</Link>
              <Link to="/offers" className="block py-2 hover:text-foreground" onClick={() => setMobileMenuOpen(false)}>Offers</Link>
              <Link to="/history" className="block py-2 hover:text-foreground" onClick={() => setMobileMenuOpen(false)}>History</Link>
              <Link to="/gift-cards" className="block py-2 hover:text-foreground" onClick={() => setMobileMenuOpen(false)}>Gift Cards</Link>
            </div>

            {isConnected && (
              <>
                <Link to="/history" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full flex items-center justify-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>History</span>
                  </Button>
                </Link>
                <Link to="/rewards" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="default" className="w-full flex items-center justify-center space-x-2">
                    <Award className="h-4 w-4" />
                    <span>Rewards</span>
                  </Button>
                </Link>
              </>
            )}

            {isConnected ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full">
                      {formatAddress(walletAddress)}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem onClick={handleCopyAddress} className="cursor-pointer">
                      <Copy className="mr-2 h-4 w-4" />
                      <span>Copy Address</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDisconnect} className="cursor-pointer text-destructive focus:text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Disconnect</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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

      {/* Secondary Navigation - Scrollable on Mobile */}
      <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/50 overflow-x-auto scrollbar-hide">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12 text-sm min-w-max">
            <div className="flex items-center space-x-6 md:space-x-8 pr-4">
              <div className="flex items-center space-x-1 text-muted-foreground hover:text-primary transition-colors whitespace-nowrap cursor-default">
                <Clapperboard className="h-4 w-4" />
                <span>Movies</span>
              </div>
              <div className="flex items-center space-x-1 text-muted-foreground hover:text-primary transition-colors whitespace-nowrap cursor-default">
                <Tv className="h-4 w-4" />
                <span>Stream</span>
              </div>
              <div className="flex items-center space-x-1 text-muted-foreground hover:text-primary transition-colors whitespace-nowrap cursor-default">
                <Calendar className="h-4 w-4" />
                <span>Events</span>
              </div>
              <div className="flex items-center space-x-1 text-muted-foreground hover:text-primary transition-colors whitespace-nowrap cursor-default">
                <Trophy className="h-4 w-4" />
                <span>Sports</span>
              </div>
              <div className="flex items-center space-x-1 text-muted-foreground hover:text-primary transition-colors whitespace-nowrap cursor-default">
                <Zap className="h-4 w-4" />
                <span>Activities</span>
              </div>
              <div className="flex items-center space-x-1 text-muted-foreground hover:text-primary transition-colors whitespace-nowrap cursor-default">
                <Music className="h-4 w-4" />
                <span>Buzz</span>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-6 text-xs text-muted-foreground">
              <div className="hover:text-foreground transition-colors cursor-default">ListYourShow</div>
              <div className="hover:text-foreground transition-colors cursor-default">Corporates</div>
              <div className="hover:text-foreground transition-colors cursor-default">Offers</div>
              <div className="hover:text-foreground transition-colors cursor-default">History</div>
              <div className="hover:text-foreground transition-colors cursor-default">Gift Cards</div>
            </div>
          </div>
        </div>
      </div>
    </nav >
  );
};

export default Navbar;

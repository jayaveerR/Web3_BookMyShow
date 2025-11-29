import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Film, Award, Menu, X, LogOut, Search, MapPin, Clapperboard, Tv, Music, Trophy, Calendar, Zap, Copy, Clock, Send, History } from "lucide-react";
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
    <nav className="sticky top-0 z-50 bg-background border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-1.5 sm:space-x-2 hover:opacity-80 transition-opacity">
            <Film className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8" />
            <span className="text-base sm:text-lg md:text-xl font-bold">CineTicket</span>
          </Link>

          {/* Center Section - Search & Location */}
          <div className="hidden lg:flex items-center space-x-3 xl:space-x-4">
            {/* Search Bar */}
            <div className={`flex items-center transition-all duration-300 ${isSearchOpen ? "w-48 xl:w-64" : "w-10"}`}>
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
              <Button variant="ghost" className="flex items-center space-x-1 px-2 xl:px-3">
                <MapPin className="h-4 w-4 xl:h-5 xl:w-5 text-primary" />
                <span className="text-xs xl:text-sm font-medium">{location}</span>
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
          <div className="hidden md:flex items-center space-x-1.5 lg:space-x-2 xl:space-x-3">
            {isConnected && (
              <>
                {/* History Button */}
                <Link to="/history">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1.5 text-black hover:text-primary hover:bg-black/10 transition-colors px-2 lg:px-3"
                  >
                    <Clock className="h-4 w-4 lg:h-5 lg:w-5" />
                    <span className="hidden lg:inline text-xs lg:text-sm">History</span>
                  </Button>
                </Link>

                {/* Rewards Button */}
                <Link to="/rewards">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1.5 text-black hover:text-primary hover:bg-white/10 transition-colors px-2 lg:px-3"
                  >
                    <Award className="h-4 w-4 lg:h-5 lg:w-5" />
                    <span className="hidden lg:inline text-xs lg:text-sm">Rewards: {rewardBalance} APT</span>
                  </Button>
                </Link>

                <Link to="/refund">
                  <Button variant="outline" size="sm" className="flex items-center space-x-1.5 border-red-500 text-red-500 hover:bg-red-50 px-2 lg:px-3">
                    <span className="text-xs lg:text-sm">Refund</span>
                  </Button>
                </Link>
                <Link to="/transfer">
                  <Button variant="ghost" size="sm" className="flex items-center gap-1.5 text-black hover:text-primary hover:bg-black/10 transition-colors px-2 lg:px-3">
                    <Send className="h-4 w-4 lg:h-5 lg:w-5" />
                    <span className="hidden lg:inline text-xs lg:text-sm">Transfer</span>
                  </Button>
                </Link>

              </>
            )}

            {isConnected ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="min-w-[100px] md:min-w-[120px] lg:min-w-[140px] text-xs lg:text-sm">
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
                size="sm"
                onClick={handleWalletConnect}
                className="min-w-[120px] md:min-w-[140px] lg:min-w-[160px] text-xs lg:text-sm"
              >
                <span className="hidden sm:inline">Connect Petra Wallet</span>
                <span className="sm:hidden">Connect</span>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-1.5 sm:p-2 hover:bg-secondary rounded-md transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 sm:py-4 space-y-2 sm:space-y-3 border-t border-border bg-background px-3 sm:px-4 max-h-[calc(100vh-3.5rem)] sm:max-h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="space-y-1 sm:space-y-2 pb-3 sm:pb-4 border-b border-border">
              <Link to="/movies" className="flex items-center space-x-2 py-2.5 hover:text-primary hover:bg-secondary rounded-md px-2 transition-colors" onClick={() => setMobileMenuOpen(false)}>
                <Clapperboard className="h-4 w-4" />
                <span className="text-sm">Movies</span>
              </Link>
              <Link to="/stream" className="flex items-center space-x-2 py-2.5 hover:text-primary hover:bg-secondary rounded-md px-2 transition-colors" onClick={() => setMobileMenuOpen(false)}>
                <Tv className="h-4 w-4" />
                <span className="text-sm">Stream</span>
              </Link>
              <Link to="/events" className="flex items-center space-x-2 py-2.5 hover:text-primary hover:bg-secondary rounded-md px-2 transition-colors" onClick={() => setMobileMenuOpen(false)}>
                <Calendar className="h-4 w-4" />
                <span className="text-sm">Events</span>
              </Link>
              <Link to="/sports" className="flex items-center space-x-2 py-2.5 hover:text-primary hover:bg-secondary rounded-md px-2 transition-colors" onClick={() => setMobileMenuOpen(false)}>
                <Trophy className="h-4 w-4" />
                <span className="text-sm">Sports</span>
              </Link>
              <Link to="/activities" className="flex items-center space-x-2 py-2.5 hover:text-primary hover:bg-secondary rounded-md px-2 transition-colors" onClick={() => setMobileMenuOpen(false)}>
                <Zap className="h-4 w-4" />
                <span className="text-sm">Activities</span>
              </Link>
              <Link to="/buzz" className="flex items-center space-x-2 py-2.5 hover:text-primary hover:bg-secondary rounded-md px-2 transition-colors" onClick={() => setMobileMenuOpen(false)}>
                <Music className="h-4 w-4" />
                <span className="text-sm">Buzz</span>
              </Link>
            </div>

            <div className="space-y-1 pb-3 sm:pb-4 border-b border-border text-xs sm:text-sm text-muted-foreground">
              <Link to="/list-your-show" className="block py-2 px-2 hover:text-foreground hover:bg-secondary rounded-md transition-colors" onClick={() => setMobileMenuOpen(false)}>ListYourShow</Link>
              <Link to="/corporates" className="block py-2 px-2 hover:text-foreground hover:bg-secondary rounded-md transition-colors" onClick={() => setMobileMenuOpen(false)}>Corporates</Link>
              <Link to="/offers" className="block py-2 px-2 hover:text-foreground hover:bg-secondary rounded-md transition-colors" onClick={() => setMobileMenuOpen(false)}>Offers</Link>
              <Link to="/gift-cards" className="block py-2 px-2 hover:text-foreground hover:bg-secondary rounded-md transition-colors" onClick={() => setMobileMenuOpen(false)}>Gift Cards</Link>
            </div>

            {isConnected && (
              <>
                <Link to="/history" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" size="sm" className="w-full flex items-center justify-center space-x-2 h-10">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">History</span>
                  </Button>
                </Link>
                <Link to="/rewards" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="default" size="sm" className="w-full flex items-center justify-center space-x-2 h-10">
                    <Award className="h-4 w-4" />
                    <span className="text-sm">Rewards: {rewardBalance} APT</span>
                  </Button>
                </Link>
                <Link to="/refund" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full flex items-center justify-center space-x-2 border-red-500 text-red-500 hover:bg-red-50 h-10">
                    <span className="text-sm">Refund</span>
                  </Button>
                </Link>
                <Link to="/transfer" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full flex items-center justify-center space-x-2 h-10">
                    <Send className="h-4 w-4" />
                    <span className="text-sm">Transfer</span>
                  </Button>
                </Link>
              </>
            )}

            {isConnected ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full h-10 text-sm">
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
                size="sm"
                onClick={() => {
                  handleWalletConnect();
                  setMobileMenuOpen(false);
                }}
                className="w-full h-10 text-sm"
              >
                Connect Petra Wallet
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Secondary Navigation - Scrollable on Mobile */}
      <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/50 overflow-x-auto scrollbar-hide">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between h-10 sm:h-12 text-xs sm:text-sm min-w-max">
            <div className="flex items-center space-x-4 sm:space-x-6 md:space-x-8 pr-3 sm:pr-4">
              <div className="flex items-center space-x-1 text-muted-foreground hover:text-primary transition-colors whitespace-nowrap cursor-default">
                <Clapperboard className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="text-xs sm:text-sm">Movies</span>
              </div>
              <div className="flex items-center space-x-1 text-muted-foreground hover:text-primary transition-colors whitespace-nowrap cursor-default">
                <Tv className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="text-xs sm:text-sm">Stream</span>
              </div>
              <div className="flex items-center space-x-1 text-muted-foreground hover:text-primary transition-colors whitespace-nowrap cursor-default">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="text-xs sm:text-sm">Events</span>
              </div>
              <div className="flex items-center space-x-1 text-muted-foreground hover:text-primary transition-colors whitespace-nowrap cursor-default">
                <Trophy className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="text-xs sm:text-sm">Sports</span>
              </div>
              <div className="flex items-center space-x-1 text-muted-foreground hover:text-primary transition-colors whitespace-nowrap cursor-default">
                <Zap className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="text-xs sm:text-sm">Activities</span>
              </div>
              <div className="flex items-center space-x-1 text-muted-foreground hover:text-primary transition-colors whitespace-nowrap cursor-default">
                <Music className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="text-xs sm:text-sm">Buzz</span>
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

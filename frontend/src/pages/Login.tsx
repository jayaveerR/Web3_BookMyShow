import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Film, Wallet, ArrowRight, Cpu } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

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
    <div className="min-h-screen w-full bg-white flex flex-col items-center justify-center relative overflow-hidden selection:bg-black selection:text-white">

      {/* Abstract Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 1.5 }}
          className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-gradient-to-br from-gray-100 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] bg-gradient-to-bl from-gray-100 to-transparent rounded-full blur-3xl"
        />
      </div>

      <div className="z-10 max-w-4xl w-full px-6 text-center">

        {/* Logo Animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-12 flex justify-center"
        >
          <div className="w-20 h-20 bg-black rounded-2xl flex items-center justify-center shadow-2xl shadow-gray-200">
            <Film className="h-10 w-10 text-white" />
          </div>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-5xl md:text-7xl font-bold tracking-tighter text-black mb-6"
        >
          Decentralized Cinema.
        </motion.h1>

        {/* AI Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="flex items-center justify-center gap-2 mb-12"
        >
          <Cpu className="w-5 h-5 text-gray-400" />
          <p className="text-xl text-gray-500 font-light">
            Powered by Next-Gen AI Implementation & Aptos Blockchain
          </p>
        </motion.div>

        {/* Connect Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
        >
          <Button
            onClick={handleConnectWallet}
            disabled={isConnecting}
            className="h-16 px-10 text-lg bg-black hover:bg-gray-900 text-white rounded-full transition-all hover:scale-105 hover:shadow-xl group"
          >
            {isConnecting ? (
              "Connecting..."
            ) : (
              <span className="flex items-center gap-3">
                <Wallet className="w-5 h-5" />
                Connect Petra Wallet
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            )}
          </Button>
        </motion.div>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left border-t border-gray-100 pt-10"
        >
          <div>
            <h3 className="font-semibold text-black mb-2">Secure</h3>
            <p className="text-sm text-gray-400">Blockchain-backed ticketing ensures 100% authenticity.</p>
          </div>
          <div>
            <h3 className="font-semibold text-black mb-2">Smart</h3>
            <p className="text-sm text-gray-400">AI-driven recommendations tailored just for you.</p>
          </div>
          <div>
            <h3 className="font-semibold text-black mb-2">Seamless</h3>
            <p className="text-sm text-gray-400">Instant refunds and transfers with zero friction.</p>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default Login;

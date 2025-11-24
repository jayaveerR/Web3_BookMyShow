import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Award, Gift, Star, Ticket } from "lucide-react";
import { useState, useEffect } from "react";

const Rewards = () => {
  const [rewardBalance, setRewardBalance] = useState("0");

  useEffect(() => {
    const rewards = localStorage.getItem("userRewards") || "0";
    setRewardBalance(rewards);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <Award className="h-16 w-16 mx-auto mb-4 text-cinema-price" />
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Rewards Program
          </h1>
          <p className="text-muted-foreground">
            Earn rewards with every booking and unlock exclusive perks
          </p>
        </div>

        {/* Current Points */}
        <div className="bg-gradient-to-br from-cinema-hero to-secondary p-8 rounded-lg border border-border mb-8 text-center">
          <p className="text-sm text-muted-foreground mb-2">Your Reward Balance</p>
          <p className="text-5xl font-bold text-foreground mb-2">{rewardBalance} APT</p>
          <p className="text-sm text-muted-foreground">Rewards never expire!</p>
        </div>

        {/* Benefits */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-card p-6 rounded-lg border border-border">
            <Ticket className="h-8 w-8 mb-4 text-cinema-price" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Earn on Bookings
            </h3>
            <p className="text-sm text-muted-foreground">
              Earn 100 points for every ticket you book through our platform
            </p>
          </div>

          <div className="bg-card p-6 rounded-lg border border-border">
            <Gift className="h-8 w-8 mb-4 text-cinema-price" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              NFT Perks
            </h3>
            <p className="text-sm text-muted-foreground">
              Your NFT tickets come with exclusive benefits and collectible value
            </p>
          </div>

          <div className="bg-card p-6 rounded-lg border border-border">
            <Star className="h-8 w-8 mb-4 text-cinema-price" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Priority Booking
            </h3>
            <p className="text-sm text-muted-foreground">
              Get early access to new releases and premium shows
            </p>
          </div>

          <div className="bg-card p-6 rounded-lg border border-border">
            <Award className="h-8 w-8 mb-4 text-cinema-price" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Exclusive Discounts
            </h3>
            <p className="text-sm text-muted-foreground">
              Redeem points for discounts on future bookings
            </p>
          </div>
        </div>

        {/* Redeem Section */}
        <div className="bg-secondary p-8 rounded-lg border border-border text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Ready to Redeem?
          </h2>
          <p className="text-muted-foreground mb-6">
            Use your points to get discounts or exclusive perks
          </p>
          <Button size="lg" className="min-w-[200px]">
            Redeem Points
          </Button>
        </div>

        {/* Connect Wallet Notice */}
        <div className="mt-8 p-4 bg-cinema-hero rounded-lg border border-border text-center">
          <p className="text-sm text-muted-foreground">
            Connect your Petra Wallet to track and redeem your rewards
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Rewards;

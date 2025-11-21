import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Languages, Film } from "lucide-react";
import { movies } from "@/data/movies";
import { toast } from "sonner";

const showTimings = ["10:00 AM", "2:00 PM", "6:00 PM", "9:00 PM"];

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const movie = movies.find(m => m.id === Number(id));

  useEffect(() => {
    if (!movie) {
      toast.error("Movie not found");
      navigate("/");
    }
  }, [movie, navigate]);

  if (!movie) return null;

  const handlePayment = () => {
    if (!selectedTime) return;
    // Store selected time in localStorage for ticket success page
    localStorage.setItem("selectedShowTime", selectedTime);
    navigate(`/seat/${id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Movie Poster */}
          <div className="relative">
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-full rounded-lg shadow-lg"
            />
          </div>

          {/* Movie Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                {movie.title}
              </h1>
              <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Film className="h-4 w-4" />
                  {movie.genre}
                </span>
                <span className="flex items-center gap-1">
                  <Languages className="h-4 w-4" />
                  {movie.language}
                </span>
                <span className="flex items-center gap-1">
                  {movie.format}
                </span>
              </div>
            </div>

            {/* Theatre Info */}
            <div className="bg-secondary p-4 rounded-lg border border-border">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-foreground mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground">Annapurna Theatre</p>
                  <p className="text-sm text-muted-foreground">Mangalagiri</p>
                </div>
              </div>
            </div>

            {/* Show Timings */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Clock className="h-5 w-5 text-foreground" />
                <h3 className="text-lg font-semibold text-foreground">Show Timings</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {showTimings.map((time) => (
                  <Button
                    key={time}
                    variant={selectedTime === time ? "default" : "outline"}
                    className="h-12 hover:bg-cinema-hover"
                    onClick={() => setSelectedTime(time)}
                  >
                    {time}
                  </Button>
                ))}
              </div>
            </div>

            {/* Price and CTA */}
            <div className="pt-4 border-t border-border">
              <div className="flex items-center justify-between mb-4">
                <span className="text-muted-foreground">Ticket Price</span>
                <span className="text-2xl font-bold text-cinema-price">{movie.price}</span>
              </div>

              <Button
                className="w-full h-12 text-lg"
                onClick={handlePayment}
                disabled={!selectedTime}
              >
                Book Tickets
              </Button>

              <p className="text-xs text-muted-foreground text-center mt-2">
                You'll be prompted to connect Petra Wallet
              </p>
            </div>
          </div>
        </div>

        {/* Synopsis */}
        <div className="mt-12">
          <h3 className="text-xl font-semibold text-foreground mb-4">Synopsis</h3>
          <p className="text-muted-foreground leading-relaxed">
            {movie.description}
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MovieDetails;

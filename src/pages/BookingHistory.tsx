import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MapPin, Calendar, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import movie1 from "@/assets/movie-1.jpg";
import movie2 from "@/assets/movie-2.jpg";

const bookingHistory = [
  {
    id: 1,
    poster: movie1,
    title: "Shadow Warriors",
    date: "Jan 20, 2025",
    time: "6:00 PM",
    status: "Active",
    price: "2 APT"
  },
  {
    id: 2,
    poster: movie2,
    title: "Love in Paris",
    date: "Jan 15, 2025",
    time: "2:00 PM",
    status: "Used",
    price: "1 APT"
  }
];

const BookingHistory = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Booking History
          </h1>
          <p className="text-muted-foreground">
            View all your past and upcoming movie bookings
          </p>
        </div>

        <div className="space-y-4">
          {bookingHistory.map((booking) => (
            <div
              key={booking.id}
              className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row">
                {/* Poster */}
                <div className="w-full sm:w-32 h-48 sm:h-auto flex-shrink-0">
                  <img
                    src={booking.poster}
                    alt={booking.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-1">
                        {booking.title}
                      </h3>
                      <div className="flex items-center text-sm text-muted-foreground space-x-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {booking.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {booking.time}
                        </span>
                      </div>
                    </div>
                    
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${
                      booking.status === "Active" 
                        ? "bg-green-100 text-green-700" 
                        : "bg-gray-100 text-gray-700"
                    }`}>
                      {booking.status === "Active" ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <Clock className="h-4 w-4" />
                      )}
                      {booking.status}
                    </div>
                  </div>

                  <div className="flex items-center text-muted-foreground text-sm mb-4">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>Annapurna Theatre, Mangalagiri</span>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <span className="text-lg font-semibold text-cinema-price">
                      {booking.price}
                    </span>
                    
                    {booking.status === "Active" && (
                      <Button variant="outline" size="sm">
                        View Ticket
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {bookingHistory.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No bookings yet</p>
            <Button onClick={() => window.location.href = "/"}>
              Browse Movies
            </Button>
          </div>
        )}

        {/* Connect Wallet Notice */}
        <div className="mt-8 p-4 bg-cinema-hero rounded-lg border border-border text-center">
          <p className="text-sm text-muted-foreground">
            Connect your Petra Wallet to view complete booking history stored on-chain
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BookingHistory;

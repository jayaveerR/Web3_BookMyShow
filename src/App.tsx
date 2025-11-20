import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import MovieDetails from "./pages/MovieDetails";
import Rewards from "./pages/Rewards";
import TicketTransfer from "./pages/TicketTransfer";
import TicketScanner from "./pages/TicketScanner";
import BookingHistory from "./pages/BookingHistory";
import TicketSuccess from "./pages/TicketSuccess";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/rewards" element={<Rewards />} />
          <Route path="/transfer" element={<TicketTransfer />} />
          <Route path="/scanner" element={<TicketScanner />} />
          <Route path="/history" element={<BookingHistory />} />
          <Route path="/ticket-success" element={<TicketSuccess />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

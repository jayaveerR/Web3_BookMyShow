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
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
          <Route path="/movie/:id" element={<ProtectedRoute><MovieDetails /></ProtectedRoute>} />
          <Route path="/rewards" element={<ProtectedRoute><Rewards /></ProtectedRoute>} />
          <Route path="/transfer" element={<ProtectedRoute><TicketTransfer /></ProtectedRoute>} />
          <Route path="/scanner" element={<ProtectedRoute><TicketScanner /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><BookingHistory /></ProtectedRoute>} />
          <Route path="/ticket-success" element={<ProtectedRoute><TicketSuccess /></ProtectedRoute>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

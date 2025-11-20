import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  useEffect(() => {
    const connected = localStorage.getItem("isWalletConnected") === "true";
    setIsConnected(connected);
  }, []);

  // Show nothing while checking connection status
  if (isConnected === null) {
    return null;
  }

  // Redirect to login if not connected
  if (!isConnected) {
    return <Navigate to="/login" replace />;
  }

  // Render children if connected
  return <>{children}</>;
};

export default ProtectedRoute;

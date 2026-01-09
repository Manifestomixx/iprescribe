import { Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useAuthStore from '../store/authStore';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, initialize } = useAuthStore();
  const location = useLocation();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize auth state from localStorage
    initialize();
    setIsInitialized(true);
  }, [initialize]);

  // Show nothing while initializing to prevent flash of content
  if (!isInitialized) {
    return null;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Only render children if user is authenticated
  return children;
};

export default ProtectedRoute;


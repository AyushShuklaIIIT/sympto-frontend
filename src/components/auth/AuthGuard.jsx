import { useAuth } from '../../contexts';
import { Navigate, useLocation } from 'react-router-dom';

const AuthGuard = ({ children, requireAuth = true }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner w-8 h-8" />
      </div>
    );
  }

  // If authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    // Redirect to login page, saving the attempted location
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // If authentication is not required but user is authenticated
  // (e.g., login page when already logged in)
  if (!requireAuth && isAuthenticated) {
    // Redirect to dashboard or intended location
    const from = location.state?.from?.pathname || '/dashboard';
    return <Navigate to={from} replace />;
  }

  // Render children if authentication requirements are met
  return children;
};

export default AuthGuard;
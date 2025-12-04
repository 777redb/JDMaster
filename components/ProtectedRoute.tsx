
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  // Not logged in -> Redirect to Login
  if (!user) {
    // In a real router setup, we would use <Navigate to="/login" />
    // For this simple view switcher, we'll return null to indicate access denied, handled by App.tsx
    return <LoginRedirect />;
  }

  // Role check
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-50 text-center p-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">403</h1>
        <h2 className="text-xl font-semibold text-gray-800">Access Forbidden</h2>
        <p className="text-gray-600 mt-2 max-w-md">
          Your current role ({user.role}) does not have permission to access this resource.
          Please contact your administrator or upgrade your plan.
        </p>
      </div>
    );
  }

  return <>{children}</>;
};

// Simple internal redirect component for the existing simple router
const LoginRedirect = () => {
  React.useEffect(() => {
    window.location.hash = 'login';
  }, []);
  return null;
};

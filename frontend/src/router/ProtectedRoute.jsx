import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * Route protector wrapper supporting authentication check and role-based access control (RBAC).
 * @param {object} props
 * @param {string|string[]} props.allowedRoles - Role or array of roles allowed to access this route
 */
export const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, role, loading } = useAuth();
  const location = useLocation();

  // Handle session loading/restoration to prevent flickering and screen flashes
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-center text-[#F8FAFC] font-sans">
        <div className="relative w-16 h-16 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-[#1E293B] border-t-[#0052CC] animate-spin"></div>
        </div>
        <p className="mt-4 text-[#94A3B8] font-medium tracking-wide text-sm animate-pulse">
          Validating Session...
        </p>
      </div>
    );
  }

  // Redirect to login if user is not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Handle role validation if restricted roles are specified
  if (allowedRoles && allowedRoles.length > 0) {
    const isAuthorized = Array.isArray(allowedRoles)
      ? allowedRoles.includes(role)
      : role === allowedRoles;

    if (!isAuthorized) {
      // Redirect to unauthorized route if they don't have access
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Render authorized child routes
  return <Outlet />;
};

export default ProtectedRoute;

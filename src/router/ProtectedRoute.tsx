// ============ ProtectedRoute.tsx - FIXED ============
import React from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "@/hooks/hooks";

// ✅ FIX 1: Define interface with allowedRoles
interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[]; // ✅ Add this!
}

// ✅ FIX 2: Accept allowedRoles as prop
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles = [], // ✅ Destructure with default empty array
}) => {
  const { user, isAuthenticated, loading } = useAppSelector(
    (state) => state.auth,
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFD700]"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // ✅ FIX 3: Check if user's role is allowed
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role as string)) {
    // Redirect to appropriate dashboard
    const roleToPath: Record<string, string> = {
      admin: "/admin",
      local_business: "/business",
      diaspora_investor: "/investor",
    };

    const redirectPath = roleToPath[user.role as string] || "/dashboard";
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

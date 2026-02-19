// components/DashboardRedirect.tsx
import { Navigate } from "react-router-dom";
import { useAppSelector } from "@/hooks/hooks";

export default function DashboardRedirect() {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  let redirectPath = "/dashboard";

  if (user?.role === "admin") {
    redirectPath = "/admin";
  } else if (user?.role === "business_owner") {
    redirectPath = "/business"; // FIXED
  } else if (user?.role === "investor") {
    redirectPath = "/investor";
  }

  return <Navigate to={redirectPath} replace />;
}

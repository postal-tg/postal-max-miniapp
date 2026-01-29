// Layout.tsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/app/providers/AuthProvider";
import { Header } from "../Header/Header";

import "./Layout.css";

export const Layout = () => {
  const { isAuthenticated } = useAuth();
  const { pathname } = useLocation();

  if (!isAuthenticated && pathname !== "/channels") {
    return <Navigate to="/channels" replace />;
  }

  return (
    <div className="app-root">
      <Header />
      <Outlet />
    </div>
  );
};

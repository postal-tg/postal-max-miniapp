// Layout.tsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { ChannelsProvider } from "@/app/providers/ChannelsProvider";
import { useAuth } from "@/app/providers/AuthProvider";
import { StatsProvider } from "@/app/providers/StatsProvider";
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
      <ChannelsProvider>
        <StatsProvider>
          <Outlet />
        </StatsProvider>
      </ChannelsProvider>
    </div>
  );
};

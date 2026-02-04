import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./providers/AuthProvider";
import { ChannelsPage } from "../pages/ChannelsPage/ChannelsPage";
import { ChannelStatsPage } from "../pages/ChannelStatsPage/ChannelStatsPage";
import { ReachPage } from "../pages/ReachPage/ReachPage";
import { Layout } from "@/shared/ui/Layout/Layout";
import { getStartParam } from "@/shared/utils/parseInitData";

function LandingRedirect() {
  const startParam = getStartParam();
  if (startParam) {
    return <Navigate to={`/reach?post_id=${encodeURIComponent(startParam)}`} replace />;
  }
  return <Navigate to="/channels" replace />;
}

export function AppRouter() {
  const basename = (import.meta.env.VITE_BASE_URL || '/').replace(/\/$/, '') || '/';

  return (
    <BrowserRouter basename={basename}>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingRedirect />} />
          <Route element={<Layout />}>
            <Route path="/channels" element={<ChannelsPage />} />
            <Route path="/channels/:id" element={<ChannelStatsPage />} />
            <Route path="/reach" element={<ReachPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

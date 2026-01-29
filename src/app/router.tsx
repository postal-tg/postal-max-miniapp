import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { AuthProvider } from "./providers/AuthProvider";
import { ChannelsPage } from "../pages/ChannelsPage/ChannelsPage";
import { ChannelStatsPage } from "../pages/ChannelStatsPage/ChannelStatsPage";
import { ReachPage } from "../pages/ReachPage/ReachPage";
import { Layout } from "@/shared/ui/Layout/Layout";
import { getStartParam } from "@/shared/utils/parseInitData";

function LandingRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const startParam = getStartParam();
    if (startParam) {
      navigate(`/reach?post_id=${encodeURIComponent(startParam)}`, { replace: true });
    } else {
      navigate("/channels", { replace: true });
    }
  }, [navigate]);

  return null;
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingRedirect />} />
          <Route element={<Layout />}>
            <Route path="/channels" element={<ChannelsPage />} />
            <Route path="/channels/:id" element={<ChannelStatsPage />} />
            <Route path="/reach" element={<ReachPage />} />
            <Route path="*" element={<ChannelsPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

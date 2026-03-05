import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./providers/AuthProvider";
import { ChannelsPage } from "../pages/ChannelsPage/ChannelsPage";
import { ChannelStatsPage } from "../pages/ChannelStatsPage/ChannelStatsPage";
import { PostStatsPage } from "../pages/ReachPage/PostStatsPage";
import { FollowerExtensionPage } from "../pages/FollowerExtensionPage/FollowerExtensionPage";
import { Layout } from "@/shared/ui/Layout/Layout";
import { getStartParam, getUserIdFromInitData } from "@/shared/utils/parseInitData";

function LandingRedirect() {
  const startParam = getStartParam();
  if (startParam?.startsWith("fe_")) {
    const userId = getUserIdFromInitData();
    const followerExtensionUuid = startParam.slice("fe_".length).trim();

    if (userId && followerExtensionUuid) {
      return (
        <Navigate
          to={`/users/${encodeURIComponent(userId)}/${encodeURIComponent(followerExtensionUuid)}`}
          replace
        />
      );
    }

    return (
      <Navigate
        to={`/follower-extension?start_param=${encodeURIComponent(startParam)}`}
        replace
      />
    );
  }

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
            <Route path="/reach" element={<PostStatsPage />} />
            <Route path="/follower-extension" element={<FollowerExtensionPage />} />
            <Route
              path="/users/:userId/:followerExtensionUuid"
              element={<FollowerExtensionPage />}
            />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ChannelsPage } from "../pages/ChannelsPage/ChannelsPage";
import { ChannelStatsPage } from "../pages/ChannelStatsPage/ChannelStatsPage";
import { Layout } from "@/shared/ui/Layout/Layout";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/channels" element={<ChannelsPage />} />
          <Route path="/channels/:id" element={<ChannelStatsPage />} />
          <Route path="*" element={<ChannelsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

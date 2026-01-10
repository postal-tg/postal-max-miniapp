import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ChannelsPage } from "../pages/ChannelsPage/ChannelsPage";
import { ChannelStatsPage } from "../pages/ChannelStatsPage/ChannelStatsPage";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/channels" element={<ChannelsPage />} />
        <Route path="/channels/:id" element={<ChannelStatsPage />} />
        <Route path="*" element={<ChannelsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

import { API_BASE_URL, USE_MOCK } from "@/shared/config/api";
import { fetchWithAuth } from "@/shared/api/client";
import { getMockChannelStats } from "@/shared/mocks/data";
import type { ChannelStats, ChannelStatsResponse } from "./types";

function statisticsUrl(channelId: string): string {
  return `${API_BASE_URL}/max/channels/${channelId}/statistics`;
}

function mapStatsResponse(raw: ChannelStatsResponse): ChannelStats {
  const r = raw.overview.reach;
  return {
    summary: {
      period: {
        from: raw.summary.period.fromDate,
        to: raw.summary.period.toDate,
      },
      totalSubscribers: raw.summary.totalSubscribers,
    },
    overview: {
      reach: {
        last24hours: { count: r.last24hours.count ?? 0, er: r.last24hours.er ?? 0 },
        last48hours: { count: r.last48hours.count ?? 0, er: r.last48hours.er ?? 0 },
        last72hours: { count: r.last72hours.count ?? 0, er: r.last72hours.er ?? 0 },
      },
      today: raw.overview.today,
      month: raw.overview.month,
    },
    growthChart: raw.growthChart,
    subscribersChart: raw.subscribersChart,
    reachChart: {
      points: {
        last24hours: raw.reachChart.last24hours,
        last48hours: raw.reachChart.last48hours,
        last72hours: raw.reachChart.last72hours,
      },
    },
  };
}

const statsPromises: Record<string, Promise<ChannelStats>> = {};

export const statsApi = {
  async getChannelStats(channelId: string): Promise<ChannelStats> {
    if (USE_MOCK) return Promise.resolve(getMockChannelStats(channelId));
    const cached = statsPromises[channelId];
    if (cached !== undefined) return cached;
    const url = statisticsUrl(channelId);
    const p = (async () => {
      const res = await fetchWithAuth(url, { method: "GET" });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Ошибка загрузки статистики: ${res.status}`);
      }
      const json = (await res.json()) as ChannelStatsResponse;
      return mapStatsResponse(json);
    })();
    statsPromises[channelId] = p;
    p.finally(() => {
      delete statsPromises[channelId];
    });
    return p;
  },
};

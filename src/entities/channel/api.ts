import { API_BASE_URL, USE_MOCK } from "@/shared/config/api";
import { fetchWithAuth } from "@/shared/api/client";
import {
  mockChannelsWithReach,
  mockUserChannelsListResponse,
} from "@/shared/mocks/data";
import type {
  Channel,
  ChannelWithReach,
  PostViewStats,
  UserChannelsListResponse,
} from "./types";

const CHANNELS_URL = `${API_BASE_URL}/max/channels/webapp/channels`;

type ChannelsData = {
  channels: ChannelWithReach[];
  dueTime: string | null;
  msgText: string | null;
  postViewStats: PostViewStats;
};

function postViewStatsFromChannel(
  ch: UserChannelsListResponse["channels"][number]
): PostViewStats {
  const r = ch.reach;
  return {
    currentViews: r.currentViews ?? null,
    last24Hours: r.last24Hours ?? null,
    last48Hours: r.last48Hours ?? null,
    last72Hours: r.last72Hours ?? null,
  };
}

function mapChannel(item: UserChannelsListResponse["channels"][number]): Channel {
  return {
    id: String(item.channelId),
    title: item.title,
    avatarUrl:
      item.photo ??
      `https://ui-avatars.com/api/?name=${encodeURIComponent(item.title)}&background=0D8ABC&color=fff`,
    subscribersCount: item.participantsCount,
    channelUrl: item.channelUrl ?? null,
  };
}

function mapChannelWithReach(
  item: UserChannelsListResponse["channels"][number]
): ChannelWithReach {
  return {
    ...mapChannel(item),
    reach: {
      last24hours: { count: item.reach.last24Hours },
      last48hours: { count: item.reach.last48Hours },
      last72hours: { count: item.reach.last72Hours },
      currentViews: { count: item.reach.currentViews },
    },
  };
}

let channelsPromise: Promise<ChannelsData> | null = null;

export const channelApi = {
  async getChannels(): Promise<ChannelsData> {
    if (USE_MOCK) {
      const json = mockUserChannelsListResponse;
      const first = json.channels[0];
      return Promise.resolve({
        channels: json.channels.map(mapChannelWithReach),
        dueTime: json.dueTime ?? null,
        msgText: json.msgText ?? null,
        postViewStats: first
          ? postViewStatsFromChannel(first)
          : {
              currentViews: null,
              last24Hours: null,
              last48Hours: null,
              last72Hours: null,
            },
      });
    }
    if (channelsPromise) return channelsPromise;
    const p = (async () => {
      const res = await fetchWithAuth(CHANNELS_URL, { method: "GET" });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Ошибка загрузки каналов: ${res.status}`);
      }
      const json = (await res.json()) as UserChannelsListResponse;
      const first = json.channels?.[0];
      return {
        channels: json.channels.map(mapChannelWithReach),
        dueTime: json.dueTime ?? null,
        msgText: json.msgText ?? null,
        postViewStats: first
          ? postViewStatsFromChannel(first)
          : {
              currentViews: null,
              last24Hours: null,
              last48Hours: null,
              last72Hours: null,
            },
      };
    })();
    channelsPromise = p;
    p.finally(() => {
      channelsPromise = null;
    });
    return p;
  },

  async getChannelsWithReach(postUuid: string): Promise<ChannelWithReach[]> {
    if (USE_MOCK) return Promise.resolve(mockChannelsWithReach);
    const url = `${CHANNELS_URL}/post/${encodeURIComponent(postUuid)}`;
    const res = await fetchWithAuth(url, { method: "GET" });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || `Ошибка загрузки каналов поста: ${res.status}`);
    }
    const json = (await res.json()) as UserChannelsListResponse;
    return json.channels.map(mapChannelWithReach);
  },
};

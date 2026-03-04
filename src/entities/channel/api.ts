import { API_BASE_URL, USE_MOCK } from "@/shared/config/api";
import { fetchWithAuth } from "@/shared/api/client";
import {
  mockChannelsWithReach,
  mockUserChannelsListResponse,
} from "@/shared/mocks/data";
import type { Channel, ChannelWithReach, UserChannelsListResponse } from "./types";

const CHANNELS_URL = `${API_BASE_URL}/max/channels/webapp/channels`;

type ChannelsData = {
  channels: Channel[];
  dueTime: string | null;
  msgText: string | null;
};

function mapChannel(item: UserChannelsListResponse["channels"][number]): Channel {
  return {
    id: String(item.channelId),
    title: item.title,
    avatarUrl:
      item.photo ??
      `https://ui-avatars.com/api/?name=${encodeURIComponent(item.title)}&background=0D8ABC&color=fff`,
    subscribersCount: item.participantsCount,
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
      return Promise.resolve({
        channels: json.channels.map(mapChannel),
        dueTime: json.dueTime ?? null,
        msgText: json.msgText ?? null,
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
      return {
        channels: json.channels.map(mapChannel),
        dueTime: json.dueTime ?? null,
        msgText: json.msgText ?? null,
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

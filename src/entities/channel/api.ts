import { API_BASE_URL, USE_MOCK } from "@/shared/config/api";
import { fetchWithAuth } from "@/shared/api/client";
import { mockChannels, mockChannelsWithReach } from "@/shared/mocks/data";
import type { Channel, ChannelWithReach, UserChannelsListResponse } from "./types";

const CHANNELS_URL = `${API_BASE_URL}/max/channels/webapp/channels`;

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
    },
  };
}

let channelsPromise: Promise<Channel[]> | null = null;

export const channelApi = {
  async getChannels(): Promise<Channel[]> {
    if (USE_MOCK) return Promise.resolve(mockChannels);
    if (channelsPromise) return channelsPromise;
    const p = (async () => {
      const res = await fetchWithAuth(CHANNELS_URL, { method: "GET" });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Ошибка загрузки каналов: ${res.status}`);
      }
      const json = (await res.json()) as UserChannelsListResponse;
      return json.channels.map(mapChannel);
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

import { API_BASE_URL } from "@/shared/config/api";
import { fetchWithAuth } from "@/shared/api/client";
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

// Mock данные для разных post_id
const mockChannelsWithReachByPostId: Record<string, ChannelWithReach[]> = {
  post_1: [
    {
      id: "ch_123",
      title: "Название 1",
      avatarUrl: "https://ui-avatars.com/api/?name=Channel+1&background=0D8ABC&color=fff",
      subscribersCount: 142698,
      reach: {
        last24hours: {
          count: 2800,
        },
        last48hours: {
          count: 3800,
        },
        last72hours: {
          count: 24300,
        },
      },
    },
    {
      id: "ch_122",
      title: "Название 2",
      avatarUrl: "https://ui-avatars.com/api/?name=Channel+1&background=0D8ABC&color=fff",
      subscribersCount: 70,
      reach: {
        last24hours: {
          count: 2800,
        },
        last48hours: {
          count: 10800,
        },
        last72hours: {
          count: 108000,
        },
      },
    },
  ],
  post_2: [
    {
      id: "ch_123",
      title: "Название 1",
      avatarUrl: "https://ui-avatars.com/api/?name=Channel+1&background=0D8ABC&color=fff",
      subscribersCount: 142698,
      reach: {
        last24hours: {
          count: 1500,
        },
        last48hours: {
          count: 2500,
        },
        last72hours: {
          count: 12000,
        },
      },
    },
    {
      id: "ch_122",
      title: "Название 2",
      avatarUrl: "https://ui-avatars.com/api/?name=Channel+1&background=0D8ABC&color=fff",
      subscribersCount: 70,
      reach: {
        last24hours: {
          count: 5000,
        },
        last48hours: {
          count: 15000,
        },
        last72hours: {
          count: 50000,
        },
      },
    },
  ],
};

let channelsPromise: Promise<Channel[]> | null = null;

export const channelApi = {
  async getChannels(): Promise<Channel[]> {
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

  getChannelsWithReach(postId: string): Promise<ChannelWithReach[]> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const data = mockChannelsWithReachByPostId[postId];
        if (!data) {
          return reject(new Error(`No data found for post_id: ${postId}`));
        }
        resolve(data);
      }, 300);
    });
  },
};

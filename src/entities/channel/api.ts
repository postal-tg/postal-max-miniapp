import type { Channel, ChannelWithReach } from "./types";

const mockChannels: Channel[] = [
  {
    id: "ch_123",
    title: "Название 1",
    avatarUrl: "https://ui-avatars.com/api/?name=Channel+1&background=0D8ABC&color=fff",
    subscribersCount: 142698,
  },
  {
    id: "ch_122",
    title: "Название 2",
    avatarUrl: "https://ui-avatars.com/api/?name=Channel+1&background=0D8ABC&color=fff",
    subscribersCount: 70,
  },
  // ещё несколько каналов...
];

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

const mockChannelsEmpty: Channel[] = [];

export const channelApi = {
  getChannels(): Promise<Channel[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockChannels), 300);
    });
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

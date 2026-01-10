import type { Channel } from "./types";

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

const mockChannelsEmpty: Channel[] = [];

export const channelApi = {
  getChannels(): Promise<Channel[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockChannels), 300);
    });
  },
};

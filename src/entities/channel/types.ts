export type ChannelId = string;

export type Channel = {
  id: ChannelId;
  title: string;
  avatarUrl: string;
  subscribersCount: number;
};

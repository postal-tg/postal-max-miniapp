export type ChannelId = string;

export type ChannelReach = {
  last24hours: {
    count: number;
  };
  last48hours: {
    count: number;
  };
  last72hours: {
    count: number;
  };
};

export type Channel = {
  id: ChannelId;
  title: string;
  avatarUrl: string;
  subscribersCount: number;
};

export type ChannelWithReach = Channel & {
  reach: ChannelReach;
};

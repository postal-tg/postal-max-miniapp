export type ChannelId = string;

/** Ответ GET /max/channels/webapp/channels */
export type UserChannelsListResponse = {
  channels: UserChannelStats[];
};

export type UserChannelStats = {
  channelId: number;
  title: string;
  photo: string | null;
  participantsCount: number;
  channelUrl: string | null;
  reach: {
    last24Hours: number;
    last48Hours: number;
    last72Hours: number;
  };
};

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

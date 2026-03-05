export type ChannelId = string;

/** Ответ GET /max/channels/webapp/channels */
export type UserChannelsListResponse = {
  channels: UserChannelStats[];
  msgText: string | null;
  dueTime: string | null;
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
    currentViews: number;
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
  currentViews: {
    count: number;
  };
};

export type Channel = {
  id: ChannelId;
  title: string;
  avatarUrl: string;
  subscribersCount: number;
  channelUrl: string | null;
};

export type PostStatsChannel = Channel & {
  reach: ChannelReach;
};

/** Статистика просмотров поста (для блока «Статистика просмотров») */
export type PostStats = {
  currentViews: number | null;
  last24Hours: number | null;
  last48Hours: number | null;
  last72Hours: number | null;
};

/** Временный алиас для совместимости. Постепенно можно удалить. */
export type PostViewStats = PostStats;

export type ISODate = string;

export type StatsSummary = {
  period: {
    from: ISODate;
    to: ISODate;
  };
  totalSubscribers: number;
};

export type StatsOverview = {
  reach: {
    last24hours: {
      count: number;
      er: number;
    }; // 24 часа
    last48hours: {
      count: number;
      er: number;
    }; // 48 часов
    last72hours: {
      count: number;
      er: number;
    };
  };
  today: {
    subscribed: number;
    unsubscribed: number;
  };
  month: {
    subscribed: number;
    unsubscribed: number;
  };
};

export type GrowthPoint = {
  date: ISODate;
  totalSubscribers: number;
};

export type SubscribersPoint = {
  date: ISODate;
  subscribed: number;
  unsubscribed: number;
};

export type ReachPoint = {
  date: ISODate;
  reach: number;
};

export type ChannelStats = {
  summary: StatsSummary;
  overview: StatsOverview;
  growthChart: {
    points: GrowthPoint[];
  };
  subscribersChart: {
    points: SubscribersPoint[];
  };
  reachChart: {
    points: {
      last24hours: ReachPoint[];
      last48hours: ReachPoint[];
      last72hours: ReachPoint[];
    };
  };
};

export type StatsRange = "24h" | "48h" | "72h";

/** Ответ GET /max/channels/{channel_id}/statistics */
export type ChannelStatsResponse = {
  channelId: number;
  title: string;
  photo: string | null;
  summary: {
    period: { fromDate: string; toDate: string };
    totalSubscribers: number;
  };
  overview: {
    reach: {
      last24hours: { count?: number; er?: number };
      last48hours: { count?: number; er?: number };
      last72hours: { count?: number; er?: number };
    };
    today: { subscribed: number; unsubscribed: number };
    month: { subscribed: number; unsubscribed: number };
  };
  growthChart: { points: GrowthPoint[] };
  subscribersChart: { points: SubscribersPoint[] };
  reachChart: {
    last24hours: ReachPoint[];
    last48hours: ReachPoint[];
    last72hours: ReachPoint[];
  };
};

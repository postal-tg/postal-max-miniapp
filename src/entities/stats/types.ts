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
    current: number;   // 24 часа
    previous: number;  // 48 часов
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
    points: ReachPoint[];
  };
};

export type StatsRange = "24h" | "48h";
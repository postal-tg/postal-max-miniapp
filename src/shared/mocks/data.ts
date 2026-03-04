import type {
  Channel,
  ChannelWithReach,
  UserChannelsListResponse,
} from "@/entities/channel/types";
import type { ChannelStats } from "@/entities/stats/types";

const avatar = "https://ui-avatars.com/api/?name=Mock+Channel&background=0D8ABC&color=fff";

export const mockChannels: Channel[] = [
  {
    id: "1",
    title: "Тестовый канал 1 - татарские новости в Новгороде",
    avatarUrl: avatar,
    subscribersCount: 12500,
  },
  {
    id: "2",
    title: "Тестовый канал 2",
    avatarUrl: avatar,
    subscribersCount: 8300,
  },
];

export const mockChannelsWithReach: ChannelWithReach[] = mockChannels.map((ch) => ({
  ...ch,
  reach: {
    last24hours: { count: Math.floor(ch.subscribersCount * 0.12) },
    last48hours: { count: Math.floor(ch.subscribersCount * 0.25) },
    last72hours: { count: Math.floor(ch.subscribersCount * 0.38) },
    currentViews: { count: Math.floor(ch.subscribersCount * 0.05) },
  },
}));

export const mockUserChannelsListResponse: UserChannelsListResponse = {
  channels: mockChannels.map((ch, index) => ({
    channelId: Number(ch.id) || index + 1,
    title: ch.title,
    photo: ch.avatarUrl,
    participantsCount: ch.subscribersCount,
    channelUrl: null,
    reach: {
      last24Hours: Math.floor(ch.subscribersCount * 0.12),
      last48Hours: Math.floor(ch.subscribersCount * 0.25),
      last72Hours: Math.floor(ch.subscribersCount * 0.38),
      currentViews: Math.floor(ch.subscribersCount * 0.05),
    },
  })),
  msgText:
    "<p><strong>Это пример текста поста</strong>, который используется только в режиме моков. " +
    "Здесь есть и <em>курсивное выделение</em>, и <b>жирный текст</b>, а также простая разметка." +
    "Он помогает проверить, как отображается HTML‑разметка и обрезка до трёх строк " +
    "в карточке «Ваш пост».</p>",
  dueTime: "2026-03-11T17:21:17.567Z",
};

function makeReachPoints(days: number, baseReach: number): { date: string; reach: number }[] {
  return Array.from({ length: days }, (_, i) => ({
    date: new Date(Date.now() - (days - 1 - i) * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    reach: baseReach + Math.floor(Math.random() * 200),
  }));
}

function makeGrowthPoints(
  days: number,
  totalSubscribers: number
): { date: string; totalSubscribers: number }[] {
  let current = totalSubscribers - days * 50;
  return Array.from({ length: days }, (_, i) => {
    current += 30 + Math.floor(Math.random() * 40);
    return {
      date: new Date(Date.now() - (days - 1 - i) * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      totalSubscribers: current,
    };
  });
}

function makeSubscribersPoints(
  days: number
): { date: string; subscribed: number; unsubscribed: number }[] {
  return Array.from({ length: days }, (_, i) => ({
    date: new Date(Date.now() - (days - 1 - i) * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    subscribed: 20 + Math.floor(Math.random() * 60),
    unsubscribed: 2 + Math.floor(Math.random() * 15),
  }));
}

const fromDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
const toDate = new Date().toISOString().slice(0, 10);

export function getMockChannelStats(_channelId: string): ChannelStats {
  return {
    summary: {
      period: { from: fromDate, to: toDate },
      totalSubscribers: 12500,
    },
    overview: {
      reach: {
        last24hours: { count: 1500, er: 12.5 },
        last48hours: { count: 3100, er: 24.8 },
        last72hours: { count: 4750, er: 38 },
      },
      today: { subscribed: 45, unsubscribed: 8 },
      month: { subscribed: 890, unsubscribed: 120 },
    },
    growthChart: {
      points: makeGrowthPoints(1, 12500),
    },
    subscribersChart: {
      points: makeSubscribersPoints(30),
    },
    reachChart: {
      points: {
        last24hours: makeReachPoints(24, 800),
        last48hours: makeReachPoints(48, 750),
        last72hours: makeReachPoints(72, 700),
      },
    },
  };
}

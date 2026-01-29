import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { statsApi } from "@/entities/stats/api";
import type { ChannelStats } from "@/entities/stats/types";

type StatsContextValue = {
  cache: Record<string, ChannelStats>;
  loadingFor: string | null;
  errorByChannelId: Record<string, string>;
  fetchStats: (channelId: string, force?: boolean) => void;
};

const StatsContext = createContext<StatsContextValue | null>(null);

export function StatsProvider({ children }: { children: ReactNode }) {
  const [cache, setCache] = useState<Record<string, ChannelStats>>({});
  const [loadingFor, setLoadingFor] = useState<string | null>(null);
  const [errorByChannelId, setErrorByChannelId] = useState<Record<string, string>>({});

  const runFetch = useCallback(
    (channelId: string, force: boolean) => {
      if (!force && cache[channelId]) return;
      setErrorByChannelId((prev) => {
        const next = { ...prev };
        delete next[channelId];
        return next;
      });
      setLoadingFor(channelId);
      statsApi
        .getChannelStats(channelId)
        .then((data) => {
          setCache((prev) => ({ ...prev, [channelId]: data }));
          setErrorByChannelId((prev) => {
            const next = { ...prev };
            delete next[channelId];
            return next;
          });
        })
        .catch((e) => {
          setErrorByChannelId((prev) => ({
            ...prev,
            [channelId]: e.message ?? "Ошибка загрузки статистики",
          }));
        })
        .finally(() =>
          setLoadingFor((current) => (current === channelId ? null : current))
        );
    },
    [cache]
  );

  const fetchStats = useCallback(
    (channelId: string, force = false) => runFetch(channelId, force),
    [runFetch]
  );

  const value = useMemo<StatsContextValue>(
    () => ({
      cache,
      loadingFor,
      errorByChannelId,
      fetchStats,
    }),
    [cache, loadingFor, errorByChannelId, fetchStats]
  );

  return (
    <StatsContext.Provider value={value}>{children}</StatsContext.Provider>
  );
}

export function useChannelStats(channelId: string | undefined) {
  const ctx = useContext(StatsContext);
  if (!ctx) throw new Error("useChannelStats must be used within StatsProvider");

  const { cache, loadingFor, errorByChannelId, fetchStats } = ctx;

  useEffect(() => {
    if (!channelId) return;
    if (cache[channelId]) return;
    if (loadingFor === channelId) return;
    fetchStats(channelId);
  }, [channelId, cache, loadingFor, fetchStats]);

  return {
    stats: channelId ? cache[channelId] ?? null : null,
    isLoading: channelId ? loadingFor === channelId : false,
    error: channelId ? errorByChannelId[channelId] ?? null : null,
    refetch: channelId ? () => fetchStats(channelId, true) : () => {},
  };
}

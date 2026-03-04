import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "./AuthProvider";
import { channelApi } from "@/entities/channel/api";
import type { ChannelWithReach, PostViewStats } from "@/entities/channel/types";

type ChannelsContextValue = {
  /** null = ещё не загружены, [] = загружены, пусто */
  channels: ChannelWithReach[] | null;
  dueTime: string | null;
  msgText: string | null;
  postViewStats: PostViewStats;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
};

const emptyPostViewStats: PostViewStats = {
  currentViews: null,
  last24Hours: null,
  last48Hours: null,
  last72Hours: null,
};

const ChannelsContext = createContext<ChannelsContextValue | null>(null);

export function ChannelsProvider({ children }: { children: ReactNode }) {
  const { isLoading: authLoading, error: authError } = useAuth();
  const [channels, setChannels] = useState<ChannelWithReach[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dueTime, setDueTime] = useState<string | null>(null);
  const [msgText, setMsgText] = useState<string | null>(null);
  const [postViewStats, setPostViewStats] = useState<PostViewStats>(emptyPostViewStats);

  const fetchChannels = useCallback(() => {
    setIsLoading(true);
    setError(null);
    channelApi
      .getChannels()
      .then((data) => {
        setChannels(data.channels);
        setDueTime(data.dueTime);
        setMsgText(data.msgText);
        setPostViewStats(data.postViewStats);
        setError(null);
      })
      .catch((e) => setError(e.message ?? "Ошибка загрузки каналов"))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (authLoading || authError) return;
    if (channels !== null) return;
    fetchChannels();
  }, [authLoading, authError, channels, fetchChannels]);

  const value = useMemo<ChannelsContextValue>(
    () => ({
      channels,
      dueTime,
      msgText,
      postViewStats,
      isLoading,
      error,
      refetch: fetchChannels,
    }),
    [channels, dueTime, msgText, postViewStats, isLoading, error, fetchChannels]
  );

  return (
    <ChannelsContext.Provider value={value}>{children}</ChannelsContext.Provider>
  );
}

export function useChannels(): ChannelsContextValue {
  const ctx = useContext(ChannelsContext);
  if (!ctx) throw new Error("useChannels must be used within ChannelsProvider");
  return ctx;
}

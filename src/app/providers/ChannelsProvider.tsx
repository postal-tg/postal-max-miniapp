import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { channelApi } from "@/entities/channel/api";
import type { PostStatsChannel } from "@/entities/channel/types";

type ChannelsContextValue = {
  /** null = ещё не загружены, [] = загружены, пусто */
  channels: PostStatsChannel[] | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
};

const ChannelsContext = createContext<ChannelsContextValue | null>(null);

export function ChannelsProvider({ children }: { children: ReactNode }) {
  const { isLoading: authLoading, error: authError } = useAuth();
  const { pathname } = useLocation();
  const [channels, setChannels] = useState<PostStatsChannel[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const shouldFetchChannels =
    pathname === "/channels" || pathname.startsWith("/channels/");

  const fetchChannels = useCallback(() => {
    setIsLoading(true);
    setError(null);
    channelApi
      .getChannels()
      .then((data) => {
        setChannels(data.channels);
        setError(null);
      })
      .catch((e) => setError(e.message ?? "Ошибка загрузки каналов"))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (!shouldFetchChannels) return;
    if (authLoading || authError) return;
    if (channels !== null) return;
    fetchChannels();
  }, [shouldFetchChannels, authLoading, authError, channels, fetchChannels]);

  const value = useMemo<ChannelsContextValue>(
    () => ({
      channels,
      isLoading,
      error,
      refetch: fetchChannels,
    }),
    [channels, isLoading, error, fetchChannels]
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

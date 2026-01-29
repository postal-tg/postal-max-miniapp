import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { authApi } from "@/entities/auth/api";
import { tokenStorage } from "@/entities/auth/tokenStorage";
import type { AuthState } from "@/entities/auth/types";

type AuthContextValue = AuthState & {
  retry: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function getInitData(): string | null {
  return typeof window !== "undefined" ? window.WebApp?.initData ?? null : null;
}

let initialLoginStarted = false;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  const performLogin = useCallback(async () => {
    tokenStorage.clear();

    const initData = getInitData();
    if (!initData) {
      setState((s) => ({
        ...s,
        isLoading: false,
        error: "WebApp initData недоступен. Запустите приложение из Max.",
      }));
      return;
    }

    try {
      const { access_token, refresh_token } = await authApi.login(initData);
      tokenStorage.setTokens(access_token, refresh_token);
      setState({
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (e) {
      setState((s) => ({
        ...s,
        isLoading: false,
        error: e instanceof Error ? e.message : "Ошибка входа",
      }));
    }
  }, []);

  useEffect(() => {
    if (initialLoginStarted) return;
    initialLoginStarted = true;
    performLogin();
  }, [performLogin]);

  const retry = useCallback(() => {
    setState((s) => ({ ...s, isLoading: true, error: null }));
    performLogin();
  }, [performLogin]);

  const value = useMemo<AuthContextValue>(
    () => ({ ...state, retry }),
    [state, retry]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

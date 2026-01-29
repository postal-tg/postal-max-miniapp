import { authApi } from "@/entities/auth/api";
import { tokenStorage } from "@/entities/auth/tokenStorage";

const SESSION_EXPIRED = "Сессия истекла. Войдите снова.";

async function fetchWithToken(url: string, init: RequestInit, accessToken: string): Promise<Response> {
  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${accessToken}`);
  return fetch(url, { ...init, headers });
}

/**
 * Fetch с Bearer-токеном. При 401 пробует refresh и повторяет запрос один раз.
 */
export async function fetchWithAuth(url: string, init?: RequestInit): Promise<Response> {
  const token = tokenStorage.getAccessToken();
  if (!token) throw new Error("Нет токена авторизации");

  let res = await fetchWithToken(url, init ?? {}, token);
  if (res.status !== 401) return res;

  const refreshToken = tokenStorage.getRefreshToken();
  if (!refreshToken) {
    tokenStorage.clear();
    throw new Error(SESSION_EXPIRED);
  }

  try {
    const { access_token, refresh_token } = await authApi.refresh(refreshToken);
    tokenStorage.setTokens(access_token, refresh_token);
  } catch {
    tokenStorage.clear();
    throw new Error(SESSION_EXPIRED);
  }

  const newToken = tokenStorage.getAccessToken();
  if (!newToken) throw new Error(SESSION_EXPIRED);

  return fetchWithToken(url, init ?? {}, newToken);
}

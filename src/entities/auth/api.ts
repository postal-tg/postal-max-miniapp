import { API_BASE_URL } from "@/shared/config/api";
import type { LoginResponse } from "./types";

const LOGIN_URL = `${API_BASE_URL}/max/channels/webapp/login`;
const REFRESH_URL = `${API_BASE_URL}/max/channels/webapp/refresh`;

export const authApi = {
  async login(initData: string): Promise<LoginResponse> {
    const res = await fetch(LOGIN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(initData),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || `Login failed: ${res.status}`);
    }

    return res.json() as Promise<LoginResponse>;
  },

  async refresh(refreshToken: string): Promise<LoginResponse> {
    const res = await fetch(REFRESH_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${refreshToken}` },
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || `Refresh failed: ${res.status}`);
    }

    return res.json() as Promise<LoginResponse>;
  },
};

import { API_BASE_URL, USE_MOCK } from "@/shared/config/api";
import { fetchWithAuth } from "@/shared/api/client";

type FollowerExtensionResponse = {
  msgText: string;
};

export const followerExtensionApi = {
  async getMessage(
    userId: string,
    followerExtensionUuid: string
  ): Promise<FollowerExtensionResponse> {
    if (USE_MOCK) {
      return Promise.resolve({
        msgText:
          "<p><strong>Mock follower extension</strong>: пример HTML‑контента для локальной разработки.</p>",
      });
    }

    const url = `${API_BASE_URL}/max/channels/webapp/users/${encodeURIComponent(
      userId
    )}/${encodeURIComponent(followerExtensionUuid)}`;

    const res = await fetchWithAuth(url, { method: "GET" });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || `Ошибка загрузки расширения подписчика: ${res.status}`);
    }

    const json = (await res.json()) as FollowerExtensionResponse;
    return json;
  },
};

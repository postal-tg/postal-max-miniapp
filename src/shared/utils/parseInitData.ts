import { getInitData } from "@/app/providers/AuthProvider";

/**
 * Извлекает start_param из window.WebApp.initData (query string от Telegram Web App).
 * Если параметра нет или WebApp недоступен — возвращает null.
 */
export function getStartParam(): string | null {
  const initData = getInitData();
  if (!initData) return null;
  const params = new URLSearchParams(initData);
  const startParam = params.get("start_param");
  return startParam && startParam.trim() !== "" ? startParam.trim() : null;
}

type InitDataUser = {
  id: number | string;
  [key: string]: unknown;
};

/**
 * Возвращает user.id из initData (параметр user — JSON-строка).
 * Если данных нет или формат неожиданный — возвращает null.
 */
export function getUserIdFromInitData(): string | null {
  const initData = getInitData();
  if (!initData) return null;

  const params = new URLSearchParams(initData);
  const userRaw = params.get("user");
  if (!userRaw) return null;

  try {
    const user = JSON.parse(userRaw) as InitDataUser;
    if (user && (typeof user.id === "number" || typeof user.id === "string")) {
      return String(user.id);
    }
    return null;
  } catch {
    return null;
  }
}


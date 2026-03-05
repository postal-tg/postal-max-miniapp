import { getInitData } from "@/app/providers/AuthProvider";

function normalizeStartParam(value: string | null): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (trimmed === "") return null;

  try {
    return decodeURIComponent(trimmed);
  } catch {
    return trimmed;
  }
}

function getStartParamFromInitData(): string | null {
  const initData = getInitData();
  if (!initData) return null;

  const params = new URLSearchParams(initData);
  return normalizeStartParam(params.get("start_param"));
}

function getStartParamFromLocation(): string | null {
  if (typeof window === "undefined") return null;

  const params = new URLSearchParams(window.location.search);
  return normalizeStartParam(
    params.get("startapp") ?? params.get("start_param") ?? params.get("tgWebAppStartParam")
  );
}

/**
 * Извлекает start_param из window.WebApp.initData (query string от Telegram Web App).
 * Если параметра нет или WebApp недоступен — возвращает null.
 */
export function getStartParam(): string | null {
  return getStartParamFromInitData() ?? getStartParamFromLocation();
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


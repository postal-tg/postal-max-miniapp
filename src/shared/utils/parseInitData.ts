import { getInitData } from "@/app/providers/AuthProvider";

/**
 * Извлекает start_param из window.WebApp.initData (query string от Telegram Web App).
 * Если параметра нет или WebApp недоступен — возвращает null.
 */
export function getStartParam(): string | null {
  const initData = getInitData();
  console.log('initData', initData)
  if (!initData) return null;
  const params = new URLSearchParams(initData);
  const startParam = params.get("start_param");
  console.log('startParam', startParam)
  return startParam && startParam.trim() !== "" ? startParam.trim() : null;
}

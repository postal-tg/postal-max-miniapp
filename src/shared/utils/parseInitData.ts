import { getInitData } from "@/app/providers/AuthProvider";

type InitDataUser = {
  id: number | string;
  [key: string]: unknown;
};

function readLocationSearchParams(): URLSearchParams | null {
  if (typeof window === "undefined") return null;
  return new URLSearchParams(window.location.search);
}

function getTrimmedValue(params: URLSearchParams | null, key: string): string | null {
  if (!params) return null;
  const value = params.get(key);
  return value && value.trim() !== "" ? value.trim() : null;
}

function getInitDataParams(rawInitData: string | null): URLSearchParams | null {
  if (!rawInitData) return null;
  return new URLSearchParams(rawInitData);
}

function getRawInitData(): string | null {
  const initData = getInitData();
  if (initData) return initData;

  const locationParams = readLocationSearchParams();
  return (
    getTrimmedValue(locationParams, "tgWebAppData") ??
    getTrimmedValue(locationParams, "webAppData")
  );
}

function getStartParamFromLocation(): string | null {
  const locationParams = readLocationSearchParams();
  const candidates = ["start_param", "startapp", "startApp", "tgWebAppStartParam"];

  for (const key of candidates) {
    const value = getTrimmedValue(locationParams, key);
    if (value) return value;
  }

  if (typeof window !== "undefined" && window.location.hash.includes("?")) {
    const hashQuery = window.location.hash.slice(window.location.hash.indexOf("?") + 1);
    const hashParams = new URLSearchParams(hashQuery);

    for (const key of candidates) {
      const value = getTrimmedValue(hashParams, key);
      if (value) return value;
    }
  }

  const rawInitDataFromUrl =
    getTrimmedValue(locationParams, "tgWebAppData") ??
    getTrimmedValue(locationParams, "webAppData");

  if (!rawInitDataFromUrl) return null;
  const params = getInitDataParams(rawInitDataFromUrl);
  return getTrimmedValue(params, "start_param");
}

export function getStartParam(): string | null {
  const params = getInitDataParams(getRawInitData());
  return getTrimmedValue(params, "start_param") ?? getStartParamFromLocation();
}

export function getUserIdFromInitData(): string | null {
  const params = getInitDataParams(getRawInitData());
  const userRaw = getTrimmedValue(params, "user");
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

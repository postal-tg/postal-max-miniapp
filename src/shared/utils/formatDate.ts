export function formatRuShortDate(input: string | number | Date): string {
  const date = new Date(input);

  const formatter = new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const raw = formatter.format(date);

  return raw.replace(" г.", "").replace(".", "").replace(/\.$/, "");
}

export function formatRuShortDateNoYear(input: string | number | Date): string {
  const date = new Date(input);

  const formatter = new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "short",
  });

  const raw = formatter.format(date); // например: "19 дек." [web:140][web:127]

  return raw.replace(".", ""); // "19 дек"
}

export function formatRuWeekdayShortDate(input: string | number | Date): string {
  const date = new Date(input);

  const formatter = new Intl.DateTimeFormat("ru-RU", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  // например: "ср, 4 дек. 2025 г." [web:140][web:127]
  const raw = formatter.format(date);

  return raw
    .replace(" г.", "")
    .replace(".,", ",") // убираем точку после месяца перед запятой
    .replace(".", ""); // убираем оставшиеся точки → "ср, 4 дек 2025"
}

export function formatTimeHHmm(input: string | number | Date): string {
  const date = new Date(input);

  return date.toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }); // вернёт например "18:30" [web:140][web:127]
}

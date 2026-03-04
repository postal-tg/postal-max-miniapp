/** Для значений ≥ 1000 возвращает формат "1.0k", иначе число как есть */
export function formatViewsCount(value: number): string {
  if (value >= 1000) {
    return (value / 1000).toFixed(1) + "к";
  }
  return String(value);
}

export function formatToK(value: number): string {
  if (Math.abs(value) < 10_000) {
    return value.toLocaleString("ru-RU");
  }

  const formatted = (value / 1_000).toFixed(1);

  // убираем .0, чтобы 12.0k → 12k
  return formatted.replace(/\.0$/, "") + "k";
}

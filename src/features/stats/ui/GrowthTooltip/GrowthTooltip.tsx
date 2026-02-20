import { formatRuWeekdayShortDate } from "@/shared/utils/formatDate";

import "./GrowthTooltip.css";

type GrowthTooltipProps = {
  active?: boolean;
  label?: string | number;
  payload?: Array<{
    value?: number;
  }>;
};

export function GrowthTooltip({ active, label, payload }: GrowthTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  const item = payload[0];

  return (
    <div className="tooltip">
      <div className="tooltip-date">{formatRuWeekdayShortDate(label as string)}</div>
      <div className="tooltip-row">
        <span className="tooltip-label">Всего подписчиков</span>
        <span className="tooltip-value">{Number(item.value).toLocaleString("ru-RU")}</span>
      </div>
    </div>
  );
}

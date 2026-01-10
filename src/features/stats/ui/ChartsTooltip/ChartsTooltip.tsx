import { formatRuWeekdayShortDate, formatTimeHHmm } from "@/shared/utils/formatDate";

import "./ChartsTooltip.css";

type ChartsTooltipProps = {
  active?: boolean;
  label?: string | number;
  payload?: Array<{
    payload?: {
      date?: string;
      reach?: number;
    };
  }>;
};

export function ChartsTooltip({ active, label, payload }: ChartsTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  const item = payload[0];

  return (
    <div className="tooltip">
      <div className="tooltip-row">
        <div className="tooltip-date">{formatRuWeekdayShortDate(label as string)}</div>
        <div className="tooltip-time">{formatTimeHHmm(label as string)}</div>
      </div>
      <div className="tooltip-row">
        <span className="tooltip-label">Охват</span>
        <span className="tooltip-value tooltip-pos">
          {Number(item.payload?.reach).toLocaleString("ru-RU")}
        </span>
      </div>
    </div>
  );
}

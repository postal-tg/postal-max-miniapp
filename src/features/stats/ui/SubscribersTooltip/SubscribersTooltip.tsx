import { formatRuWeekdayShortDate } from "@/shared/utils/formatDate";

import "./SubscribersTooltip.css";

type SubscribersTooltipProps = {
  active?: boolean;
  label?: string | number;
  payload?: Array<{
    payload?: {
      subscribed?: number;
      unsubscribed?: number;
    };
  }>;
};

export function SubscribersTooltip({ active, label, payload }: SubscribersTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  const item = payload[0];

  return (
    <div className="tooltip">
      <div className="tooltip-date">{formatRuWeekdayShortDate(label as string)}</div>
      <div className="tooltip-row">
        <span className="tooltip-label">Подписалось</span>
        <span className="tooltip-value tooltip-pos">
          {Number(item.payload?.subscribed).toLocaleString("ru-RU")}
        </span>
      </div>
      <div className="tooltip-row">
        <span className="tooltip-label">Отписалось</span>
        <span className="tooltip-value tooltip-neg">
          {Number(item.payload?.unsubscribed).toLocaleString("ru-RU")}
        </span>
      </div>
    </div>
  );
}

import { useMemo } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { formatRuShortDateNoYear } from "@/shared/utils/formatDate";
import type { ContentType } from "recharts/types/component/Tooltip";
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";

import "./LineChartBase.css";

type LineDef = {
  dataKey: string;
  color: string;
};

type Props<T extends object> = {
  data: T[];
  lines: LineDef[];
  period?: { from: string; to: string };
  tooltipContent?: ContentType<ValueType, NameType>;
  xTicks?: (string | number)[];
};

function getMidpointDate(from: string, to: string): string {
  const fromTime = new Date(from).getTime();
  const toTime = new Date(to).getTime();
  const midTime = (fromTime + toTime) / 2;
  return new Date(midTime).toISOString().slice(0, 10);
}

const Y_TICK_COUNT = 7;

function getLineValues<T extends object>(data: T[], lines: LineDef[]): number[] {
  const values: number[] = [];

  for (const point of data) {
    const record = point as Record<string, unknown>;

    for (const line of lines) {
      const value = record[line.dataKey];

      if (typeof value === "number" && !Number.isNaN(value)) {
        values.push(value);
      }
    }
  }

  return values;
}

function getYDomainAndTicks(values: number[]): { domain: [number, number]; ticks: number[] } {
  // Нет значений — рисуем условный диапазон с целыми тиками
  if (values.length === 0) {
    const min = 0;
    const max = Y_TICK_COUNT - 1;
    const ticks = Array.from({ length: Y_TICK_COUNT }, (_, index) => min + index);
    const domain: [number, number] = [min, max];
    return { domain, ticks };
  }

  let min = Math.min(...values);
  let max = Math.max(...values);

  if (min === max) {
    if (min === 0) {
      min = -1;
      max = 1;
    } else {
      const padding = Math.abs(min) * 0.1 || 1;
      min = min - padding;
      max = max + padding;
    }
  } else {
    const padding = (max - min) * 0.1;
    min = min - padding;
    max = max + padding;
  }

  // Приводим домен к "красивым" целым значениям
  min = Math.floor(min);
  max = Math.ceil(max);

  if (min === max) {
    // защита от вырожденного случая после округления
    max = min + (Y_TICK_COUNT - 1);
  }

  // Строим домен так, чтобы внизу графика оставалось пространство,
  // но тики и подписи были только для неотрицательных значений.
  const domainMin = min;
  const domainMax = max <= 0 ? Y_TICK_COUNT - 1 : max;

  const startTick = Math.max(0, domainMin);
  const rawRange = domainMax - startTick;
  const rawStep = rawRange / (Y_TICK_COUNT - 1);
  const step = Math.max(1, Math.round(rawStep));

  const ticks = Array.from(
    { length: Y_TICK_COUNT },
    (_, index) => startTick + step * index
  );
  const domain: [number, number] = [domainMin, ticks[ticks.length - 1]];

  return { domain, ticks };
}

export function LineChartBase<T extends object>({
  data,
  lines,
  period,
  tooltipContent,
  xTicks,
}: Props<T>) {
  const { chartData, xDomain, isSinglePoint, yDomain, yTicks } = useMemo(() => {
    if (data.length !== 1) {
      const values = getLineValues(data, lines);
      const { domain, ticks } = getYDomainAndTicks(values);

      return {
        chartData: data,
        xDomain: undefined as [string, string] | undefined,
        isSinglePoint: false,
        yDomain: domain,
        yTicks: ticks,
      };
    }
    const point = data[0] as T & { date?: string };
    if (period) {
      const centerDate = getMidpointDate(period.from, period.to);
      const values = getLineValues([{ ...point, date: centerDate }] as T[], lines);
      const { domain, ticks } = getYDomainAndTicks(values);

      return {
        chartData: [{ ...point, date: centerDate }] as T[],
        xDomain: [period.from, period.to] as [string, string],
        isSinglePoint: true,
        yDomain: domain,
        yTicks: ticks,
      };
    }

    const singleChartData = [point] as T[];
    const values = getLineValues(singleChartData, lines);
    const { domain, ticks } = getYDomainAndTicks(values);

    return {
      chartData: singleChartData,
      xDomain: undefined,
      isSinglePoint: true,
      yDomain: domain,
      yTicks: ticks,
    };
  }, [data, period, lines]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData} margin={{ top: 50 }}>
        <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" vertical={false} horizontal={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={6}
          ticks={xTicks}
          domain={xDomain}
          tickFormatter={(value) => formatRuShortDateNoYear(value)}
          tick={{ fontSize: 8, fill: "#ababab" }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={4}
          tick={{ fontSize: 8, fill: "#ababab" }}
          tickFormatter={(value) => value.toLocaleString("ru-RU")}
          domain={yDomain}
          ticks={yTicks}
          width={"auto"}
        />
        {tooltipContent ? (
          <Tooltip content={tooltipContent} position={{ y: 0 }} />
        ) : (
          <Tooltip position={{ y: 0 }} />
        )}
        {yTicks.map((tick) => (
          <ReferenceLine
            key={`grid-${tick}`}
            y={tick}
            stroke="#e5e7eb"
            strokeDasharray="3 3"
            ifOverflow="extendDomain"
          />
        ))}
        {isSinglePoint
          ? lines.map((line) => {
            const point = chartData[0] as Record<string, number | string | null | undefined>;
            const value = point[line.dataKey];
            if (typeof value !== "number") return null;
            return (
              <ReferenceLine
                key={line.dataKey}
                y={value}
                stroke={line.color}
                strokeWidth={2}
                ifOverflow="extendDomain"
              />
            );
          })
          : null}
        {lines.map((line) => (
          <Line
            key={line.dataKey}
            type="linear"
            dataKey={line.dataKey}
            stroke={line.color}
            strokeWidth={2}
            dot={isSinglePoint}
            isAnimationActive={false}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

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

export function LineChartBase<T extends object>({
  data,
  lines,
  period,
  tooltipContent,
  xTicks,
}: Props<T>) {
  const { chartData, xDomain, isSinglePoint } = useMemo(() => {
    if (data.length !== 1) {
      return { chartData: data, xDomain: undefined as [string, string] | undefined, isSinglePoint: false };
    }
    const point = data[0] as T & { date?: string };
    if (period) {
      const centerDate = getMidpointDate(period.from, period.to);
      return {
        chartData: [{ ...point, date: centerDate }] as T[],
        xDomain: [period.from, period.to] as [string, string],
        isSinglePoint: true,
      };
    }
    return {
      chartData: [point] as T[],
      xDomain: undefined,
      isSinglePoint: true,
    };
  }, [data, period]);

  return (
    <ResponsiveContainer width="100%" height={180}>
      <LineChart data={chartData} margin={{ top: 50 }}>
        <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" vertical={false} />
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
          domain={["dataMin", "dataMax"]}
          width={"auto"}
        />
        {tooltipContent ? (
          <Tooltip content={tooltipContent} position={{ y: 0 }} />
        ) : (
          <Tooltip position={{ y: 0 }} />
        )}
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

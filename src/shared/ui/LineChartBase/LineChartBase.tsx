import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatRuShortDateNoYear } from "@/shared/utils/formatDate";
import type { ContentType } from "recharts/types/component/Tooltip";
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";

type LineDef = {
  dataKey: string;
  color: string;
};

type Props<T extends object> = {
  data: T[];
  lines: LineDef[];
  tooltipContent?: ContentType<ValueType, NameType>;
  xTicks?: (string | number)[];
};

export function LineChartBase<T extends object>({ data, lines, tooltipContent, xTicks }: Props<T>) {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <LineChart data={data}>
        <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={6}
          ticks={xTicks}
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
        {tooltipContent ? <Tooltip content={tooltipContent} /> : <Tooltip />}
        {lines.map((line) => (
          <Line
            key={line.dataKey}
            type="linear"
            dataKey={line.dataKey}
            stroke={line.color}
            strokeWidth={2}
            dot={false}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

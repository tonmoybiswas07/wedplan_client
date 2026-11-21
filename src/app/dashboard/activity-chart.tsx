"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Datum = { label: string } & Record<string, string | number>;
type Series = { key: string; label: string; color: string };

export function ActivityChart({
  data,
  series,
}: {
  data: Datum[];
  series: Series[];
}) {
  return (
    <>
      <div aria-hidden="true" className="h-60 min-w-0 overflow-clip sm:h-72">
        <ResponsiveContainer width="100%" height="100%" debounce={80}>
          <BarChart
            data={data}
            margin={{ top: 12, right: 4, left: 0, bottom: 4 }}
            barGap={4}
            accessibilityLayer={false}
          >
            <CartesianGrid
              vertical={false}
              stroke="var(--border)"
              strokeDasharray="3 4"
            />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
              tickMargin={9}
              interval={0}
            />
            <YAxis
              width={29}
              allowDecimals={false}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
            />
            <Tooltip
              cursor={{ fill: "var(--accent)", opacity: 0.55 }}
              contentStyle={{
                background: "var(--card)",
                color: "var(--foreground)",
                borderColor: "var(--border)",
                borderRadius: 12,
              }}
              itemStyle={{ color: "var(--foreground)" }}
            />
            {series.map(({ key, label, color }) => (
              <Bar
                key={key}
                dataKey={key}
                name={label}
                fill={color}
                radius={[5, 5, 0, 0]}
                maxBarSize={58}
                isAnimationActive={false}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
      {series.length > 1 && (
        <ul
          aria-hidden="true"
          className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground"
        >
          {series.map(({ key, label, color }) => (
            <li key={key} className="flex items-center gap-1.5">
              <span
                style={{ background: color }}
                className="size-2.5 rounded-sm"
              />
              {label}
            </li>
          ))}
        </ul>
      )}
      <details className="mt-4 border-t border-line pt-3 text-sm">
        <summary className="w-fit cursor-pointer font-semibold text-berry">
          View chart data
        </summary>
        <table className="mt-3 w-full text-start text-xs sm:text-sm">
          <thead>
            <tr className="text-muted-foreground">
              <th scope="col" className="text-start">
                Period or status
              </th>
              {series.map(({ key, label }) => (
                <th key={key} scope="col" className="text-end">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.label} className="border-b border-line/70">
                <th scope="row" className="py-1.5 text-start font-medium">
                  {row.label}
                </th>
                {series.map(({ key }) => (
                  <td key={key} className="text-end tabular-nums">
                    {row[key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </>
  );
}

import React, { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatNumber } from "../../lib/formatters";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-bg-elevated border border-border-subtle p-3 rounded-lg shadow-xl text-xs space-y-1">
        <p className="font-semibold text-txt-primary">{label}</p>
        <p className="text-accent-purple font-medium">
          Total clicks: <span className="font-numeric">{formatNumber(payload[0].value)}</span>
        </p>
        {payload[1] && (
          <p className="text-accent-teal font-medium">
            Unique visitors: <span className="font-numeric">{formatNumber(payload[1].value)}</span>
          </p>
        )}
      </div>
    );
  }
  return null;
};

export function ClickTimelineChart({ data = [] }) {
  const chartData = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return data.map((item) => {
      const rawDate = item.date || item.timestamp;
      let displayDate = rawDate;
      if (rawDate) {
        if (rawDate.includes("T")) {
          try {
            const d = new Date(rawDate);
            displayDate = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
          } catch (e) {
            displayDate = rawDate;
          }
        } else {
          const parts = rawDate.split("-");
          if (parts.length === 3) {
            displayDate = `${parts[1]}/${parts[2]}`;
          }
        }
      }
      return {
        ...item,
        displayDate: displayDate || "",
      };
    });
  }, [data]);

  if (!chartData || chartData.length === 0) {
    return (
      <div className="h-60 flex items-center justify-center text-xs text-txt-muted border border-dashed border-border-subtle rounded-lg">
        No click activity recorded in this period.
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#7C6CFF" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#7C6CFF" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="tealGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#35C9B5" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#35C9B5" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis
            dataKey="displayDate"
            stroke="#5A6578"
            fontSize={11}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#5A6578"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="clicks"
            stroke="#7C6CFF"
            strokeWidth={1.5}
            fillOpacity={1}
            fill="url(#purpleGradient)"
          />
          <Area
            type="monotone"
            dataKey="unique_visitors"
            stroke="#35C9B5"
            strokeWidth={1.5}
            fillOpacity={1}
            fill="url(#tealGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

import React, { useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  BarChart2,
  LineChart as LineIcon,
  AreaChart as AreaIcon,
  Calendar,
} from "lucide-react";
import { formatNumber } from "../../lib/formatters";

// Custom Theme-Aware Tooltip Component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const total = payload.find((p) => p.dataKey === "clicks")?.value || 0;
    const unique = payload.find((p) => p.dataKey === "unique_visitors")?.value || 0;
    const ratio = total > 0 ? Math.round((unique / total) * 100) : 0;

    return (
      <div className="bg-bg-elevated/95 backdrop-blur-md border border-border-subtle p-3.5 rounded-xl shadow-popover text-xs space-y-2.5 min-w-[200px]">
        <div className="flex items-center justify-between border-b border-border-subtle pb-2">
          <span className="font-semibold text-txt-primary">{label}</span>
          <span className="text-[10px] bg-bg-surface text-txt-muted px-2 py-0.5 rounded-full border border-border-subtle font-numeric">
            {ratio}% unique
          </span>
        </div>
        <div className="space-y-2">
          {payload.map((entry, index) => {
            const isTotal = entry.dataKey === "clicks";
            return (
              <div key={index} className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full inline-block"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-txt-secondary font-medium">
                    {isTotal ? "Total Clicks" : "Unique Visitors"}
                  </span>
                </div>
                <span className="font-bold text-txt-primary font-numeric">
                  {formatNumber(entry.value)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  return null;
};

export function ClickTimelineChart({ data = [] }) {
  const [chartType, setChartType] = useState("area"); // 'area' | 'bar' | 'line'
  const [timeframe, setTimeframe] = useState("7d"); // '7d' | '14d' | '30d'
  const [activeSeries, setActiveSeries] = useState({ clicks: true, unique: true });

  // Transform & pad timeline data to form a continuous date range curve
  const chartData = useMemo(() => {
    if (!Array.isArray(data)) return [];

    const daysCount = timeframe === "7d" ? 7 : timeframe === "14d" ? 14 : 30;

    // Create lookup map of existing date entries
    const map = new Map();
    data.forEach((item) => {
      const key = item.date || item.timestamp;
      if (key) {
        // Strip ISO time if present
        const dateKey = key.includes("T") ? key.split("T")[0] : key;
        map.set(dateKey, item);
      }
    });

    // Reference end date: use latest in data or today
    let endDate = new Date();
    if (data.length > 0) {
      const lastItem = data[data.length - 1];
      const dStr = lastItem.date || lastItem.timestamp;
      if (dStr) {
        const cleanStr = dStr.includes("T") ? dStr.split("T")[0] : dStr;
        const parts = cleanStr.split("-");
        if (parts.length === 3) {
          endDate = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
        }
      }
    }

    const padded = [];
    for (let i = daysCount - 1; i >= 0; i--) {
      const d = new Date(endDate);
      d.setDate(d.getDate() - i);
      const isoDate = d.toISOString().split("T")[0];
      const displayDate = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

      const existing = map.get(isoDate);
      padded.push({
        date: isoDate,
        displayDate,
        clicks: existing ? existing.clicks || 0 : 0,
        unique_visitors: existing ? existing.unique_visitors || 0 : 0,
      });
    }

    return padded;
  }, [data, timeframe]);

  // Compute peak activity day
  const peakDay = useMemo(() => {
    if (!chartData || chartData.length === 0) return null;
    return chartData.reduce((prev, current) => (prev.clicks > current.clicks ? prev : current), chartData[0]);
  }, [chartData]);

  // Compute total clicks in selected dataset timeframe
  const totals = useMemo(() => {
    return chartData.reduce(
      (acc, item) => ({
        clicks: acc.clicks + item.clicks,
        unique: acc.unique + item.unique_visitors,
      }),
      { clicks: 0, unique: 0 }
    );
  }, [chartData]);

  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center space-y-3 text-center border border-dashed border-border-subtle/80 rounded-xl bg-bg-elevated/20 p-6">
        <div className="w-12 h-12 rounded-full bg-accent-purple/10 flex items-center justify-center text-accent-purple">
          <Calendar className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm font-semibold text-txt-primary">No click activity recorded</p>
          <p className="text-xs text-txt-secondary max-w-xs mt-1">
            Share your short links or test a redirect to populate live traffic charts.
          </p>
        </div>
      </div>
    );
  }

  const toggleSeries = (key) => {
    setActiveSeries((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      if (!next.clicks && !next.unique) return prev;
      return next;
    });
  };

  return (
    <div className="space-y-4">
      {/* Header Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-bg-elevated/40 border border-border-subtle rounded-xl">
        {/* Metric Overview Callout */}
        <div className="flex items-baseline space-x-3">
          <div>
            <span className="text-3xl font-bold text-txt-primary font-numeric tracking-tight leading-none">
              {formatNumber(totals.clicks)}
            </span>
            <span className="text-xs text-txt-muted ml-2 font-medium">Total clicks ({timeframe})</span>
          </div>
          {peakDay && peakDay.clicks > 0 && (
            <div className="inline-flex items-center space-x-1.5 text-xs text-accent-teal bg-accent-teal/10 border border-accent-teal/20 px-2.5 py-1 rounded-full">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Peak: <strong>{formatNumber(peakDay.clicks)}</strong> on {peakDay.displayDate}</span>
            </div>
          )}
        </div>

        {/* Range Selector & Series Toggles & View Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Timeframe Selector */}
          <div className="flex items-center bg-bg-surface border border-border-subtle p-0.5 rounded-lg">
            {["7d", "14d", "30d"].map((rangeKey) => (
              <button
                key={rangeKey}
                type="button"
                onClick={() => setTimeframe(rangeKey)}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold uppercase transition-all ${
                  timeframe === rangeKey
                    ? "bg-accent-purple text-white shadow-xs"
                    : "text-txt-muted hover:text-txt-secondary"
                }`}
              >
                {rangeKey}
              </button>
            ))}
          </div>

          {/* Series Legend Toggles */}
          <div className="flex items-center space-x-1.5">
            <button
              type="button"
              onClick={() => toggleSeries("clicks")}
              className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                activeSeries.clicks
                  ? "bg-accent-purple/15 text-accent-purple border border-accent-purple/30"
                  : "bg-bg-elevated text-txt-muted border border-transparent hover:text-txt-secondary"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-accent-purple" />
              <span>Clicks</span>
            </button>

            <button
              type="button"
              onClick={() => toggleSeries("unique")}
              className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                activeSeries.unique
                  ? "bg-accent-teal/15 text-accent-teal border border-accent-teal/30"
                  : "bg-bg-elevated text-txt-muted border border-transparent hover:text-txt-secondary"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-accent-teal" />
              <span>Visitors</span>
            </button>
          </div>

          {/* Chart Type Selector */}
          <div className="flex items-center bg-bg-surface border border-border-subtle p-0.5 rounded-lg">
            <button
              type="button"
              onClick={() => setChartType("area")}
              className={`p-1.5 rounded-md text-xs transition-colors ${
                chartType === "area"
                  ? "bg-bg-elevated text-txt-primary shadow-xs"
                  : "text-txt-muted hover:text-txt-secondary"
              }`}
              title="Area Chart"
            >
              <AreaIcon className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setChartType("bar")}
              className={`p-1.5 rounded-md text-xs transition-colors ${
                chartType === "bar"
                  ? "bg-bg-elevated text-txt-primary shadow-xs"
                  : "text-txt-muted hover:text-txt-secondary"
              }`}
              title="Bar Chart"
            >
              <BarChart2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setChartType("line")}
              className={`p-1.5 rounded-md text-xs transition-colors ${
                chartType === "line"
                  ? "bg-bg-elevated text-txt-primary shadow-xs"
                  : "text-txt-muted hover:text-txt-secondary"
              }`}
              title="Line Chart"
            >
              <LineIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Chart Canvas */}
      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "bar" ? (
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
              <XAxis dataKey="displayDate" stroke="var(--txt-muted)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--txt-muted)" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(128,128,128,0.06)" }} />
              {activeSeries.clicks && <Bar dataKey="clicks" fill="var(--accent-purple)" radius={[4, 4, 0, 0]} maxBarSize={32} />}
              {activeSeries.unique && <Bar dataKey="unique_visitors" fill="var(--accent-teal)" radius={[4, 4, 0, 0]} maxBarSize={32} />}
            </BarChart>
          ) : chartType === "line" ? (
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
              <XAxis dataKey="displayDate" stroke="var(--txt-muted)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--txt-muted)" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              {activeSeries.clicks && (
                <Line
                  type="monotone"
                  dataKey="clicks"
                  stroke="var(--accent-purple)"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: "var(--accent-purple)", strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: "var(--accent-purple)", stroke: "var(--bg-surface)", strokeWidth: 2 }}
                />
              )}
              {activeSeries.unique && (
                <Line
                  type="monotone"
                  dataKey="unique_visitors"
                  stroke="var(--accent-teal)"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: "var(--accent-teal)", strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: "var(--accent-teal)", stroke: "var(--bg-surface)", strokeWidth: 2 }}
                />
              )}
            </LineChart>
          ) : (
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent-purple)" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="var(--accent-purple)" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="tealGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent-teal)" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="var(--accent-teal)" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
              <XAxis dataKey="displayDate" stroke="var(--txt-muted)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--txt-muted)" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              {activeSeries.clicks && (
                <Area
                  type="monotone"
                  dataKey="clicks"
                  stroke="var(--accent-purple)"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#purpleGradient)"
                  activeDot={{ r: 6, fill: "var(--accent-purple)", stroke: "var(--bg-surface)", strokeWidth: 2 }}
                />
              )}
              {activeSeries.unique && (
                <Area
                  type="monotone"
                  dataKey="unique_visitors"
                  stroke="var(--accent-teal)"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#tealGradient)"
                  activeDot={{ r: 6, fill: "var(--accent-teal)", stroke: "var(--bg-surface)", strokeWidth: 2 }}
                />
              )}
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}


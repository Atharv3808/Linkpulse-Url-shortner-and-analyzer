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
  MousePointerClick,
  Users,
  TrendingUp,
  BarChart2,
  LineChart as LineIcon,
  AreaChart as AreaIcon,
  Calendar,
} from "lucide-react";
import { formatNumber } from "../../lib/formatters";

// Premium Glassmorphic Tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const total = payload.find((p) => p.dataKey === "clicks")?.value || 0;
    const unique = payload.find((p) => p.dataKey === "unique_visitors")?.value || 0;
    const ratio = total > 0 ? Math.round((unique / total) * 100) : 0;

    return (
      <div className="bg-[#0E1017]/95 backdrop-blur-md border border-white/10 p-3.5 rounded-xl shadow-2xl text-xs space-y-2.5 min-w-[200px]">
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <span className="font-semibold text-txt-primary">{label}</span>
          <span className="text-[10px] bg-white/5 text-txt-muted px-2 py-0.5 rounded-full border border-white/5">
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
  const [activeSeries, setActiveSeries] = useState({ clicks: true, unique: true });

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
            const d = new Date(parts[0], parts[1] - 1, parts[2]);
            displayDate = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
          }
        }
      }
      return {
        ...item,
        displayDate: displayDate || "",
        clicks: item.clicks || 0,
        unique_visitors: item.unique_visitors || 0,
      };
    });
  }, [data]);

  // Compute peak activity day
  const peakDay = useMemo(() => {
    if (!chartData || chartData.length === 0) return null;
    return chartData.reduce((prev, current) => (prev.clicks > current.clicks ? prev : current), chartData[0]);
  }, [chartData]);

  // Compute total clicks in dataset
  const totals = useMemo(() => {
    return chartData.reduce(
      (acc, item) => ({
        clicks: acc.clicks + item.clicks,
        unique: acc.unique + item.unique_visitors,
      }),
      { clicks: 0, unique: 0 }
    );
  }, [chartData]);

  if (!chartData || chartData.length === 0) {
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
      // Prevent unselecting both
      if (!next.clicks && !next.unique) return prev;
      return next;
    });
  };

  return (
    <div className="space-y-4">
      {/* Header Controls & Summary Stats Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-bg-elevated/40 border border-border-subtle rounded-xl">
        {/* Series Toggles */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => toggleSeries("clicks")}
            className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeSeries.clicks
                ? "bg-accent-purple/15 text-accent-purple border border-accent-purple/30 shadow-sm"
                : "bg-bg-elevated text-txt-muted border border-transparent hover:text-txt-secondary"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-accent-purple" />
            <span>Total Clicks</span>
            <span className="font-semibold font-numeric">({formatNumber(totals.clicks)})</span>
          </button>

          <button
            type="button"
            onClick={() => toggleSeries("unique")}
            className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeSeries.unique
                ? "bg-accent-teal/15 text-accent-teal border border-accent-teal/30 shadow-sm"
                : "bg-bg-elevated text-txt-muted border border-transparent hover:text-txt-secondary"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-accent-teal" />
            <span>Unique Visitors</span>
            <span className="font-semibold font-numeric">({formatNumber(totals.unique)})</span>
          </button>
        </div>

        {/* Peak Badge & Chart View Toggle */}
        <div className="flex items-center justify-between sm:justify-end space-x-3">
          {peakDay && peakDay.clicks > 0 && (
            <div className="hidden md:flex items-center space-x-1.5 text-[11px] text-txt-secondary bg-white/5 border border-white/5 px-2.5 py-1 rounded-lg">
              <TrendingUp className="w-3.5 h-3.5 text-accent-green" />
              <span>Peak:</span>
              <strong className="text-txt-primary font-numeric">{formatNumber(peakDay.clicks)}</strong>
              <span>on {peakDay.displayDate}</span>
            </div>
          )}

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
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="displayDate" stroke="#5A6578" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#5A6578" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
              {activeSeries.clicks && <Bar dataKey="clicks" fill="#6366F1" radius={[4, 4, 0, 0]} maxBarSize={32} />}
              {activeSeries.unique && <Bar dataKey="unique_visitors" fill="#10B981" radius={[4, 4, 0, 0]} maxBarSize={32} />}
            </BarChart>
          ) : chartType === "line" ? (
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="displayDate" stroke="#5A6578" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#5A6578" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              {activeSeries.clicks && (
                <Line
                  type="monotone"
                  dataKey="clicks"
                  stroke="#6366F1"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: "#6366F1", strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: "#6366F1", stroke: "#ffffff", strokeWidth: 2 }}
                />
              )}
              {activeSeries.unique && (
                <Line
                  type="monotone"
                  dataKey="unique_visitors"
                  stroke="#10B981"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: "#10B981", strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: "#10B981", stroke: "#ffffff", strokeWidth: 2 }}
                />
              )}
            </LineChart>
          ) : (
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="tealGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="displayDate" stroke="#5A6578" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#5A6578" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              {activeSeries.clicks && (
                <Area
                  type="monotone"
                  dataKey="clicks"
                  stroke="#6366F1"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#purpleGradient)"
                  activeDot={{ r: 6, fill: "#6366F1", stroke: "#ffffff", strokeWidth: 2 }}
                />
              )}
              {activeSeries.unique && (
                <Area
                  type="monotone"
                  dataKey="unique_visitors"
                  stroke="#10B981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#tealGradient)"
                  activeDot={{ r: 6, fill: "#10B981", stroke: "#ffffff", strokeWidth: 2 }}
                />
              )}
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}


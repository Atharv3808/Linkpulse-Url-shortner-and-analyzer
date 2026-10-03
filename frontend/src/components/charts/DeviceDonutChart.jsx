import React from "react";
import { Monitor, Smartphone, Tablet, Bot } from "lucide-react";
import { formatNumber } from "../../lib/formatters";

export function DeviceDonutChart({ devices = {} }) {
  const counts = devices.counts || {};
  const percentages = devices.percentages || {};

  const items = [
    { label: "DESKTOP", key: "desktop", icon: Monitor, color: "text-[#1351AA]" },
    { label: "MOBILE", key: "mobile", icon: Smartphone, color: "text-[#1351AA]" },
    { label: "TABLET", key: "tablet", icon: Tablet, color: "text-txt-primary" },
    { label: "BOT / CRAWLER", key: "bot", icon: Bot, color: "text-red-700" },
  ];

  return (
    <div className="space-y-2.5">
      {items.map((item) => {
        const count = counts[item.key] || 0;
        const pct = percentages[item.key] || 0;
        const Icon = item.icon;

        return (
          <div
            key={item.key}
            className="flex items-center justify-between p-3 bg-bg-surface border border-border-subtle rounded-none text-xs"
          >
            <div className="flex items-center space-x-3">
              <Icon className={`w-4 h-4 ${item.color}`} />
              <span className="font-mono font-bold uppercase text-txt-primary">{item.label}</span>
            </div>
            <div className="text-right font-mono">
              <span className="font-bold text-txt-primary font-numeric">
                {formatNumber(count)}
              </span>
              <span className="text-txt-muted ml-2 font-numeric">({pct}%)</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

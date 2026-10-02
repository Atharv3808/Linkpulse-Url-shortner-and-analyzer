import React from "react";
import { Monitor, Smartphone, Tablet, Bot, HelpCircle } from "lucide-react";
import { formatNumber } from "../../lib/formatters";

export function DeviceDonutChart({ devices = {} }) {
  const counts = devices.counts || {};
  const percentages = devices.percentages || {};

  const items = [
    { label: "Desktop", key: "desktop", icon: Monitor, color: "text-accent-purple" },
    { label: "Mobile", key: "mobile", icon: Smartphone, color: "text-accent-teal" },
    { label: "Tablet", key: "tablet", icon: Tablet, color: "text-accent-yellow" },
    { label: "Bot / Crawler", key: "bot", icon: Bot, color: "text-accent-red" },
  ];

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const count = counts[item.key] || 0;
        const pct = percentages[item.key] || 0;
        const Icon = item.icon;

        return (
          <div
            key={item.key}
            className="flex items-center justify-between p-2.5 bg-bg-elevated/40 border border-border-subtle rounded-lg text-xs"
          >
            <div className="flex items-center space-x-2.5">
              <Icon className={`w-4 h-4 ${item.color}`} />
              <span className="font-medium text-txt-primary">{item.label}</span>
            </div>
            <div className="text-right">
              <span className="font-semibold text-txt-primary font-numeric">
                {formatNumber(count)}
              </span>
              <span className="text-txt-muted ml-1.5 font-numeric">({pct}%)</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

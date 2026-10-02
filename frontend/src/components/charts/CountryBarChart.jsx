import React from "react";
import { formatNumber } from "../../lib/formatters";

export function CountryBarChart({ countries = [] }) {
  if (!countries || countries.length === 0) {
    return (
      <div className="py-8 text-center text-xs text-txt-muted border border-dashed border-border-subtle rounded-lg">
        No country data available.
      </div>
    );
  }

  const maxClicks = Math.max(...countries.map((c) => c.clicks || 0), 1);

  return (
    <div className="space-y-3">
      {countries.slice(0, 7).map((item, idx) => {
        const percentage = item.percentage ?? Math.round((item.clicks / maxClicks) * 100);
        return (
          <div key={idx} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-txt-primary truncate">
                {item.country || "Unknown"}
              </span>
              <span className="text-txt-secondary font-numeric">
                {formatNumber(item.clicks)}{" "}
                <span className="text-txt-muted">({percentage}%)</span>
              </span>
            </div>
            <div className="w-full bg-bg-elevated h-2 rounded-full overflow-hidden">
              <div
                className="bg-accent-purple h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, percentage)}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

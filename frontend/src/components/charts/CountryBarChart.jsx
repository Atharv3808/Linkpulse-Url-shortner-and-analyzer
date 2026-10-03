import React from "react";
import { formatNumber } from "../../lib/formatters";

export function CountryBarChart({ countries = [] }) {
  if (!countries || countries.length === 0) {
    return (
      <div className="py-8 text-center text-xs font-mono text-txt-muted border border-border-subtle rounded-none uppercase">
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
              <span className="font-bold text-txt-primary uppercase truncate font-mono">
                {item.country || "Unknown"}
              </span>
              <span className="text-txt-secondary font-numeric font-mono text-xs">
                {formatNumber(item.clicks)}{" "}
                <span className="text-txt-muted">({percentage}%)</span>
              </span>
            </div>
            <div className="w-full bg-bg-elevated h-2.5 rounded-none overflow-hidden border border-border-subtle">
              <div
                className="bg-[#1351AA] h-full rounded-none transition-all duration-300"
                style={{ width: `${Math.min(100, percentage)}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

import React from "react";

export function Badge({ children, variant = "neutral", size = "sm" }) {
  const variants = {
    active: "bg-accent-green/10 text-accent-green border-accent-green/20",
    inactive: "bg-txt-muted/10 text-txt-secondary border-white/10",
    expired: "bg-accent-red/10 text-accent-red border-accent-red/20",
    bot: "bg-accent-yellow/10 text-accent-yellow border-accent-yellow/20",
    purple: "bg-accent-purple/10 text-accent-purple border-accent-purple/20",
    neutral: "bg-bg-elevated text-txt-secondary border-border-subtle",
  };

  const sizes = {
    sm: "px-2.5 py-0.5 text-[11px] font-medium tracking-wide",
    md: "px-3 py-1 text-xs font-semibold tracking-wide",
  };

  return (
    <span
      className={`inline-flex items-center rounded-md border ${variants[variant] || variants.neutral} ${sizes[size]}`}
    >
      {children}
    </span>
  );
}

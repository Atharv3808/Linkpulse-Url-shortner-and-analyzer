import React from "react";

export function Badge({ children, variant = "default", className = "" }) {
  const baseStyles =
    "inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-md border tracking-tight shrink-0 select-none";

  const variants = {
    default: "bg-bg-elevated text-txt-secondary border-border-subtle",
    purple: "bg-accent-purple/10 text-accent-purple border-accent-purple/20",
    teal: "bg-accent-teal/10 text-accent-teal border-accent-teal/20",
    active: "bg-accent-green/10 text-accent-green border-accent-green/20",
    inactive: "bg-txt-muted/10 text-txt-muted border-border-subtle",
    warning: "bg-accent-yellow/10 text-accent-yellow border-accent-yellow/20",
    danger: "bg-accent-red/10 text-accent-red border-accent-red/20",
  };

  return (
    <span className={`${baseStyles} ${variants[variant] || variants.default} ${className}`}>
      {children}
    </span>
  );
}

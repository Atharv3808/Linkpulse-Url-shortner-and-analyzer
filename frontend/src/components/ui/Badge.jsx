import React from "react";

export function Badge({ children, variant = "default", className = "" }) {
  const baseStyles =
    "inline-flex items-center text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-none border shrink-0 select-none";

  const variants = {
    default: "bg-bg-elevated text-txt-secondary border-border-subtle",
    purple: "bg-[#1351AA]/10 text-[#1351AA] border-[#1351AA]/30",
    teal: "bg-[#1351AA]/10 text-[#1351AA] border-[#1351AA]/30",
    active: "bg-[#1351AA]/10 text-[#1351AA] border-[#1351AA]/30",
    inactive: "bg-txt-muted/10 text-txt-muted border-border-subtle",
    expired: "bg-red-700/10 text-red-700 border-red-700/30",
    warning: "bg-amber-500/10 text-amber-700 border-amber-500/30",
    danger: "bg-red-700/10 text-red-700 border-red-700/30",
  };

  return (
    <span className={`${baseStyles} ${variants[variant] || variants.default} ${className}`}>
      {children}
    </span>
  );
}

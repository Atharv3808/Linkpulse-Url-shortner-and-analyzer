import React from "react";
import { Loader2 } from "lucide-react";

export function Button({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled = false,
  icon: Icon,
  className = "",
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-1 focus:ring-accent-purple/50 focus:ring-offset-1 focus:ring-offset-bg-dark disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer";

  const variants = {
    primary:
      "bg-accent-purple hover:bg-accent-purple-hover text-white shadow-xs",
    secondary:
      "bg-bg-elevated hover:bg-white/[0.04] text-txt-primary border border-border-subtle hover:border-border-hover",
    outline:
      "bg-transparent border border-border-subtle hover:bg-bg-elevated text-txt-primary hover:border-border-hover",
    danger:
      "bg-accent-red/10 border border-accent-red/20 hover:bg-accent-red/20 text-accent-red",
    ghost:
      "bg-transparent hover:bg-bg-elevated text-txt-secondary hover:text-txt-primary",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs gap-1.5 min-h-[32px]",
    md: "px-4 py-2 text-sm gap-2 min-h-[38px]",
    lg: "px-5 py-2.5 text-sm gap-2.5 min-h-[44px]",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant] || variants.primary} ${
        sizes[size] || sizes.md
      } ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current shrink-0" />
      ) : Icon ? (
        <Icon className="w-4 h-4 shrink-0" />
      ) : null}
      <span>{children}</span>
    </button>
  );
}

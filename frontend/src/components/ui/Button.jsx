import React from "react";
import { Loader2 } from "lucide-react";

export function Button({
  children,
  variant = "primary",
  size = "md",
  icon: Icon,
  iconPosition = "left",
  isLoading = false,
  disabled = false,
  className = "",
  type = "button",
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center font-bold tracking-[0.08em] uppercase transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#1351AA] focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed select-none rounded-none cursor-pointer";

  const variants = {
    primary:
      "bg-[#1351AA] text-[#E3E2DE] hover:bg-[#141414] active:bg-[#141414]",
    secondary:
      "bg-[#141414] text-[#E3E2DE] hover:bg-[#1351AA] border border-[#141414]",
    outline:
      "bg-transparent text-txt-primary border border-border-subtle hover:border-[#141414] hover:bg-[#141414] hover:text-[#E3E2DE]",
    ghost:
      "bg-transparent text-txt-secondary hover:text-txt-primary hover:bg-bg-elevated font-mono",
    danger:
      "bg-red-700 text-white hover:bg-[#141414] active:bg-[#141414]",
  };

  const sizes = {
    xs: "text-[10px] px-2.5 py-1 space-x-1.5 min-h-[28px]",
    sm: "text-xs px-3.5 py-1.5 space-x-1.5 min-h-[36px]",
    md: "text-xs px-4 py-2.5 space-x-2 min-h-[44px]",
    lg: "text-sm px-6 py-3 space-x-2.5 min-h-[52px]",
  };

  const iconSizes = {
    xs: "w-3 h-3",
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-4.5 h-4.5",
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className={`${iconSizes[size]} animate-spin shrink-0`} />
      ) : Icon && iconPosition === "left" ? (
        <Icon className={`${iconSizes[size]} shrink-0`} />
      ) : null}

      <span>{children}</span>

      {!isLoading && Icon && iconPosition === "right" && (
        <Icon className={`${iconSizes[size]} shrink-0`} />
      )}
    </button>
  );
}

export function IconButton({
  icon: Icon,
  label,
  variant = "ghost",
  size = "md",
  className = "",
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#1351AA] disabled:opacity-50 disabled:cursor-not-allowed rounded-none text-txt-secondary hover:text-txt-primary cursor-pointer";

  const variants = {
    ghost: "bg-transparent hover:bg-bg-elevated",
    outline: "bg-transparent border border-border-subtle hover:bg-[#141414] hover:text-[#E3E2DE]",
    secondary: "bg-bg-secondary border border-border-subtle hover:bg-[#141414] hover:text-[#E3E2DE]",
  };

  const sizes = {
    xs: "w-7 h-7 p-1 text-xs",
    sm: "w-8 h-8 p-1.5 text-xs",
    md: "w-9 h-9 p-2 text-sm",
    lg: "w-10 h-10 p-2.5 text-base",
  };

  const iconSizes = {
    xs: "w-3.5 h-3.5",
    sm: "w-4 h-4",
    md: "w-4.5 h-4.5",
    lg: "w-5 h-5",
  };

  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      className={`${baseStyles} ${variants[variant] || variants.ghost} ${sizes[size]} ${className}`}
      {...props}
    >
      <Icon className={iconSizes[size]} />
    </button>
  );
}

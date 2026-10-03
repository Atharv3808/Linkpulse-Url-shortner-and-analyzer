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
    "inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-accent-purple/40 disabled:opacity-50 disabled:cursor-not-allowed select-none rounded-md";

  const variants = {
    primary:
      "bg-accent-purple text-white hover:bg-accent-purple-hover shadow-xs active:scale-[0.99]",
    secondary:
      "bg-bg-secondary text-txt-primary hover:bg-bg-elevated border border-border-subtle hover:border-border-hover active:scale-[0.99]",
    outline:
      "bg-transparent text-txt-primary border border-border-subtle hover:bg-bg-elevated hover:border-border-hover active:scale-[0.99]",
    ghost:
      "bg-transparent text-txt-secondary hover:text-txt-primary hover:bg-bg-elevated active:scale-[0.99]",
    danger:
      "bg-accent-red text-white hover:opacity-90 shadow-xs active:scale-[0.99]",
  };

  const sizes = {
    xs: "text-[11px] px-2 py-1 space-x-1.5 min-h-[28px]",
    sm: "text-xs px-3 py-1.5 space-x-1.5 min-h-[32px]",
    md: "text-xs px-3.5 py-2 space-x-2 min-h-[36px]",
    lg: "text-sm px-4.5 py-2.5 space-x-2 min-h-[42px]",
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
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
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
    "inline-flex items-center justify-center transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-accent-purple/40 disabled:opacity-50 disabled:cursor-not-allowed rounded-md text-txt-secondary hover:text-txt-primary";

  const variants = {
    ghost: "bg-transparent hover:bg-bg-elevated",
    outline: "bg-transparent border border-border-subtle hover:bg-bg-elevated hover:border-border-hover",
    secondary: "bg-bg-secondary border border-border-subtle hover:bg-bg-elevated",
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
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      <Icon className={iconSizes[size]} />
    </button>
  );
}

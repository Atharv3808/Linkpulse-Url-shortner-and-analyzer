import React, { forwardRef } from "react";

export const Input = forwardRef(function Input(
  { label, error, helperText, icon: Icon, className = "", ...props },
  ref
) {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="block text-xs font-medium text-txt-secondary uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="relative rounded-lg shadow-xs">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-txt-muted">
            <Icon className="h-4 w-4" />
          </div>
        )}
        <input
          ref={ref}
          className={`block w-full rounded-lg bg-bg-elevated border border-border-subtle px-3.5 py-2 text-sm text-txt-primary placeholder-txt-muted transition-colors focus:border-accent-purple/60 focus:outline-none focus:ring-1 focus:ring-accent-purple/40 ${
            Icon ? "pl-9" : ""
          } ${error ? "border-accent-red focus:border-accent-red focus:ring-accent-red/40" : ""} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-accent-red font-medium mt-1">{error}</p>}
      {helperText && !error && (
        <p className="text-xs text-txt-muted mt-1">{helperText}</p>
      )}
    </div>
  );
});

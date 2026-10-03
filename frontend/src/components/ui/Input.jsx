import React from "react";

export function Input({
  label,
  error,
  helperText,
  icon: Icon,
  className = "",
  id,
  type = "text",
  ...props
}) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-medium text-txt-secondary select-none"
        >
          {label}
        </label>
      )}
      <div className="relative rounded-lg">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-txt-muted">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          id={inputId}
          type={type}
          className={`w-full bg-bg-secondary border text-txt-primary text-xs rounded-lg ${
            Icon ? "pl-9" : "px-3"
          } py-2.5 transition-colors placeholder:text-txt-muted focus:outline-none ${
            error
              ? "border-accent-red focus:border-accent-red focus:ring-1 focus:ring-accent-red/40"
              : "border-border-subtle hover:border-border-hover focus:border-accent-purple/60 focus:ring-1 focus:ring-accent-purple/40"
          } ${className}`}
          {...props}
        />
      </div>
      {error ? (
        <p className="text-[11px] text-accent-red font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-[11px] text-txt-muted">{helperText}</p>
      ) : null}
    </div>
  );
}

export function Select({
  label,
  error,
  options = [],
  className = "",
  id,
  children,
  ...props
}) {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-xs font-medium text-txt-secondary select-none"
        >
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`w-full bg-bg-secondary border text-txt-primary text-xs rounded-lg px-3 py-2.5 transition-colors focus:outline-none ${
          error
            ? "border-accent-red focus:border-accent-red focus:ring-1 focus:ring-accent-red/40"
            : "border-border-subtle hover:border-border-hover focus:border-accent-purple/60 focus:ring-1 focus:ring-accent-purple/40"
        } ${className}`}
        {...props}
      >
        {children ||
          options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
      </select>
      {error && <p className="text-[11px] text-accent-red font-medium">{error}</p>}
    </div>
  );
}

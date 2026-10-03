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
          className="block text-xs font-mono font-bold tracking-wider text-[#444343] uppercase select-none"
        >
          {label}
        </label>
      )}
      <div className="relative rounded-none">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-txt-muted">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          id={inputId}
          type={type}
          className={`w-full bg-bg-secondary border text-txt-primary text-xs rounded-none ${
            Icon ? "pl-10" : "px-3.5"
          } py-3 h-[44px] transition-colors placeholder:text-txt-muted focus:outline-none ${
            error
              ? "border-red-700 focus:border-red-700 focus:ring-1 focus:ring-red-700"
              : "border-border-subtle hover:border-border-hover focus:border-[#1351AA] focus:ring-1 focus:ring-[#1351AA]"
          } ${className}`}
          {...props}
        />
      </div>
      {error ? (
        <p className="text-[11px] font-mono text-red-700 font-bold">{error}</p>
      ) : helperText ? (
        <p className="text-[11px] font-mono text-txt-muted">{helperText}</p>
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
          className="block text-xs font-mono font-bold tracking-wider text-[#444343] uppercase select-none"
        >
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`w-full bg-bg-secondary border text-txt-primary text-xs rounded-none px-3.5 py-3 h-[44px] transition-colors focus:outline-none ${
          error
            ? "border-red-700 focus:border-red-700 focus:ring-1 focus:ring-red-700"
            : "border-border-subtle hover:border-border-hover focus:border-[#1351AA] focus:ring-1 focus:ring-[#1351AA]"
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
      {error && <p className="text-[11px] font-mono text-red-700 font-bold">{error}</p>}
    </div>
  );
}

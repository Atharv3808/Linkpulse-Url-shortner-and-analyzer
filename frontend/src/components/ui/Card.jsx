import React from "react";

export function Card({ children, className = "", onClick, ...props }) {
  return (
    <div
      onClick={onClick}
      className={`bg-bg-card border border-border-subtle rounded-xl p-4.5 transition-all duration-150 ${
        onClick ? "cursor-pointer hover:border-border-hover" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, description, action, className = "" }) {
  return (
    <div className={`flex items-start justify-between gap-4 mb-4 ${className}`}>
      <div>
        <h3 className="text-sm font-semibold text-txt-primary tracking-tight">{title}</h3>
        {description && (
          <p className="text-xs text-txt-secondary mt-0.5">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

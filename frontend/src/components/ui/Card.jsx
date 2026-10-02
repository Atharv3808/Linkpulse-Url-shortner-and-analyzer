import React from "react";

export function Card({ children, className = "", ...props }) {
  return (
    <div
      className={`bg-bg-surface border border-border-subtle rounded-xl p-5 sm:p-6 shadow-xs ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, description, action }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5 pb-4 border-b border-border-subtle">
      <div>
        <h3 className="text-base font-semibold text-txt-primary tracking-tight">{title}</h3>
        {description && (
          <p className="text-xs text-txt-secondary mt-0.5">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

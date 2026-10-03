import React from "react";

export function Card({ children, className = "", onClick, ...props }) {
  return (
    <div
      onClick={onClick}
      className={`bg-bg-card border border-border-subtle rounded-none p-6 overflow-hidden transition-colors duration-150 ${
        onClick ? "cursor-pointer hover:border-border-hover hover:bg-bg-elevated/40" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, description, action, className = "" }) {
  return (
    <div className={`flex items-start justify-between gap-4 mb-5 pb-3 border-b border-border-subtle ${className}`}>
      <div>
        <h3 className="text-sm font-black uppercase tracking-tight text-txt-primary">
          {title}
        </h3>
        {description && (
          <p className="text-xs font-mono text-txt-muted mt-1">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

import React from "react";

export function Tabs({ tabs = [], activeTab, onChange, className = "" }) {
  return (
    <div className={`flex items-center border-b border-border-subtle space-x-1 ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`inline-flex items-center space-x-2 px-3 py-2 text-xs font-medium border-b-2 transition-all duration-150 -mb-px select-none ${
              isActive
                ? "border-accent-purple text-txt-primary"
                : "border-transparent text-txt-secondary hover:text-txt-primary hover:border-border-hover"
            }`}
          >
            {Icon && <Icon className={`w-3.5 h-3.5 ${isActive ? "text-accent-purple" : "text-txt-muted"}`} />}
            <span>{tab.label}</span>
            {tab.badge && (
              <span className="text-[10px] bg-bg-elevated text-txt-secondary px-1.5 py-0.2 rounded-full">
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

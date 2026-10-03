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
            className={`inline-flex items-center space-x-2 px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-wider border-b-2 transition-colors duration-150 -mb-px select-none rounded-none cursor-pointer ${
              isActive
                ? "border-[#1351AA] text-[#1351AA] bg-bg-elevated/40"
                : "border-transparent text-txt-secondary hover:text-txt-primary hover:border-border-hover"
            }`}
          >
            {Icon && <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[#1351AA]" : "text-txt-muted"}`} />}
            <span>{tab.label}</span>
            {tab.badge && (
              <span className="text-[10px] font-mono bg-bg-elevated text-txt-secondary px-1.5 py-0.5 border border-border-subtle">
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

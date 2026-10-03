import React from "react";

export function SectionLabel({ label, sublabel, children }) {
  return (
    <>
      {/* Desktop Sidebar (Columns 1–3) */}
      <aside className="lg:col-span-3 hidden lg:flex flex-col justify-between p-8 xl:p-10 border-r border-[#C7C7C7] bg-[#E3E2DE] select-none">
        <div className="space-y-2 sticky top-28">
          <div className="text-xs font-mono font-bold tracking-[0.2em] text-[#7A7A7A] uppercase flex items-center space-x-2">
            <span className="inline-block w-1.5 h-1.5 bg-[#1351AA]"></span>
            <span>{label}</span>
          </div>
          {sublabel && (
            <p className="text-[11px] font-mono text-[#444343] leading-relaxed">
              {sublabel}
            </p>
          )}
        </div>
        {children && <div className="pt-8 text-xs font-mono text-[#7A7A7A]">{children}</div>}
      </aside>

      {/* Mobile Top Label */}
      <div className="lg:hidden px-6 pt-8 pb-2 border-b border-[#C7C7C7]/60 bg-[#E3E2DE]">
        <div className="text-xs font-mono font-bold tracking-[0.2em] text-[#7A7A7A] uppercase flex items-center space-x-2">
          <span className="inline-block w-1.5 h-1.5 bg-[#1351AA]"></span>
          <span>[{label}]</span>
        </div>
      </div>
    </>
  );
}

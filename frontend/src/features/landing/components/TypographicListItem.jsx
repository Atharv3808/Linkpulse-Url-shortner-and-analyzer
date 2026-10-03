import React from "react";

export function TypographicListItem({ index, title, description, badge, onClick }) {
  return (
    <div
      onClick={onClick}
      className="group border-t border-[#C7C7C7] p-6 sm:p-8 xl:p-10 transition-colors duration-300 hover:bg-[#F8F9FA] cursor-pointer select-none flex flex-col md:flex-row md:items-center justify-between gap-4"
    >
      <div className="flex items-start md:items-center space-x-6">
        <span className="font-mono text-xs text-[#7A7A7A] tracking-wider pt-1 md:pt-0 shrink-0">
          {index}
        </span>
        <div className="space-y-1">
          <h3 className="text-2xl sm:text-3xl xl:text-4xl font-black text-[#141414] group-hover:text-[#1351AA] transition-colors duration-300 tracking-tight uppercase">
            {title}
          </h3>
          {description && (
            <p className="text-sm text-[#444343] font-medium leading-relaxed max-w-xl">
              {description}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-3 shrink-0 self-end md:self-center">
        {badge && (
          <span className="text-[10px] font-mono font-bold tracking-widest text-[#7A7A7A] border border-[#C7C7C7] px-2.5 py-1 uppercase bg-[#F8F9FA]">
            {badge}
          </span>
        )}
        <span className="text-xl font-bold text-[#141414] group-hover:text-[#1351AA] transition-transform duration-300 group-hover:translate-x-2">
          →
        </span>
      </div>
    </div>
  );
}

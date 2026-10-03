import React from "react";

export function ProductPreviewFrame() {
  return (
    <div className="w-full border border-[#C7C7C7] bg-white font-sans text-[#141414] select-none my-8">
      {/* Header Bar */}
      <div className="border-b border-[#C7C7C7] p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center space-x-3">
          <span className="w-2.5 h-2.5 bg-[#1351AA]"></span>
          <span className="font-bold tracking-wider text-[#141414] uppercase">
            LINKPULSE / OVERVIEW
          </span>
          <span className="text-[#7A7A7A] hidden sm:inline">|</span>
          <span className="text-[#7A7A7A] hidden sm:inline uppercase">
            LIVE ANALYTICS ENGINE
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <span className="px-2.5 py-1 bg-[#141414] text-white font-bold text-[10px] tracking-widest uppercase">
            30 DAYS
          </span>
          <span className="text-[10px] font-bold text-[#1351AA] border border-[#1351AA] px-2 py-0.5 uppercase">
            PRODUCT PREVIEW
          </span>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 border-b border-[#C7C7C7]">
        <div className="p-6 border-b sm:border-b-0 sm:border-r border-[#C7C7C7]">
          <div className="text-[10px] font-mono font-bold tracking-widest text-[#7A7A7A] uppercase mb-1">
            TOTAL CLICKS
          </div>
          <div className="text-3xl sm:text-4xl font-black text-[#141414] font-numeric tracking-tight">
            24,891
          </div>
          <div className="text-xs font-mono text-[#1351AA] font-bold mt-1">
            +18.4% vs last period
          </div>
        </div>

        <div className="p-6 border-b sm:border-b-0 sm:border-r border-[#C7C7C7]">
          <div className="text-[10px] font-mono font-bold tracking-widest text-[#7A7A7A] uppercase mb-1">
            UNIQUE VISITORS
          </div>
          <div className="text-3xl sm:text-4xl font-black text-[#141414] font-numeric tracking-tight">
            18,410
          </div>
          <div className="text-xs font-mono text-[#444343] mt-1">
            73.9% conversion rate
          </div>
        </div>

        <div className="p-6">
          <div className="text-[10px] font-mono font-bold tracking-widest text-[#7A7A7A] uppercase mb-1">
            BOT TRAFFIC FILTERED
          </div>
          <div className="text-3xl sm:text-4xl font-black text-[#141414] font-numeric tracking-tight">
            1,240
          </div>
          <div className="text-xs font-mono text-[#7A7A7A] mt-1">
            Verified automated crawlers
          </div>
        </div>
      </div>

      {/* Editorial Timeline Chart SVG */}
      <div className="p-6 sm:p-8 border-b border-[#C7C7C7] bg-white">
        <div className="flex items-center justify-between text-xs font-mono mb-4 text-[#7A7A7A]">
          <span>CLICK TIMELINE breakdown (OCT 2026)</span>
          <span className="text-[#1351AA] font-bold">PEAK: 1,480 CLICKS / DAY</span>
        </div>

        <div className="h-44 sm:h-52 w-full relative">
          <svg
            className="w-full h-full overflow-visible"
            viewBox="0 0 800 200"
            preserveAspectRatio="none"
          >
            {/* Horizontal Grid lines */}
            <line x1="0" y1="40" x2="800" y2="40" stroke="#C7C7C7" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="0" y1="90" x2="800" y2="90" stroke="#C7C7C7" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="0" y1="140" x2="800" y2="140" stroke="#C7C7C7" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="0" y1="190" x2="800" y2="190" stroke="#C7C7C7" strokeWidth="1" />

            {/* Editorial Line Path */}
            <path
              d="M 0,160 Q 100,140 200,80 T 400,100 T 600,30 T 800,90"
              fill="none"
              stroke="#1351AA"
              strokeWidth="3.5"
            />

            {/* Peak Dot Markers */}
            <circle cx="200" cy="80" r="5" fill="#1351AA" stroke="#FFFFFF" strokeWidth="2" />
            <circle cx="600" cy="30" r="6" fill="#1351AA" stroke="#FFFFFF" strokeWidth="2" />

            {/* Peak Callout Label */}
            <g transform="translate(560, 2)">
              <rect x="0" y="0" width="80" height="20" fill="#1351AA" />
              <text x="40" y="14" fill="#FFFFFF" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                1,480 CLICKS
              </text>
            </g>
          </svg>
        </div>

        <div className="flex justify-between text-[10px] font-mono text-[#7A7A7A] pt-2 border-t border-[#C7C7C7]">
          <span>OCT 01</span>
          <span>OCT 08</span>
          <span>OCT 15</span>
          <span>OCT 22</span>
          <span>OCT 30</span>
        </div>
      </div>

      {/* Dual Breakdown Table (Top Links & Traffic) */}
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Top Links */}
        <div className="p-6 border-b md:border-b-0 md:border-r border-[#C7C7C7] space-y-4">
          <div className="text-xs font-mono font-bold tracking-widest text-[#141414] uppercase flex items-center justify-between">
            <span>TOP PERFORMING LINKS</span>
            <span className="text-[#7A7A7A]">CLICKS</span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between p-2.5 border border-[#C7C7C7] bg-[#F8F9FA]">
              <span className="font-bold text-[#1351AA]">/launch2026</span>
              <span className="font-bold font-numeric text-[#141414]">8,421</span>
            </div>
            <div className="flex items-center justify-between p-2.5 border border-[#C7C7C7] bg-[#F8F9FA]">
              <span className="font-bold text-[#141414]">/portfolio</span>
              <span className="font-bold font-numeric text-[#141414]">5,210</span>
            </div>
            <div className="flex items-center justify-between p-2.5 border border-[#C7C7C7] bg-[#F8F9FA]">
              <span className="font-bold text-[#141414]">/newsletter-oct</span>
              <span className="font-bold font-numeric text-[#141414]">3,890</span>
            </div>
          </div>
        </div>

        {/* Traffic Breakdown */}
        <div className="p-6 space-y-4">
          <div className="text-xs font-mono font-bold tracking-widest text-[#141414] uppercase flex items-center justify-between">
            <span>DEVICE & LOCATION</span>
            <span className="text-[#7A7A7A]">SHARE</span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div>
              <div className="flex justify-between mb-1">
                <span>MOBILE DEVICES</span>
                <span className="font-bold text-[#1351AA]">68%</span>
              </div>
              <div className="w-full h-2 bg-[#C7C7C7]">
                <div className="h-full bg-[#1351AA] w-[68%]"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span>DESKTOP COMPUTERS</span>
                <span className="font-bold text-[#141414]">28%</span>
              </div>
              <div className="w-full h-2 bg-[#C7C7C7]">
                <div className="h-full bg-[#141414] w-[28%]"></div>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-[#7A7A7A] flex justify-between border-t border-[#C7C7C7]/60">
              <span>TOP REGIONS: UNITED STATES (42%), INDIA (28%), GERMANY (18%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

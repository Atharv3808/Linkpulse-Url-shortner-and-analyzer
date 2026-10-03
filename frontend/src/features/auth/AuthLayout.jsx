import React from "react";
import { Link } from "react-router-dom";

export function AuthLayout({ children, isRegister = false }) {
  return (
    <div className="min-h-screen bg-white text-[#141414] font-sans flex flex-col selection:bg-[#1351AA] selection:text-white">
      {/* Mobile Top Header */}
      <header className="lg:hidden flex items-center justify-between p-6 border-b border-[#C7C7C7] bg-white sticky top-0 z-20">
        <Link to="/" className="flex items-center space-x-2 group">
          <span className="text-lg font-black tracking-tight text-[#141414] uppercase">
            LINKPULSE
          </span>
        </Link>
        <span className="text-[10px] font-mono tracking-widest text-[#7A7A7A] uppercase font-bold">
          LINK INTELLIGENCE
        </span>
      </header>

      {/* Main Split Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-screen">
        {/* Left Brand Panel (~45% on desktop) */}
        <aside className="lg:col-span-5 hidden lg:flex flex-col justify-between p-10 xl:p-14 border-r border-[#C7C7C7] bg-white select-none">
          {/* Top Brand Tag */}
          <div className="space-y-1.5 animate-fade-in-up">
            <Link to="/" className="inline-block">
              <span className="text-xl font-black tracking-tight text-[#141414] uppercase hover:text-[#1351AA] transition-colors">
                LINKPULSE
              </span>
            </Link>
            <div className="text-[10px] font-mono tracking-widest text-[#7A7A7A] uppercase font-bold">
              LINK INTELLIGENCE
            </div>
          </div>

          {/* Editorial Headline & Statement */}
          <div className="my-auto py-10 space-y-8 animate-fade-in-up">
            <h1 className="text-5xl xl:text-6xl font-black text-[#141414] leading-[0.88] tracking-tight uppercase">
              SHORT<br />
              LINKS.<br />
              <br />
              DEEP<br />
              <span className="text-[#1351AA]">INSIGHT.</span>
            </h1>

            <div className="space-y-2 text-[#444343] font-medium text-sm sm:text-base leading-relaxed max-w-sm">
              <p>Create links.</p>
              <p>Track what happens.</p>
              <p>Understand the signal.</p>
            </div>
          </div>

          {/* Technical Brand Footer */}
          <div className="pt-6 border-t border-[#C7C7C7] flex items-center justify-between text-xs font-mono text-[#7A7A7A]">
            <span>LINKPULSE / LINK INTELLIGENCE</span>
            <span className="tracking-widest">01 CREATE &nbsp;02 SHARE &nbsp;03 MEASURE</span>
          </div>
        </aside>

        {/* Right Auth Content Panel (~55% on desktop) */}
        <main className="lg:col-span-7 flex flex-col justify-between p-6 sm:p-10 xl:p-16 bg-white min-h-full">
          {/* Form Container */}
          <div className="my-auto w-full max-w-[440px] mx-auto py-6 sm:py-10 animate-fade-in-up">
            {children}
          </div>

          {/* Product Signal Footer Tag */}
          <footer className="w-full max-w-[440px] mx-auto pt-6 border-t border-[#C7C7C7]/60 flex items-center justify-between text-[11px] font-mono text-[#7A7A7A]">
            <span>
              {isRegister ? "LINKPULSE / NEW WORKSPACE" : "LINKPULSE / SECURE ACCESS"}
            </span>
            <span>256-BIT ENCRYPTION</span>
          </footer>
        </main>
      </div>
    </div>
  );
}

import React from "react";
import { Link } from "react-router-dom";

export function LandingFooter() {
  return (
    <footer className="border-t border-[#C7C7C7] bg-white text-[#141414] select-none">
      <div className="max-w-[1920px] mx-auto grid grid-cols-1 lg:grid-cols-12">
        {/* Brand Column (Col 1-4) */}
        <div className="lg:col-span-4 p-8 xl:p-12 border-b lg:border-b-0 lg:border-r border-[#C7C7C7] space-y-4">
          <Link to="/" className="inline-block">
            <span className="text-2xl font-black tracking-tight text-[#141414] uppercase hover:text-[#1351AA] transition-colors">
              LINKPULSE
            </span>
          </Link>
          <p className="text-xs font-mono text-[#444343] leading-relaxed max-w-sm">
            URL Shortener + Click Intelligence + Campaign Analytics Platform. Built for teams who measure signal rather than noise.
          </p>
          <div className="pt-4 text-[10px] font-mono tracking-widest text-[#7A7A7A] uppercase">
            LINK INTELLIGENCE / 2026
          </div>
        </div>

        {/* Links Grid (Col 5-12) */}
        <div className="lg:col-span-8 p-8 xl:p-12 grid grid-cols-2 md:grid-cols-3 gap-8 text-xs font-mono">
          {/* Product Column */}
          <div className="space-y-3">
            <span className="font-bold tracking-widest text-[#141414] uppercase block mb-4">
              PRODUCT
            </span>
            <ul className="space-y-2 text-[#444343]">
              <li>
                <a href="#intelligence" className="hover:text-[#1351AA] transition-colors">
                  Analytics Breakdown
                </a>
              </li>
              <li>
                <a href="#system" className="hover:text-[#1351AA] transition-colors">
                  Short Links
                </a>
              </li>
              <li>
                <a href="#capabilities" className="hover:text-[#1351AA] transition-colors">
                  Campaign Tracking
                </a>
              </li>
              <li>
                <a href="#capabilities" className="hover:text-[#1351AA] transition-colors">
                  QR Engine
                </a>
              </li>
            </ul>
          </div>

          {/* Platform Column */}
          <div className="space-y-3">
            <span className="font-bold tracking-widest text-[#141414] uppercase block mb-4">
              PLATFORM
            </span>
            <ul className="space-y-2 text-[#444343]">
              <li>
                <a href="#flow" className="hover:text-[#1351AA] transition-colors">
                  System Architecture
                </a>
              </li>
              <li>
                <a href="#control" className="hover:text-[#1351AA] transition-colors">
                  Privacy & IP Hashing
                </a>
              </li>
              <li>
                <a href="#why-different" className="hover:text-[#1351AA] transition-colors">
                  Performance & Speed
                </a>
              </li>
            </ul>
          </div>

          {/* Account Column */}
          <div className="space-y-3">
            <span className="font-bold tracking-widest text-[#141414] uppercase block mb-4">
              ACCOUNT
            </span>
            <ul className="space-y-2 text-[#444343]">
              <li>
                <Link to="/login" className="hover:text-[#1351AA] transition-colors">
                  Sign in
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-[#1351AA] transition-colors">
                  Create Workspace
                </Link>
              </li>
              <li>
                <Link to="/app/dashboard" className="hover:text-[#1351AA] transition-colors">
                  App Overview
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Legal Bar */}
      <div className="border-t border-[#C7C7C7] p-6 text-xs font-mono text-[#7A7A7A] flex flex-col sm:flex-row items-center justify-between gap-4 max-w-[1920px] mx-auto">
        <span>© 2026 LINKPULSE. ALL RIGHTS RESERVED.</span>
        <span className="tracking-widest uppercase">
          01 CREATE &nbsp;02 SHARE &nbsp;03 MEASURE
        </span>
      </div>
    </footer>
  );
}

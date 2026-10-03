import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuthStore } from "../../../store/useAuthStore";

export function LandingNav({ onScrollToSection }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (sectionId) => {
    setMobileMenuOpen(false);
    if (onScrollToSection) {
      onScrollToSection(sectionId);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="sticky top-0 z-50 h-[80px] bg-[#E3E2DE]/95 backdrop-blur-md border-b border-[#C7C7C7] transition-colors select-none">
      <div className="max-w-[1920px] mx-auto h-full grid grid-cols-12 items-center px-6 lg:px-10">
        {/* Columns 1–3: Brand Logo */}
        <div className="col-span-6 lg:col-span-3 flex items-center space-x-3">
          <Link to="/" className="flex items-center space-x-2 group">
            <span className="text-xl font-black tracking-tight text-[#141414] uppercase group-hover:text-[#1351AA] transition-colors">
              LINKPULSE
            </span>
            <span className="w-2 h-2 bg-[#1351AA] inline-block"></span>
          </Link>
        </div>

        {/* Columns 4–9: Operational Status (Desktop) */}
        <div className="hidden lg:flex lg:col-span-6 items-center justify-center space-x-6 text-xs font-mono text-[#7A7A7A]">
          <span className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
            <span className="text-[#141414] font-bold tracking-wider uppercase">
              SYSTEM OPERATIONAL
            </span>
          </span>
          <span className="text-[#C7C7C7]">/</span>
          <span className="tracking-widest uppercase">CLICK INTELLIGENCE 2026</span>
        </div>

        {/* Columns 10–12: Navigation Actions (Desktop) */}
        <div className="hidden lg:flex lg:col-span-3 items-center justify-end space-x-6">
          <button
            onClick={() => handleNavClick("system")}
            className="text-xs font-mono font-bold text-[#444343] hover:text-[#1351AA] uppercase tracking-wider transition-colors cursor-pointer"
          >
            System
          </button>
          <button
            onClick={() => handleNavClick("intelligence")}
            className="text-xs font-mono font-bold text-[#444343] hover:text-[#1351AA] uppercase tracking-wider transition-colors cursor-pointer"
          >
            Analytics
          </button>

          {isAuthenticated ? (
            <Link
              to="/app/dashboard"
              className="h-[44px] px-5 bg-[#1351AA] hover:bg-[#141414] text-[#E3E2DE] font-bold text-xs tracking-wider uppercase transition-colors duration-300 flex items-center justify-center space-x-1.5"
            >
              <span>WORKSPACE →</span>
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="text-xs font-mono font-bold text-[#141414] hover:text-[#1351AA] uppercase tracking-wider transition-colors"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="h-[44px] px-5 bg-[#1351AA] hover:bg-[#141414] text-[#E3E2DE] font-bold text-xs tracking-wider uppercase transition-colors duration-300 flex items-center justify-center space-x-1.5"
              >
                <span>GET STARTED →</span>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="col-span-6 lg:hidden flex justify-end">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#141414] hover:text-[#1351AA] transition-colors focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-[#C7C7C7] bg-[#E3E2DE] px-6 py-6 space-y-4 animate-fade-in-up">
          <div className="flex flex-col space-y-3 font-mono text-sm uppercase">
            <button
              onClick={() => handleNavClick("system")}
              className="text-left font-bold text-[#141414] hover:text-[#1351AA] py-2 border-b border-[#C7C7C7]/50"
            >
              01 / SYSTEM
            </button>
            <button
              onClick={() => handleNavClick("intelligence")}
              className="text-left font-bold text-[#141414] hover:text-[#1351AA] py-2 border-b border-[#C7C7C7]/50"
            >
              02 / ANALYTICS
            </button>
            <button
              onClick={() => handleNavClick("capabilities")}
              className="text-left font-bold text-[#141414] hover:text-[#1351AA] py-2 border-b border-[#C7C7C7]/50"
            >
              03 / CAPABILITIES
            </button>
          </div>

          <div className="pt-2 flex flex-col space-y-3">
            {isAuthenticated ? (
              <Link
                to="/app/dashboard"
                className="w-full h-[50px] bg-[#1351AA] text-[#E3E2DE] font-bold text-xs tracking-wider uppercase flex items-center justify-center"
              >
                GO TO WORKSPACE →
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="w-full h-[50px] bg-[#1351AA] text-[#E3E2DE] font-bold text-xs tracking-wider uppercase flex items-center justify-center"
                >
                  START WITH LINKPULSE →
                </Link>
                <Link
                  to="/login"
                  className="w-full h-[50px] border border-[#141414] text-[#141414] font-bold text-xs tracking-wider uppercase flex items-center justify-center"
                >
                  SIGN IN
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

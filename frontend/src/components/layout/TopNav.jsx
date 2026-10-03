import React, { useState, useRef, useEffect } from "react";
import {
  Menu,
  Plus,
  Search,
  Sun,
  Moon,
  Laptop,
  User,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { Button } from "../ui/Button";
import { useThemeStore } from "../../store/useThemeStore";
import { useAuthStore } from "../../store/useAuthStore";

export function TopNav({
  onOpenMobileSidebar,
  onOpenCreateLinkModal,
  onOpenCommandPalette,
  title,
}) {
  const { theme, setTheme } = useThemeStore();
  const { user, logout } = useAuthStore();

  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const themeRef = useRef(null);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (themeRef.current && !themeRef.current.contains(e.target)) {
        setIsThemeOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getThemeIcon = () => {
    if (theme === "light") return Sun;
    if (theme === "dark") return Moon;
    return Laptop;
  };

  const ThemeIcon = getThemeIcon();

  return (
    <header className="h-14 bg-bg-sidebar/90 backdrop-blur-md border-b border-border-subtle sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between transition-colors duration-150">
      {/* Left: Mobile menu & Breadcrumb title */}
      <div className="flex items-center space-x-3 min-w-0">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          className="p-1.5 text-txt-secondary hover:text-txt-primary lg:hidden rounded-md hover:bg-bg-elevated transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-4 h-4" />
        </button>
        <div className="flex items-center space-x-2 truncate">
          <span className="text-xs font-semibold text-txt-muted hidden sm:inline">
            LinkPulse /
          </span>
          <h1 className="text-xs sm:text-sm font-semibold text-txt-primary tracking-tight truncate">
            {title || "Overview"}
          </h1>
        </div>
      </div>

      {/* Right: Search, Theme Selector, Create Link, User Avatar */}
      <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
        {/* Command Search Bar Trigger (⌘K) */}
        <button
          type="button"
          onClick={onOpenCommandPalette}
          className="hidden sm:inline-flex items-center space-x-2 bg-bg-secondary hover:bg-bg-elevated border border-border-subtle hover:border-border-hover text-txt-muted hover:text-txt-secondary text-xs px-3 py-1.5 rounded-lg transition-all"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Search...</span>
          <kbd className="font-mono text-[10px] bg-bg-dark border border-border-subtle text-txt-muted px-1.5 py-0.2 rounded">
            ⌘K
          </kbd>
        </button>

        {/* Mobile Search Icon */}
        <button
          type="button"
          onClick={onOpenCommandPalette}
          className="sm:hidden p-1.5 text-txt-muted hover:text-txt-primary hover:bg-bg-elevated rounded-lg transition-colors"
          title="Search (⌘K)"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Theme Selector Popover */}
        <div className="relative" ref={themeRef}>
          <button
            type="button"
            onClick={() => setIsThemeOpen(!isThemeOpen)}
            title="Appearance Settings"
            className="p-1.5 text-txt-secondary hover:text-txt-primary hover:bg-bg-elevated rounded-lg transition-colors border border-border-subtle"
          >
            <ThemeIcon className="w-4 h-4" />
          </button>

          {isThemeOpen && (
            <div className="absolute right-0 mt-2 w-36 bg-bg-surface border border-border-subtle rounded-xl shadow-popover p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="text-[10px] font-semibold text-txt-muted uppercase px-2 py-1 select-none">
                Appearance
              </div>
              <button
                type="button"
                onClick={() => {
                  setTheme("system");
                  setIsThemeOpen(false);
                }}
                className={`w-full flex items-center space-x-2 px-2.5 py-1.5 text-xs rounded-md transition-colors ${
                  theme === "system"
                    ? "bg-accent-purple/15 text-accent-purple font-semibold"
                    : "text-txt-secondary hover:text-txt-primary hover:bg-bg-elevated"
                }`}
              >
                <Laptop className="w-3.5 h-3.5" />
                <span>System</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setTheme("light");
                  setIsThemeOpen(false);
                }}
                className={`w-full flex items-center space-x-2 px-2.5 py-1.5 text-xs rounded-md transition-colors ${
                  theme === "light"
                    ? "bg-accent-purple/15 text-accent-purple font-semibold"
                    : "text-txt-secondary hover:text-txt-primary hover:bg-bg-elevated"
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span>Light</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setTheme("dark");
                  setIsThemeOpen(false);
                }}
                className={`w-full flex items-center space-x-2 px-2.5 py-1.5 text-xs rounded-md transition-colors ${
                  theme === "dark"
                    ? "bg-accent-purple/15 text-accent-purple font-semibold"
                    : "text-txt-secondary hover:text-txt-primary hover:bg-bg-elevated"
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span>Dark</span>
              </button>
            </div>
          )}
        </div>

        {/* Primary Action Button */}
        <Button
          onClick={onOpenCreateLinkModal}
          variant="primary"
          size="sm"
          icon={Plus}
        >
          <span className="hidden sm:inline">Create link</span>
          <span className="sm:hidden">Create</span>
        </Button>

        {/* User Menu Avatar */}
        <div className="relative" ref={userMenuRef}>
          <button
            type="button"
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center space-x-1 p-0.5 rounded-full hover:ring-2 hover:ring-border-hover transition-all"
          >
            <div className="w-7 h-7 rounded-full bg-accent-purple text-white font-bold text-xs flex items-center justify-center shadow-xs">
              {user?.first_name ? user.first_name[0].toUpperCase() : <User className="w-3.5 h-3.5" />}
            </div>
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-bg-surface border border-border-subtle rounded-xl shadow-popover p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-2 border-b border-border-subtle mb-1">
                <p className="text-xs font-semibold text-txt-primary truncate">
                  {user?.first_name ? `${user.first_name} ${user.last_name || ""}` : "Account"}
                </p>
                <p className="text-[10px] text-txt-muted truncate">{user?.email}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  logout();
                  setIsUserMenuOpen(false);
                }}
                className="w-full flex items-center space-x-2 px-2.5 py-1.5 text-xs text-accent-red hover:bg-accent-red/10 rounded-md transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

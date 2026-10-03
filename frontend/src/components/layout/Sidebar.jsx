import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Link2,
  FolderKanban,
  Building2,
  Settings,
  LogOut,
  User,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { useThemeStore } from "../../store/useThemeStore";

export function Sidebar({ isOpen, onClose }) {
  const { user, activeWorkspace, logout } = useAuthStore();
  const { sidebarCollapsed, toggleSidebarCollapsed } = useThemeStore();

  const primaryNav = [
    { name: "Overview", path: "/app/dashboard", icon: LayoutDashboard },
    { name: "Links", path: "/app/links", icon: Link2 },
    { name: "Campaigns", path: "/app/campaigns", icon: FolderKanban },
  ];

  const secondaryNav = [
    { name: "Workspaces", path: "/app/workspaces", icon: Building2 },
    { name: "Settings", path: "/app/settings", icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 bg-bg-sidebar border-r border-border-subtle flex flex-col transition-all duration-200 ease-in-out lg:translate-x-0 rounded-none ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } ${sidebarCollapsed ? "lg:w-16" : "lg:w-64"} w-64`}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-border-subtle shrink-0">
          <NavLink
            to="/app/dashboard"
            className="flex items-center space-x-2 group overflow-hidden"
          >
            <span className="font-black text-base tracking-tight text-txt-primary uppercase group-hover:text-[#1351AA] transition-colors">
              LINKPULSE
            </span>
            <span className="w-2 h-2 bg-[#1351AA] inline-block shrink-0"></span>
          </NavLink>

          {/* Desktop Collapse Toggle */}
          <button
            type="button"
            onClick={toggleSidebarCollapsed}
            title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            className="hidden lg:flex p-1.5 text-txt-muted hover:text-txt-primary hover:bg-bg-elevated rounded-none transition-colors"
          >
            {sidebarCollapsed ? (
              <PanelLeftOpen className="w-4 h-4" />
            ) : (
              <PanelLeftClose className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Workspace Quick Context */}
        {!sidebarCollapsed && (
          <div className="p-3 border-b border-border-subtle">
            <NavLink
              to="/app/workspaces"
              onClick={onClose}
              className="p-3 bg-bg-surface hover:bg-bg-elevated border border-border-subtle rounded-none flex items-center justify-between transition-colors group"
            >
              <div className="min-w-0 flex-1">
                <p className="text-[10px] uppercase font-mono font-bold tracking-widest text-txt-muted">
                  WORKSPACE
                </p>
                <p className="text-xs font-bold text-txt-primary truncate mt-0.5 uppercase">
                  {activeWorkspace?.name || "Personal Workspace"}
                </p>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-txt-muted group-hover:text-txt-primary shrink-0 ml-1" />
            </NavLink>
          </div>
        )}

        {/* Navigation Links */}
        <div className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
          {/* Main Workspace Section */}
          <div className="space-y-1">
            {!sidebarCollapsed && (
              <p className="px-3 text-[10px] font-mono font-bold text-txt-muted uppercase tracking-widest mb-2">
                CORE
              </p>
            )}
            {primaryNav.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  title={sidebarCollapsed ? item.name : undefined}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3 py-2.5 rounded-none text-xs font-mono font-bold uppercase tracking-wider transition-all duration-150 min-h-[40px] ${
                      sidebarCollapsed ? "justify-center px-0" : ""
                    } ${
                      isActive
                        ? "bg-bg-elevated border-l-2 border-[#1351AA] text-txt-primary"
                        : "text-txt-secondary hover:text-txt-primary hover:bg-bg-surface"
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0 text-txt-muted" />
                  {!sidebarCollapsed && <span>{item.name}</span>}
                </NavLink>
              );
            })}
          </div>

          {/* Management Section */}
          <div className="space-y-1 pt-3 border-t border-border-subtle">
            {!sidebarCollapsed && (
              <p className="px-3 text-[10px] font-mono font-bold text-txt-muted uppercase tracking-widest mb-2">
                MANAGEMENT
              </p>
            )}
            {secondaryNav.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  title={sidebarCollapsed ? item.name : undefined}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3 py-2.5 rounded-none text-xs font-mono font-bold uppercase tracking-wider transition-all duration-150 min-h-[40px] ${
                      sidebarCollapsed ? "justify-center px-0" : ""
                    } ${
                      isActive
                        ? "bg-bg-elevated border-l-2 border-[#1351AA] text-txt-primary"
                        : "text-txt-secondary hover:text-txt-primary hover:bg-bg-surface"
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0 text-txt-muted" />
                  {!sidebarCollapsed && <span>{item.name}</span>}
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* User Footer Profile */}
        <div className="p-3 border-t border-border-subtle bg-bg-surface shrink-0">
          <div
            className={`flex items-center ${
              sidebarCollapsed ? "justify-center" : "justify-between"
            }`}
          >
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className="w-7 h-7 rounded-none bg-[#1351AA] text-[#E3E2DE] font-bold text-xs flex items-center justify-center shrink-0">
                {user?.first_name ? user.first_name[0].toUpperCase() : <User className="w-3.5 h-3.5" />}
              </div>
              {!sidebarCollapsed && (
                <div className="min-w-0">
                  <p className="text-xs font-bold text-txt-primary truncate">
                    {user?.first_name ? `${user.first_name} ${user.last_name || ""}` : "User Account"}
                  </p>
                  <p className="text-[10px] font-mono text-txt-muted truncate">{user?.email}</p>
                </div>
              )}
            </div>
            {!sidebarCollapsed && (
              <button
                type="button"
                onClick={logout}
                title="Log out"
                className="p-1.5 text-txt-muted hover:text-red-700 hover:bg-bg-elevated rounded-none transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

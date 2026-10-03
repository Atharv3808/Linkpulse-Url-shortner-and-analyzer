import React, { useState } from "react";
import {
  User,
  Shield,
  Building2,
  Palette,
  Check,
  Sun,
  Moon,
  Laptop,
} from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { useThemeStore } from "../../store/useThemeStore";
import { ApplicationShell } from "../../components/layout/ApplicationShell";
import { Card, CardHeader } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";

export function SettingsPage() {
  const { user, activeWorkspace } = useAuthStore();
  const { theme, setTheme, compactMode, setCompactMode } = useThemeStore();
  const [activeTab, setActiveTab] = useState("general");

  const tabs = [
    { id: "general", label: "GENERAL & PROFILE", icon: User },
    { id: "appearance", label: "APPEARANCE & THEME", icon: Palette },
    { id: "security", label: "SECURITY & API", icon: Shield },
    { id: "workspace", label: "WORKSPACE", icon: Building2 },
  ];

  return (
    <ApplicationShell title="Settings">
      <div className="space-y-6">
        <div className="border-b border-border-subtle pb-5">
          <div className="flex items-center space-x-2 text-[10px] font-mono uppercase tracking-wider text-txt-muted mb-1 font-bold">
            <span className="text-accent-purple">[SYSTEM]</span>
            <span>/</span>
            <span>PREFERENCES & CONFIGURATION</span>
          </div>
          <h2 className="text-xl font-black text-txt-primary uppercase tracking-tight">
            Settings
          </h2>
          <p className="text-xs text-txt-secondary mt-1 max-w-xl leading-relaxed">
            Manage your personal account profile, appearance preferences, security, and active workspace settings.
          </p>
        </div>

        {/* Settings Navigation & Content */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sub-Navigation Sidebar */}
          <div className="w-full md:w-60 shrink-0 space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-none text-[11px] font-mono font-bold tracking-wider transition-all text-left uppercase ${
                    isActive
                      ? "bg-txt-primary text-bg-surface border border-txt-primary"
                      : "text-txt-secondary hover:text-txt-primary hover:bg-bg-surface border border-transparent"
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-bg-surface" : "text-txt-muted"}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Settings Main Panel */}
          <div className="flex-1 space-y-6">
            {/* General & Profile */}
            {activeTab === "general" && (
              <Card className="rounded-none border-border-subtle">
                <CardHeader
                  title="PROFILE DETAILS"
                  description="Your account identity and communication preferences"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <Input
                    label="FIRST NAME"
                    defaultValue={user?.first_name || ""}
                    disabled
                  />
                  <Input
                    label="LAST NAME"
                    defaultValue={user?.last_name || ""}
                    disabled
                  />
                  <div className="sm:col-span-2">
                    <Input
                      label="EMAIL ADDRESS"
                      defaultValue={user?.email || ""}
                      disabled
                    />
                  </div>
                  <div>
                    <span className="text-txt-muted uppercase text-[10px] font-mono font-bold tracking-wider">
                      ACCOUNT REGISTERED
                    </span>
                    <p className="font-mono font-bold text-txt-primary text-xs mt-1">
                      {user?.date_joined ? new Date(user.date_joined).toLocaleDateString() : "N/A"}
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* Appearance Settings */}
            {activeTab === "appearance" && (
              <div className="space-y-6">
                <Card className="rounded-none border-border-subtle">
                  <CardHeader
                    title="THEME PREFERENCE"
                    description="Choose your preferred color theme for the interface"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    {/* System Option */}
                    <div
                      onClick={() => setTheme("system")}
                      className={`p-4 rounded-none border cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                        theme === "system"
                          ? "bg-bg-elevated border-accent-purple"
                          : "bg-bg-surface border-border-subtle hover:border-txt-primary"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Laptop className="w-4 h-4 text-accent-purple" />
                          <span className="font-bold text-xs text-txt-primary font-mono uppercase tracking-wider">System</span>
                        </div>
                        {theme === "system" && <Check className="w-4 h-4 text-accent-purple" />}
                      </div>
                      <p className="text-[11px] text-txt-secondary leading-relaxed font-mono">
                        Matches your operating system light/dark preference automatically.
                      </p>
                    </div>

                    {/* Light Option */}
                    <div
                      onClick={() => setTheme("light")}
                      className={`p-4 rounded-none border cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                        theme === "light"
                          ? "bg-bg-elevated border-accent-purple"
                          : "bg-bg-surface border-border-subtle hover:border-txt-primary"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Sun className="w-4 h-4 text-accent-purple" />
                          <span className="font-bold text-xs text-txt-primary font-mono uppercase tracking-wider">Light</span>
                        </div>
                        {theme === "light" && <Check className="w-4 h-4 text-accent-purple" />}
                      </div>
                      <p className="text-[11px] text-txt-secondary leading-relaxed font-mono">
                        Clean high-contrast white palette `#FFFFFF` with high contrast black borders.
                      </p>
                    </div>

                    {/* Dark Option */}
                    <div
                      onClick={() => setTheme("dark")}
                      className={`p-4 rounded-none border cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                        theme === "dark"
                          ? "bg-bg-elevated border-accent-purple"
                          : "bg-bg-surface border-border-subtle hover:border-txt-primary"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Moon className="w-4 h-4 text-accent-purple" />
                          <span className="font-bold text-xs text-txt-primary font-mono uppercase tracking-wider">Dark</span>
                        </div>
                        {theme === "dark" && <Check className="w-4 h-4 text-accent-purple" />}
                      </div>
                      <p className="text-[11px] text-txt-secondary leading-relaxed font-mono">
                        Deep charcoal `#141414` dark mode optimized for technical editorial layout.
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="rounded-none border-border-subtle">
                  <CardHeader
                    title="INTERFACE DENSITY"
                    description="Adjust the layout density of analytics metrics and tables"
                  />
                  <div className="flex items-center justify-between p-3.5 bg-bg-surface border border-border-subtle rounded-none text-xs">
                    <div>
                      <p className="font-bold text-txt-primary uppercase font-mono tracking-wider text-xs">Compact View</p>
                      <p className="text-txt-secondary mt-0.5">Use tighter padding for higher information density</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={compactMode}
                      onChange={(e) => setCompactMode(e.target.checked)}
                      className="w-4 h-4 rounded-none border-border-subtle text-accent-purple focus:ring-0 cursor-pointer"
                    />
                  </div>
                </Card>
              </div>
            )}

            {/* Security & API */}
            {activeTab === "security" && (
              <Card className="rounded-none border-border-subtle">
                <CardHeader
                  title="API & INTEGRATION STATUS"
                  description="Backend connectivity and deployment configuration details"
                />
                <div className="space-y-3 text-xs">
                  <div className="p-3.5 bg-bg-surface border border-border-subtle rounded-none flex items-center justify-between">
                    <div>
                      <p className="font-bold text-txt-primary font-mono text-xs uppercase tracking-wider">API Base Endpoint</p>
                      <p className="text-txt-muted font-mono mt-0.5 text-[11px]">
                        {import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000"}
                      </p>
                    </div>
                    <span className="px-2.5 py-0.5 bg-accent-green/10 text-accent-green border border-accent-green/30 rounded-none text-[10px] font-mono font-bold uppercase tracking-wider">
                      Connected
                    </span>
                  </div>

                  <div className="p-3.5 bg-bg-surface border border-border-subtle rounded-none flex items-center justify-between">
                    <div>
                      <p className="font-bold text-txt-primary font-mono text-xs uppercase tracking-wider">Public Redirect Base</p>
                      <p className="text-txt-muted font-mono mt-0.5 text-[11px]">
                        {import.meta.env.VITE_PUBLIC_SHORT_URL_BASE || "http://127.0.0.1:8000"}
                      </p>
                    </div>
                    <span className="px-2.5 py-0.5 bg-accent-purple/10 text-accent-purple border border-accent-purple/30 rounded-none text-[10px] font-mono font-bold uppercase tracking-wider">
                      Active
                    </span>
                  </div>
                </div>
              </Card>
            )}

            {/* Workspace Settings */}
            {activeTab === "workspace" && (
              <Card className="rounded-none border-border-subtle">
                <CardHeader
                  title="ACTIVE WORKSPACE SETTINGS"
                  description="Metadata and configuration for your current workspace"
                />
                <div className="space-y-4 text-xs">
                  <Input
                    label="WORKSPACE NAME"
                    defaultValue={activeWorkspace?.name || "Personal Workspace"}
                    disabled
                  />
                  <div>
                    <span className="text-txt-muted uppercase text-[10px] font-mono font-bold tracking-wider">
                      YOUR PERMISSION ROLE
                    </span>
                    <p className="font-mono font-bold text-txt-primary text-xs mt-1 uppercase">
                      {activeWorkspace?.role || "OWNER"}
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </ApplicationShell>
  );
}

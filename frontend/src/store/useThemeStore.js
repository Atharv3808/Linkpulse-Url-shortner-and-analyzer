import { create } from "zustand";

const THEME_KEY = "linkpulse_theme";
const COMPACT_KEY = "linkpulse_compact";
const SIDEBAR_KEY = "linkpulse_sidebar_collapsed";

const getInitialTheme = () => {
  if (typeof window === "undefined") return "system";
  return localStorage.getItem(THEME_KEY) || "system";
};

const getInitialCompact = () => {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(COMPACT_KEY) === "true";
};

const getInitialSidebarCollapsed = () => {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(SIDEBAR_KEY) === "true";
};

const applyThemeToDOM = (theme) => {
  if (typeof window === "undefined") return;
  const root = document.documentElement;
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  const isDark = theme === "dark" || (theme === "system" && prefersDark);

  if (isDark) {
    root.classList.add("dark");
    root.classList.remove("light");
  } else {
    root.classList.add("light");
    root.classList.remove("dark");
  }
};

export const useThemeStore = create((set, get) => ({
  theme: getInitialTheme(),
  compactMode: getInitialCompact(),
  sidebarCollapsed: getInitialSidebarCollapsed(),

  setTheme: (theme) => {
    localStorage.setItem(THEME_KEY, theme);
    applyThemeToDOM(theme);
    set({ theme });
  },

  setCompactMode: (compactMode) => {
    localStorage.setItem(COMPACT_KEY, String(compactMode));
    set({ compactMode });
  },

  setSidebarCollapsed: (sidebarCollapsed) => {
    localStorage.setItem(SIDEBAR_KEY, String(sidebarCollapsed));
    set({ sidebarCollapsed });
  },

  toggleSidebarCollapsed: () => {
    const next = !get().sidebarCollapsed;
    localStorage.setItem(SIDEBAR_KEY, String(next));
    set({ sidebarCollapsed: next });
  },

  initTheme: () => {
    const currentTheme = get().theme;
    applyThemeToDOM(currentTheme);

    // Watch system theme changes
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => {
        if (get().theme === "system") {
          applyThemeToDOM("system");
        }
      };

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  },
}));

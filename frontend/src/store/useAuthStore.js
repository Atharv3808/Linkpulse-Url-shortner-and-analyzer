import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,
  activeWorkspace: null,
  isAuthenticated: !!localStorage.getItem("linkpulse_access_token"),
  isLoading: false,

  setAuth: (user, tokens, workspace = null) => {
    if (tokens?.access) {
      localStorage.setItem("linkpulse_access_token", tokens.access);
    }
    if (tokens?.refresh) {
      localStorage.setItem("linkpulse_refresh_token", tokens.refresh);
    }
    set({
      user,
      isAuthenticated: true,
      activeWorkspace: workspace || null,
      isLoading: false,
    });
  },

  setUser: (user) => set({ user }),

  setActiveWorkspace: (workspace) => set({ activeWorkspace: workspace }),

  logout: () => {
    localStorage.removeItem("linkpulse_access_token");
    localStorage.removeItem("linkpulse_refresh_token");
    set({
      user: null,
      activeWorkspace: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },
}));

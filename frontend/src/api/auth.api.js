import { apiClient } from "./client";

export const authApi = {
  login: async (credentials) => {
    const res = await apiClient.post("/api/v1/auth/login/", credentials);
    return res.data;
  },

  register: async (payload) => {
    const res = await apiClient.post("/api/v1/auth/register/", payload);
    return res.data;
  },

  getMe: async () => {
    const res = await apiClient.get("/api/v1/auth/me/");
    return res.data;
  },

  logout: async () => {
    const res = await apiClient.post("/api/v1/auth/logout/");
    return res.data;
  },
};

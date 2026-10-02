import { apiClient } from "./client";

export const campaignsApi = {
  list: async () => {
    const res = await apiClient.get("/api/v1/campaigns/");
    return res.data;
  },

  get: async (id) => {
    const res = await apiClient.get(`/api/v1/campaigns/${id}/`);
    return res.data;
  },

  create: async (payload) => {
    const res = await apiClient.post("/api/v1/campaigns/", payload);
    return res.data;
  },

  getAnalytics: async (id) => {
    const res = await apiClient.get(`/api/v1/campaigns/${id}/analytics/`);
    return res.data;
  },
};

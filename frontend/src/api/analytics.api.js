import { apiClient } from "./client";

export const analyticsApi = {
  getOverview: async (workspaceId = "") => {
    const params = workspaceId ? { workspace_id: workspaceId } : {};
    const res = await apiClient.get("/api/v1/analytics/overview/", { params });
    return res.data;
  },

  getLinkDetail: async (linkId, range = "30d") => {
    const res = await apiClient.get(`/api/v1/analytics/links/${linkId}/`, {
      params: { range },
    });
    return res.data;
  },

  getLinkTimeline: async (linkId, range = "30d") => {
    const res = await apiClient.get(`/api/v1/analytics/links/${linkId}/timeline/`, {
      params: { range },
    });
    return res.data;
  },

  exportCsv: async (linkId) => {
    const res = await apiClient.get(`/api/v1/analytics/links/${linkId}/export/`, {
      params: { format: "csv" },
      responseType: "blob",
    });
    return res.data;
  },
};

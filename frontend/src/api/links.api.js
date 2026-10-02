import { apiClient } from "./client";

export const linksApi = {
  list: async (params = {}) => {
    const res = await apiClient.get("/api/v1/links/", { params });
    return res.data;
  },

  get: async (id) => {
    const res = await apiClient.get(`/api/v1/links/${id}/`);
    return res.data;
  },

  create: async (payload) => {
    const res = await apiClient.post("/api/v1/links/", payload);
    return res.data;
  },

  update: async (id, payload) => {
    const res = await apiClient.patch(`/api/v1/links/${id}/`, payload);
    return res.data;
  },

  delete: async (id) => {
    const res = await apiClient.delete(`/api/v1/links/${id}/`);
    return res.data;
  },

  getQrCodeBlob: async (id) => {
    const res = await apiClient.get(`/api/v1/links/${id}/qr/`, {
      responseType: "blob",
    });
    return res.data;
  },
};

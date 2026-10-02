import { apiClient } from "./client";

export const workspacesApi = {
  list: async () => {
    const res = await apiClient.get("/api/v1/workspaces/");
    return res.data;
  },

  create: async (payload) => {
    const res = await apiClient.post("/api/v1/workspaces/", payload);
    return res.data;
  },

  getMembers: async (workspaceId) => {
    const res = await apiClient.get(`/api/v1/workspaces/${workspaceId}/members/`);
    return res.data;
  },

  addMember: async (workspaceId, payload) => {
    const res = await apiClient.post(`/api/v1/workspaces/${workspaceId}/members/add/`, payload);
    return res.data;
  },

  removeMember: async (workspaceId, memberId) => {
    const res = await apiClient.delete(`/api/v1/workspaces/${workspaceId}/members/${memberId}/remove/`);
    return res.data;
  },
};

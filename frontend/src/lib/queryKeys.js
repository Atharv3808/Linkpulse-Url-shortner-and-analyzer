export const queryKeys = {
  auth: {
    me: () => ["auth", "me"],
  },
  workspaces: {
    all: () => ["workspaces"],
    detail: (id) => ["workspaces", id],
    members: (id) => ["workspaces", id, "members"],
  },
  links: {
    all: (filters) => ["links", filters],
    detail: (id) => ["links", "detail", id],
  },
  analytics: {
    overview: (workspaceId) => ["analytics", "overview", workspaceId],
    detail: (linkId, range) => ["analytics", "link", linkId, range],
    timeline: (linkId, range) => ["analytics", "timeline", linkId, range],
  },
  campaigns: {
    all: () => ["campaigns"],
    detail: (id) => ["campaigns", id],
    analytics: (id) => ["campaigns", id, "analytics"],
  },
};

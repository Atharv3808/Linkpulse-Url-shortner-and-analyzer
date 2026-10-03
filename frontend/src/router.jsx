import React, { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./features/auth/ProtectedRoute";
import { PageSkeleton } from "./components/ui/Skeleton";

// Lazy load route pages for optimal JS bundle splitting
const LandingPage = lazy(() =>
  import("./features/landing/LandingPage").then((m) => ({ default: m.LandingPage }))
);
const LoginPage = lazy(() =>
  import("./features/auth/LoginPage").then((m) => ({ default: m.LoginPage }))
);
const RegisterPage = lazy(() =>
  import("./features/auth/RegisterPage").then((m) => ({ default: m.RegisterPage }))
);
const DashboardOverviewPage = lazy(() =>
  import("./features/dashboard/DashboardOverviewPage").then((m) => ({ default: m.DashboardOverviewPage }))
);
const LinksPage = lazy(() =>
  import("./features/links/LinksPage").then((m) => ({ default: m.LinksPage }))
);
const LinkDetailPage = lazy(() =>
  import("./features/links/LinkDetailPage").then((m) => ({ default: m.LinkDetailPage }))
);
const CampaignsPage = lazy(() =>
  import("./features/campaigns/CampaignsPage").then((m) => ({ default: m.CampaignsPage }))
);
const WorkspacesPage = lazy(() =>
  import("./features/workspaces/WorkspacesPage").then((m) => ({ default: m.WorkspacesPage }))
);
const SettingsPage = lazy(() =>
  import("./features/settings/SettingsPage").then((m) => ({ default: m.SettingsPage }))
);

const withSuspense = (Component) => (
  <Suspense fallback={<PageSkeleton />}>
    <Component />
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: withSuspense(LandingPage),
  },
  {
    path: "/login",
    element: withSuspense(LoginPage),
  },
  {
    path: "/register",
    element: withSuspense(RegisterPage),
  },
  {
    path: "/app",
    element: (
      <ProtectedRoute>
        <Navigate to="/app/dashboard" replace />
      </ProtectedRoute>
    ),
  },
  {
    path: "/app/dashboard",
    element: (
      <ProtectedRoute>
        {withSuspense(DashboardOverviewPage)}
      </ProtectedRoute>
    ),
  },
  {
    path: "/app/links",
    element: (
      <ProtectedRoute>
        {withSuspense(LinksPage)}
      </ProtectedRoute>
    ),
  },
  {
    path: "/app/links/:id",
    element: (
      <ProtectedRoute>
        {withSuspense(LinkDetailPage)}
      </ProtectedRoute>
    ),
  },
  {
    path: "/app/campaigns",
    element: (
      <ProtectedRoute>
        {withSuspense(CampaignsPage)}
      </ProtectedRoute>
    ),
  },
  {
    path: "/app/workspaces",
    element: (
      <ProtectedRoute>
        {withSuspense(WorkspacesPage)}
      </ProtectedRoute>
    ),
  },
  {
    path: "/app/settings",
    element: (
      <ProtectedRoute>
        {withSuspense(SettingsPage)}
      </ProtectedRoute>
    ),
  },
  {
    path: "*",
    element: <Navigate to="/app/dashboard" replace />,
  },
]);

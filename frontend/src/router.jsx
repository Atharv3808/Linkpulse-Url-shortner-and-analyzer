import React, { Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./features/auth/ProtectedRoute";
import { PageSkeleton } from "./components/ui/Skeleton";
import { RouteErrorElement } from "./components/ui/ErrorBoundary";
import { lazyWithRetry } from "./utils/lazyWithRetry";

// Lazy load route pages with retry resilience against dynamic import chunk load failures
const LandingPage = lazyWithRetry(() =>
  import("./features/landing/LandingPage").then((m) => ({ default: m.LandingPage }))
);
const LoginPage = lazyWithRetry(() =>
  import("./features/auth/LoginPage").then((m) => ({ default: m.LoginPage }))
);
const RegisterPage = lazyWithRetry(() =>
  import("./features/auth/RegisterPage").then((m) => ({ default: m.RegisterPage }))
);
const DashboardOverviewPage = lazyWithRetry(() =>
  import("./features/dashboard/DashboardOverviewPage").then((m) => ({ default: m.DashboardOverviewPage }))
);
const LinksPage = lazyWithRetry(() =>
  import("./features/links/LinksPage").then((m) => ({ default: m.LinksPage }))
);
const LinkDetailPage = lazyWithRetry(() =>
  import("./features/links/LinkDetailPage").then((m) => ({ default: m.LinkDetailPage }))
);
const CampaignsPage = lazyWithRetry(() =>
  import("./features/campaigns/CampaignsPage").then((m) => ({ default: m.CampaignsPage }))
);
const WorkspacesPage = lazyWithRetry(() =>
  import("./features/workspaces/WorkspacesPage").then((m) => ({ default: m.WorkspacesPage }))
);
const SettingsPage = lazyWithRetry(() =>
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
    errorElement: <RouteErrorElement />,
    element: withSuspense(LandingPage),
  },
  {
    path: "/login",
    errorElement: <RouteErrorElement />,
    element: withSuspense(LoginPage),
  },
  {
    path: "/register",
    errorElement: <RouteErrorElement />,
    element: withSuspense(RegisterPage),
  },
  {
    path: "/app",
    errorElement: <RouteErrorElement />,
    element: (
      <ProtectedRoute>
        <Navigate to="/app/dashboard" replace />
      </ProtectedRoute>
    ),
  },
  {
    path: "/app/dashboard",
    errorElement: <RouteErrorElement />,
    element: (
      <ProtectedRoute>
        {withSuspense(DashboardOverviewPage)}
      </ProtectedRoute>
    ),
  },
  {
    path: "/app/links",
    errorElement: <RouteErrorElement />,
    element: (
      <ProtectedRoute>
        {withSuspense(LinksPage)}
      </ProtectedRoute>
    ),
  },
  {
    path: "/app/links/:id",
    errorElement: <RouteErrorElement />,
    element: (
      <ProtectedRoute>
        {withSuspense(LinkDetailPage)}
      </ProtectedRoute>
    ),
  },
  {
    path: "/app/campaigns",
    errorElement: <RouteErrorElement />,
    element: (
      <ProtectedRoute>
        {withSuspense(CampaignsPage)}
      </ProtectedRoute>
    ),
  },
  {
    path: "/app/workspaces",
    errorElement: <RouteErrorElement />,
    element: (
      <ProtectedRoute>
        {withSuspense(WorkspacesPage)}
      </ProtectedRoute>
    ),
  },
  {
    path: "/app/settings",
    errorElement: <RouteErrorElement />,
    element: (
      <ProtectedRoute>
        {withSuspense(SettingsPage)}
      </ProtectedRoute>
    ),
  },
  {
    path: "*",
    errorElement: <RouteErrorElement />,
    element: <Navigate to="/app/dashboard" replace />,
  },
]);

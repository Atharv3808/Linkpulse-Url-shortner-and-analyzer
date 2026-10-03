import React, { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { AppProviders } from "./providers";
import { router } from "./router";
import { useAuthStore } from "./store/useAuthStore";
import { authApi } from "./api/auth.api";
import { ErrorBoundary } from "./components/ui/ErrorBoundary";

export function App() {
  const { isAuthenticated, setUser, logout } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      authApi
        .getMe()
        .then((res) => {
          if (res?.data) {
            setUser(res.data);
          }
        })
        .catch(() => {
          // Token invalid or expired
          logout();
        });
    }
  }, [isAuthenticated, setUser, logout]);

  return (
    <ErrorBoundary>
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>
    </ErrorBoundary>
  );
}

export default App;

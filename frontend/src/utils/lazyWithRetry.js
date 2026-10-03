import { lazy } from "react";

/**
 * Enhanced React lazy loader that auto-retries failed dynamic imports.
 * Catches Vite chunk load errors when assets change after a new deployment.
 */
export function lazyWithRetry(componentImport) {
  return lazy(async () => {
    const pageHasBeenRefreshed = JSON.parse(
      window.sessionStorage.getItem("page_has_been_refreshed") || "false"
    );

    try {
      const component = await componentImport();
      window.sessionStorage.setItem("page_has_been_refreshed", "false");
      return component;
    } catch (error) {
      const isDynamicImportError =
        error.name === "TypeError" ||
        error.message?.includes("Failed to fetch dynamically imported module") ||
        error.message?.includes("Importing a module script failed");

      if (isDynamicImportError && !pageHasBeenRefreshed) {
        window.sessionStorage.setItem("page_has_been_refreshed", "true");
        window.location.reload();
        return new Promise(() => {});
      }

      throw error;
    }
  });
}

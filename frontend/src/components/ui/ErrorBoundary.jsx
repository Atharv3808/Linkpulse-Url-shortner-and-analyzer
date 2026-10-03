import React from "react";
import { useRouteError, isRouteErrorResponse } from "react-router-dom";
import { AlertTriangle, RefreshCw, Home, ChevronRight } from "lucide-react";

export function RouteErrorElement() {
  const error = useRouteError();

  let errorMessage = "An unexpected error occurred while loading this page.";
  let errorTitle = "Application Error";
  let isModuleImportError = false;

  if (isRouteErrorResponse(error)) {
    errorTitle = `${error.status} ${error.statusText || "Error"}`;
    errorMessage = error.data?.message || error.statusText || errorMessage;
  } else if (error instanceof Error) {
    errorMessage = error.message;
    if (
      error.message?.includes("Failed to fetch dynamically imported module") ||
      error.name === "TypeError"
    ) {
      isModuleImportError = true;
      errorTitle = "Update Available / Chunk Load Error";
    }
  }

  const handleReload = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    window.location.href = "/app/dashboard";
  };

  return (
    <div className="min-h-screen bg-white text-[#141414] font-sans flex items-center justify-center p-6 sm:p-12">
      <div className="w-full max-w-xl border-2 border-[#141414] bg-white p-8 sm:p-10 shadow-[6px_6px_0px_0px_#141414] space-y-6">
        <div className="flex items-center space-x-3 pb-4 border-b border-[#141414]">
          <div className="w-10 h-10 bg-[#B91C1C] text-white flex items-center justify-center font-bold">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#7A7A7A] block">
              SYSTEM ALERT
            </span>
            <h1 className="text-xl font-black uppercase tracking-tight text-[#141414]">
              {errorTitle}
            </h1>
          </div>
        </div>

        <p className="text-sm font-medium text-[#444343] leading-relaxed">
          {isModuleImportError
            ? "A new version of LinkPulse was deployed or a temporary network issue prevented loading this page section. Reloading will fetch the latest version."
            : errorMessage}
        </p>

        {error instanceof Error && error.stack && (
          <details className="group border border-[#C7C7C7] bg-[#F8F9FA] p-3 text-xs font-mono">
            <summary className="cursor-pointer font-bold text-[#141414] flex items-center justify-between">
              <span>View Technical Details</span>
              <ChevronRight className="w-4 h-4 transition-transform group-open:rotate-90" />
            </summary>
            <pre className="mt-2 text-[11px] text-[#444343] overflow-x-auto whitespace-pre-wrap max-h-40 pt-2 border-t border-[#C7C7C7]">
              {error.stack}
            </pre>
          </details>
        )}

        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleReload}
            className="flex-1 h-[48px] bg-[#1351AA] hover:bg-[#141414] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 border border-[#1351AA] transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reload Application</span>
          </button>
          <button
            onClick={handleGoHome}
            className="flex-1 h-[48px] bg-white hover:bg-[#141414] text-[#141414] hover:text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 border border-[#141414] transition-colors cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Go to Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return <RouteErrorElement />;
    }
    return this.props.children;
  }
}

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { authApi } from "../../api/auth.api";
import { useAuthStore } from "../../store/useAuthStore";
import { AuthLayout } from "./AuthLayout";

export function LoginPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("Please enter both email address and password.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");

    try {
      const res = await authApi.login({ email, password });
      const { user, tokens } = res.data;
      setAuth(user, tokens);
      navigate("/app/dashboard");
    } catch (err) {
      setErrorMsg(
        err.message || "Unable to sign in. Check your email and password and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout isRegister={false}>
      {/* Category Header */}
      <div className="mb-8">
        <span className="text-xs font-mono font-bold tracking-widest text-[#7A7A7A] uppercase mb-2 block">
          ACCOUNT
        </span>
        <h2 className="text-3xl sm:text-4xl font-black text-[#141414] tracking-tight uppercase leading-none mb-3">
          WELCOME BACK.
        </h2>
        <p className="text-sm text-[#444343] font-medium leading-relaxed">
          Sign in to continue to LinkPulse.
        </p>
      </div>

      {/* Error State Banner */}
      {errorMsg && (
        <div
          role="alert"
          aria-live="polite"
          className="p-4 border border-[#141414] bg-[#F8F9FA] text-[#141414] text-xs font-mono mb-6 space-y-1"
        >
          <div className="font-bold uppercase tracking-wider text-red-700 flex items-center justify-between">
            <span>UNABLE TO SIGN IN</span>
            <span>[ERROR]</span>
          </div>
          <p className="text-[#444343] font-sans text-xs leading-normal">
            {errorMsg}
          </p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {/* Email Field */}
        <div>
          <label
            htmlFor="email"
            className="block text-xs font-mono font-bold tracking-wider text-[#444343] uppercase mb-2"
          >
            EMAIL ADDRESS
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@company.com"
            autoComplete="email"
            required
            aria-required="true"
            aria-invalid={!!errorMsg}
            className="w-full h-[54px] px-4 bg-transparent border border-[#C7C7C7] text-[#141414] font-medium placeholder-[#7A7A7A] focus:outline-none focus:border-[#1351AA] focus:ring-1 focus:ring-[#1351AA] transition-colors rounded-none text-base"
          />
        </div>

        {/* Password Field */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor="password"
              className="block text-xs font-mono font-bold tracking-wider text-[#444343] uppercase"
            >
              PASSWORD
            </label>
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              autoComplete="current-password"
              required
              aria-required="true"
              aria-invalid={!!errorMsg}
              className="w-full h-[54px] pl-4 pr-12 bg-transparent border border-[#C7C7C7] text-[#141414] font-medium placeholder-[#7A7A7A] focus:outline-none focus:border-[#1351AA] focus:ring-1 focus:ring-[#1351AA] transition-colors rounded-none text-base"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7A7A7A] hover:text-[#141414] transition-colors focus:outline-none focus:text-[#1351AA]"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5 stroke-[1.75]" />
              ) : (
                <Eye className="w-5 h-5 stroke-[1.75]" />
              )}
            </button>
          </div>
        </div>

        {/* Submit CTA */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-[56px] bg-[#1351AA] hover:bg-[#141414] text-white font-bold text-sm tracking-[0.08em] uppercase transition-colors duration-300 rounded-none flex items-center justify-center space-x-2 disabled:opacity-60 disabled:cursor-not-allowed group cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1351AA] focus:ring-offset-2 focus:ring-offset-white"
        >
          {isLoading ? (
            <span className="inline-flex items-center space-x-2">
              <svg
                className="animate-spin h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>SIGNING IN...</span>
            </span>
          ) : (
            <>
              <span>SIGN IN</span>
              <span className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </>
          )}
        </button>
      </form>

      {/* Footer Auth Switch */}
      <div className="mt-8 pt-6 border-t border-[#C7C7C7] flex flex-col sm:flex-row items-center justify-between text-xs gap-3">
        <span className="text-[#444343] font-medium">
          Don't have an account?
        </span>
        <Link
          to="/register"
          className="font-mono font-bold text-[#1351AA] hover:text-[#141414] uppercase tracking-wider transition-colors"
        >
          CREATE ACCOUNT →
        </Link>
      </div>
    </AuthLayout>
  );
}

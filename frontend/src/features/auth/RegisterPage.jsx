import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { authApi } from "../../api/auth.api";
import { useAuthStore } from "../../store/useAuthStore";
import { AuthLayout } from "./AuthLayout";

export function RegisterPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    workspaceName: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setErrorMsg("Please enter your email address and password.");
      return;
    }
    if (formData.password.length < 8) {
      setErrorMsg("Password must be at least 8 characters long.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setErrorMsg("Passwords do not match. Please verify your password.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");

    try {
      const res = await authApi.register({
        email: formData.email,
        password: formData.password,
        first_name: formData.firstName,
        last_name: formData.lastName,
        workspace_name: formData.workspaceName,
      });

      const { user, tokens, workspace } = res.data;
      setAuth(user, tokens, workspace);
      navigate("/app/dashboard");
    } catch (err) {
      setErrorMsg(
        err.message || "Registration failed. Please check your inputs and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout isRegister={true}>
      {/* Category Header */}
      <div className="mb-6">
        <span className="text-xs font-mono font-bold tracking-widest text-[#7A7A7A] uppercase mb-2 block">
          GET STARTED
        </span>
        <h2 className="text-3xl sm:text-4xl font-black text-[#141414] tracking-tight uppercase leading-none mb-3">
          CREATE YOUR WORKSPACE.
        </h2>
        <p className="text-sm text-[#444343] font-medium leading-relaxed">
          Start creating links and understanding the traffic behind them.
        </p>
      </div>

      {/* Error State Banner */}
      {errorMsg && (
        <div
          role="alert"
          aria-live="polite"
          className="p-4 border border-[#141414] bg-[#E3E2DE] text-[#141414] text-xs font-mono mb-6 space-y-1"
        >
          <div className="font-bold uppercase tracking-wider text-red-700 flex items-center justify-between">
            <span>REGISTRATION ERROR</span>
            <span>[ERROR]</span>
          </div>
          <p className="text-[#444343] font-sans text-xs leading-normal">
            {errorMsg}
          </p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Name Fields (2 Columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="firstName"
              className="block text-xs font-mono font-bold tracking-wider text-[#444343] uppercase mb-1.5"
            >
              FIRST NAME
            </label>
            <input
              id="firstName"
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Jane"
              autoComplete="given-name"
              className="w-full h-[52px] px-4 bg-transparent border border-[#C7C7C7] text-[#141414] font-medium placeholder-[#7A7A7A] focus:outline-none focus:border-[#1351AA] focus:ring-1 focus:ring-[#1351AA] transition-colors rounded-none text-base"
            />
          </div>
          <div>
            <label
              htmlFor="lastName"
              className="block text-xs font-mono font-bold tracking-wider text-[#444343] uppercase mb-1.5"
            >
              LAST NAME
            </label>
            <input
              id="lastName"
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Doe"
              autoComplete="family-name"
              className="w-full h-[52px] px-4 bg-transparent border border-[#C7C7C7] text-[#141414] font-medium placeholder-[#7A7A7A] focus:outline-none focus:border-[#1351AA] focus:ring-1 focus:ring-[#1351AA] transition-colors rounded-none text-base"
            />
          </div>
        </div>

        {/* Email Field */}
        <div>
          <label
            htmlFor="email"
            className="block text-xs font-mono font-bold tracking-wider text-[#444343] uppercase mb-1.5"
          >
            EMAIL ADDRESS
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@company.com"
            autoComplete="email"
            required
            aria-required="true"
            aria-invalid={!!errorMsg}
            className="w-full h-[52px] px-4 bg-transparent border border-[#C7C7C7] text-[#141414] font-medium placeholder-[#7A7A7A] focus:outline-none focus:border-[#1351AA] focus:ring-1 focus:ring-[#1351AA] transition-colors rounded-none text-base"
          />
        </div>

        {/* Workspace Name (Optional) */}
        <div>
          <label
            htmlFor="workspaceName"
            className="block text-xs font-mono font-bold tracking-wider text-[#444343] uppercase mb-1.5"
          >
            WORKSPACE NAME <span className="text-[#7A7A7A] font-normal">(OPTIONAL)</span>
          </label>
          <input
            id="workspaceName"
            type="text"
            name="workspaceName"
            value={formData.workspaceName}
            onChange={handleChange}
            placeholder="Acme Growth Marketing"
            autoComplete="organization"
            className="w-full h-[52px] px-4 bg-transparent border border-[#C7C7C7] text-[#141414] font-medium placeholder-[#7A7A7A] focus:outline-none focus:border-[#1351AA] focus:ring-1 focus:ring-[#1351AA] transition-colors rounded-none text-base"
          />
        </div>

        {/* Password Field */}
        <div>
          <label
            htmlFor="password"
            className="block text-xs font-mono font-bold tracking-wider text-[#444343] uppercase mb-1.5"
          >
            PASSWORD
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••••••"
              autoComplete="new-password"
              required
              aria-required="true"
              className="w-full h-[52px] pl-4 pr-12 bg-transparent border border-[#C7C7C7] text-[#141414] font-medium placeholder-[#7A7A7A] focus:outline-none focus:border-[#1351AA] focus:ring-1 focus:ring-[#1351AA] transition-colors rounded-none text-base"
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

        {/* Confirm Password Field */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-xs font-mono font-bold tracking-wider text-[#444343] uppercase mb-1.5"
          >
            CONFIRM PASSWORD
          </label>
          <input
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="••••••••••••"
            autoComplete="new-password"
            required
            aria-required="true"
            className="w-full h-[52px] px-4 bg-transparent border border-[#C7C7C7] text-[#141414] font-medium placeholder-[#7A7A7A] focus:outline-none focus:border-[#1351AA] focus:ring-1 focus:ring-[#1351AA] transition-colors rounded-none text-base"
          />
        </div>

        {/* Progressive Password Visualizer */}
        {formData.password && (
          <div className="pt-1 flex items-center justify-between text-xs font-mono select-none">
            <span
              className={
                formData.password.length >= 8
                  ? "text-[#1351AA] font-bold"
                  : "text-[#7A7A7A]"
              }
            >
              {formData.password.length >= 8
                ? "✓ 8+ characters"
                : "• Minimum 8 characters"}
            </span>
            {formData.confirmPassword && (
              <span
                className={
                  formData.password === formData.confirmPassword
                    ? "text-[#1351AA] font-bold"
                    : "text-red-700 font-bold"
                }
              >
                {formData.password === formData.confirmPassword
                  ? "✓ Passwords match"
                  : "✕ Passwords do not match"}
              </span>
            )}
          </div>
        )}

        {/* Submit CTA */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-[56px] mt-2 bg-[#1351AA] hover:bg-[#141414] text-[#E3E2DE] font-bold text-sm tracking-[0.08em] uppercase transition-colors duration-300 rounded-none flex items-center justify-center space-x-2 disabled:opacity-60 disabled:cursor-not-allowed group cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1351AA] focus:ring-offset-2 focus:ring-offset-[#E3E2DE]"
        >
          {isLoading ? (
            <span className="inline-flex items-center space-x-2">
              <svg
                className="animate-spin h-4 w-4 text-[#E3E2DE]"
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
              <span>CREATING ACCOUNT...</span>
            </span>
          ) : (
            <>
              <span>CREATE ACCOUNT</span>
              <span className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </>
          )}
        </button>
      </form>

      {/* Footer Auth Switch */}
      <div className="mt-6 pt-6 border-t border-[#C7C7C7] flex flex-col sm:flex-row items-center justify-between text-xs gap-3">
        <span className="text-[#444343] font-medium">
          Already have an account?
        </span>
        <Link
          to="/login"
          className="font-mono font-bold text-[#1351AA] hover:text-[#141414] uppercase tracking-wider transition-colors"
        >
          SIGN IN →
        </Link>
      </div>
    </AuthLayout>
  );
}

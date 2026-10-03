import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Zap, Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { authApi } from "../../api/auth.api";
import { useAuthStore } from "../../store/useAuthStore";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";

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
      setErrorMsg("Please enter both email and password.");
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
      setErrorMsg(err.message || "Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-dark flex items-center justify-center p-4 transition-colors duration-150">
      <div className="w-full max-w-md space-y-6 bg-bg-surface border border-border-subtle p-8 rounded-xl shadow-popover">
        {/* Crisp Minimal Logo Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-accent-purple/10 text-accent-purple mb-1 border border-accent-purple/25">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-txt-primary">
            Sign in to LinkPulse
          </h2>
          <p className="text-xs text-txt-secondary leading-relaxed">
            Access your short links and click intelligence workspace
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 bg-accent-red/10 border border-accent-red/20 rounded-lg flex items-center space-x-2.5 text-xs text-accent-red font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={Mail}
            required
          />

          <div className="space-y-1.5 relative">
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={Lock}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-7.5 text-txt-muted hover:text-txt-primary transition-colors"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <Button
            type="submit"
            className="w-full mt-2"
            isLoading={isLoading}
            size="md"
          >
            Sign in
          </Button>
        </form>

        {/* Footer Link */}
        <div className="text-center text-xs text-txt-secondary pt-3 border-t border-border-subtle">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-accent-purple hover:underline"
          >
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}

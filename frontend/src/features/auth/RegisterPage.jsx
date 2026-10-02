import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Zap, Mail, Lock, User, Building, Eye, EyeOff, AlertCircle } from "lucide-react";
import { authApi } from "../../api/auth.api";
import { useAuthStore } from "../../store/useAuthStore";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";

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
      setErrorMsg("Please fill in all required fields.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setErrorMsg("Passwords do not match.");
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
      setErrorMsg(err.message || "Registration failed. Please check inputs.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-dark flex items-center justify-center p-4 py-10">
      <div className="w-full max-w-md space-y-6 bg-bg-surface border border-border-subtle p-8 rounded-xl shadow-2xl">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-accent-purple/15 text-accent-purple mb-1 border border-accent-purple/30">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <h2 className="text-xl font-semibold tracking-tight text-txt-primary">
            Create your account
          </h2>
          <p className="text-xs text-txt-secondary">
            Get started with LinkPulse click intelligence
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 bg-accent-red/10 border border-accent-red/20 rounded-lg flex items-center space-x-2.5 text-xs text-accent-red">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="First Name"
              name="firstName"
              placeholder="Jane"
              value={formData.firstName}
              onChange={handleChange}
              icon={User}
            />
            <Input
              label="Last Name"
              name="lastName"
              placeholder="Doe"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>

          <Input
            label="Email Address"
            type="email"
            name="email"
            placeholder="you@company.com"
            value={formData.email}
            onChange={handleChange}
            icon={Mail}
            required
          />

          <Input
            label="Workspace Name (Optional)"
            name="workspaceName"
            placeholder="Acme Marketing"
            value={formData.workspaceName}
            onChange={handleChange}
            icon={Building}
          />

          <div className="space-y-1.5 relative">
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              icon={Lock}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-7 text-txt-muted hover:text-txt-primary transition-colors"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <Input
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleChange}
            icon={Lock}
            required
          />

          <Button
            type="submit"
            className="w-full mt-2"
            isLoading={isLoading}
            size="md"
          >
            Create account
          </Button>
        </form>

        {/* Footer Link */}
        <div className="text-center text-xs text-txt-secondary pt-3 border-t border-border-subtle">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-accent-purple hover:underline"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

// src/features/auth/components/AuthForm.tsx
import React, { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { apiClient } from "../../../lib/apiClient"; // rename your file to apiClient.ts
import { useUser } from "../../../context/UserContext";
import { useHoldToPeek } from "../hooks/useHoldToPeek";
import { getPasswordStrength, passwordMeetsRules } from "../utils/password";
import { PasswordRules } from "./PasswordRules";
import { PasswordStrength } from "./PasswordStrength";
import { PasswordField } from "./PasswordField";

export function AuthForm({ mounted }: { mounted: boolean }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwFocused, setPwFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { setUser } = useUser();
  const peek = useHoldToPeek(2000);

  const pwMeets = passwordMeetsRules(password);
  const passwordsMatch = password.length > 0 && password === confirmPassword;

  const canSubmit = isLogin
    ? email.length > 0 && password.length > 0
    : email.length > 0 && pwMeets && passwordsMatch;

  const strength = useMemo(() => getPasswordStrength(password), [password]);

  const switchMode = () => {
    setIsLogin((v) => !v);
    setPassword("");
    setConfirmPassword("");
    peek.stop();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLogin && password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/signup";
      const response = await apiClient.post(endpoint, { email, password });

      if (response.data.user) {
        setUser(response.data.user);
        toast.success(
          isLogin ? "Welcome back!" : "Account created successfully!",
        );
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          error.response?.data ||
          "An error occurred",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Heading */}
      <div className="mb-4 text-center">
        <h2 className="text-2xl sm:text-3xl lg:text-3xl font-semibold tracking-tight text-foreground mb-1.5">
          {isLogin ? "Welcome back" : "Join meowclub"}
        </h2>
        <p className="text-sm text-muted-foreground">
          {isLogin
            ? "Sign in to continue your yap session ☕"
            : "Create your free account and start chatting!"}
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className={`space-y-2 form-panel ${mounted ? "fields-ready" : ""}`}
      >
        <div className="field-row space-y-1.5">
          <Label htmlFor="email" className="text-sm font-medium">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-10 lg:h-10 rounded-lg text-sm"
          />
        </div>

        <div className="field-row space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            {isLogin && (
              <button
                type="button"
                onClick={() =>
                  toast.info("Forgot password is not implemented yet 😊")
                }
                className="text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                Forgot password?
              </button>
            )}
          </div>

          <PasswordField
            id="password"
            value={password}
            onChange={setPassword}
            required
            show={peek.show}
            onPeekStart={peek.start}
            onPeekStop={peek.stop}
            onFocus={() => setPwFocused(true)}
            onBlur={() => setPwFocused(false)}
            className="h-10 lg:h-10 rounded-xl text-base pr-10"
          />

          {!isLogin && password.length > 0 && (
            <PasswordStrength strength={strength} />
          )}
          {!isLogin && (
            <PasswordRules password={password} focused={pwFocused} />
          )}
        </div>

        {!isLogin && (
          <div className="field-row space-y-1.5">
            <Label htmlFor="confirmPassword" className="text-sm font-medium">
              Confirm password
            </Label>

            <PasswordField
              id="confirmPassword"
              value={confirmPassword}
              onChange={setConfirmPassword}
              required
              show={peek.show}
              onPeekStart={peek.start}
              onPeekStop={peek.stop}
              className="h-12 lg:h-12 rounded-xl text-base pr-10"
            />

            {confirmPassword.length > 0 && (
              <p
                className={`text-[11px] ${
                  passwordsMatch ? "text-emerald-500" : "text-destructive"
                }`}
              >
                {passwordsMatch
                  ? "✓ Passwords match"
                  : "Passwords do not match"}
              </p>
            )}
          </div>
        )}

        <div className="field-row pt-2">
          <Button
            type="submit"
            disabled={isLoading || !canSubmit}
            className="h-12 lg:h-12 w-full rounded-lg text-base font-semibold bg-primary text-primary-foreground shadow hover:shadow-md hover:brightness-95 active:scale-[0.98] transition-all duration-200 disabled:opacity-50"
          >
            {isLoading ? "Loading…" : isLogin ? "Sign In" : "Create Account"}
          </Button>
        </div>
      </form>

      <div className="my-4 flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">or</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <p className="text-center text-sm text-muted-foreground">
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <button
          type="button"
          onClick={switchMode}
          className="font-semibold text-primary hover:underline underline-offset-2"
        >
          {isLogin ? "Sign up" : "Sign in"}
        </button>
      </p>
    </>
  );
}

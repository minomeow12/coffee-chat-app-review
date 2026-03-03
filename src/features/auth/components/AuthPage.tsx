// src/features/auth/components/AuthPage.tsx
import { useEffect, useState } from "react";
import { AuthForm } from "./AuthForm";
import "../styles/auth.css";

export function AuthPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setMounted(true), 60);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div className="auth-root relative min-h-dvh bg-background px-4 py-6 sm:py-10 lg:py-4">
      <div className="mx-auto flex min-h-dvh flex-col items-center justify-center">
        <div className="absolute inset-0 bg-linear-to-br from-amber-50/50 via-background to-background dark:from-amber-950/10 dark:via-background dark:to-background" />

        <div className="relative w-full max-w-105 sm:max-w-115 lg:max-w-130">
          {/* branding */}
          <div className="text-center mb-3">
            <div className="inline-flex items-center justify-center gap-2.5 mb-1">
              <img
                src="/logo.png"
                alt="meowclub"
                className="h-8 w-8 sm:h-9 sm:w-9 lg:h-9 lg:w-9"
              />
              <h1 className="brand-font text-3xl sm:text-3xl lg:text-4xl font-semibold text-foreground">
                meowclub
              </h1>
            </div>
            <p className="text-sm text-muted-foreground">
              A cozy corner for real conversations
            </p>
          </div>

          {/* card */}
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
            <div className="absolute inset-x-12 top-0 h-px bg-linear-to-r from-transparent via-amber-400/40 to-transparent" />
            <div className="p-6 sm:p-10 lg:p-8">
              <AuthForm mounted={mounted} />
            </div>
          </div>

          <p className="mt-3 text-center text-xs text-muted-foreground">
            Made by Evelyn Nguyen
          </p>
        </div>
      </div>
    </div>
  );
}

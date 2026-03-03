// src/features/auth/components/PasswordRules.tsx

import { getPasswordFlags } from "../utils/password";

export function PasswordRules({
  password,
  focused,
}: {
  password: string;
  focused: boolean;
}) {
  const flags = getPasswordFlags(password);

  const rules = [
    { met: flags.minLen, label: "8+ chars" },
    { met: flags.hasLower, label: "lowercase" },
    { met: flags.hasUpper, label: "uppercase" },
    { met: flags.hasNum, label: "number" },
    { met: flags.hasSym, label: "symbol" },
  ];

  if (!focused && password.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5 pt-1">
      {rules.map(({ met, label }) => (
        <span
          key={label}
          className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-medium transition-all duration-200
            ${
              met
                ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-600 dark:text-emerald-400"
                : "border-border bg-(--muted)/50 text-muted-foreground"
            }`}
        >
          {met ? "✓" : "·"} {label}
        </span>
      ))}
    </div>
  );
}

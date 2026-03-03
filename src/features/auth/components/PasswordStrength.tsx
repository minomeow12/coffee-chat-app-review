// src/features/auth/components/PasswordStrength.tsx

import type { PasswordStrength as Strength } from "../utils/password";

export function PasswordStrength({ strength }: { strength: Strength }) {
  return (
    <div className="space-y-1 pt-0.5">
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-border/50">
        <div
          className={`strength-bar h-full rounded-full ${strength.color}`}
          style={{ width: `${strength.percent}%` }}
        />
      </div>
      <p className="text-[11px] capitalize text-muted-foreground">
        {strength.label} password
      </p>
    </div>
  );
}

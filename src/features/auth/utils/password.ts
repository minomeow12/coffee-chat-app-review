// src/features/auth/utils/password.ts
export type PasswordStrength = {
  label: "weak" | "medium" | "strong";
  color: string; // tailwind class
  percent: number; // 0-100
};

export function getPasswordFlags(password: string) {
  return {
    minLen: password.length >= 8,
    hasLower: /[a-z]/.test(password),
    hasUpper: /[A-Z]/.test(password),
    hasNum: /\d/.test(password),
    hasSym: /[^A-Za-z0-9]/.test(password),
  };
}

export function passwordMeetsRules(password: string) {
  const flags = getPasswordFlags(password);
  return Object.values(flags).every(Boolean);
}

export function getPasswordStrength(password: string): PasswordStrength {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { label: "weak", color: "bg-red-400", percent: 20 };
  if (score <= 3)
    return { label: "medium", color: "bg-amber-400", percent: 60 };
  return { label: "strong", color: "bg-emerald-400", percent: 100 };
}

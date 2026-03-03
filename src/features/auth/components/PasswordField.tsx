// src/features/auth/components/PasswordField.tsx

import { Eye, EyeOff } from "lucide-react";
import { Input } from "../../../components/ui/input";

type Props = {
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  show: boolean;
  onPeekStart: () => void;
  onPeekStop: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
};

export function PasswordField({
  id,
  value,
  onChange,
  placeholder = "••••••••",
  required,
  className,
  show,
  onPeekStart,
  onPeekStop,
  onFocus,
  onBlur,
}: Props) {
  return (
    <div className="relative">
      <Input
        id={id}
        type={show ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        onFocus={onFocus}
        onBlur={onBlur}
        className={className}
      />
      <button
        type="button"
        onPointerDown={(e) => {
          e.preventDefault();
          onPeekStart();
        }}
        onPointerUp={onPeekStop}
        onPointerLeave={onPeekStop}
        onPointerCancel={onPeekStop}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Hold to peek"
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}

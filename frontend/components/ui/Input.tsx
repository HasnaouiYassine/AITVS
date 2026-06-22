import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export function Input({ label, error, hint, className, id, ...props }: InputProps) {
  const inputId = id || props.name;

  return (
    <label className="block space-y-2" htmlFor={inputId}>
      {label ? <span className="text-sm font-semibold text-ink">{label}</span> : null}
      <input id={inputId} className={cn("input-field", className)} {...props} />
      {error ? <span className="block text-xs font-medium text-red-600">{error}</span> : null}
      {hint && !error ? <span className="block text-xs text-muted">{hint}</span> : null}
    </label>
  );
}

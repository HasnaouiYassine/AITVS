import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Spinner } from "./Spinner";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: ReactNode;
}

const variants = {
  primary: "bg-amber text-white shadow-[0_4px_14px_rgba(232,160,32,0.35)] hover:bg-amber-600",
  secondary: "border-2 border-navy text-navy hover:bg-navy hover:text-white",
  ghost: "text-navy hover:bg-navy-50",
  danger: "bg-red-600 text-white hover:bg-red-700",
};

const sizes = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

export function Button({
  variant = "primary",
  size = "md",
  loading,
  icon,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-55",
        variants[variant],
        sizes[size],
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Spinner size="sm" color={variant === "primary" || variant === "danger" ? "white" : "navy"} /> : icon}
      {children}
    </button>
  );
}

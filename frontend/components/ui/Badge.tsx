import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  variant?: "success" | "warning" | "info" | "gray";
  children: ReactNode;
}

const variants = {
  success: "bg-emerald-50 text-emerald-700",
  warning: "bg-amber-50 text-amber-600",
  info: "bg-navy-50 text-navy",
  gray: "bg-zinc-100 text-zinc-700",
};

export function Badge({ variant = "gray", children }: BadgeProps) {
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-semibold", variants[variant])}>
      {children}
    </span>
  );
}

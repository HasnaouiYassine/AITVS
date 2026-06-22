import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  padding?: "sm" | "md" | "lg";
  hover?: boolean;
}

const padding = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export function Card({ children, className, padding: pad = "md", hover, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "card",
        padding[pad],
        hover && "transition-shadow hover:shadow-[var(--shadow-card-hover)]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

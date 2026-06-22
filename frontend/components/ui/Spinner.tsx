import { cn } from "@/lib/utils";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: "navy" | "amber" | "white";
}

const sizes = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-10 w-10",
};

const colors = {
  navy: "border-navy/20 border-t-navy",
  amber: "border-amber/20 border-t-amber",
  white: "border-white/40 border-t-white",
};

export function Spinner({ size = "md", color = "navy" }: SpinnerProps) {
  return (
    <span
      className={cn("inline-block animate-spin rounded-full border-2", sizes[size], colors[color])}
      aria-label="Loading"
    />
  );
}

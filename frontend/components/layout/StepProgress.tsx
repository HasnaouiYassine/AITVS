import type { ElementType } from "react";
import { Check, Grid3X3, ImageUp, MousePointer2, Sparkles } from "lucide-react";
import type { VisualizationStep } from "@/types";
import { cn } from "@/lib/utils";

const steps: Array<{ key: VisualizationStep; label: string; icon: ElementType }> = [
  { key: "upload", label: "Upload", icon: ImageUp },
  { key: "floor-select", label: "Map Floor", icon: MousePointer2 },
  { key: "select-tile", label: "Select Tile", icon: Grid3X3 },
  { key: "generating", label: "Generate", icon: Sparkles },
];

export function StepProgress({ current }: { current: VisualizationStep }) {
  const currentIndex = steps.findIndex((step) => step.key === current);

  return (
    <div className="flex items-center">
      {steps.map((step, index) => {
        const complete = index < currentIndex || current === "result";
        const active = index === currentIndex && current !== "result";
        const Icon = complete ? Check : step.icon;

        return (
          <div key={step.key} className="flex flex-1 items-center">
            <div className="flex min-w-16 flex-col items-center gap-2">
              <div
                className={cn(
                  "grid h-10 w-10 place-items-center rounded-full border text-sm transition",
                  complete && "border-amber bg-amber text-white",
                  active && "border-navy bg-navy text-white shadow-[0_0_0_5px_rgba(31,58,95,0.12)]",
                  !complete && !active && "border-line bg-white text-muted",
                )}
              >
                <Icon size={18} />
              </div>
              <span className={cn("text-xs font-semibold", active ? "text-navy" : "text-muted")}>
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 ? (
              <div className={cn("mx-2 h-1 flex-1 rounded-full", complete ? "bg-amber" : "bg-line")} />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

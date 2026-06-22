import { StepProgress } from "@/components/layout/StepProgress";
import { FloorSelector } from "@/components/visualize/FloorSelector";

export default function FloorSelectPage() {
  return (
    <div className="space-y-6">
      <StepProgress current="floor-select" />
      <FloorSelector />
    </div>
  );
}

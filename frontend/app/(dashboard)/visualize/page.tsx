import { StepProgress } from "@/components/layout/StepProgress";
import { UploadZone } from "@/components/visualize/UploadZone";

export default function VisualizePage() {
  return (
    <div className="space-y-6">
      <StepProgress current="upload" />
      <UploadZone />
    </div>
  );
}

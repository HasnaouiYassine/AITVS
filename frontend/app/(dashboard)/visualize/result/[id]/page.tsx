import Link from "next/link";
import { Download, FolderPlus } from "lucide-react";
import { StepProgress } from "@/components/layout/StepProgress";
import { BeforeAfterSlider } from "@/components/visualize/BeforeAfterSlider";
import { Button } from "@/components/ui/Button";
import { projects } from "@/lib/mock-data";

export default function ResultPage() {
  const project = projects[0];

  return (
    <div className="space-y-6">
      <StepProgress current="result" />
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-ink">Visualization ready</h1>
          <p className="mt-2 text-muted">Compare the original room against the AI tile preview.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" icon={<Download size={17} />}>Export</Button>
          <Link
            href="/projects/project-1"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-amber px-5 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(232,160,32,0.35)] transition hover:bg-amber-600"
          >
            <FolderPlus size={17} />
            Save project
          </Link>
        </div>
      </div>
      <BeforeAfterSlider before={project.roomImageUrl} after={project.resultImageUrl} />
    </div>
  );
}

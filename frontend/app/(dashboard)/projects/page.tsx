import { ProjectGallery } from "@/components/projects/ProjectGallery";

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-ink">My Projects</h1>
          <p className="mt-2 text-muted">Review and manage your AI-powered interior tile visualizations.</p>
        </div>
        <input className="input-field max-w-sm" placeholder="Search projects..." />
      </div>
      <ProjectGallery />
    </div>
  );
}

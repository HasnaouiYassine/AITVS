import { projects } from "@/lib/mock-data";
import { ProjectCard } from "./ProjectCard";

export function ProjectGallery() {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard key={project._id} project={project} />
      ))}
    </div>
  );
}

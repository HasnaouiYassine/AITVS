import Link from "next/link";
import Image from "next/image";
import { Eye, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import type { IProject } from "@/types";
import { formatDate } from "@/lib/mock-data";

export function ProjectCard({ project }: { project: IProject }) {
  return (
    <article className="group card overflow-hidden p-0 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)]">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={project.resultImageUrl}
          alt={project.tileId.name}
          fill
          sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3">
          <Badge variant="info">{project.tileId.category}</Badge>
        </div>
        <div className="absolute inset-0 flex items-center justify-center gap-3 bg-navy/20 opacity-0 backdrop-blur-[2px] transition group-hover:opacity-100">
          <Link href={`/projects/${project._id}`} className="grid h-11 w-11 place-items-center rounded-full bg-white text-navy shadow-lg">
            <Eye size={18} />
          </Link>
          <button className="grid h-11 w-11 place-items-center rounded-full bg-red-600 text-white shadow-lg" aria-label="Delete project">
            <Trash2 size={18} />
          </button>
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-bold text-ink">{project.tileId.name}</h3>
          <span className="text-xs font-medium text-muted">{formatDate(project.createdAt)}</span>
        </div>
        <p className="mt-2 text-sm text-muted">{project.tileId.dimensions} tile visualization</p>
      </div>
    </article>
  );
}

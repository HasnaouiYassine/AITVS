import { notFound } from "next/navigation";
import { BeforeAfterSlider } from "@/components/visualize/BeforeAfterSlider";
import { Card } from "@/components/ui/Card";
import { projects, formatDate } from "@/lib/mock-data";

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = projects.find((item) => item._id === id) || projects[0];
  if (!project) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-ink">{project.tileId.name}</h1>
        <p className="mt-2 text-muted">Generated {formatDate(project.createdAt)} with {project.tileId.dimensions} tile.</p>
      </div>
      <BeforeAfterSlider before={project.roomImageUrl} after={project.resultImageUrl} />
      <Card>
        <h2 className="text-xl font-bold text-ink">Floor mapping data</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-4">
          {project.floorCorners.map((corner, index) => (
            <div key={index} className="rounded-lg bg-surface p-3">
              <p className="text-sm font-bold text-navy">Corner {index + 1}</p>
              <p className="mt-1 text-sm text-muted">x {corner.x}, y {corner.y}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

import Link from "next/link";
import type { ElementType } from "react";
import { ArrowRight, CheckCircle2, Clock3, Grid3X3, ImageUp, Sparkles, Users } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProjectGallery } from "@/components/projects/ProjectGallery";
import { projects, tiles } from "@/lib/mock-data";

export default function DashboardPage() {
  const stats: Array<[string, string | number, ElementType]> = [
    ["Projects", projects.length, ImageUp],
    ["Active tiles", tiles.length, Grid3X3],
    ["Render credits", "75", Sparkles],
    ["Retail users", "24", Users],
  ];

  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[1fr_23rem]">
        <div className="card overflow-hidden p-8">
          <div className="max-w-2xl">
            <Badge variant="warning">AI tile visualizer</Badge>
            <h1 className="mt-4 text-3xl font-bold leading-tight text-ink md:text-5xl">
              Turn room photos into tile-ready previews.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-muted">
              Upload a room, map the floor plane, choose a tile, and generate a realistic preview your customers can trust.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link className="inline-flex h-12 items-center gap-2 rounded-lg bg-amber px-6 font-semibold text-white shadow-[0_4px_14px_rgba(232,160,32,0.35)]" href="/visualize">
                Start visualization
                <ArrowRight size={18} />
              </Link>
              <Link className="inline-flex h-12 items-center rounded-lg border-2 border-navy px-6 font-semibold text-navy" href="/catalog">
                Explore catalog
              </Link>
            </div>
          </div>
        </div>
        <Card>
          <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-muted">Retail readiness</h2>
          <div className="mt-5 space-y-4">
            {[
              ["Embeddable flow", "Prepared for retailer website installs"],
              ["JWT auth", "Credentials and Google OAuth scaffolding"],
              ["CV handoff", "Project route ready for FastAPI integration"],
            ].map(([title, detail]) => (
              <div key={title} className="flex gap-3">
                <CheckCircle2 className="mt-0.5 text-emerald-600" size={19} />
                <div>
                  <p className="font-bold text-ink">{title}</p>
                  <p className="text-sm text-muted">{detail}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>
      <section className="grid grid-cols-1 gap-5 md:grid-cols-4">
        {stats.map(([label, value, Icon]) => (
          <Card key={label}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-muted">{label}</p>
                <p className="mt-2 text-3xl font-bold text-ink">{value}</p>
              </div>
              <div className="grid h-11 w-11 place-items-center rounded-lg bg-navy-50 text-navy">
                <Icon size={21} />
              </div>
            </div>
          </Card>
        ))}
      </section>
      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-ink">Recent projects</h2>
            <p className="text-sm text-muted">Latest generated room previews.</p>
          </div>
          <div className="hidden items-center gap-2 text-sm font-semibold text-muted md:flex">
            <Clock3 size={16} />
            Updated today
          </div>
        </div>
        <ProjectGallery />
      </section>
    </div>
  );
}

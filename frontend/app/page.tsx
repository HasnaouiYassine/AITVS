import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Eye,
  Grid3X3,
  ImageUp,
  Layers3,
  Sparkles,
} from "lucide-react";

const roomBefore =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCl8KgCE6VSqOdJl_mVet2iJRoxqcOSYIZNNeM-AUhjtFy1phWY-erpMoGM8k46Bp4mtygg7DxQVQ6mcEaUaL-IZOB02rCqGoZK7fb0jl409ozf1oMEmJ6B7vBZJL_JGGjrmrkSwE9AynBvc3r_dOQqQH79zcfXbsfbxzVvKrouWBT93AW31V3C4SUrVItaGU-AkV-LjYTjMOQK46KRA1X3aMbFAARlV5bUG26pnACcptWnw2jTfDSkSbNmDBGNvNMyHcBdsyDsnA";
const roomAfter =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDmCK5pJ0TcBgt9u_F6PPpDqK7zs7s2JAsEQdRbCuU-WE9XlOJMbckqx-aD4DovFd2nxwPHZGcWeD4y52pQb-8VOYk9WtlD3FQWgEC_C0K4zr853qauiALmyeAdmOqSmOFYbWdoOCooJcr_rzylDXLfEKWFpFiWL54fKvpl7UsTmGbZx3IUvklaOds55gjcgrU3NQ2o6iebDb-WBXi5aktF1KpNYz0NOFJwBJWXS-vfCA7EyLshLZt7TUxI6yB1SSTBpgGa_v2x4A";

const steps = [
  {
    title: "Upload Your Room",
    copy: "Snap a photo of a kitchen, bathroom, showroom, or living area. TileVision identifies floors and walls automatically.",
    icon: ImageUp,
    tone: "bg-navy text-white",
  },
  {
    title: "Pick a Tile",
    copy: "Browse real textures by material, color, finish, and size so clients can compare options without guessing.",
    icon: Grid3X3,
    tone: "bg-amber text-white",
  },
  {
    title: "See the Result",
    copy: "Generate a photorealistic preview, then save the project or continue refining grout, pattern, and layout choices.",
    icon: Eye,
    tone: "bg-navy-50 text-navy",
  },
];

const metrics = [
  ["8K", "visual previews"],
  ["50+", "showrooms supported"],
  ["3", "simple workflow steps"],
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-surface text-ink">
      <header className="fixed inset-x-0 top-0 z-40 border-b border-line bg-surface/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-4 md:px-8">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-navy text-sm font-black text-white">TV</span>
            <span className="text-xl font-extrabold text-navy">TileVision</span>
          </Link>
          <nav className="hidden items-center gap-8 text-sm font-medium text-ink/75 md:flex">
            <Link className="transition hover:text-navy" href="/dashboard">
              Dashboard
            </Link>
            <Link className="transition hover:text-navy" href="/projects">
              Projects
            </Link>
            <Link className="transition hover:text-navy" href="/catalog">
              Catalog
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link className="hidden text-sm font-bold text-navy transition hover:text-amber md:inline-flex" href="/login">
              Sign in
            </Link>
            <Link
              className="inline-flex h-11 items-center justify-center rounded-lg bg-amber px-4 text-sm font-bold text-white shadow-[0_4px_14px_rgba(232,160,32,0.32)] transition hover:bg-amber-600 md:px-6"
              href="/register"
            >
              New Visualization
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto grid min-h-screen max-w-[1280px] grid-cols-1 items-center gap-10 px-4 pb-16 pt-28 md:px-8 lg:grid-cols-[0.92fr_1.08fr] lg:gap-14 lg:pb-24">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#d5e3ff] px-4 py-2 text-xs font-semibold text-[#001c3b]">
            <Sparkles size={14} fill="currentColor" />
            Powered by TileVision AI
          </div>
          <h1 className="max-w-xl text-4xl font-extrabold leading-[1.12] text-navy md:text-5xl">
            Visualize Any Tile In Your Room - <span className="text-[#815500]">Instantly</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-ink/75 md:text-lg">
            Upload a photo. Pick a tile. See the result in seconds. Experience professional-grade interior visualization
            from your browser.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              className="inline-flex h-14 items-center justify-center gap-2 rounded-lg bg-amber px-7 text-base font-bold text-white shadow-[0_8px_24px_rgba(232,160,32,0.28)] transition hover:bg-amber-600"
              href="/register"
            >
              Try It Free
              <ArrowRight size={18} />
            </Link>
            <Link
              className="inline-flex h-14 items-center justify-center gap-2 rounded-lg border-2 border-navy px-7 text-base font-bold text-navy transition hover:bg-navy hover:text-white"
              href="/catalog"
            >
              For Retailers
            </Link>
          </div>
          <div className="mt-10 grid max-w-lg grid-cols-3 gap-4">
            {metrics.map(([value, label]) => (
              <div key={label}>
                <p className="text-2xl font-extrabold text-navy">{value}</p>
                <p className="mt-1 text-xs font-semibold text-muted">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="relative h-[390px] overflow-hidden rounded-xl border border-ink/10 bg-white shadow-[0_18px_45px_rgba(0,0,0,0.18)] md:h-[500px]">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${roomAfter})` }}
              aria-label="AI visualized room with polished marble tile"
            />
            <div
              className="absolute inset-y-0 left-0 w-1/2 bg-cover bg-center"
              style={{ backgroundImage: `url(${roomBefore})` }}
              aria-label="Original room before tile visualization"
            />
            <div className="absolute inset-y-0 left-1/2 z-20 w-1 -translate-x-1/2 bg-white shadow-[0_0_18px_rgba(0,0,0,0.35)]" />
            <div className="absolute left-1/2 top-1/2 z-30 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-navy shadow-[0_5px_18px_rgba(0,0,0,0.25)]">
              <Layers3 size={22} />
            </div>
            <div className="absolute left-4 top-4 z-30 rounded-full bg-navy/90 px-4 py-2 text-xs font-bold text-white">
              ORIGINAL
            </div>
            <div className="absolute right-4 top-4 z-30 rounded-full bg-[#815500]/90 px-4 py-2 text-xs font-bold text-white">
              AI VISUALIZED
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-[#eae7e7] py-9">
        <div className="mx-auto max-w-[1280px] px-4 text-center md:px-8">
          <p className="text-sm font-semibold uppercase text-ink/65">Trusted by 50+ tile showrooms worldwide</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-8 opacity-45">
            {["Atelier Stone", "Northline Tile", "Casa Forma", "Mosaic Lab", "Urban Bath"].map((name) => (
              <span key={name} className="rounded bg-ink/10 px-8 py-3 text-xs font-bold text-ink/55">
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-4 py-16 md:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-sm font-bold uppercase text-amber">Workflow</p>
          <h2 className="text-3xl font-extrabold text-navy">Redesign in Three Simple Steps</h2>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <article key={step.title} className="card p-6 md:p-8">
                <div className={`mb-7 grid h-12 w-12 place-items-center rounded-lg ${step.tone}`}>
                  <Icon size={22} />
                </div>
                <h3 className="text-xl font-extrabold text-navy">{step.title}</h3>
                <p className="mt-4 text-sm leading-7 text-ink/72">{step.copy}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="border-y border-line bg-white py-16">
        <div className="mx-auto grid max-w-[1280px] gap-8 px-4 md:px-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="mb-3 text-sm font-bold uppercase text-amber">Built for decisions</p>
            <h2 className="text-3xl font-extrabold leading-tight text-navy">
              Give homeowners and commercial clients a preview they can trust.
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ["AI room masking", "Detect floors and walls from everyday room photos."],
              ["Real tile catalogs", "Organize textures by style, finish, format, and availability."],
              ["Project history", "Keep client concepts, selected tiles, and final renders together."],
              ["Retail ready", "Show options clearly before samples or installation begin."],
            ].map(([title, copy]) => (
              <div key={title} className="rounded-lg border border-line bg-surface p-5">
                <BadgeCheck className="mb-4 text-amber" size={22} />
                <h3 className="font-extrabold text-navy">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-[#032448] px-4 py-12 text-white md:px-8">
        <div className="mx-auto grid max-w-[1280px] gap-10 md:grid-cols-[1.3fr_0.7fr_0.7fr]">
          <div>
            <div className="mb-6 flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-amber text-sm font-black">TV</span>
              <span className="text-2xl font-extrabold">TileVision</span>
            </div>
            <p className="max-w-md leading-7 text-white/72">
              The AI-powered tile visualization platform for homeowners, designers, and commercial retailers.
            </p>
          </div>
          <div>
            <h3 className="mb-5 font-bold text-amber">Product</h3>
            <div className="grid gap-3 text-white/72">
              <Link href="/visualize">Visualizer</Link>
              <Link href="/catalog">Catalog</Link>
              <Link href="/projects">Projects</Link>
            </div>
          </div>
          <div>
            <h3 className="mb-5 font-bold text-amber">Company</h3>
            <div className="grid gap-3 text-white/72">
              <Link href="/login">Sign in</Link>
              <Link href="/register">Create account</Link>
              <Link href="/dashboard">Workspace</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

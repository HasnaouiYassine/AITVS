"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FolderKanban, Grid3X3, Home, LayoutDashboard, Settings, ShieldCheck, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/visualize", label: "New Visualization", icon: Sparkles },
  { href: "/projects", label: "My Projects", icon: FolderKanban },
  { href: "/catalog", label: "Tile Catalog", icon: Grid3X3 },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/admin", label: "Admin", icon: ShieldCheck },
];

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
}

export function Sidebar({ open = false, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      <button
        type="button"
        aria-label="Close navigation"
        className={cn(
          "fixed inset-0 z-40 bg-ink/35 transition-opacity md:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-60 flex-col bg-navy py-8 text-white shadow-lg transition-transform duration-200 md:z-40 md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="mb-10 flex items-center justify-between px-6">
          <Link href="/dashboard" className="flex items-center gap-3" onClick={onClose}>
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-amber text-sm font-black text-white">
              TV
            </div>
            <div>
              <div className="text-xl font-bold leading-none">TileVision</div>
              <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/55">
                AI Visualization
              </div>
            </div>
          </Link>
          <button
            type="button"
            className="grid h-9 w-9 place-items-center rounded-lg text-white/70 transition hover:bg-white/10 hover:text-white md:hidden"
            aria-label="Close navigation"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>
      <nav className="flex flex-1 flex-col gap-1">
        {links.map((item) => {
          const active =
            pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 border-l-4 border-transparent px-5 py-3 text-sm font-semibold text-white/65 transition hover:bg-white/8 hover:text-white",
                active && "border-amber bg-white/10 text-white",
              )}
            >
              <Icon size={19} />
              {item.label}
            </Link>
          );
        })}
      </nav>
        <div className="px-5">
          <div className="rounded-xl border border-white/10 bg-white/8 p-4">
            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-white/55">
              <Home size={14} />
              Studio Plan
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-3/4 rounded-full bg-amber" />
            </div>
            <p className="mt-2 text-xs text-white/75">75 / 100 render credits</p>
          </div>
        </div>
      </aside>
    </>
  );
}

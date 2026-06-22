"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LogOut, Menu, Plus, Search } from "lucide-react";

export interface TopNavUser {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export function TopNav({ onMenuClick, user }: { onMenuClick?: () => void; user?: TopNavUser }) {
  const pathname = usePathname();
  const title = pathname.startsWith("/visualize")
    ? "Visualization Studio"
    : pathname.startsWith("/projects")
      ? "Projects"
      : pathname.startsWith("/catalog")
        ? "Catalog"
        : pathname.startsWith("/admin")
          ? "Admin"
          : "Dashboard";
  const initials =
    user?.name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ||
    user?.email?.slice(0, 2).toUpperCase() ||
    "TV";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-line bg-surface/95 px-4 backdrop-blur md:px-8">
      <div className="flex items-center gap-3">
        <button type="button" className="rounded-lg p-2 text-navy md:hidden" aria-label="Open navigation" onClick={onMenuClick}>
          <Menu size={22} />
        </button>
        <div>
          <p className="hidden text-xs font-semibold uppercase tracking-[0.18em] text-muted md:block">
            TileVision Workspace
          </p>
          <h1 className="text-lg font-bold text-navy md:text-xl">{title}</h1>
        </div>
      </div>
      <div className="hidden w-full max-w-xs items-center gap-2 rounded-lg border border-line bg-white px-3 py-2 lg:flex">
        <Search size={17} className="text-muted" />
        <input className="w-full bg-transparent text-sm outline-none" placeholder="Search projects, tiles..." />
      </div>
      <div className="flex items-center gap-3">
        <Link
          href="/visualize"
          className="hidden h-11 items-center justify-center gap-2 rounded-lg bg-amber px-5 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(232,160,32,0.35)] transition hover:bg-amber-600 md:inline-flex"
        >
          <Plus size={17} />
          New Visualization
        </Link>
        <div className="hidden min-w-0 text-right md:block">
          <p className="truncate text-sm font-bold text-navy">{user?.name || "TileVision User"}</p>
          <p className="truncate text-xs text-muted">{user?.email || "Workspace"}</p>
        </div>
        <div className="grid h-10 w-10 place-items-center rounded-full border border-line bg-white text-sm font-bold text-navy">
          {initials}
        </div>
        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-lg text-navy transition hover:bg-navy-50"
          aria-label="Sign out"
          title="Sign out"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}

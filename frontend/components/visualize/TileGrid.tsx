"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, Sparkles } from "lucide-react";
import { tiles } from "@/lib/mock-data";
import { TileCard } from "./TileCard";

const categories = ["all", "marble", "wood", "stone", "mosaic", "ceramic"] as const;

export function TileGrid() {
  const [selected, setSelected] = useState(tiles[0]);
  const [category, setCategory] = useState<(typeof categories)[number]>("all");
  const [search, setSearch] = useState("");
  const filtered = useMemo(
    () =>
      tiles.filter(
        (tile) =>
          (category === "all" || tile.category === category) &&
          tile.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [category, search],
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[16rem_1fr]">
      <aside className="card h-fit p-5">
        <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-muted">Categories</h2>
        <div className="mt-4 flex flex-wrap gap-2 lg:flex-col">
          {categories.map((item) => (
            <button
              key={item}
              className={`rounded-lg px-3 py-2 text-left text-sm font-semibold capitalize transition ${
                category === item ? "bg-navy text-white" : "bg-surface text-muted hover:bg-navy-50 hover:text-navy"
              }`}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </aside>
      <section>
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex w-full max-w-md items-center gap-2 rounded-lg border border-line bg-white px-3 py-2">
            <Search size={17} className="text-muted" />
            <input
              className="w-full bg-transparent text-sm outline-none"
              placeholder="Search catalog..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <Link
            href="/visualize/result/demo"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-amber px-5 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(232,160,32,0.35)] transition hover:bg-amber-600"
          >
            <Sparkles size={17} />
            Generate preview
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((tile) => (
            <TileCard key={tile._id} tile={tile} selected={tile._id === selected._id} onSelect={setSelected} />
          ))}
        </div>
      </section>
    </div>
  );
}

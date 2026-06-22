"use client";

import { Check } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import type { ITile } from "@/types";
import { cn } from "@/lib/utils";

export function TileCard({
  tile,
  selected,
  onSelect,
}: {
  tile: ITile;
  selected?: boolean;
  onSelect?: (tile: ITile) => void;
}) {
  return (
    <button
      className={cn(
        "group card overflow-hidden p-0 text-left transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)]",
        selected && "ring-2 ring-amber ring-offset-2 ring-offset-surface",
      )}
      onClick={() => onSelect?.(tile)}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={tile.imageUrl}
          alt={tile.name}
          fill
          sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        {selected ? (
          <span className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-amber text-white shadow-lg">
            <Check size={17} />
          </span>
        ) : null}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-bold text-ink">{tile.name}</h3>
          <Badge variant="info">{tile.category}</Badge>
        </div>
        <div className="mt-3 flex items-center justify-between text-sm text-muted">
          <span>{tile.dimensions}</span>
          <span className="font-bold text-navy">{tile.priceRange}</span>
        </div>
      </div>
    </button>
  );
}

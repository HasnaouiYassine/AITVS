"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { RotateCcw, WandSparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";

const defaultPoints = [
  { x: 23, y: 64 },
  { x: 74, y: 63 },
  { x: 91, y: 92 },
  { x: 8, y: 94 },
];

export function FloorSelector() {
  const [points, setPoints] = useState(defaultPoints);

  return (
    <div className="grid min-h-[calc(100vh-14rem)] gap-6 lg:grid-cols-[1fr_18rem]">
      <div className="card relative overflow-hidden p-0">
        <Image
          src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1500&q=80"
          alt="Modern living room"
          fill
          sizes="(min-width: 1024px) calc(100vw - 34rem), 100vw"
          className="object-cover"
        />
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <polygon
            points={points.map((point) => `${point.x},${point.y}`).join(" ")}
            fill="rgba(232,160,32,0.24)"
            stroke="#E8A020"
            strokeWidth="0.45"
          />
        </svg>
        {points.map((point, index) => (
          <button
            key={`${point.x}-${point.y}`}
            className="absolute grid h-8 w-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-white bg-navy text-xs font-bold text-white shadow-lg"
            style={{ left: `${point.x}%`, top: `${point.y}%` }}
            onClick={() =>
              setPoints((current) =>
                current.map((existing, itemIndex) =>
                  itemIndex === index ? { x: existing.x + 1 > 94 ? 8 : existing.x + 1, y: existing.y } : existing,
                ),
              )
            }
          >
            {index + 1}
          </button>
        ))}
      </div>
      <aside className="card flex flex-col justify-between p-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber">Perspective grid</p>
          <h2 className="mt-2 text-xl font-bold text-ink">Click each handle to fine-tune the floor plane.</h2>
          <div className="mt-5 space-y-3">
            {points.map((point, index) => (
              <div key={index} className="flex items-center justify-between rounded-lg bg-surface px-3 py-2 text-sm">
                <span className="font-semibold text-navy">Corner {index + 1}</span>
                <span className="text-muted">
                  {point.x}%, {point.y}%
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-6 space-y-3">
          <Button variant="secondary" className="w-full" icon={<RotateCcw size={17} />} onClick={() => setPoints(defaultPoints)}>
            Reset points
          </Button>
          <Link
            href="/visualize/select-tile"
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-amber px-5 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(232,160,32,0.35)] transition hover:bg-amber-600"
          >
            <WandSparkles size={17} />
            Choose tile
          </Link>
        </div>
      </aside>
    </div>
  );
}

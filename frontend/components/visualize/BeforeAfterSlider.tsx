"use client";

import { useState } from "react";
import Image from "next/image";

export function BeforeAfterSlider({
  before,
  after,
}: {
  before: string;
  after: string;
}) {
  const [position, setPosition] = useState(55);

  return (
    <div className="card overflow-hidden p-0">
      <div className="relative aspect-[16/10] min-h-80">
        <Image src={after} alt="AI visualized room" fill sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 overflow-hidden" style={{ width: `${position}%` }}>
          <div className="relative h-full" style={{ width: `${10000 / position}%` }}>
            <Image src={before} alt="Original room" fill sizes="100vw" className="object-cover" />
          </div>
        </div>
        <div className="absolute inset-y-0 w-1 -translate-x-1/2 bg-white shadow-xl" style={{ left: `${position}%` }} />
        <input
          aria-label="Compare original and visualized room"
          type="range"
          min="12"
          max="88"
          value={position}
          onChange={(event) => setPosition(Number(event.target.value))}
          className="absolute inset-x-6 bottom-6 accent-amber"
        />
        <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-navy">Original</div>
        <div className="absolute right-4 top-4 rounded-full bg-navy/90 px-3 py-1 text-xs font-bold text-white">TileVision</div>
      </div>
    </div>
  );
}

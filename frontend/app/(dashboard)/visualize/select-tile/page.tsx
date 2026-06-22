import { StepProgress } from "@/components/layout/StepProgress";
import { TileGrid } from "@/components/visualize/TileGrid";

export default function SelectTilePage() {
  return (
    <div className="space-y-6">
      <StepProgress current="select-tile" />
      <div>
        <h1 className="text-3xl font-bold text-ink">Choose your texture</h1>
        <p className="mt-2 text-muted">Select the tile material you want the AI to visualize in your space.</p>
      </div>
      <TileGrid />
    </div>
  );
}

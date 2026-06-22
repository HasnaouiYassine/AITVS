import { TileGrid } from "@/components/visualize/TileGrid";

export default function CatalogPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-ink">Tile Catalog</h1>
        <p className="mt-2 text-muted">Browse retailer-ready tile textures, categories, dimensions, and price bands.</p>
      </div>
      <TileGrid />
    </div>
  );
}

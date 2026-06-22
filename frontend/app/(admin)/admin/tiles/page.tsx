import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { tiles } from "@/lib/mock-data";

export default function AdminTilesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-ink">Tile Management</h1>
      <Card className="overflow-hidden p-0">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-surface text-muted">
            <tr>
              <th className="px-5 py-3">Tile</th>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3">Dimensions</th>
              <th className="px-5 py-3">Price</th>
              <th className="px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {tiles.map((tile) => (
              <tr key={tile._id}>
                <td className="px-5 py-4 font-bold text-ink">{tile.name}</td>
                <td className="px-5 py-4 capitalize text-muted">{tile.category}</td>
                <td className="px-5 py-4 text-muted">{tile.dimensions}</td>
                <td className="px-5 py-4 text-muted">{tile.priceRange}</td>
                <td className="px-5 py-4"><Badge variant="success">Active</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

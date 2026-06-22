import Link from "next/link";
import { Grid3X3, Users } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { tiles, users } from "@/lib/mock-data";

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-ink">Admin</h1>
        <p className="mt-2 text-muted">Manage global tile inventory, users, and client accounts.</p>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <Link href="/admin/tiles">
          <Card hover>
            <Grid3X3 className="text-navy" size={26} />
            <h2 className="mt-4 text-xl font-bold text-ink">Tiles</h2>
            <p className="mt-2 text-muted">{tiles.length} active catalog items.</p>
          </Card>
        </Link>
        <Link href="/admin/users">
          <Card hover>
            <Users className="text-navy" size={26} />
            <h2 className="mt-4 text-xl font-bold text-ink">Users</h2>
            <p className="mt-2 text-muted">{users.length} seeded workspace users.</p>
          </Card>
        </Link>
      </div>
    </div>
  );
}

import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { users, formatDate } from "@/lib/mock-data";

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-ink">User Management</h1>
      <Card className="overflow-hidden p-0">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead className="bg-surface text-muted">
            <tr>
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Email</th>
              <th className="px-5 py-3">Role</th>
              <th className="px-5 py-3">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {users.map((user) => (
              <tr key={user._id}>
                <td className="px-5 py-4 font-bold text-ink">{user.name}</td>
                <td className="px-5 py-4 text-muted">{user.email}</td>
                <td className="px-5 py-4"><Badge variant={user.role === "admin" ? "warning" : "info"}>{user.role}</Badge></td>
                <td className="px-5 py-4 text-muted">{formatDate(user.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

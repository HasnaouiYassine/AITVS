import { Bell, Building2, KeyRound, Palette } from "lucide-react";
import type { ElementType } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function SettingsPage() {
  const settingsCards: Array<[ElementType, string, string]> = [
    [Palette, "Brand theme", "Navy utility surfaces with amber action accents."],
    [Bell, "Notifications", "Weekly render summaries and project alerts."],
    [KeyRound, "Security", "JWT sessions with Google OAuth and credentials."],
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-ink">Settings</h1>
        <p className="mt-2 text-muted">Manage workspace profile, embed defaults, and account preferences.</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
        <Card className="space-y-4">
          <h2 className="flex items-center gap-2 text-xl font-bold text-ink"><Building2 size={20} /> Workspace</h2>
          <Input label="Company name" defaultValue="Northline Tiles" />
          <Input label="Embed domain" defaultValue="northlinetiles.com" />
          <Input label="Support email" defaultValue="support@northlinetiles.com" />
          <Button>Save changes</Button>
        </Card>
        <div className="space-y-4">
          {settingsCards.map(([Icon, title, detail]) => (
            <Card key={title}>
              <Icon className="text-navy" size={22} />
              <h3 className="mt-3 font-bold text-ink">{title}</h3>
              <p className="mt-1 text-sm leading-6 text-muted">{detail}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

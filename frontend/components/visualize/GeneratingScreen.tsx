import { Sparkles } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";

export function GeneratingScreen() {
  return (
    <Card className="flex min-h-96 flex-col items-center justify-center text-center" padding="lg">
      <div className="mb-5 grid h-16 w-16 place-items-center rounded-full bg-amber-50 text-amber">
        <Sparkles size={30} />
      </div>
      <Spinner size="lg" color="amber" />
      <h2 className="mt-6 text-2xl font-bold text-ink">Rendering tile perspective</h2>
      <p className="mt-3 max-w-md text-sm leading-6 text-muted">
        The production flow will send the selected room, corners, and tile texture to the CV service, then save the result as a project.
      </p>
    </Card>
  );
}

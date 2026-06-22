import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { auth } from "@/lib/auth";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const authConfigured =
    Boolean(process.env.MONGODB_URI) &&
    Boolean(process.env.AUTH_SECRET) &&
    process.env.AUTH_SECRET !== "replace-with-a-long-random-secret";
  const session = await auth();

  if (authConfigured && !session?.user) {
    redirect("/login");
  }

  return <AppShell user={session?.user}>{children}</AppShell>;
}

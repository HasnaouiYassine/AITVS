"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { Globe2, LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <Card className="w-full max-w-md" padding="lg">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-xl bg-navy text-sm font-black text-white">
            TV
          </div>
          <h1 className="text-2xl font-bold text-ink">Welcome back</h1>
          <p className="mt-2 text-sm text-muted">Sign in to manage visualizations and tile catalogs.</p>
        </div>
        <form
          className="space-y-4"
          onSubmit={async (event) => {
            event.preventDefault();
            setLoading(true);
            const form = new FormData(event.currentTarget);
            await signIn("credentials", {
              email: form.get("email"),
              password: form.get("password"),
              callbackUrl: "/dashboard",
            });
            setLoading(false);
          }}
        >
          <Input label="Email" name="email" type="email" placeholder="you@example.com" required />
          <Input label="Password" name="password" type="password" placeholder="Minimum 8 characters" required />
          <Button className="w-full" loading={loading} icon={<LockKeyhole size={17} />}>
            Sign in
          </Button>
        </form>
        <div className="my-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-wide text-muted">
          <span className="h-px flex-1 bg-line" />
          or
          <span className="h-px flex-1 bg-line" />
        </div>
        <Button variant="secondary" className="w-full" icon={<Globe2 size={17} />} onClick={() => signIn("google", { callbackUrl: "/dashboard" })}>
          Continue with Google
        </Button>
        <p className="mt-6 text-center text-sm text-muted">
          New to TileVision?{" "}
          <Link href="/register" className="font-bold text-navy">
            Create account
          </Link>
        </p>
      </Card>
    </main>
  );
}

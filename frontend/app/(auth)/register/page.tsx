"use client";

import Link from "next/link";
import { useState } from "react";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

export default function RegisterPage() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <Card className="w-full max-w-md" padding="lg">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-xl bg-amber text-sm font-black text-white">
            TV
          </div>
          <h1 className="text-2xl font-bold text-ink">Create your account</h1>
          <p className="mt-2 text-sm text-muted">Start building tile visualizations for your studio or retail brand.</p>
        </div>
        <form
          className="space-y-4"
          onSubmit={async (event) => {
            event.preventDefault();
            setLoading(true);
            setMessage("");
            const form = new FormData(event.currentTarget);
            const res = await fetch("/api/auth/register", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(Object.fromEntries(form)),
            });
            setMessage(res.ok ? "Account created. You can sign in now." : "Could not create account yet.");
            setLoading(false);
          }}
        >
          <Input label="Name" name="name" placeholder="Maya Hart" required />
          <Input label="Email" name="email" type="email" placeholder="you@example.com" required />
          <Input label="Password" name="password" type="password" hint="Use at least 8 characters." required />
          <Button className="w-full" loading={loading} icon={<UserPlus size={17} />}>
            Create account
          </Button>
        </form>
        {message ? <p className="mt-4 rounded-lg bg-navy-50 px-3 py-2 text-sm font-semibold text-navy">{message}</p> : null}
        <p className="mt-6 text-center text-sm text-muted">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-navy">
            Sign in
          </Link>
        </p>
      </Card>
    </main>
  );
}

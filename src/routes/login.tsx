import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Crest } from "@/components/brand/crest";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { GROK_PROVIDERS, authClient, authEnabled, signIn } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const { user, isPending } = useCurrentUserState();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  if (isPending) {
    return <div className="grid min-h-dvh place-items-center bg-paper text-sm text-muted">Loading session…</div>;
  }
  if (user) return <Navigate to="/dashboard" />;

  async function onEmail(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "up") {
        const { error } = await authClient.signUp.email({
          email,
          password,
          name: name || email.split("@")[0],
          callbackURL: "/dashboard",
        });
        if (error) throw new Error(error.message || "Could not create account");
      } else {
        const { error } = await authClient.signIn.email({
          email,
          password,
          callbackURL: "/dashboard",
        });
        if (error) throw new Error(error.message || "Could not sign in");
      }
      window.location.href = "/dashboard";
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Sign-in failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className="relative hidden bg-navy p-10 text-white lg:flex lg:flex-col">
        <Link to="/" className="flex items-center gap-3">
          <Crest className="h-10 w-10" light />
          <div>
            <div className="font-display text-lg font-semibold">AEC College</div>
            <div className="text-xs tracking-[0.16em] text-white/55 uppercase">Learning system</div>
          </div>
        </Link>
        <div className="mt-auto max-w-md">
          <blockquote className="font-display text-3xl leading-snug font-medium">
            Knowledge in service of the nation.
          </blockquote>
          <p className="mt-4 text-sm text-white/65">
            Academic Office, Atomic Energy Commission College · Lehtrar Road, near Nilore,
            Islamabad. Session 2025–26.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center bg-paper px-5 py-10">
        <div className="w-full max-w-sm">
          <Link to="/" className="mb-8 flex items-center gap-2 lg:hidden">
            <Crest className="h-8 w-8" />
            <span className="font-display font-semibold text-navy">AEC LMS</span>
          </Link>
          <h1 className="font-display text-2xl font-semibold text-ink">
            {mode === "in" ? "Sign in" : "Create your campus account"}
          </h1>
          <p className="mt-1 text-sm text-muted">
            Use your college email, or continue with Google or X. You will pick a campus role on
            first entry.
          </p>

          {authEnabled ? (
            <>
              <div className="mt-6 grid gap-2">
                {GROK_PROVIDERS.map((p) => (
                  <Button
                    key={p.providerId}
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => signIn(p.providerId, { callbackURL: "/dashboard" })}
                  >
                    Continue with {p.label}
                  </Button>
                ))}
              </div>
              <div className="my-6 flex items-center gap-3 text-xs text-faint">
                <span className="h-px flex-1 bg-line" />
                or email
                <span className="h-px flex-1 bg-line" />
              </div>
              <form onSubmit={onEmail} className="space-y-3">
                {mode === "up" ? (
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Full name</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                  </div>
                ) : null}
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    autoComplete={mode === "up" ? "new-password" : "current-password"}
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={busy}>
                  {busy ? "Please wait…" : mode === "in" ? "Sign in with email" : "Create account"}
                </Button>
              </form>
              <button
                type="button"
                className="mt-4 text-sm text-primary"
                onClick={() => setMode(mode === "in" ? "up" : "in")}
              >
                {mode === "in" ? "Need an account? Register" : "Already registered? Sign in"}
              </button>
            </>
          ) : (
            <p className="mt-6 text-sm text-muted">Sign-in is disabled.</p>
          )}
        </div>
      </div>
    </div>
  );
}

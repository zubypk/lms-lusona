import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AppearanceControls } from "@/components/appearance/controls";
import { Crest, Wordmark } from "@/components/brand/crest";
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
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState<"email" | "google" | "twitter" | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  if (isPending) {
    return <div className="grid min-h-dvh place-items-center text-sm text-muted">Loading session…</div>;
  }
  if (user) return <Navigate to="/dashboard" />;

  async function onEmail(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    if (password.length < 8) {
      setFormError("Password must be at least 8 characters.");
      return;
    }
    setBusy("email");
    try {
      if (mode === "up") {
        const { error } = await authClient.signUp.email({
          email: email.trim(),
          password,
          name: name.trim() || email.split("@")[0],
          callbackURL: "/dashboard",
        });
        if (error) throw new Error(error.message || "Could not create account");
      } else {
        const { error } = await authClient.signIn.email({
          email: email.trim(),
          password,
          callbackURL: "/dashboard",
        });
        if (error) throw new Error(error.message || "Email or password is not recognised");
      }
      window.location.href = "/dashboard";
    } catch (err) {
      const message = err instanceof Error ? err.message : "Sign-in failed";
      setFormError(message);
      toast.error(message);
    } finally {
      setBusy(null);
    }
  }

  function onOauth(providerId: string, key: "google" | "twitter") {
    setFormError(null);
    setBusy(key);
    void signIn(providerId, { callbackURL: "/dashboard", errorCallbackURL: "/login" }).catch((err: unknown) => {
      const message =
        err instanceof Error
          ? err.message
          : "Could not open the sign-in window. Allow pop-ups, or use email instead.";
      setFormError(
        `Google / X needs an allowed pop-up in this preview. ${message} Use email and password — that is the solid login for this test campus.`,
      );
      toast.error(message);
      setBusy(null);
    });
  }

  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className="relative h-40 overflow-hidden bg-navy text-white lg:hidden">
        <img src="/campus/exterior.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-navy/70" />
        <div className="relative z-10 flex h-full flex-col justify-between p-5">
          <Link to="/">
            <Wordmark light compact />
          </Link>
          <p className="text-sm text-white/75">Test campus · email login</p>
        </div>
      </div>

      <div className="relative hidden overflow-hidden bg-navy p-10 text-white lg:flex lg:flex-col">
        <img src="/campus/exterior.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-navy/70" />
        <div className="relative z-10 flex h-full flex-col">
          <Link to="/" className="flex items-center gap-3">
            <Crest className="h-10 w-10" light />
            <div>
              <div className="font-display text-lg font-semibold text-white">LMS</div>
              <div className="text-xs tracking-[0.16em] text-white/55 uppercase">Learning Management System</div>
            </div>
          </Link>
          <div className="mt-auto max-w-md">
            <blockquote className="font-display text-3xl leading-snug font-medium text-white">
              Sign in to the test campus.
            </blockquote>
            <p className="mt-4 text-sm text-white/65">
              Register with email (password 8+ characters). This preview is a test feed — work in progress, full LMS
              coming soon. Google and X may be blocked by pop-up settings.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center bg-surface px-5 py-8 sm:py-10">
        <div className="w-full max-w-sm">
          <div className="mb-5 flex items-center justify-between gap-3">
            <Link to="/" className="hidden items-center gap-2 lg:flex">
              <Crest className="h-8 w-8" />
              <span className="font-display font-semibold text-heading">LMS</span>
            </Link>
            <AppearanceControls />
          </div>
          <p className="mb-3 rounded-md border border-warn/40 bg-warn-bg px-3 py-2 text-xs text-ink">
            TEST FEED · Work in progress · Under maintenance · Full LMS coming soon. Do not treat this as the live
            campus.
          </p>
          <h1 className="font-display text-2xl font-semibold text-heading">
            {mode === "in" ? "Sign in to LMS" : "Create your LMS account"}
          </h1>
          <p className="mt-1 text-sm text-muted">
            Students: use the email and password issued by your class teacher. Teachers and admins: sign in with campus
            email. After a new staff account, pick your role once.
          </p>

          {authEnabled ? (
            <>
              <form onSubmit={onEmail} className="mt-5 space-y-3">
                {mode === "up" ? (
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Full name</Label>
                    <Input
                      id="name"
                      value={name}
                      autoComplete="name"
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                ) : null}
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPw ? "text" : "password"}
                      autoComplete={mode === "up" ? "new-password" : "current-password"}
                      minLength={8}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pr-12"
                    />
                    <button
                      type="button"
                      className="absolute top-1/2 right-2 grid h-9 w-9 -translate-y-1/2 place-items-center text-muted"
                      onClick={() => setShowPw((v) => !v)}
                      aria-label={showPw ? "Hide password" : "Show password"}
                    >
                      {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                {formError ? (
                  <p className="rounded-md border border-danger/30 bg-danger-bg px-3 py-2 text-sm text-danger">
                    {formError}
                  </p>
                ) : null}
                <Button type="submit" className="w-full" disabled={busy !== null}>
                  {busy === "email"
                    ? "Please wait…"
                    : mode === "in"
                      ? "Sign in with email"
                      : "Create account"}
                </Button>
              </form>
              <button
                type="button"
                className="mt-3 min-h-11 text-sm text-primary"
                onClick={() => {
                  setMode(mode === "in" ? "up" : "in");
                  setFormError(null);
                }}
              >
                {mode === "in" ? "Need an account? Register with email" : "Already registered? Sign in"}
              </button>

              <div className="my-5 flex items-center gap-3 text-xs text-faint">
                <span className="h-px flex-1 bg-line" />
                optional window
                <span className="h-px flex-1 bg-line" />
              </div>
              <div className="grid gap-2">
                {GROK_PROVIDERS.map((p) => {
                  const key = p.idp === "google" ? "google" : "twitter";
                  return (
                    <Button
                      key={p.providerId}
                      type="button"
                      variant="outline"
                      className="w-full"
                      disabled={busy !== null}
                      onClick={() => onOauth(p.providerId, key)}
                    >
                      {busy === key ? "Opening window…" : `Continue with ${p.label}`}
                    </Button>
                  );
                })}
              </div>
              <p className="mt-3 text-[11px] text-muted">
                Google and X open a pop-up. If nothing happens, stay on email — that login is stored on this campus.
              </p>
            </>
          ) : (
            <p className="mt-6 text-sm text-muted">Sign-in is disabled on this preview.</p>
          )}
        </div>
      </div>
    </div>
  );
}

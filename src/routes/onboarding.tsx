import { createFileRoute, Navigate, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Crest } from "@/components/brand/crest";
import { Button } from "@/components/ui/button";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { completeOnboarding, getMyProfile, ROLES } from "@/lib/lms";
import { queryClient } from "@/lib/query-client";
import { cn } from "@/lib/utils";
import { useState } from "react";
import type { Role } from "@/lib/lms/types";

export const Route = createFileRoute("/onboarding")({ component: Onboarding });

function Onboarding() {
  const { user, isPending } = useCurrentUserState();
  const nav = useNavigate();
  const [role, setRole] = useState<Role>("student");
  const me = useQuery({ queryKey: ["me"], queryFn: () => getMyProfile(), enabled: !!user });
  const mut = useMutation({
    mutationFn: () => completeOnboarding({ data: { role } }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["me"] });
      toast.success("Welcome to LMS.");
      nav({ to: "/dashboard" });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isPending || me.isPending) {
    return <div className="grid min-h-dvh place-items-center text-sm text-muted">Preparing LMS…</div>;
  }
  if (!user) return <RedirectToSignIn />;
  if (me.data) return <Navigate to="/dashboard" />;

  return (
    <div className="min-h-dvh px-5 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center gap-3">
          <Crest className="h-10 w-10" />
          <div>
            <div className="font-display text-lg font-semibold text-heading">LMS</div>
            <div className="text-sm text-muted">Choose how you will use the campus system</div>
          </div>
        </div>
        <h1 className="mt-8 font-display text-3xl font-semibold text-ink">Select a campus role</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          The Grade 11 Pre-Engineering cohort is already loaded. Students and teachers are linked to an
          existing register so you can see real attendance, assignments and results immediately. A Super
          Admin can later reassign any account from Users & roles.
        </p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {ROLES.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setRole(r.id)}
              className={cn(
                "min-h-24 rounded-xl border bg-surface p-5 text-left shadow-[var(--shadow-card)] transition-colors",
                role === r.id ? "border-primary ring-2 ring-accent/30" : "border-line hover:border-line-strong",
              )}
            >
              <div className="font-medium text-ink">{r.label}</div>
              <p className="mt-1 text-sm text-muted">{r.blurb}</p>
            </button>
          ))}
        </div>
        <Button className="mt-8 w-full sm:w-auto" size="lg" disabled={mut.isPending} onClick={() => mut.mutate()}>
          {mut.isPending ? "Opening LMS…" : "Continue"}
        </Button>
      </div>
    </div>
  );
}

import { Copy, Printer } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CAMPUS_DOMAIN, MAIL_DOMAIN } from "@/lib/build";
import type { IssuedLogin } from "@/lib/lms/types";

export function LoginSlip({ issued }: { issued: IssuedLogin }) {
  const text = [
    `LMS student login`,
    `Name: ${issued.name}`,
    `Roll: ${issued.rollNumber}`,
    `Student ID: ${issued.studentCode}`,
    `Email: ${issued.email}`,
    `Username: ${issued.username}`,
    `Password: ${issued.tempPassword}`,
    `Sign in at https://${CAMPUS_DOMAIN}  ·  mail @${MAIL_DOMAIN}`,
  ].join("\n");

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Login copied. Give it to the student once.");
    } catch {
      toast.error("Could not copy. Write the password down.");
    }
  }

  function printSlip() {
    const w = window.open("", "_blank", "noopener,noreferrer,width=480,height=640");
    if (!w) return;
    w.document.write(`<!doctype html><html><head><title>Student login</title>
      <style>
        body { font-family: Georgia, serif; padding: 32px; color: #12385A; }
        h1 { font-size: 18px; margin: 0 0 4px; }
        p { font-size: 12px; color: #5b6b7c; margin: 0 0 16px; }
        dl { display: grid; grid-template-columns: 110px 1fr; gap: 8px 12px; font-size: 14px; }
        dt { color: #5b6b7c; } dd { margin: 0; font-weight: 600; }
        .pw { font-family: ui-monospace, monospace; letter-spacing: 0.04em; }
      </style></head><body>
      <h1>LMS · Student login</h1>
      <p>Share once. Change the password after first sign-in.</p>
      <dl>
        <dt>Name</dt><dd>${issued.name}</dd>
        <dt>Roll</dt><dd>${issued.rollNumber}</dd>
        <dt>Student ID</dt><dd>${issued.studentCode}</dd>
        <dt>Email</dt><dd>${issued.email}</dd>
        <dt>Username</dt><dd>${issued.username}</dd>
        <dt>Password</dt><dd class="pw">${issued.tempPassword}</dd>
      </dl>
      </body></html>`);
    w.document.close();
    w.focus();
    w.print();
  }

  return (
    <div className="rounded-xl border border-primary/30 bg-info-bg p-4">
      <div className="text-[10px] font-medium tracking-[0.16em] text-primary uppercase">Issued login · show once</div>
      <div className="mt-2 font-display text-lg font-semibold text-ink">{issued.name}</div>
      <p className="text-xs text-muted">
        Roll {issued.rollNumber} · {issued.studentCode}
      </p>
      <dl className="mt-3 grid grid-cols-[5.5rem_1fr] gap-x-3 gap-y-1 text-sm">
        <dt className="text-muted">Email</dt>
        <dd className="font-medium break-all">{issued.email}</dd>
        <dt className="text-muted">Username</dt>
        <dd className="font-medium">{issued.username}</dd>
        <dt className="text-muted">Password</dt>
        <dd className="font-mono tracking-wide">{issued.tempPassword}</dd>
      </dl>
      <p className="mt-3 text-xs text-muted">
        Parent details stay classified. Only name, father name and roll no were stored.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button type="button" size="sm" onClick={() => void copy()}>
          <Copy className="h-3.5 w-3.5" /> Copy
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={printSlip}>
          <Printer className="h-3.5 w-3.5" /> Print slip
        </Button>
      </div>
    </div>
  );
}

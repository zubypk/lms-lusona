const PKT = "Asia/Karachi";

export function formatDate(value: string | Date | null | undefined) {
  if (!value) return "—";
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) {
    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const [y, m, day] = value.split("-").map(Number);
      return new Date(Date.UTC(y, m - 1, day)).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
      });
    }
    return String(value);
  }
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: PKT,
  });
}

export function formatDateTime(value: string | Date | null | undefined) {
  if (!value) return "—";
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: PKT,
  });
}

export function formatPct(n: number) {
  return `${Math.round(n)}%`;
}

export function letterAndGpa(pct: number): { letter: string; gpa: number } {
  if (pct >= 85) return { letter: "A+", gpa: 4.0 };
  if (pct >= 80) return { letter: "A", gpa: 3.7 };
  if (pct >= 75) return { letter: "B+", gpa: 3.3 };
  if (pct >= 70) return { letter: "B", gpa: 3.0 };
  if (pct >= 65) return { letter: "C+", gpa: 2.7 };
  if (pct >= 60) return { letter: "C", gpa: 2.3 };
  if (pct >= 55) return { letter: "D+", gpa: 2.0 };
  if (pct >= 50) return { letter: "D", gpa: 1.0 };
  return { letter: "F", gpa: 0 };
}

export function num(v: unknown) {
  if (typeof v === "number") return v;
  if (typeof v === "string") return Number(v);
  return 0;
}

export const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function initials(name: string) {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("") || "?";
}

export function hueFromName(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i += 1) h = (h + name.charCodeAt(i) * 17) % 360;
  return h;
}

export function youtubeId(url: string) {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1);
    return u.searchParams.get("v");
  } catch {
    return null;
  }
}

export function platformLabel(p: string) {
  if (p === "meet") return "Google Meet";
  if (p === "zoom") return "Zoom";
  if (p === "teams") return "Microsoft Teams";
  return p;
}

export function materialLabel(t: string) {
  const map: Record<string, string> = {
    pdf: "PDF",
    docx: "Word",
    ppt: "PowerPoint",
    pptx: "PowerPoint",
    video: "Video",
    image: "Image",
    zip: "Archive",
    link: "Link",
    youtube: "YouTube",
  };
  return map[t] ?? t.toUpperCase();
}

export function roleLabel(role: string) {
  const map: Record<string, string> = {
    super_admin: "Super Admin",
    academic_admin: "Academic Admin",
    class_incharge: "Class Incharge",
    teacher: "Teacher",
    student: "Student",
  };
  return map[role] ?? role;
}

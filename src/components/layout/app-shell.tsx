import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  FileSpreadsheet,
  GraduationCap,
  LayoutDashboard,
  Library,
  Menu,
  MessagesSquare,
  PenSquare,
  Settings,
  Table2,
  Users,
  Video,
  ClipboardList,
  UserRound,
  School,
  LineChart,
  Shield,
  UserCog,
} from "lucide-react";
import { useMemo, useState } from "react";
import { UserButton } from "@/lib/auth/gates";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import type { Actor, Role } from "@/lib/lms/types";
import { roleLabel } from "@/lib/lms/format";
import { Wordmark } from "@/components/brand/crest";
import { CampusMarquee } from "@/components/brand/marquee";
import { AppearanceControls } from "@/components/appearance/controls";
import { SiteFooter } from "@/components/layout/site-footer";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { CAMPUS_DOMAIN } from "@/lib/build";
import { cn } from "@/lib/utils";

type Item = { to: string; label: string; icon: typeof LayoutDashboard; roles?: Role[] };

const NAV: { title: string; items: Item[] }[] = [
  {
    title: "Campus",
    items: [
      { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { to: "/calendar", label: "Academic calendar", icon: CalendarDays },
      { to: "/notifications", label: "Notifications", icon: Bell },
    ],
  },
  {
    title: "People",
    items: [
      { to: "/students", label: "Students", icon: GraduationCap, roles: ["super_admin", "academic_admin", "class_incharge", "teacher"] },
      { to: "/teachers", label: "Teachers", icon: Users },
      { to: "/users", label: "Users & roles", icon: UserCog, roles: ["super_admin", "academic_admin"] },
      { to: "/profile", label: "My profile", icon: UserRound },
    ],
  },
  {
    title: "Academics",
    items: [
      { to: "/sessions", label: "Sessions", icon: School, roles: ["super_admin", "academic_admin"] },
      { to: "/classes", label: "Classes & sections", icon: Library, roles: ["super_admin", "academic_admin", "class_incharge"] },
      { to: "/subjects", label: "Subjects & syllabus", icon: BookOpen },
      { to: "/timetable", label: "Timetable", icon: Table2 },
    ],
  },
  {
    title: "Learning",
    items: [
      { to: "/materials", label: "Study materials", icon: BookOpen },
      { to: "/assignments", label: "Assignments", icon: PenSquare },
      { to: "/quizzes", label: "Quizzes", icon: ClipboardList },
      { to: "/meetings", label: "Online classes", icon: Video },
      { to: "/forum", label: "Discussion forum", icon: MessagesSquare },
    ],
  },
  {
    title: "Records",
    items: [
      { to: "/attendance", label: "Attendance", icon: ClipboardCheck },
      { to: "/results", label: "Results", icon: FileSpreadsheet },
      { to: "/reports", label: "Reports", icon: LineChart, roles: ["super_admin", "academic_admin", "class_incharge"] },
      { to: "/admin", label: "Admin panel", icon: Shield, roles: ["super_admin", "academic_admin"] },
      { to: "/settings", label: "Settings", icon: Settings, roles: ["super_admin"] },
    ],
  },
];

const MARQUEE =
  "AEC LMS · Session 2025–26 · lms.lusona.org · College mail @lms.edu.pk · Mid-term week begins 22 September";

function visible(item: Item, role: Role) {
  if (!item.roles) return true;
  if (role === "super_admin") return true;
  return item.roles.includes(role);
}

function NavBody({ actor, onNavigate }: { actor: Actor; onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="flex flex-1 flex-col gap-5 overflow-y-auto px-3 pb-6">
      {NAV.map((group) => {
        const items = group.items.filter((i) => visible(i, actor.role));
        if (!items.length) return null;
        return (
          <div key={group.title}>
            <div className="px-3 pb-1 text-[10px] font-medium tracking-[0.16em] text-white/40 uppercase">
              {group.title}
            </div>
            <div className="flex flex-col gap-0.5">
              {items.map((item) => {
                const active = pathname === item.to || pathname.startsWith(item.to + "/");
                const Icon = item.icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={onNavigate}
                    className={cn(
                      "flex h-10 items-center gap-2.5 rounded-md px-3 text-sm transition-colors",
                      active ? "bg-white/12 text-white" : "text-white/70 hover:bg-white/8 hover:text-white",
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
    </nav>
  );
}

export function AppShell({ actor }: { actor: Actor }) {
  const [open, setOpen] = useState(false);
  const user = useCurrentUser();
  const name = actor.displayName || user?.displayName || "Campus member";
  const subtitle = useMemo(() => {
    if (actor.role === "student" && actor.className) {
      return `${roleLabel(actor.role)} · ${actor.className} ${actor.sectionName ?? ""}`.trim();
    }
    return roleLabel(actor.role);
  }, [actor]);

  return (
    <div className="flex min-h-dvh bg-paper">
      <aside className="sticky top-0 hidden h-dvh w-[16.5rem] shrink-0 flex-col bg-navy md:flex">
        <div className="px-4 py-5">
          <Link to="/dashboard">
            <Wordmark light />
          </Link>
        </div>
        <NavBody actor={actor} />
        <div className="border-t border-white/10 p-4">
          <div className="text-[10px] tracking-[0.14em] text-white/40 uppercase">Session 2025–26</div>
          <div className="mt-1 text-xs text-white/70">{CAMPUS_DOMAIN}</div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <CampusMarquee compact text={MARQUEE} />
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-line bg-surface/90 px-4 backdrop-blur-sm">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </Button>
          <div className="md:hidden">
            <Wordmark />
          </div>
          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <AppearanceControls />
            <Link
              to="/notifications"
              className="hidden h-11 items-center text-sm text-muted hover:text-ink sm:inline-flex"
            >
              Notices
            </Link>
            <div className="hidden text-right sm:block">
              <div className="text-sm font-medium text-ink">{name}</div>
              <div className="text-xs text-muted">{subtitle}</div>
            </div>
            <UserButton />
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6">
          <Outlet />
        </main>
        <SiteFooter compact />
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="bg-navy p-0 text-white">
          <div className="px-4 py-5">
            <Wordmark light />
          </div>
          <NavBody actor={actor} onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
    </div>
  );
}

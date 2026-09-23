import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
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
  RefreshCw,
  School,
  LineChart,
  Shield,
  UserCog,
  LogOut,
} from "lucide-react";
import { useMemo, useState, useSyncExternalStore } from "react";
import { authEnabled, signOut } from "@/lib/auth/client";
import { hasGateSessionMarker } from "@/lib/auth/gate-session-marker";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import type { Actor, Role } from "@/lib/lms/types";
import { roleLabel } from "@/lib/lms/format";
import { Wordmark } from "@/components/brand/crest";
import { CampusMarquee } from "@/components/brand/marquee";
import { AppearanceControls } from "@/components/appearance/controls";
import { MusicToggle } from "@/components/brand/campus-music";
import { HardRefreshButton } from "@/components/brand/hard-refresh";
import { SiteFooter } from "@/components/layout/site-footer";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn, publicDisplayName } from "@/lib/utils";

type Item = { to: string; label: string; icon: typeof LayoutDashboard; roles?: Role[] };

const NAV: { title: string; items: Item[] }[] = [
  {
    title: "Campus",
    items: [
      { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { to: "/my-class", label: "My class", icon: School, roles: ["super_admin", "academic_admin", "class_incharge", "teacher"] },
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

const TABS: Item[] = [
  { to: "/dashboard", label: "Home", icon: LayoutDashboard },
  { to: "/my-class", label: "Class", icon: School, roles: ["super_admin", "academic_admin", "class_incharge", "teacher"] },
  { to: "/materials", label: "Learn", icon: BookOpen, roles: ["student"] },
  { to: "/assignments", label: "Work", icon: PenSquare },
  { to: "/attendance", label: "Attend", icon: ClipboardCheck },
];

const MARQUEE =
  "LMS · Class teachers enrol with Name, Father name and Roll no · Student login is issued automatically · Subject teachers see only their classes · Session 2025–26";

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
                      "flex h-11 items-center gap-2.5 rounded-md px-3 text-sm transition-colors",
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

function AccountMenu({ actor }: { actor: Actor }) {
  const user = useCurrentUser();
  const navigate = useNavigate();
  const [signingOut, setSigningOut] = useState(false);
  const name = publicDisplayName(actor.displayName || user?.displayName);
  const initial = name.charAt(0).toUpperCase();
  const gateSession = useSyncExternalStore(
    () => () => {},
    hasGateSessionMarker,
    () => false,
  );
  const canSignOut = authEnabled && !gateSession;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="grid h-11 w-11 place-items-center overflow-hidden rounded-full border border-line bg-paper-2 text-sm font-medium text-ink"
          aria-label="Account"
        >
          {user?.profileImageUrl ? (
            <img src={user.profileImageUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            initial
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-2">
          <div className="truncate text-sm font-medium text-ink">{name}</div>
          <div className="text-xs text-muted">{roleLabel(actor.role)}</div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => void navigate({ to: "/profile" })}>
          <UserRound className="h-4 w-4" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => {
          window.location.assign(`/refresh?t=${Date.now()}`);
        }}>
          <RefreshCw className="h-4 w-4" />
          Hard refresh
        </DropdownMenuItem>
        {canSignOut ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              disabled={signingOut}
              onSelect={() => {
                setSigningOut(true);
                void signOut().catch(() => setSigningOut(false));
              }}
            >
              <LogOut className="h-4 w-4" />
              {signingOut ? "Signing out…" : "Sign out"}
            </DropdownMenuItem>
          </>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function MobileTabs({ actor, onMore }: { actor: Actor; onMore: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const items = TABS.filter((i) => visible(i, actor.role));
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-sm md:hidden"
      aria-label="LMS phone navigation"
    >
      <div className="grid h-14 grid-cols-5">
        {items.map((item) => {
          const active = pathname === item.to || pathname.startsWith(item.to + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium",
                active ? "text-primary" : "text-muted",
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
        <button
          type="button"
          onClick={onMore}
          className="flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium text-muted"
        >
          <Menu className="h-5 w-5" />
          Menu
        </button>
      </div>
    </nav>
  );
}

export function AppShell({ actor }: { actor: Actor }) {
  const [open, setOpen] = useState(false);
  const user = useCurrentUser();
  const name = publicDisplayName(actor.displayName || user?.displayName);
  const subtitle = useMemo(() => {
    if (actor.role === "student" && actor.className) {
      return `${roleLabel(actor.role)} · ${actor.className} ${actor.sectionName ?? ""}`.trim();
    }
    return roleLabel(actor.role);
  }, [actor]);

  return (
    <div className="flex min-h-dvh">
      <aside className="sticky top-0 hidden h-dvh w-[16.5rem] shrink-0 flex-col bg-navy md:flex">
        <div className="px-4 py-5">
          <Link to="/dashboard">
            <Wordmark light />
          </Link>
        </div>
        <NavBody actor={actor} />
        <div className="mt-auto border-t border-white/10 p-3">
          <div className="text-[10px] tracking-[0.14em] text-white/40 uppercase">Session 2025–26</div>
          <div className="mt-1 text-xs text-white/70">LMS</div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <CampusMarquee compact text={MARQUEE} />
        <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-line bg-surface/90 px-3 pt-[env(safe-area-inset-top)] backdrop-blur-sm sm:px-4">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </Button>
          <Link to="/dashboard" className="md:hidden">
            <Wordmark compact />
          </Link>
          <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
            <div className="md:hidden">
              <MusicToggle />
            </div>
            <div className="hidden md:block">
              <AppearanceControls />
            </div>
            <div className="md:hidden">
              <HardRefreshButton />
            </div>
            <Button asChild variant="ghost" size="icon" className="hidden sm:inline-flex" aria-label="Notices">
              <Link to="/notifications">
                <Bell className="h-5 w-5" />
              </Link>
            </Button>
            <div className="hidden text-right md:block">
              <div className="text-sm font-medium text-ink">{name}</div>
              <div className="text-xs text-muted">{subtitle}</div>
            </div>
            <AccountMenu actor={actor} />
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-5 pb-[calc(4.75rem+env(safe-area-inset-bottom))] sm:px-6 md:pb-6">
          <Outlet />
        </main>
        <div className="hidden md:block">
          <SiteFooter compact />
        </div>
      </div>

      <MobileTabs actor={actor} onMore={() => setOpen(true)} />

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="bg-navy p-0 text-white">
          <div className="px-4 py-5">
            <Wordmark light />
          </div>
          <NavBody actor={actor} onNavigate={() => setOpen(false)} />
          <div className="border-t border-white/10 p-4">
            <AppearanceControls light />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

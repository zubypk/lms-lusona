import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { d as useRouterState, m as Outlet, v as Link, y as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { c as roleLabel } from "./format-TM2oG14R.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { C as ChartLine, E as Bell, T as BookOpen, _ as FileSpreadsheet, b as ClipboardCheck, d as MessagesSquare, f as Menu, h as GraduationCap, i as UserRound, l as Settings, m as LayoutDashboard, n as Video, o as Table2, p as Library, r as Users, s as SquarePen, t as X, u as School, w as CalendarDays, y as ClipboardList } from "../_libs/lucide-react.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { a as DialogPortal, i as DialogOverlay, n as DialogClose, r as DialogContent, t as Dialog } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { s as Skeleton } from "./router-CAe6ag9G.mjs";
import { t as Button } from "./button-OJh_VqBS.mjs";
import { n as getMyProfile } from "./profile-PD3MNGy4.mjs";
import { i as useCurrentUserState, n as Wordmark, r as useCurrentUser } from "./crest-DqZn1M-7.mjs";
import { i as UserButton, t as RedirectToSignIn } from "./gates-BK9V45tR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/route-na1Cs8HU.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Sheet = Dialog;
function SheetContent({ side = "left", className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, { className: "fixed inset-0 z-50 bg-ink/40" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
		className: cn("fixed z-50 flex h-full flex-col bg-navy text-white shadow-xl", side === "left" ? "top-0 left-0 w-[min(20rem,88vw)]" : "top-0 right-0 w-[min(24rem,88vw)] bg-surface text-ink", className),
		...props,
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
			className: "absolute top-3 right-3 rounded-sm p-2 text-current/70 hover:bg-white/10",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "sr-only",
				children: "Close"
			})]
		})]
	})] });
}
var NAV = [
	{
		title: "Campus",
		items: [
			{
				to: "/dashboard",
				label: "Dashboard",
				icon: LayoutDashboard
			},
			{
				to: "/calendar",
				label: "Academic calendar",
				icon: CalendarDays
			},
			{
				to: "/notifications",
				label: "Notifications",
				icon: Bell
			}
		]
	},
	{
		title: "People",
		items: [
			{
				to: "/students",
				label: "Students",
				icon: GraduationCap,
				roles: [
					"super_admin",
					"academic_admin",
					"class_incharge",
					"teacher"
				]
			},
			{
				to: "/teachers",
				label: "Teachers",
				icon: Users
			},
			{
				to: "/profile",
				label: "My profile",
				icon: UserRound
			}
		]
	},
	{
		title: "Academics",
		items: [
			{
				to: "/sessions",
				label: "Sessions",
				icon: School,
				roles: ["super_admin", "academic_admin"]
			},
			{
				to: "/classes",
				label: "Classes & sections",
				icon: Library,
				roles: [
					"super_admin",
					"academic_admin",
					"class_incharge"
				]
			},
			{
				to: "/subjects",
				label: "Subjects & syllabus",
				icon: BookOpen
			},
			{
				to: "/timetable",
				label: "Timetable",
				icon: Table2
			}
		]
	},
	{
		title: "Learning",
		items: [
			{
				to: "/materials",
				label: "Study materials",
				icon: BookOpen
			},
			{
				to: "/assignments",
				label: "Assignments",
				icon: SquarePen
			},
			{
				to: "/quizzes",
				label: "Quizzes",
				icon: ClipboardList
			},
			{
				to: "/meetings",
				label: "Online classes",
				icon: Video
			},
			{
				to: "/forum",
				label: "Discussion forum",
				icon: MessagesSquare
			}
		]
	},
	{
		title: "Records",
		items: [
			{
				to: "/attendance",
				label: "Attendance",
				icon: ClipboardCheck
			},
			{
				to: "/results",
				label: "Results",
				icon: FileSpreadsheet
			},
			{
				to: "/reports",
				label: "Reports",
				icon: ChartLine,
				roles: [
					"super_admin",
					"academic_admin",
					"class_incharge"
				]
			},
			{
				to: "/settings",
				label: "Settings",
				icon: Settings,
				roles: ["super_admin"]
			}
		]
	}
];
function visible(item, role) {
	if (!item.roles) return true;
	if (role === "super_admin") return true;
	return item.roles.includes(role);
}
function NavBody({ actor, onNavigate }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		className: "flex flex-1 flex-col gap-5 overflow-y-auto px-3 pb-6",
		children: NAV.map((group) => {
			const items = group.items.filter((i) => visible(i, actor.role));
			if (!items.length) return null;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "px-3 pb-1 text-[10px] font-medium tracking-[0.16em] text-white/40 uppercase",
				children: group.title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-col gap-0.5",
				children: items.map((item) => {
					const active = pathname === item.to || pathname.startsWith(item.to + "/");
					const Icon = item.icon;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: item.to,
						onClick: onNavigate,
						className: cn("flex h-10 items-center gap-2.5 rounded-md px-3 text-sm transition-colors", active ? "bg-white/12 text-white" : "text-white/70 hover:bg-white/8 hover:text-white"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4 shrink-0" }), item.label]
					}, item.to);
				})
			})] }, group.title);
		})
	});
}
function AppShell({ actor }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const user = useCurrentUser();
	const name = actor.displayName || user?.displayName || "Campus member";
	const subtitle = (0, import_react.useMemo)(() => {
		if (actor.role === "student" && actor.className) return `${roleLabel(actor.role)} · ${actor.className} ${actor.sectionName ?? ""}`.trim();
		return roleLabel(actor.role);
	}, [actor]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh bg-paper",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "sticky top-0 hidden h-dvh w-[16.5rem] shrink-0 flex-col bg-navy md:flex",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "px-4 py-5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/dashboard",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wordmark, { light: true })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavBody, { actor }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-t border-white/10 p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10px] tracking-[0.14em] text-white/40 uppercase",
							children: "Session 2025–26"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1 text-xs text-white/70",
							children: "Rawalpindi / Islamabad"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-w-0 flex-1 flex-col",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-line bg-surface/90 px-4 backdrop-blur-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon",
							className: "md:hidden",
							onClick: () => setOpen(true),
							"aria-label": "Open menu",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "h-5 w-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "md:hidden",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wordmark, {})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "ml-auto flex items-center gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/notifications",
									className: "hidden h-11 items-center text-sm text-muted hover:text-ink sm:inline-flex",
									children: "Notices"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "hidden text-right sm:block",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-sm font-medium text-ink",
										children: name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-muted",
										children: subtitle
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {})
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
				open,
				onOpenChange: setOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetContent, {
					side: "left",
					className: "bg-navy p-0 text-white",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "px-4 py-5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wordmark, { light: true })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavBody, {
						actor,
						onNavigate: () => setOpen(false)
					})]
				})
			})
		]
	});
}
function AppLayout() {
	const { user, isPending } = useCurrentUserState();
	const me = useQuery({
		queryKey: ["me"],
		queryFn: () => getMyProfile(),
		enabled: !!user
	});
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShellSkeleton, {});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	if (me.isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShellSkeleton, {});
	if (!me.data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/onboarding" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { actor: me.data });
}
function ShellSkeleton() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh bg-paper",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "hidden w-[16.5rem] bg-navy md:block" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex-1 p-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-8 w-48" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-3 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-24" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-24" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-24" })
				]
			})]
		})]
	});
}
//#endregion
export { AppLayout as component };

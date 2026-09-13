import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as queryClient, s as Skeleton } from "./router-CAe6ag9G.mjs";
import { r as PageHeader } from "./page-CZIwOlta.mjs";
import { t as Badge } from "./badge-y-r0oP60.mjs";
import { t as Button } from "./button-OJh_VqBS.mjs";
import { t as Input } from "./input-Bwpmjhr-.mjs";
import { i as canTeach } from "./types-CmLQZMpi.mjs";
import { n as getMyProfile } from "./profile-PD3MNGy4.mjs";
import { o as markAttendance, t as getAttendance } from "./records-g3YmYo9V.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-BhKvy1JJ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/attendance-DgPSNMQW.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STATUSES = [
	"present",
	"late",
	"absent",
	"excused"
];
function AttendancePage() {
	const me = useQuery({
		queryKey: ["me"],
		queryFn: () => getMyProfile()
	});
	const [sectionId, setSectionId] = (0, import_react.useState)();
	const [date, setDate] = (0, import_react.useState)(() => (/* @__PURE__ */ new Date()).toISOString().slice(0, 10));
	const q = useQuery({
		queryKey: ["attendance", sectionId],
		queryFn: () => getAttendance({ data: sectionId ? { sectionId } : void 0 })
	});
	const teach = canTeach(me.data?.role ?? "student");
	const [marks, setMarks] = (0, import_react.useState)({});
	const data = q.data;
	const mut = useMutation({
		mutationFn: () => markAttendance({ data: {
			sectionId: data?.sectionId ?? 5,
			date,
			marks: (data?.students ?? []).map((s) => ({
				studentId: s.id,
				status: marks[s.id] ?? "present"
			}))
		} }),
		onSuccess: () => {
			toast.success("Attendance saved");
			queryClient.invalidateQueries({ queryKey: ["attendance"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const tone = (s) => s === "present" ? "ok" : s === "late" ? "warn" : s === "absent" ? "danger" : "muted";
	const days = data?.days ?? [];
	const recent = (0, import_react.useMemo)(() => days.slice(-8), [days]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Attendance",
		subtitle: "Daily register, late marks and month-to-date percentages.",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
			value: String(data?.sectionId ?? ""),
			onValueChange: (v) => setSectionId(Number(v)),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
				className: "w-56",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Section" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: data?.sections.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
				value: String(s.id),
				children: s.label
			}, s.id)) })]
		})
	}), q.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-80" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4",
			children: data?.summary.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-md border border-line bg-surface px-3 py-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-sm font-medium",
					children: s.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-xs text-muted",
					children: [
						s.present,
						"/",
						s.total,
						" · ",
						s.pct,
						"%"
					]
				})]
			}, s.id))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-x-auto rounded-xl border border-line bg-surface shadow-[var(--shadow-card)]",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full min-w-[720px] text-left text-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "bg-paper text-muted",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-3 py-2",
						children: "Student"
					}), recent.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-2 py-2 font-medium",
						children: d.slice(8)
					}, d))] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: data?.students.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-t border-line",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
						className: "px-3 py-2 text-sm",
						children: [s.name, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[11px] text-faint",
							children: s.roll_number
						})]
					}), recent.map((d) => {
						const st = data.map[`${s.id}:${d}`];
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-2 py-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: tone(st),
								children: st ? st[0]?.toUpperCase() : "·"
							})
						}, d);
					})]
				}, s.id)) })]
			})
		}),
		teach ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 rounded-xl border border-line bg-surface p-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex flex-wrap items-center gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-medium",
						children: "Mark register"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "date",
						className: "w-44",
						value: date,
						onChange: (e) => setDate(e.target.value)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "outline",
						onClick: () => {
							const all = {};
							for (const s of data?.students ?? []) all[s.id] = "present";
							setMarks(all);
						},
						children: "Mark all present"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => mut.mutate(),
						disabled: mut.isPending,
						children: "Save day"
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-2",
				children: data?.students.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-2 rounded-md border border-line px-3 py-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm",
						children: s.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-1",
						children: STATUSES.map((st) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setMarks((m) => ({
								...m,
								[s.id]: st
							})),
							className: cn("h-9 rounded-md px-2 text-xs capitalize", (marks[s.id] ?? "present") === st ? "bg-navy text-white" : "bg-paper text-muted"),
							children: st
						}, st))
					})]
				}, s.id))
			})]
		}) : null
	] })] });
}
//#endregion
export { AttendancePage as component };

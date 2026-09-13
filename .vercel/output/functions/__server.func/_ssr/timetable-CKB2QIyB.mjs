import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { t as WEEKDAYS } from "./format-TM2oG14R.mjs";
import { n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as queryClient, s as Skeleton } from "./router-CAe6ag9G.mjs";
import { n as Field, r as PageHeader } from "./page-CZIwOlta.mjs";
import { t as Button } from "./button-OJh_VqBS.mjs";
import { t as Input } from "./input-Bwpmjhr-.mjs";
import { n as canAdmin } from "./types-CmLQZMpi.mjs";
import { n as getMyProfile } from "./profile-PD3MNGy4.mjs";
import { r as listLookups } from "./records-g3YmYo9V.mjs";
import { i as DialogTitle, n as DialogContent, r as DialogHeader, t as Dialog } from "./dialog-fryiFcUo.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-BhKvy1JJ.mjs";
import { f as saveTimetableSlot, n as getTimetable } from "./academic-BlRUvdp3.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/timetable-CKB2QIyB.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var PERIODS = [
	1,
	2,
	3,
	4,
	5,
	6
];
function TimetablePage() {
	const [sectionId, setSectionId] = (0, import_react.useState)(void 0);
	const me = useQuery({
		queryKey: ["me"],
		queryFn: () => getMyProfile()
	});
	const q = useQuery({
		queryKey: ["timetable", sectionId],
		queryFn: () => getTimetable({ data: sectionId ? { sectionId } : void 0 })
	});
	const lookups = useQuery({
		queryKey: ["lookups"],
		queryFn: () => listLookups()
	});
	const [open, setOpen] = (0, import_react.useState)(false);
	const admin = canAdmin(me.data?.role ?? "student") || me.data?.role === "class_incharge";
	const data = q.data;
	const slots = data?.slots ?? [];
	const grid = {};
	for (const s of slots) grid[`${s.day_of_week}:${s.period}`] = s;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Weekly timetable",
			subtitle: "Periods run 08:00–12:45 with a 15-minute break after period 3.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
				value: String(data?.sectionId ?? ""),
				onValueChange: (v) => setSectionId(Number(v)),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
					className: "w-56",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Section" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: data?.sections.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
					value: String(s.id),
					children: s.label
				}, s.id)) })]
			}), admin ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: () => setOpen(true),
				children: "Add slot"
			}) : null] })
		}),
		q.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-80" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-x-auto rounded-xl border border-line bg-surface shadow-[var(--shadow-card)]",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full min-w-[800px] text-left text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "bg-paper text-xs tracking-wide text-muted uppercase",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-3 py-2 font-medium",
						children: "Period"
					}), WEEKDAYS.slice(0, 5).map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-3 py-2 font-medium",
						children: d
					}, d))] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: PERIODS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-t border-line",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-3 py-3 text-xs text-muted",
						children: p
					}), WEEKDAYS.slice(0, 5).map((_, i) => {
						const slot = grid[`${i + 1}:${p}`];
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-3 align-top",
							children: slot ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-medium",
									children: slot.subject_name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs text-muted",
									children: [
										slot.starts_at,
										"–",
										slot.ends_at,
										" · ",
										slot.room
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-faint",
									children: slot.teacher_name
								})
							] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-faint",
								children: "—"
							})
						}, i);
					})]
				}, p)) })]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open,
			onOpenChange: setOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Timetable slot" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlotForm, {
				lookups: lookups.data,
				sectionId: data?.sectionId ?? 5,
				onDone: () => {
					setOpen(false);
					queryClient.invalidateQueries({ queryKey: ["timetable"] });
				}
			})] })
		})
	] });
}
function SlotForm({ lookups, sectionId, onDone }) {
	const [subjectId, setSubjectId] = (0, import_react.useState)("1");
	const [day, setDay] = (0, import_react.useState)("1");
	const [period, setPeriod] = (0, import_react.useState)("1");
	const [starts, setStarts] = (0, import_react.useState)("08:00");
	const [ends, setEnds] = (0, import_react.useState)("08:45");
	const [room, setRoom] = (0, import_react.useState)("R-11A");
	const mut = useMutation({
		mutationFn: () => saveTimetableSlot({ data: {
			sectionId,
			subjectId: Number(subjectId),
			dayOfWeek: Number(day),
			period: Number(period),
			startsAt: starts,
			endsAt: ends,
			room
		} }),
		onSuccess: () => {
			toast.success("Slot added");
			onDone();
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "grid gap-3",
		onSubmit: (e) => {
			e.preventDefault();
			mut.mutate();
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Subject",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: subjectId,
					onValueChange: setSubjectId,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: lookups?.subjects.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
						value: String(s.id),
						children: s.name
					}, s.id)) })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Day (1=Mon)",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: day,
						onChange: (e) => setDay(e.target.value)
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Period",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: period,
						onChange: (e) => setPeriod(e.target.value)
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Starts",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: starts,
						onChange: (e) => setStarts(e.target.value)
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Ends",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: ends,
						onChange: (e) => setEnds(e.target.value)
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Room",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: room,
					onChange: (e) => setRoom(e.target.value)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "submit",
				children: "Save"
			})
		]
	});
}
//#endregion
export { TimetablePage as component };

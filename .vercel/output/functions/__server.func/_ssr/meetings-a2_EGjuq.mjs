import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { r as formatDateTime, s as platformLabel } from "./format-TM2oG14R.mjs";
import { n as Video } from "../_libs/lucide-react.mjs";
import { n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as queryClient, s as Skeleton } from "./router-CAe6ag9G.mjs";
import { n as Field, r as PageHeader } from "./page-CZIwOlta.mjs";
import { t as Badge } from "./badge-y-r0oP60.mjs";
import { t as Button } from "./button-OJh_VqBS.mjs";
import { t as Input } from "./input-Bwpmjhr-.mjs";
import { c as listMeetings, f as saveMeeting } from "./learning-BdgXquKe.mjs";
import { i as canTeach } from "./types-CmLQZMpi.mjs";
import { n as getMyProfile } from "./profile-PD3MNGy4.mjs";
import { r as listLookups } from "./records-g3YmYo9V.mjs";
import { i as DialogTitle, n as DialogContent, r as DialogHeader, t as Dialog } from "./dialog-fryiFcUo.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-BhKvy1JJ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/meetings-a2_EGjuq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function MeetingsPage() {
	const q = useQuery({
		queryKey: ["meetings"],
		queryFn: () => listMeetings()
	});
	const me = useQuery({
		queryKey: ["me"],
		queryFn: () => getMyProfile()
	});
	const lookups = useQuery({
		queryKey: ["lookups"],
		queryFn: () => listLookups()
	});
	const [open, setOpen] = (0, import_react.useState)(false);
	const teach = canTeach(me.data?.role ?? "student");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Online classes",
			subtitle: "Google Meet, Zoom and Microsoft Teams — join from the timetable.",
			actions: teach ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: () => setOpen(true),
				children: "Schedule"
			}) : null
		}),
		q.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-48" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-3",
			children: q.data?.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-surface p-5 shadow-[var(--shadow-card)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-medium",
					children: m.title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-sm text-muted",
					children: [
						m.subject_name ?? "College",
						" · ",
						formatDateTime(m.starts_at),
						m.teacher_name ? ` · ${m.teacher_name}` : ""
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "outline",
						children: platformLabel(m.platform)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: m.url,
							target: "_blank",
							rel: "noreferrer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, { className: "h-4 w-4" }), " Join"]
						})
					})]
				})]
			}, m.id))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open,
			onOpenChange: setOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Schedule online class" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MeetingForm, {
				lookups: lookups.data,
				onDone: () => {
					setOpen(false);
					queryClient.invalidateQueries({ queryKey: ["meetings"] });
				}
			})] })
		})
	] });
}
function MeetingForm({ lookups, onDone }) {
	const [title, setTitle] = (0, import_react.useState)("");
	const [platform, setPlatform] = (0, import_react.useState)("meet");
	const [url, setUrl] = (0, import_react.useState)("https://meet.google.com/");
	const [startsAt, setStartsAt] = (0, import_react.useState)("2026-09-18T09:30");
	const [subjectId, setSubjectId] = (0, import_react.useState)("1");
	const mut = useMutation({
		mutationFn: () => saveMeeting({ data: {
			title,
			platform,
			url,
			startsAt: new Date(startsAt).toISOString(),
			subjectId: Number(subjectId),
			sectionId: 5
		} }),
		onSuccess: () => {
			toast.success("Class scheduled");
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
				label: "Title",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: title,
					onChange: (e) => setTitle(e.target.value),
					required: true
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Platform",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: platform,
					onValueChange: (v) => setPlatform(v),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "meet",
							children: "Google Meet"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "zoom",
							children: "Zoom"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "teams",
							children: "Microsoft Teams"
						})
					] })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Meeting URL",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: url,
					onChange: (e) => setUrl(e.target.value),
					required: true
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Starts",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					type: "datetime-local",
					value: startsAt,
					onChange: (e) => setStartsAt(e.target.value)
				})
			}),
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
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "submit",
				children: "Schedule"
			})
		]
	});
}
//#endregion
export { MeetingsPage as component };

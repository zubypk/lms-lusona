import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { r as formatDateTime } from "./format-TM2oG14R.mjs";
import { n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as queryClient, s as Skeleton } from "./router-CAe6ag9G.mjs";
import { n as Field, r as PageHeader } from "./page-CZIwOlta.mjs";
import { t as Button } from "./button-OJh_VqBS.mjs";
import { t as Input } from "./input-Bwpmjhr-.mjs";
import { a as saveSettings, i as listAudit, r as getSettings } from "./profile-PD3MNGy4.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-CmVDYOLQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SettingsPage() {
	const settings = useQuery({
		queryKey: ["settings"],
		queryFn: () => getSettings()
	});
	const audit = useQuery({
		queryKey: ["audit"],
		queryFn: () => listAudit()
	});
	const [form, setForm] = (0, import_react.useState)({});
	(0, import_react.useEffect)(() => {
		if (settings.data) setForm(settings.data);
	}, [settings.data]);
	const mut = useMutation({
		mutationFn: () => saveSettings({ data: { entries: Object.entries(form).map(([key, value]) => ({
			key,
			value
		})) } }),
		onSuccess: () => {
			toast.success("Settings saved");
			queryClient.invalidateQueries({ queryKey: ["settings"] });
		},
		onError: (e) => toast.error(e.message)
	});
	if (settings.isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-64" });
	if (settings.error) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-danger",
		children: settings.error.message
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "System settings",
			subtitle: "Institution identity used across notices and gazettes."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "grid max-w-xl gap-3 rounded-xl border border-line bg-surface p-5",
			onSubmit: (e) => {
				e.preventDefault();
				mut.mutate();
			},
			children: [[
				["college_name", "College name"],
				["college_short", "Short name"],
				["city", "City"],
				["motto", "Motto"],
				["address", "Address"],
				["phone", "Phone"],
				["email", "Registrar email"]
			].map(([key, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: form[key] ?? "",
					onChange: (e) => setForm((f) => ({
						...f,
						[key]: e.target.value
					}))
				})
			}, key)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "submit",
				disabled: mut.isPending,
				children: "Save"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mt-8 mb-3 font-display text-lg font-semibold",
			children: "Audit log"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-x-auto rounded-xl border border-line bg-surface",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full text-left text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "bg-paper text-xs text-muted uppercase",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3",
							children: "When"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3",
							children: "Action"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3",
							children: "Entity"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3",
							children: "Detail"
						})
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: audit.data?.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-t border-line",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-2 text-xs",
							children: formatDateTime(a.created_at)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-2",
							children: a.action
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "px-4 py-2 text-xs",
							children: [
								a.entity,
								" ",
								a.entity_id
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-2 text-xs text-muted",
							children: a.detail
						})
					]
				}, a.id)) })]
			})
		})
	] });
}
//#endregion
export { SettingsPage as component };

import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { c as roleLabel } from "./format-TM2oG14R.mjs";
import { n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as queryClient, o as Avatar, s as Skeleton } from "./router-CAe6ag9G.mjs";
import { r as PageHeader } from "./page-CZIwOlta.mjs";
import { t as Badge } from "./badge-y-r0oP60.mjs";
import { t as Button } from "./button-OJh_VqBS.mjs";
import { t as ROLES } from "./types-CmLQZMpi.mjs";
import { n as getMyProfile, o as switchRole } from "./profile-PD3MNGy4.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profile-BnHqyX2s.js
var import_jsx_runtime = require_jsx_runtime();
function ProfilePage() {
	const me = useQuery({
		queryKey: ["me"],
		queryFn: () => getMyProfile()
	});
	const mut = useMutation({
		mutationFn: (role) => switchRole({ data: { role } }),
		onSuccess: async () => {
			await queryClient.invalidateQueries();
			toast.success("Campus role updated");
		},
		onError: (e) => toast.error(e.message)
	});
	if (me.isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-48" });
	const p = me.data;
	if (!p) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "My profile",
			subtitle: "Campus identity linked to your signed-in account."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-xl border border-line bg-surface p-6 shadow-[var(--shadow-card)]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
					name: p.displayName,
					src: p.photoUrl,
					size: 64
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-display text-2xl font-semibold",
						children: p.displayName
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm text-muted",
						children: p.email
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						className: "mt-2",
						children: roleLabel(p.role)
					})
				] })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: "mt-6 grid gap-3 text-sm sm:grid-cols-2",
				children: [
					p.className ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-xs text-muted",
						children: "Class"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", { children: [
						p.className,
						" ",
						p.sectionName
					] })] }) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-xs text-muted",
						children: "Student register"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: p.studentId ? `Linked #${p.studentId}` : "Not linked" })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-xs text-muted",
						children: "Faculty register"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: p.teacherId ? `Linked #${p.teacherId}` : "Not linked" })] })
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mt-8 mb-2 font-display text-lg font-semibold",
			children: "Explore another role"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-4 max-w-xl text-sm text-muted",
			children: "This preview campus lets you switch persona so you can review Admin, Teacher and Student dashboards with the same account. Production deployments would lock the role to the Academic Office assignment."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-wrap gap-2",
			children: ROLES.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: p.role === r.id ? "default" : "outline",
				onClick: () => mut.mutate(r.id),
				disabled: mut.isPending,
				children: r.label
			}, r.id))
		})
	] });
}
//#endregion
export { ProfilePage as component };

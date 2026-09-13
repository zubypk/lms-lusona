import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as useNavigate, y as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as queryClient } from "./router-CAe6ag9G.mjs";
import { t as Button } from "./button-OJh_VqBS.mjs";
import { t as ROLES } from "./types-CmLQZMpi.mjs";
import { n as getMyProfile, t as completeOnboarding } from "./profile-PD3MNGy4.mjs";
import { i as useCurrentUserState, t as Crest } from "./crest-DqZn1M-7.mjs";
import { t as RedirectToSignIn } from "./gates-BK9V45tR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/onboarding-CYxLjUjF.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Onboarding() {
	const { user, isPending } = useCurrentUserState();
	const nav = useNavigate();
	const [role, setRole] = (0, import_react.useState)("student");
	const me = useQuery({
		queryKey: ["me"],
		queryFn: () => getMyProfile(),
		enabled: !!user
	});
	const mut = useMutation({
		mutationFn: () => completeOnboarding({ data: { role } }),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["me"] });
			toast.success("Welcome to AEC College.");
			nav({ to: "/dashboard" });
		},
		onError: (e) => toast.error(e.message)
	});
	if (isPending || me.isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-dvh place-items-center bg-paper text-sm text-muted",
		children: "Preparing campus…"
	});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	if (me.data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/dashboard" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-dvh bg-paper px-5 py-10",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-3xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crest, { className: "h-10 w-10" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-display text-lg font-semibold text-navy",
						children: "AEC College"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm text-muted",
						children: "Choose how you will use the campus system"
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-8 font-display text-3xl font-semibold text-ink",
					children: "Select a campus role"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 max-w-2xl text-sm text-muted",
					children: "The Grade 11 Pre-Engineering cohort is already loaded. Students and teachers are linked to an existing register so you can see real attendance, assignments and results immediately."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8 grid gap-3 sm:grid-cols-2",
					children: ROLES.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setRole(r.id),
						className: cn("rounded-xl border bg-surface p-5 text-left shadow-[var(--shadow-card)] transition-colors", role === r.id ? "border-primary ring-2 ring-accent/30" : "border-line hover:border-line-strong"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-medium text-ink",
							children: r.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted",
							children: r.blurb
						})]
					}, r.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "mt-8",
					size: "lg",
					disabled: mut.isPending,
					onClick: () => mut.mutate(),
					children: mut.isPending ? "Opening campus…" : "Continue"
				})
			]
		})
	});
}
//#endregion
export { Onboarding as component };

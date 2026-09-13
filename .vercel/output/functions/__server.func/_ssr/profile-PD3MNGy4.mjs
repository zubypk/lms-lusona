import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-DJ7VXPDc.mjs";
import { cn as _enum, gn as object, un as array, yn as string } from "../_libs/@better-auth/core+[...].mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profile-PD3MNGy4.js
var RoleSchema = _enum([
	"super_admin",
	"academic_admin",
	"class_incharge",
	"teacher",
	"student"
]);
var getMyProfile = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("dc2d96209353308d99a65824fe7fe6d467f6aa64721f16fc047e6bab29dbb821"));
var completeOnboarding = createServerFn({ method: "POST" }).validator(object({ role: RoleSchema })).middleware([authMiddleware]).handler(createSsrRpc("27828f3bbcb03233f816e55225cfba85ddb5e75414d00417ea8fde22c705ee6c"));
var switchRole = createServerFn({ method: "POST" }).validator(object({ role: RoleSchema })).middleware([authMiddleware]).handler(createSsrRpc("61732e29c10f8b348cd574d2bbeb0624e504ed8fe0e81b68ee5f54c274f30855"));
var getSettings = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("9fe84f18dcf7ee2ec391f7d99cfe8799d23ab4e5bbd3bbea1465fe279758e4ab"));
var saveSettings = createServerFn({ method: "POST" }).validator(object({ entries: array(object({
	key: string(),
	value: string()
})) })).middleware([authMiddleware]).handler(createSsrRpc("814ee82be443906e7d0a137e4dde04a0b28519c1605c6e2e7f5c0203914088ea"));
var listAudit = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("9118a79f1a8e44c5f28cbccf2a4dc16fd8e1879c958c973f77a208bc62887e5e"));
//#endregion
export { saveSettings as a, listAudit as i, getMyProfile as n, switchRole as o, getSettings as r, completeOnboarding as t };

import { applySessionToken } from "@/lib/auth/client";
import { enterTestCampus } from "./guest";

export async function openCampusDesk() {
  const result = await enterTestCampus();
  applySessionToken(result.token);
  window.location.assign("/dashboard");
}

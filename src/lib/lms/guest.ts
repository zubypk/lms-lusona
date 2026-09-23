import { createServerFn } from "@tanstack/react-start";
import { MAIL_DOMAIN } from "@/lib/build";
import { getSql } from "@/lib/db";
import { provisionEmailLogin, rotateEmailPassword } from "./accounts";

const DESK_EMAIL = `campus.desk@${MAIL_DOMAIN}`;
const DESK_PASSWORD = "CampusDesk#2026";

function pickToken(value: unknown): string | null {
  if (!value || typeof value !== "object") return null;
  const row = value as Record<string, unknown>;
  if (typeof row.token === "string" && row.token) return row.token;
  const data = row.data;
  if (data && typeof data === "object") {
    const inner = data as Record<string, unknown>;
    if (typeof inner.token === "string" && inner.token) return inner.token;
  }
  return null;
}

/** Open the test-campus desk (super admin) so Enter LMS can skip the login wall. */
export const enterTestCampus = createServerFn({ method: "POST" }).handler(async () => {
  const sql = await getSql();
  const rows = await sql<{ id: string }>`
    select id from "user" where lower(email) = ${DESK_EMAIL} limit 1
  `;
  let userId = rows[0]?.id;
  if (!userId) {
    userId = await provisionEmailLogin(sql, {
      name: "Campus desk",
      email: DESK_EMAIL,
      password: DESK_PASSWORD,
    });
  } else {
    await rotateEmailPassword(sql, userId, DESK_PASSWORD);
  }

  await sql`
    insert into profiles (user_id, role, display_name, email, updated_at)
    values (${userId}, 'super_admin', 'Campus desk', ${DESK_EMAIL}, now())
    on conflict (user_id) do update set
      role = 'super_admin',
      display_name = excluded.display_name,
      email = excluded.email,
      updated_at = now()
  `;

  const { auth } = await import("@/lib/auth/server");
  const signed = await auth.api.signInEmail({
    body: { email: DESK_EMAIL, password: DESK_PASSWORD, rememberMe: true },
  });
  const token = pickToken(signed);
  if (!token) throw new Error("Could not open the campus desk.");
  return { token, email: DESK_EMAIL };
});

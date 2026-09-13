import { hashPassword } from "better-auth/crypto";
import { MAIL_DOMAIN } from "@/lib/build";
import type { Sql } from "@/lib/db";

export function makeStudentUsername(name: string, roll: string, seq: number) {
  const base = name.toLowerCase().replace(/[^a-z]/g, "").slice(0, 8) || "student";
  const tail = roll.toLowerCase().replace(/[^a-z0-9]/g, "").slice(-4) || String(seq);
  return `${base}${tail}`;
}

export function makeStudentEmail(username: string) {
  return `${username}@${MAIL_DOMAIN}`;
}

export function makeStudentPassword() {
  const n = Math.floor(100000 + Math.random() * 900000);
  return `Lms#${n}`;
}

export async function provisionEmailLogin(
  sql: Sql,
  opts: { name: string; email: string; password: string },
) {
  const existing = await sql<{ id: string }>`
    select id from "user" where lower(email) = ${opts.email.toLowerCase()} limit 1
  `;
  if (existing[0]) {
    throw new Error("A campus login already exists for this email. Reset the password instead.");
  }
  const userId = crypto.randomUUID();
  const accountId = crypto.randomUUID();
  const hashed = await hashPassword(opts.password);
  await sql`
    insert into "user" ("id", "name", "email", "emailVerified", "createdAt", "updatedAt")
    values (${userId}, ${opts.name}, ${opts.email.toLowerCase()}, true, now(), now())
  `;
  await sql`
    insert into "account" (
      "id", "accountId", "providerId", "userId", "password", "createdAt", "updatedAt"
    ) values (
      ${accountId}, ${userId}, 'credential', ${userId}, ${hashed}, now(), now()
    )
  `;
  return userId;
}

export async function rotateEmailPassword(sql: Sql, userId: string, password: string) {
  const hashed = await hashPassword(password);
  const updated = await sql<{ id: string }>`
    update "account"
    set "password" = ${hashed}, "updatedAt" = now()
    where "userId" = ${userId} and "providerId" = 'credential'
    returning "id"
  `;
  if (updated[0]) return;
  await sql`
    insert into "account" (
      "id", "accountId", "providerId", "userId", "password", "createdAt", "updatedAt"
    ) values (
      ${crypto.randomUUID()}, ${userId}, 'credential', ${userId}, ${hashed}, now(), now()
    )
  `;
}

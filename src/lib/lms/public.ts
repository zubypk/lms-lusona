import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { BUILD, CAMPUS_DOMAIN, MAIL_DOMAIN } from "@/lib/build";

export type PublicCampus = {
  college_name: string;
  college_short: string;
  city: string;
  motto: string;
  address: string;
  phone: string;
  email: string;
  domain: string;
  email_domain: string;
  marquee: string;
  release_message: string;
  current_session: string;
  build_number: string;
  build_title: string;
  build_message: string;
};

const DEFAULTS: PublicCampus = {
  college_name: "LMS",
  college_short: "LMS",
  city: "Campus",
  motto: "One campus. One register.",
  address: "Learning Management System",
  phone: "",
  email: "registrar@lms.edu.pk",
  domain: CAMPUS_DOMAIN,
  email_domain: MAIL_DOMAIN,
  marquee:
    "Welcome to LMS · Class teachers enrol with Name, Father name and Roll no · Student login issued automatically · Subject teachers see only their classes · Session 2025–26",
  release_message: "",
  current_session: "2025-26",
  build_number: BUILD.number,
  build_title: BUILD.title,
  build_message: BUILD.message,
};

export const getPublicCampus = createServerFn({ method: "GET" }).handler(async (): Promise<PublicCampus> => {
  const sql = await getSql();
  const rows = await sql<{ key: string; value: string }>`select key, value from settings`;
  const map: Record<string, string> = {};
  for (const r of rows) map[r.key] = r.value;
  return {
    college_name: map.college_name || DEFAULTS.college_name,
    college_short: map.college_short || DEFAULTS.college_short,
    city: map.city || DEFAULTS.city,
    motto: map.motto || DEFAULTS.motto,
    address: map.address || DEFAULTS.address,
    phone: map.phone || DEFAULTS.phone,
    email: map.email || DEFAULTS.email,
    domain: map.domain || DEFAULTS.domain,
    email_domain: map.email_domain || DEFAULTS.email_domain,
    marquee: map.marquee || DEFAULTS.marquee,
    release_message: map.release_message || DEFAULTS.release_message,
    current_session: map.current_session || DEFAULTS.current_session,
    build_number: BUILD.number,
    build_title: BUILD.title,
    build_message: map.release_message || BUILD.message,
  };
});

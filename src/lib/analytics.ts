import { supabase } from "@/integrations/supabase/client";
import { LANGUAGES } from "./dashboard-language";

const OPT_OUT = "autismcare-analytics-optout";
const LOCAL = "autismcare-analytics-local";

export type EventType = "visit" | "chat_started" | "clear_chat";
export type LangCode = "en" | "xh" | "zu" | "af";

export const langCode = (language: string): LangCode =>
  (LANGUAGES.find((l) => l.value === language)?.code ?? "en") as LangCode;

export function isOptedOut() {
  try { return localStorage.getItem(OPT_OUT) === "1"; } catch { return false; }
}
export function setOptOut(v: boolean) {
  try { v ? localStorage.setItem(OPT_OUT, "1") : localStorage.removeItem(OPT_OUT); } catch {}
}

/** Anonymous event: only type, language code and time. No personal data. */
export async function track(event_type: EventType, language: string) {
  if (typeof window === "undefined" || isOptedOut()) return;
  const lang = langCode(language);
  try {
    const counts = JSON.parse(localStorage.getItem(LOCAL) || "{}");
    counts[event_type] = (counts[event_type] || 0) + 1;
    localStorage.setItem(LOCAL, JSON.stringify(counts));
  } catch {}
  await supabase.from("analytics").insert({ event_type, language: lang }).then(() => {}, () => {});
}

const EMAIL = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i;
const PHONE = /(\+?\d[\s-]?){9,}/;
export const containsPII = (t: string) => EMAIL.test(t) || PHONE.test(t);

"use server";

import { createClient } from "@/lib/supabase/server";

export type SignupResult = { ok: boolean; message: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Public newsletter signup. Stores consent + timestamp (CAN-SPAM/TCPA). */
export async function signup(_prev: SignupResult | null, formData: FormData): Promise<SignupResult> {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const name = String(formData.get("name") || "").trim();
  const consent = formData.get("consent") === "on";

  if (!EMAIL_RE.test(email)) {
    return { ok: false, message: "Please enter a valid email address." };
  }
  if (!consent) {
    return { ok: false, message: "Please check the box so we know it's okay to email you." };
  }

  const supabase = createClient();
  const { error } = await supabase.from("contacts").insert({
    email,
    name: name || null,
    source: "website",
    consent: true,
    consent_at: new Date().toISOString(),
  });

  if (error) {
    // Unique-violation (already signed up) is a friendly success, not an error.
    if (error.code === "23505") {
      return { ok: true, message: "You're already on the list — thanks!" };
    }
    return { ok: false, message: "Something went wrong. Please try again." };
  }

  return { ok: true, message: "You're in! Watch your inbox for tips from Jeff." };
}

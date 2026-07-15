"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function requireUser() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  return supabase;
}

/** Save edited content blocks. */
export async function saveContent(updates: { key: string; value: string }[]) {
  const supabase = await requireUser();
  for (const u of updates) {
    const { error } = await supabase
      .from("content_blocks")
      .update({ value: u.value })
      .eq("key", u.key);
    if (error) return { ok: false, message: error.message };
  }
  revalidatePath("/");
  return { ok: true, message: "Saved" };
}

export async function signOutAction() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export type EventInput = {
  id?: string;
  title: string;
  description: string;
  start_date: string;
  start_time: string;
  end_time: string;
  price: string;
  location: string;
  recurrence: "none" | "weekly" | "monthly-last";
  recurrence_dow: number | null;
  is_published: boolean;
};

export async function saveEvent(input: EventInput) {
  const supabase = await requireUser();
  const row = {
    title: input.title,
    description: input.description || null,
    start_date: input.start_date,
    start_time: input.start_time || null,
    end_time: input.end_time || null,
    price: input.price || null,
    location: input.location || null,
    recurrence: input.recurrence,
    recurrence_dow: input.recurrence === "none" ? null : input.recurrence_dow,
    is_published: input.is_published,
  };

  if (input.id) {
    const { error } = await supabase.from("events").update(row).eq("id", input.id);
    if (error) return { ok: false, message: error.message };
  } else {
    const { error } = await supabase.from("events").insert(row);
    if (error) return { ok: false, message: error.message };
  }
  revalidatePath("/");
  revalidatePath("/admin/events");
  return { ok: true, message: "Saved" };
}

export async function deleteEvent(id: string) {
  const supabase = await requireUser();
  const { error } = await supabase.from("events").delete().eq("id", id);
  if (error) return { ok: false, message: error.message };
  revalidatePath("/");
  revalidatePath("/admin/events");
  return { ok: true, message: "Deleted" };
}

export async function deleteContact(id: string) {
  const supabase = await requireUser();
  const { error } = await supabase.from("contacts").delete().eq("id", id);
  if (error) return { ok: false, message: error.message };
  revalidatePath("/admin/contacts");
  return { ok: true, message: "Deleted" };
}

export async function setUnsubscribed(id: string, unsubscribed: boolean) {
  const supabase = await requireUser();
  const { error } = await supabase.from("contacts").update({ unsubscribed }).eq("id", id);
  if (error) return { ok: false, message: error.message };
  revalidatePath("/admin/contacts");
  return { ok: true, message: "Updated" };
}

// ---------------------------------------------------------------------------
// Social & email posts (the posting engine)
// ---------------------------------------------------------------------------

export type PostInput = {
  id?: string;
  body: string;
  media_url: string;
  channels: string[];
  email_subject: string;
  scheduled_at: string; // ISO timestamp
};

export async function savePost(input: PostInput) {
  const supabase = await requireUser();
  if (!input.body.trim()) return { ok: false, message: "Write a message first." };
  if (input.channels.length === 0) return { ok: false, message: "Pick at least one place to send it." };
  if (input.channels.includes("instagram") && !input.media_url) {
    return { ok: false, message: "Instagram posts need a photo." };
  }

  const row = {
    body: input.body.trim(),
    media_url: input.media_url || null,
    channels: input.channels,
    email_subject: input.email_subject.trim() || null,
    scheduled_at: input.scheduled_at,
    status: "scheduled",
  };

  if (input.id) {
    // Only posts that haven't gone out yet can be edited.
    const { error } = await supabase
      .from("posts")
      .update(row)
      .eq("id", input.id)
      .in("status", ["scheduled", "failed", "canceled"]);
    if (error) return { ok: false, message: error.message };
  } else {
    const { error } = await supabase.from("posts").insert(row);
    if (error) return { ok: false, message: error.message };
  }
  revalidatePath("/admin/posts");
  return { ok: true, message: "Saved" };
}

export async function cancelPost(id: string) {
  const supabase = await requireUser();
  const { error } = await supabase
    .from("posts")
    .update({ status: "canceled" })
    .eq("id", id)
    .eq("status", "scheduled");
  if (error) return { ok: false, message: error.message };
  revalidatePath("/admin/posts");
  return { ok: true, message: "Canceled" };
}

export async function deletePost(id: string) {
  const supabase = await requireUser();
  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) return { ok: false, message: error.message };
  revalidatePath("/admin/posts");
  return { ok: true, message: "Deleted" };
}

/** Put a failed/canceled post back in the queue (only unsent channels re-send). */
export async function requeuePost(id: string) {
  const supabase = await requireUser();
  const { error } = await supabase
    .from("posts")
    .update({ status: "scheduled", scheduled_at: new Date().toISOString() })
    .eq("id", id)
    .in("status", ["failed", "canceled"]);
  if (error) return { ok: false, message: error.message };
  revalidatePath("/admin/posts");
  return { ok: true, message: "Back in the queue" };
}

/**
 * Send everything that's due right now, instead of waiting for the
 * 5-minute clock. Requires a signed-in admin; uses the service role
 * because the dispatcher also reads the email list.
 */
export async function sendDueNow() {
  await requireUser();
  const { createServiceClient } = await import("@/lib/supabase/admin");
  const { runDispatch } = await import("@/lib/dispatch");
  const service = createServiceClient();
  if (!service) {
    return {
      ok: false,
      message: "Sending isn't fully set up yet (SUPABASE_SERVICE_ROLE_KEY is missing in Vercel).",
    };
  }
  try {
    const summary = await runDispatch(service);
    revalidatePath("/admin/posts");
    return {
      ok: true,
      message: summary.dispatched
        ? `Sent ${summary.dispatched} post${summary.dispatched === 1 ? "" : "s"}.`
        : "Nothing was due to send.",
    };
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : "Sending failed." };
  }
}

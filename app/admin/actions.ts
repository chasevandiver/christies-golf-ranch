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

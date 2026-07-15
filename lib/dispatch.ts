import type { SupabaseClient } from "@supabase/supabase-js";
import { postToFacebook, postToInstagram, type ChannelResult } from "@/lib/social";
import { sendCampaign, type Recipient } from "@/lib/email";

export type PostRow = {
  id: string;
  body: string;
  media_url: string | null;
  channels: string[];
  email_subject: string | null;
  result_log: Record<string, { ok: boolean; detail: string; at: string }>;
};

/**
 * Claim and send every due post. Idempotent: posts are atomically claimed
 * (scheduled → sending) so overlapping runs can't double-send, and each
 * channel's outcome is recorded in result_log so a retry only re-sends
 * channels that haven't succeeded yet.
 */
export async function runDispatch(supabase: SupabaseClient) {
  const { data: due, error } = await supabase
    .from("posts")
    .update({ status: "sending" })
    .eq("status", "scheduled")
    .lte("scheduled_at", new Date().toISOString())
    .select("id,body,media_url,channels,email_subject,result_log");
  if (error) throw new Error(error.message);

  const results: { id: string; status: string }[] = [];
  for (const post of (due ?? []) as PostRow[]) {
    results.push(await dispatchPost(supabase, post));
  }
  return { dispatched: results.length, results };
}

async function dispatchPost(supabase: SupabaseClient, post: PostRow) {
  const log: PostRow["result_log"] = { ...(post.result_log ?? {}) };

  for (const channel of post.channels) {
    if (log[channel]?.ok) continue; // already went out on a previous attempt

    let result: ChannelResult;
    if (channel === "facebook") {
      result = await postToFacebook(post.body, post.media_url);
    } else if (channel === "instagram") {
      result = await postToInstagram(post.body, post.media_url);
    } else if (channel === "email") {
      result = await dispatchEmail(supabase, post);
    } else {
      result = { ok: false, detail: `Unknown channel "${channel}"` };
    }
    log[channel] = { ...result, at: new Date().toISOString() };
  }

  const allOk = post.channels.every((ch) => log[ch]?.ok);
  const status = allOk ? "sent" : "failed";
  await supabase.from("posts").update({ status, result_log: log }).eq("id", post.id);
  return { id: post.id, status };
}

async function dispatchEmail(supabase: SupabaseClient, post: PostRow): Promise<ChannelResult> {
  const { data: contacts, error } = await supabase
    .from("contacts")
    .select("id,email,name,unsubscribe_token")
    .eq("consent", true)
    .eq("unsubscribed", false);
  if (error) return { ok: false, detail: `Couldn't load the email list: ${error.message}` };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://christiesgolfranch.com";
  return sendCampaign({
    subject: post.email_subject || "News from Christie's Golf Ranch",
    body: post.body,
    mediaUrl: post.media_url,
    recipients: (contacts ?? []) as Recipient[],
    siteUrl,
  });
}

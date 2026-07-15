/**
 * Facebook Page + Instagram Business posting via the Meta Graph API.
 *
 * Requires (Vercel env vars):
 *   META_PAGE_ID            — the Facebook Page ID
 *   META_PAGE_ACCESS_TOKEN  — long-lived Page access token
 *   META_IG_USER_ID         — the Instagram Business account ID linked to the Page
 *
 * Until these are set (BUILDSTATUS: blocked on Meta app + app review), sends
 * fail with a clear "not configured" message rather than crashing.
 */

const GRAPH = "https://graph.facebook.com/v21.0";

export type ChannelResult = { ok: boolean; detail: string };

async function graphPost(path: string, params: Record<string, string>): Promise<Record<string, unknown>> {
  const res = await fetch(`${GRAPH}/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(params).toString(),
  });
  const json = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  if (!res.ok) {
    const err = json?.error as { message?: string } | undefined;
    throw new Error(err?.message || `Graph API error (HTTP ${res.status})`);
  }
  return json;
}

export async function postToFacebook(body: string, mediaUrl?: string | null): Promise<ChannelResult> {
  const pageId = process.env.META_PAGE_ID;
  const token = process.env.META_PAGE_ACCESS_TOKEN;
  if (!pageId || !token) {
    return { ok: false, detail: "Facebook isn't connected yet (waiting on Meta app credentials)." };
  }
  try {
    const result = mediaUrl
      ? await graphPost(`${pageId}/photos`, { url: mediaUrl, message: body, access_token: token })
      : await graphPost(`${pageId}/feed`, { message: body, access_token: token });
    return { ok: true, detail: `Posted to Facebook (id ${result.id ?? result.post_id ?? "?"})` };
  } catch (e) {
    return { ok: false, detail: e instanceof Error ? e.message : "Facebook post failed." };
  }
}

export async function postToInstagram(body: string, mediaUrl?: string | null): Promise<ChannelResult> {
  const igId = process.env.META_IG_USER_ID;
  const token = process.env.META_PAGE_ACCESS_TOKEN;
  if (!igId || !token) {
    return { ok: false, detail: "Instagram isn't connected yet (waiting on Meta app credentials)." };
  }
  if (!mediaUrl) {
    return { ok: false, detail: "Instagram posts need a photo — add one and try again." };
  }
  try {
    // Two-step publish: create a media container, then publish it.
    const container = await graphPost(`${igId}/media`, {
      image_url: mediaUrl,
      caption: body,
      access_token: token,
    });
    const published = await graphPost(`${igId}/media_publish`, {
      creation_id: String(container.id),
      access_token: token,
    });
    return { ok: true, detail: `Posted to Instagram (id ${published.id ?? "?"})` };
  } catch (e) {
    return { ok: false, detail: e instanceof Error ? e.message : "Instagram post failed." };
  }
}

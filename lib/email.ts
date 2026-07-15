import type { ChannelResult } from "./social";

/**
 * Campaign email via Resend to the consented contact list.
 *
 * Requires (Vercel env vars):
 *   RESEND_API_KEY — from resend.com
 *   RESEND_FROM    — verified sender, e.g. "Christie's Golf Ranch <hello@christiesgolfranch.com>"
 *
 * CAN-SPAM: every send includes the ranch's physical address and a working
 * per-contact unsubscribe link. Only contacts with consent=true and
 * unsubscribed=false are ever emailed (the dispatcher enforces this).
 */

export type Recipient = { id: string; email: string; name: string | null; unsubscribe_token: string };

const BRAND = "#3A5A40";
const BRAND_DEEP = "#2A4430";
const BASE = "#F6F2E8";
const INK = "#23281F";
const INK_SOFT = "#5A6152";
const LINE = "#DED6C4";

export function renderCampaignHtml(opts: {
  body: string;
  mediaUrl?: string | null;
  unsubscribeUrl: string;
}): string {
  const paragraphs = opts.body
    .split(/\n{2,}/)
    .map((p) => `<p style="margin:0 0 16px;line-height:1.6;">${escapeHtml(p).replace(/\n/g, "<br>")}</p>`)
    .join("");
  const media = opts.mediaUrl
    ? `<img src="${escapeAttr(opts.mediaUrl)}" alt="" width="560" style="width:100%;max-width:560px;border-radius:6px;margin:0 0 20px;display:block;">`
    : "";
  return `<!doctype html>
<html><body style="margin:0;padding:0;background:${BASE};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BASE};padding:24px 12px;">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
  <tr><td style="background:${BRAND_DEEP};border-radius:8px 8px 0 0;padding:20px 28px;">
    <span style="font-family:Georgia,serif;font-size:20px;font-weight:bold;color:#F6F2E8;">Christie's Golf Ranch</span><br>
    <span style="font-family:Arial,sans-serif;font-size:10px;letter-spacing:2px;color:#DCAE58;">PILOT POINT &middot; TEXAS</span>
  </td></tr>
  <tr><td style="background:#FCFAF4;padding:28px;font-family:Arial,sans-serif;font-size:16px;color:${INK};">
    ${media}
    ${paragraphs}
    <p style="margin:24px 0 0;font-family:Georgia,serif;font-style:italic;color:${BRAND};">— Jeff &amp; the crew at Christie's Golf Ranch</p>
  </td></tr>
  <tr><td style="background:#FCFAF4;border-top:1px solid ${LINE};border-radius:0 0 8px 8px;padding:18px 28px;font-family:Arial,sans-serif;font-size:12px;color:${INK_SOFT};line-height:1.6;">
    Christie's Golf Ranch &middot; 920 US Highway 377, Pilot Point, TX 76258 &middot; (214) 317-1488<br>
    You're getting this because you joined our list at the ranch or on the website.
    <a href="${escapeAttr(opts.unsubscribeUrl)}" style="color:${INK_SOFT};">Unsubscribe</a>
  </td></tr>
</table>
</td></tr>
</table>
</body></html>`;
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function escapeAttr(s: string): string {
  return escapeHtml(s).replace(/"/g, "&quot;");
}

/** Send a campaign to the list in batches via Resend. */
export async function sendCampaign(opts: {
  subject: string;
  body: string;
  mediaUrl?: string | null;
  recipients: Recipient[];
  siteUrl: string;
}): Promise<ChannelResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  if (!apiKey || !from) {
    return { ok: false, detail: "Email isn't connected yet (RESEND_API_KEY / RESEND_FROM not set)." };
  }
  if (opts.recipients.length === 0) {
    return { ok: true, detail: "No subscribed contacts to email yet — nothing sent." };
  }

  let sent = 0;
  const errors: string[] = [];
  // Resend's batch endpoint accepts up to 100 messages per call.
  for (let i = 0; i < opts.recipients.length; i += 100) {
    const batch = opts.recipients.slice(i, i + 100).map((r) => ({
      from,
      to: [r.email],
      reply_to: "christiesgolfranch@gmail.com",
      subject: opts.subject,
      html: renderCampaignHtml({
        body: opts.body,
        mediaUrl: opts.mediaUrl,
        unsubscribeUrl: `${opts.siteUrl}/api/unsubscribe?id=${r.id}&t=${r.unsubscribe_token}`,
      }),
    }));
    try {
      const res = await fetch("https://api.resend.com/emails/batch", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify(batch),
      });
      if (!res.ok) {
        const json = (await res.json().catch(() => ({}))) as { message?: string };
        throw new Error(json.message || `Resend error (HTTP ${res.status})`);
      }
      sent += batch.length;
    } catch (e) {
      errors.push(e instanceof Error ? e.message : "batch failed");
    }
  }

  if (errors.length) {
    return {
      ok: sent > 0,
      detail: `Emailed ${sent} of ${opts.recipients.length} people; some batches failed: ${errors[0]}`,
    };
  }
  return { ok: true, detail: `Emailed ${sent} ${sent === 1 ? "person" : "people"} on the list.` };
}

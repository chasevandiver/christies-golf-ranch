import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

/** One-click unsubscribe target used in every campaign email (CAN-SPAM). */
export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id") ?? "";
  const token = req.nextUrl.searchParams.get("t") ?? "";

  let message = "Something went wrong — please email christiesgolfranch@gmail.com and we'll take you off the list.";
  if (id && token) {
    const supabase = createServiceClient();
    if (supabase) {
      const { data } = await supabase
        .from("contacts")
        .update({ unsubscribed: true })
        .eq("id", id)
        .eq("unsubscribe_token", token)
        .select("id");
      if (data && data.length > 0) {
        message = "You're unsubscribed. You won't get any more emails from us.";
      }
    }
  }

  return new NextResponse(
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Christie's Golf Ranch</title></head>
<body style="margin:0;background:#F6F2E8;font-family:Arial,sans-serif;color:#23281F;display:flex;align-items:center;justify-content:center;min-height:100vh;">
<div style="background:#FCFAF4;border:1px solid #DED6C4;border-radius:10px;padding:40px;max-width:420px;text-align:center;">
<h1 style="font-family:Georgia,serif;color:#2A4430;font-size:22px;margin:0 0 12px;">Christie's Golf Ranch</h1>
<p style="line-height:1.6;margin:0;">${message}</p>
</div></body></html>`,
    { headers: { "Content-Type": "text/html; charset=utf-8" } }
  );
}

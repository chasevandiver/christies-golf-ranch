import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/admin";
import { runDispatch } from "@/lib/dispatch";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Sends every due post to its channels. Called by Supabase pg_cron every
 * 5 minutes; safe to call manually. Protected by CRON_SECRET
 * (Authorization: Bearer <secret> or x-cron-secret header).
 */
export async function POST(req: NextRequest) {
  return handle(req);
}
export async function GET(req: NextRequest) {
  return handle(req);
}

async function handle(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization") ?? "";
  const headerSecret = req.headers.get("x-cron-secret") ?? "";
  if (!secret || (auth !== `Bearer ${secret}` && headerSecret !== secret)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const supabase = createServiceClient();
  if (!supabase) {
    return NextResponse.json({ error: "SUPABASE_SERVICE_ROLE_KEY not configured" }, { status: 500 });
  }

  try {
    const summary = await runDispatch(supabase);
    return NextResponse.json(summary);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "dispatch failed" },
      { status: 500 }
    );
  }
}

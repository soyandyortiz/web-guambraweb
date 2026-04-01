import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const ua       = req.headers.get("user-agent")  ?? "";
  const referrer = req.headers.get("referer")      ?? "";

  await admin.from("bio_page_visits").insert({ user_agent: ua, referrer });
  return NextResponse.json({ ok: true });
}

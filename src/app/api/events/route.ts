import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentMember } from "@/lib/auth/session";
import { validateEvent } from "@/lib/validation/schemas";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const upcoming = searchParams.get("upcoming");
    const status = searchParams.get("status");

    let query = supabase.from("events").select("*").order("event_date", { ascending: true });

    if (upcoming === "true") {
      const today = new Date().toISOString().split("T")[0];
      query = query.gte("event_date", today);
    }

    if (status === "finalized") {
      query = query.eq("is_finalized", true);
    } else if (status === "open") {
      query = query.eq("is_finalized", false);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const member = await getCurrentMember();
    if (!member) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (member.position_web > 1) {
      return NextResponse.json({ error: "Forbidden: board access required" }, { status: 403 });
    }

    const body = await request.json();
    const validation = validateEvent(body);
    if (!validation.valid) {
      return NextResponse.json({ error: "Validation failed", details: validation.errors }, { status: 400 });
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("events")
      .insert({
        event_name: body.event_name,
        event_date: body.event_date,
        start_time: body.start_time,
        end_time: body.end_time,
        location: body.location,
        description: body.description || null,
        fa_emr_needed: body.fa_emr_needed ?? 0,
        emt_needed: body.emt_needed ?? 0,
        supervisor_needed: body.supervisor_needed ?? 0,
        is_finalized: body.is_finalized ?? false,
        created_by: member.user_id,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

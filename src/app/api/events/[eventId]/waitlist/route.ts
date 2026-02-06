import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentMember } from "@/lib/auth/session";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const member = await getCurrentMember();
    if (!member) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // Board or supervisor only (position_web <= 1 for board, position_club handles supervisor)
    if (member.position_web > 1 && member.position_club < 3) {
      return NextResponse.json({ error: "Forbidden: board or supervisor access required" }, { status: 403 });
    }

    const { eventId } = await params;
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("event_signups")
      .select(`
        *,
        members:user_id (
          user_id,
          first_name,
          last_name,
          iu_email,
          position_club
        )
      `)
      .eq("event_id", eventId)
      .order("signup_time", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const member = await getCurrentMember();
    if (!member) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (member.position_web > 1) {
      return NextResponse.json({ error: "Forbidden: board access required" }, { status: 403 });
    }

    const { eventId } = await params;
    const body = await request.json();
    const { signup_id, ...updates } = body;

    if (!signup_id) {
      return NextResponse.json({ error: "signup_id is required" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("event_signups")
      .update(updates)
      .eq("signup_id", signup_id)
      .eq("event_id", eventId)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

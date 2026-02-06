import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentMember } from "@/lib/auth/session";

export async function POST(
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
    const { signup_id } = body;

    if (!signup_id) {
      return NextResponse.json({ error: "signup_id is required" }, { status: 400 });
    }

    const supabase = await createClient();

    // Verify signup exists for this event
    const { data: signup, error: lookupError } = await supabase
      .from("event_signups")
      .select("*")
      .eq("signup_id", signup_id)
      .eq("event_id", eventId)
      .single();

    if (lookupError || !signup) {
      return NextResponse.json({ error: "Signup not found for this event" }, { status: 404 });
    }

    if (signup.is_assigned) {
      return NextResponse.json({ error: "Member is already assigned" }, { status: 409 });
    }

    const { data, error } = await supabase
      .from("event_signups")
      .update({
        is_assigned: true,
        assigned_by: member.user_id,
        assigned_time: new Date().toISOString(),
      })
      .eq("signup_id", signup_id)
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

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

    const { eventId } = await params;
    const body = await request.json();
    const supabase = await createClient();

    // Check event exists
    const { data: event, error: eventError } = await supabase
      .from("events")
      .select("*")
      .eq("event_id", eventId)
      .single();

    if (eventError || !event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Check not already signed up
    const { data: existing } = await supabase
      .from("event_signups")
      .select("signup_id")
      .eq("event_id", eventId)
      .eq("user_id", member.user_id)
      .single();

    if (existing) {
      return NextResponse.json({ error: "Already signed up for this event" }, { status: 409 });
    }

    const { data, error } = await supabase
      .from("event_signups")
      .insert({
        event_id: eventId,
        user_id: member.user_id,
        position_type: body.position_type || null,
        is_assigned: false,
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

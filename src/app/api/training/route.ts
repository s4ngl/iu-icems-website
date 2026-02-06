import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentMember } from "@/lib/auth/session";
import { validateTrainingSession } from "@/lib/validation/schemas";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("training_sessions")
      .select("*")
      .order("training_date", { ascending: true });

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
    const validation = validateTrainingSession(body);
    if (!validation.valid) {
      return NextResponse.json({ error: "Validation failed", details: validation.errors }, { status: 400 });
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("training_sessions")
      .insert({
        training_name: body.training_name,
        training_date: body.training_date,
        start_time: body.start_time,
        end_time: body.end_time,
        location: body.location,
        description: body.description || null,
        max_participants: body.max_participants ?? null,
        is_aha_training: body.is_aha_training ?? false,
        cpr_cost: body.cpr_cost ?? null,
        fa_cost: body.fa_cost ?? null,
        both_cost: body.both_cost ?? null,
        point_contact: body.point_contact || null,
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

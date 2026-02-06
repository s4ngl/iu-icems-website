import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentMember } from "@/lib/auth/session";
import { validateTrainingSession } from "@/lib/validation/schemas";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ trainingId: string }> }
) {
  try {
    const { trainingId } = await params;
    const supabase = await createClient();

    const { data: training, error } = await supabase
      .from("training_sessions")
      .select("*")
      .eq("training_id", trainingId)
      .single();

    if (error || !training) {
      return NextResponse.json({ error: "Training session not found" }, { status: 404 });
    }

    const { count: signupCount } = await supabase
      .from("training_signups")
      .select("*", { count: "exact", head: true })
      .eq("training_id", trainingId);

    return NextResponse.json({ data: { ...training, signup_count: signupCount ?? 0 } });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ trainingId: string }> }
) {
  try {
    const member = await getCurrentMember();
    if (!member) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (member.position_web > 1) {
      return NextResponse.json({ error: "Forbidden: board access required" }, { status: 403 });
    }

    const { trainingId } = await params;
    const body = await request.json();
    const validation = validateTrainingSession(body);
    if (!validation.valid) {
      return NextResponse.json({ error: "Validation failed", details: validation.errors }, { status: 400 });
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("training_sessions")
      .update({
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
      })
      .eq("training_id", trainingId)
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

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ trainingId: string }> }
) {
  try {
    const member = await getCurrentMember();
    if (!member) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (member.position_web > 1) {
      return NextResponse.json({ error: "Forbidden: board access required" }, { status: 403 });
    }

    const { trainingId } = await params;
    const supabase = await createClient();
    const { error } = await supabase
      .from("training_sessions")
      .delete()
      .eq("training_id", trainingId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Training session deleted" });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

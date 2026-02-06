import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentMember } from "@/lib/auth/session";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ trainingId: string }> }
) {
  try {
    const member = await getCurrentMember();
    if (!member) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { trainingId } = await params;
    const body = await request.json();
    const supabase = await createClient();

    // Check training session exists
    const { data: training, error: trainingError } = await supabase
      .from("training_sessions")
      .select("*")
      .eq("training_id", trainingId)
      .single();

    if (trainingError || !training) {
      return NextResponse.json({ error: "Training session not found" }, { status: 404 });
    }

    // Check capacity
    if (training.max_participants) {
      const { count } = await supabase
        .from("training_signups")
        .select("*", { count: "exact", head: true })
        .eq("training_id", trainingId);

      if (count !== null && count >= training.max_participants) {
        return NextResponse.json({ error: "Training session is full" }, { status: 409 });
      }
    }

    // Check not already signed up
    const { data: existing } = await supabase
      .from("training_signups")
      .select("signup_id")
      .eq("training_id", trainingId)
      .eq("user_id", member.user_id)
      .single();

    if (existing) {
      return NextResponse.json({ error: "Already signed up for this training" }, { status: 409 });
    }

    const { data, error } = await supabase
      .from("training_signups")
      .insert({
        training_id: trainingId,
        user_id: member.user_id,
        signup_type: body.signup_type || null,
        payment_confirmed: false,
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

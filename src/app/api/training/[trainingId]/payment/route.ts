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
    if (member.position_web > 1) {
      return NextResponse.json({ error: "Forbidden: board access required" }, { status: 403 });
    }

    const { trainingId } = await params;
    const body = await request.json();
    const { signup_id } = body;

    if (!signup_id) {
      return NextResponse.json({ error: "signup_id is required" }, { status: 400 });
    }

    const supabase = await createClient();

    // Verify the training is an AHA training
    const { data: training, error: trainingError } = await supabase
      .from("training_sessions")
      .select("is_aha_training")
      .eq("training_id", trainingId)
      .single();

    if (trainingError || !training) {
      return NextResponse.json({ error: "Training session not found" }, { status: 404 });
    }

    if (!training.is_aha_training) {
      return NextResponse.json({ error: "Payment confirmation is only for AHA training sessions" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("training_signups")
      .update({
        payment_confirmed: true,
        confirmed_by: member.user_id,
      })
      .eq("signup_id", signup_id)
      .eq("training_id", trainingId)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: "Signup not found for this training" }, { status: 404 });
    }

    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

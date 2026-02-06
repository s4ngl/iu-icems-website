import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentMember } from "@/lib/auth/session";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ trainingId: string }> }
) {
  try {
    const member = await getCurrentMember();
    if (!member) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (member.position_web === null || member.position_web > 1) {
      return NextResponse.json({ error: "Forbidden: board access required" }, { status: 403 });
    }

    const { trainingId } = await params;
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("training_signups")
      .select(`
        *,
        members:user_id (
          user_id,
          first_name,
          last_name,
          iu_email
        )
      `)
      .eq("training_id", trainingId)
      .order("signup_time", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

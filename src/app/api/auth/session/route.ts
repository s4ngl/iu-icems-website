import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ data: { user: null, member: null } });
    }

    const { data: member } = await supabase
      .from("members")
      .select("*")
      .eq("user_id", user.id)
      .single();

    return NextResponse.json({ data: { user, member } });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

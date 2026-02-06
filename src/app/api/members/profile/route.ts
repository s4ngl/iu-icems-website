import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth/session";
import { validateProfileUpdate } from "@/lib/validation/schemas";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = await createClient();

    const [memberResult, certsResult, penaltyResult, hoursResult] = await Promise.all([
      supabase
        .from("members")
        .select("*")
        .eq("user_id", user.id)
        .single(),
      supabase
        .from("certifications")
        .select("*")
        .eq("user_id", user.id)
        .order("upload_date", { ascending: false }),
      supabase
        .from("penalty_points")
        .select("*")
        .eq("user_id", user.id)
        .eq("is_active", true),
      supabase
        .from("event_hours")
        .select("confirmed_hours")
        .eq("user_id", user.id)
        .eq("is_confirmed", true),
    ]);

    if (memberResult.error || !memberResult.data) {
      return NextResponse.json({ error: "Member profile not found" }, { status: 404 });
    }

    const totalPenaltyPoints = (penaltyResult.data ?? []).reduce(
      (sum, p) => sum + (p.points ?? 0),
      0
    );

    const totalConfirmedHours = (hoursResult.data ?? []).reduce(
      (sum, h) => sum + (h.confirmed_hours ?? 0),
      0
    );

    return NextResponse.json({
      data: {
        ...memberResult.data,
        certifications: certsResult.data ?? [],
        total_confirmed_hours: totalConfirmedHours,
        penalty_points: totalPenaltyPoints,
        active_penalties: penaltyResult.data ?? [],
      },
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validation = validateProfileUpdate(body);
    if (!validation.valid) {
      return NextResponse.json({ error: "Validation failed", details: validation.errors }, { status: 400 });
    }

    const allowedFields = ["first_name", "last_name", "phone_number", "gender", "class_year", "pronouns"];
    const updates: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("members")
      .update(updates)
      .eq("user_id", user.id)
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

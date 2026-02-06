import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");
    const userId = searchParams.get("userId");

    const supabase = await createClient();
    
    let query = supabase
      .from("certifications")
      .select(`
        *,
        member:members!certifications_user_id_fkey (
          user_id,
          first_name,
          last_name,
          iu_email
        )
      `)
      .order("upload_date", { ascending: false });

    if (status === "pending") {
      query = query.eq("is_approved", false);
    } else if (status === "approved") {
      query = query.eq("is_approved", true);
    }

    if (userId) {
      query = query.eq("user_id", userId);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching certifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch certifications" },
      { status: 500 }
    );
  }
}

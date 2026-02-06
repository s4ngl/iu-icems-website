import { createClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";
  const origin = request.headers.get("origin") || new URL(request.url).origin;

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // Check if member profile exists, create one if not (for OAuth users)
      const { data: existingMember } = await supabase
        .from("members")
        .select("user_id")
        .eq("user_id", data.user.id)
        .single();

      if (!existingMember) {
        const metadata = data.user.user_metadata;
        await supabase.from("members").insert({
          user_id: data.user.id,
          first_name: metadata?.full_name?.split(" ")[0] || metadata?.name?.split(" ")[0] || "",
          last_name: metadata?.full_name?.split(" ").slice(1).join(" ") || metadata?.name?.split(" ").slice(1).join(" ") || "",
          iu_email: data.user.email || "",
          phone_number: "",
          gender: 0,
          class_year: 0,
          pronouns: 0,
          position_web: 3,
          account_status: 0,
        });
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Auth error - redirect to login with error
  return NextResponse.redirect(`${origin}/login?error=auth_callback_error`);
}

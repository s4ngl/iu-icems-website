import { createClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";

function parseFullName(fullName?: string): { firstName: string; lastName: string } {
  if (!fullName || fullName.trim().length === 0) {
    return { firstName: "", lastName: "" };
  }
  const parts = fullName.trim().split(/\s+/);
  return {
    firstName: parts[0],
    lastName: parts.length > 1 ? parts.slice(1).join(" ") : "",
  };
}

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
        const { firstName, lastName } = parseFullName(
          metadata?.full_name || metadata?.name
        );
        await supabase.from("members").insert({
          user_id: data.user.id,
          first_name: firstName,
          last_name: lastName,
          iu_email: data.user.email || "",
          phone_number: "",
          gender: 2,
          class_year: 0,
          pronouns: 2,
          position_web: 3,
          account_status: 0,
        });
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Auth error - redirect to login with error
  const errorParam = code ? "code_exchange_failed" : "missing_auth_code";
  return NextResponse.redirect(`${origin}/login?error=${errorParam}`);
}

import { createClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, firstName, lastName, phone, classYear, pronouns } =
      body;

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: "Required fields are missing" },
        { status: 400 }
      );
    }

    if (!email.endsWith("@iu.edu")) {
      return NextResponse.json(
        { error: "Only @iu.edu email addresses are allowed" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    if (authData.user) {
      const { error: memberError } = await supabase.from("members").insert({
        user_id: authData.user.id,
        first_name: firstName,
        last_name: lastName,
        iu_email: email,
        phone_number: phone || "",
        gender: 2,
        class_year: classYear ?? 0,
        pronouns: pronouns ?? 0,
        position_web: 3,
        account_status: 0,
      });

      if (memberError) {
        return NextResponse.json(
          { error: "Account created but profile setup failed. Please contact support." },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      data: { user: authData.user },
      message: "Registration successful. Please check your email to verify your account.",
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

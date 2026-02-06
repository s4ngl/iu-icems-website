import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth/session";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const certType = formData.get("cert_type") as string | null;
    const expirationDate = formData.get("expiration_date") as string | null;

    if (!file) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }
    if (!certType) {
      return NextResponse.json({ error: "Certification type is required" }, { status: 400 });
    }
    if (!expirationDate) {
      return NextResponse.json({ error: "Expiration date is required" }, { status: 400 });
    }

    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "File must be PDF, JPEG, or PNG" }, { status: 400 });
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File size must be less than 10MB" }, { status: 400 });
    }

    const supabase = await createClient();
    const fileExt = file.name.split(".").pop();
    const filePath = `certifications/${user.id}/${certType}-${Date.now()}.${fileExt}`;

    const arrayBuffer = await file.arrayBuffer();
    const { error: uploadError } = await supabase.storage
      .from("certifications")
      .upload(filePath, arrayBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data: cert, error: certError } = await supabase
      .from("certifications")
      .insert({
        user_id: user.id,
        cert_type: certType,
        file_path: filePath,
        expiration_date: expirationDate,
        is_approved: false,
      })
      .select()
      .single();

    if (certError) {
      return NextResponse.json({ error: certError.message }, { status: 500 });
    }

    return NextResponse.json({ data: cert }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

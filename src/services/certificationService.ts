import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database.types";

type Certification = Database["public"]["Tables"]["certifications"]["Row"];

export async function getCertifications(
  userId: string
): Promise<Certification[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("certifications")
    .select("*")
    .eq("user_id", userId)
    .order("upload_date", { ascending: false });

  if (error) return [];
  return data;
}

export async function uploadCertification(
  userId: string,
  certType: number,
  filePath: string
): Promise<{ data: Certification | null; error: string | null }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("certifications")
    .insert({
      user_id: userId,
      cert_type: certType,
      file_path: filePath,
    })
    .select()
    .single();

  if (error) return { data: null, error: error.message };
  return { data, error: null };
}

export async function approveCertification(
  certId: string,
  approvedBy: string,
  expirationDate?: string
): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("certifications")
    .update({
      is_approved: true,
      approved_by: approvedBy,
      approved_date: new Date().toISOString(),
      expiration_date: expirationDate || null,
    })
    .eq("cert_id", certId);

  return { error: error?.message ?? null };
}

export async function deleteCertification(
  certId: string
): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("certifications")
    .delete()
    .eq("cert_id", certId);

  return { error: error?.message ?? null };
}

import type { Database } from "./database.types";

export type Certification =
  Database["public"]["Tables"]["certifications"]["Row"];
export type CertificationInsert =
  Database["public"]["Tables"]["certifications"]["Insert"];
export type CertificationUpdate =
  Database["public"]["Tables"]["certifications"]["Update"];

export const CERT_TYPE_LABELS: Record<number, string> = {
  0: "First Aid",
  1: "BLS/CPR",
  2: "EMT",
  3: "EMR",
  4: "ICS-100",
  5: "ICS-200",
  6: "ICS-700",
  7: "ICS-800",
};
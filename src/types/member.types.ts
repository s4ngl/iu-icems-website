import type { Database } from "./database.types";

export type Member = Database["public"]["Tables"]["members"]["Row"];
export type MemberInsert = Database["public"]["Tables"]["members"]["Insert"];
export type MemberUpdate = Database["public"]["Tables"]["members"]["Update"];
export type EmergencyContact =
  Database["public"]["Tables"]["emergency_contacts"]["Row"];
export type EmergencyContactInsert =
  Database["public"]["Tables"]["emergency_contacts"]["Insert"];

export interface MemberProfile extends Member {
  emergency_contacts?: EmergencyContact[];
}

export const GENDER_LABELS: Record<number, string> = {
  0: "Female",
  1: "Male",
  2: "Other",
};

export const CLASS_YEAR_LABELS: Record<number, string> = {
  0: "Freshman",
  1: "Sophomore",
  2: "Junior",
  3: "Senior",
  4: "Other",
};

export const PRONOUNS_LABELS: Record<number, string> = {
  0: "He/Him",
  1: "She/Her",
  2: "Other",
};

export const POSITION_CLUB_LABELS: Record<number, string> = {
  0: "General Member",
  1: "GM FA/EMR",
  2: "GM EMT",
  3: "Supervisor EMT",
};

export const POSITION_WEB_LABELS: Record<number, string> = {
  0: "Admin",
  1: "Board",
  2: "Supervisor",
  3: "Member",
};

export const ACCOUNT_STATUS_LABELS: Record<number, string> = {
  0: "Pending",
  1: "Active",
  2: "Inactive",
};
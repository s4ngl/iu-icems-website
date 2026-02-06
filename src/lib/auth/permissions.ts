import { ROLES, type RoleValue } from "@/config/roles";
import type { Database } from "@/types/database.types";

type Member = Database["public"]["Tables"]["members"]["Row"];

/**
 * Map the database position_web value to our ROLES values.
 * DB: 0=Admin, 1=Board, 2=Supervisor, 3=Member
 * ROLES: 0=Public, 1=Pending, 2=General, 3=Certified, 4=Supervisor, 5=Board, 6=Admin
 */
export function getMemberRole(member: Member | null): RoleValue {
  if (!member) return ROLES.PUBLIC;

  if (member.account_status === 0) return ROLES.PENDING;

  switch (member.position_web) {
    case 0:
      return ROLES.ADMIN;
    case 1:
      return ROLES.BOARD;
    case 2:
      return ROLES.SUPERVISOR;
    case 3:
    default:
      if (member.dues_paid) {
        return ROLES.GENERAL;
      }
      return ROLES.PENDING;
  }
}

export function hasMinRole(memberRole: RoleValue, requiredRole: RoleValue): boolean {
  return memberRole >= requiredRole;
}

export function canAccessRoute(member: Member | null, requiredRole: RoleValue): boolean {
  const role = getMemberRole(member);
  return hasMinRole(role, requiredRole);
}

export function isBoard(member: Member | null): boolean {
  return canAccessRoute(member, ROLES.BOARD);
}

export function isSupervisor(member: Member | null): boolean {
  return canAccessRoute(member, ROLES.SUPERVISOR);
}

export function isAdmin(member: Member | null): boolean {
  return canAccessRoute(member, ROLES.ADMIN);
}
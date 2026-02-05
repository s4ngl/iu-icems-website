export const ROLES = {
  PUBLIC: 0,
  PENDING: 1,
  GENERAL: 2,
  CERTIFIED: 3,
  SUPERVISOR: 4,
  BOARD: 5,
  ADMIN: 6,
} as const;

export type RoleValue = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_LABELS: Record<RoleValue, string> = {
  [ROLES.PUBLIC]: "Public",
  [ROLES.PENDING]: "Pending Member",
  [ROLES.GENERAL]: "General Member",
  [ROLES.CERTIFIED]: "Certified Member",
  [ROLES.SUPERVISOR]: "Supervisor",
  [ROLES.BOARD]: "Board Member",
  [ROLES.ADMIN]: "Administrator",
};

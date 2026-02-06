// Certification types matching DB enum
export const CERT_TYPES = {
  FA: 0,
  BLS_CPR: 1,
  EMT: 2,
  EMR: 3,
  ICS_100: 4,
  ICS_200: 5,
  ICS_700: 6,
  ICS_800: 7,
} as const;

export const CERT_LABELS: Record<number, string> = {
  [CERT_TYPES.FA]: "First Aid",
  [CERT_TYPES.BLS_CPR]: "BLS/CPR",
  [CERT_TYPES.EMT]: "EMT",
  [CERT_TYPES.EMR]: "EMR",
  [CERT_TYPES.ICS_100]: "ICS-100",
  [CERT_TYPES.ICS_200]: "ICS-200",
  [CERT_TYPES.ICS_700]: "ICS-700",
  [CERT_TYPES.ICS_800]: "ICS-800",
};

// Position types for event signups
export const POSITION_TYPES = {
  SUPERVISOR: 0,
  EMT: 1,
  FA_EMR: 2,
} as const;

export const POSITION_LABELS: Record<number, string> = {
  [POSITION_TYPES.SUPERVISOR]: "Supervisor",
  [POSITION_TYPES.EMT]: "EMT",
  [POSITION_TYPES.FA_EMR]: "FA/EMR",
};

// Gender enum
export const GENDER = {
  FEMALE: 0,
  MALE: 1,
  OTHER: 2,
} as const;

export const GENDER_LABELS: Record<number, string> = {
  [GENDER.FEMALE]: "Female",
  [GENDER.MALE]: "Male",
  [GENDER.OTHER]: "Other",
};

// Class year enum
export const CLASS_YEAR = {
  FRESHMAN: 0,
  SOPHOMORE: 1,
  JUNIOR: 2,
  SENIOR: 3,
  OTHER: 4,
} as const;

export const CLASS_YEAR_LABELS: Record<number, string> = {
  [CLASS_YEAR.FRESHMAN]: "Freshman",
  [CLASS_YEAR.SOPHOMORE]: "Sophomore",
  [CLASS_YEAR.JUNIOR]: "Junior",
  [CLASS_YEAR.SENIOR]: "Senior",
  [CLASS_YEAR.OTHER]: "Other",
};

// Pronouns enum
export const PRONOUNS = {
  HE_HIM: 0,
  SHE_HER: 1,
  OTHER: 2,
} as const;

export const PRONOUNS_LABELS: Record<number, string> = {
  [PRONOUNS.HE_HIM]: "He/Him",
  [PRONOUNS.SHE_HER]: "She/Her",
  [PRONOUNS.OTHER]: "Other",
};

// Account status enum
export const ACCOUNT_STATUS = {
  PENDING: 0,
  ACTIVE: 1,
  INACTIVE: 2,
} as const;

export const ACCOUNT_STATUS_LABELS: Record<number, string> = {
  [ACCOUNT_STATUS.PENDING]: "Pending",
  [ACCOUNT_STATUS.ACTIVE]: "Active",
  [ACCOUNT_STATUS.INACTIVE]: "Inactive",
};

// Training signup types
export const SIGNUP_TYPES = {
  CPR_ONLY: 0,
  FA_ONLY: 1,
  BOTH: 2,
} as const;

export const SIGNUP_TYPE_LABELS: Record<number, string> = {
  [SIGNUP_TYPES.CPR_ONLY]: "CPR Only",
  [SIGNUP_TYPES.FA_ONLY]: "First Aid Only",
  [SIGNUP_TYPES.BOTH]: "Both",
};

// Notification types
export const NOTIFICATION_TYPES = {
  EVENT_CREATED: 0,
  EVENT_UPDATED: 1,
  EVENT_CANCELLED: 2,
  SIGNUP_CONFIRMED: 3,
  HOURS_CONFIRMED: 4,
  CERT_EXPIRING: 5,
  ACCOUNT_APPROVED: 6,
  TRAINING_REMINDER: 7,
} as const;

// File upload limits
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
] as const;

// Pagination
export const DEFAULT_PAGE_SIZE = 20;

// ICS forms needed for certification
export const REQUIRED_ICS_FORMS = [
  CERT_TYPES.ICS_100,
  CERT_TYPES.ICS_200,
  CERT_TYPES.ICS_700,
  CERT_TYPES.ICS_800,
] as const;

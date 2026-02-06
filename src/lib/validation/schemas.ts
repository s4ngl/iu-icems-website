import {
  isValidEmail,
  isValidPassword,
  isValidPhone,
  isValidDate,
  isValidTime,
  isFutureDate,
  isStartBeforeEnd,
} from "./validators";
import { sanitizeString, sanitizeEmail } from "./sanitizers";

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

export function validateRegistration(data: {
  first_name: string;
  last_name: string;
  iu_email: string;
  password: string;
  confirm_password: string;
  phone_number?: string;
}): ValidationResult {
  const errors: Record<string, string> = {};

  if (!sanitizeString(data.first_name)) {
    errors.first_name = "First name is required";
  }
  if (!sanitizeString(data.last_name)) {
    errors.last_name = "Last name is required";
  }
  if (!data.iu_email) {
    errors.iu_email = "Email is required";
  } else if (!isValidEmail(data.iu_email)) {
    errors.iu_email = "Must be a valid @iu.edu email";
  }

  const passwordCheck = isValidPassword(data.password);
  if (!data.password) {
    errors.password = "Password is required";
  } else if (!passwordCheck.valid) {
    const missing: string[] = [];
    if (!passwordCheck.requirements.minLength) missing.push("8+ characters");
    if (!passwordCheck.requirements.uppercase) missing.push("uppercase letter");
    if (!passwordCheck.requirements.lowercase) missing.push("lowercase letter");
    if (!passwordCheck.requirements.number) missing.push("number");
    if (!passwordCheck.requirements.specialChar)
      missing.push("special character");
    errors.password = `Password requires: ${missing.join(", ")}`;
  }

  if (data.password !== data.confirm_password) {
    errors.confirm_password = "Passwords do not match";
  }

  if (data.phone_number && !isValidPhone(data.phone_number)) {
    errors.phone_number = "Must be a valid 10-digit US phone number";
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateLogin(data: {
  email: string;
  password: string;
}): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.email) {
    errors.email = "Email is required";
  } else if (!isValidEmail(data.email)) {
    errors.email = "Must be a valid @iu.edu email";
  }

  if (!data.password) {
    errors.password = "Password is required";
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateProfileUpdate(data: {
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  gender?: number;
  class_year?: number;
  pronouns?: number;
}): ValidationResult {
  const errors: Record<string, string> = {};

  if (data.first_name !== undefined && !sanitizeString(data.first_name)) {
    errors.first_name = "First name cannot be empty";
  }
  if (data.last_name !== undefined && !sanitizeString(data.last_name)) {
    errors.last_name = "Last name cannot be empty";
  }
  if (data.phone_number && !isValidPhone(data.phone_number)) {
    errors.phone_number = "Must be a valid 10-digit US phone number";
  }
  if (data.gender !== undefined && data.gender < 0) {
    errors.gender = "Invalid gender selection";
  }
  if (data.class_year !== undefined && data.class_year < 0) {
    errors.class_year = "Invalid class year selection";
  }
  if (data.pronouns !== undefined && data.pronouns < 0) {
    errors.pronouns = "Invalid pronouns selection";
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateEvent(data: {
  event_name: string;
  event_date: string;
  start_time: string;
  end_time: string;
  location: string;
  fa_emr_needed?: number;
  emt_needed?: number;
  supervisor_needed?: number;
}): ValidationResult {
  const errors: Record<string, string> = {};

  if (!sanitizeString(data.event_name)) {
    errors.event_name = "Event name is required";
  }
  if (!data.event_date) {
    errors.event_date = "Event date is required";
  } else if (!isValidDate(data.event_date)) {
    errors.event_date = "Invalid date format";
  } else if (!isFutureDate(data.event_date)) {
    errors.event_date = "Event date must be today or in the future";
  }
  if (!data.start_time) {
    errors.start_time = "Start time is required";
  } else if (!isValidTime(data.start_time)) {
    errors.start_time = "Invalid time format (HH:MM)";
  }
  if (!data.end_time) {
    errors.end_time = "End time is required";
  } else if (!isValidTime(data.end_time)) {
    errors.end_time = "Invalid time format (HH:MM)";
  }
  if (
    data.start_time &&
    data.end_time &&
    isValidTime(data.start_time) &&
    isValidTime(data.end_time) &&
    !isStartBeforeEnd(data.start_time, data.end_time)
  ) {
    errors.end_time = "End time must be after start time";
  }
  if (!sanitizeString(data.location)) {
    errors.location = "Location is required";
  }
  if (data.fa_emr_needed !== undefined && data.fa_emr_needed < 0) {
    errors.fa_emr_needed = "Must be a non-negative number";
  }
  if (data.emt_needed !== undefined && data.emt_needed < 0) {
    errors.emt_needed = "Must be a non-negative number";
  }
  if (data.supervisor_needed !== undefined && data.supervisor_needed < 0) {
    errors.supervisor_needed = "Must be a non-negative number";
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateTrainingSession(data: {
  training_name: string;
  training_date: string;
  start_time: string;
  end_time: string;
  location: string;
  max_participants?: number;
  is_aha_training?: boolean;
  cpr_cost?: number;
  fa_cost?: number;
  both_cost?: number;
}): ValidationResult {
  const errors: Record<string, string> = {};

  if (!sanitizeString(data.training_name)) {
    errors.training_name = "Training name is required";
  }
  if (!data.training_date) {
    errors.training_date = "Training date is required";
  } else if (!isValidDate(data.training_date)) {
    errors.training_date = "Invalid date format";
  } else if (!isFutureDate(data.training_date)) {
    errors.training_date = "Training date must be today or in the future";
  }
  if (!data.start_time) {
    errors.start_time = "Start time is required";
  } else if (!isValidTime(data.start_time)) {
    errors.start_time = "Invalid time format (HH:MM)";
  }
  if (!data.end_time) {
    errors.end_time = "End time is required";
  } else if (!isValidTime(data.end_time)) {
    errors.end_time = "Invalid time format (HH:MM)";
  }
  if (
    data.start_time &&
    data.end_time &&
    isValidTime(data.start_time) &&
    isValidTime(data.end_time) &&
    !isStartBeforeEnd(data.start_time, data.end_time)
  ) {
    errors.end_time = "End time must be after start time";
  }
  if (!sanitizeString(data.location)) {
    errors.location = "Location is required";
  }
  if (data.max_participants !== undefined && data.max_participants < 0) {
    errors.max_participants = "Must be a non-negative number";
  }
  if (data.cpr_cost !== undefined && data.cpr_cost < 0) {
    errors.cpr_cost = "Must be a non-negative number";
  }
  if (data.fa_cost !== undefined && data.fa_cost < 0) {
    errors.fa_cost = "Must be a non-negative number";
  }
  if (data.both_cost !== undefined && data.both_cost < 0) {
    errors.both_cost = "Must be a non-negative number";
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

export function validatePasswordChange(data: {
  current_password: string;
  new_password: string;
  confirm_password: string;
}): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.current_password) {
    errors.current_password = "Current password is required";
  }

  const passwordCheck = isValidPassword(data.new_password);
  if (!data.new_password) {
    errors.new_password = "New password is required";
  } else if (!passwordCheck.valid) {
    const missing: string[] = [];
    if (!passwordCheck.requirements.minLength) missing.push("8+ characters");
    if (!passwordCheck.requirements.uppercase) missing.push("uppercase letter");
    if (!passwordCheck.requirements.lowercase) missing.push("lowercase letter");
    if (!passwordCheck.requirements.number) missing.push("number");
    if (!passwordCheck.requirements.specialChar)
      missing.push("special character");
    errors.new_password = `Password requires: ${missing.join(", ")}`;
  }

  if (data.new_password !== data.confirm_password) {
    errors.confirm_password = "Passwords do not match";
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

export function validatePenaltyPoints(data: {
  points: number;
  reason: string;
}): ValidationResult {
  const errors: Record<string, string> = {};

  if (data.points < 0) {
    errors.points = "Points must be a non-negative number";
  }
  if (!sanitizeString(data.reason)) {
    errors.reason = "Reason is required";
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

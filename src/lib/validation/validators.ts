export function isValidEmail(email: string): boolean {
  const trimmed = email.trim().toLowerCase();
  return /^[^\s@]+@iu\.edu$/.test(trimmed);
}

export function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, "");
  return digits.length === 10;
}

export function isValidPassword(password: string): {
  valid: boolean;
  requirements: {
    minLength: boolean;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    specialChar: boolean;
  };
} {
  const requirements = {
    minLength: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    specialChar: /[^A-Za-z0-9]/.test(password),
  };
  return {
    valid: Object.values(requirements).every(Boolean),
    requirements,
  };
}

export function isValidDate(date: string): boolean {
  const parsed = new Date(date);
  return !isNaN(parsed.getTime());
}

export function isValidTime(time: string): boolean {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(time);
}

export function isFutureDate(date: string): boolean {
  const parsed = new Date(date);
  if (isNaN(parsed.getTime())) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return parsed >= today;
}

export function isStartBeforeEnd(start: string, end: string): boolean {
  return start < end;
}

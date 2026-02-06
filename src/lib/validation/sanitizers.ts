export function sanitizeString(input: string): string {
  return input.replace(/<[^>]*>/g, "").trim();
}

export function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

export function sanitizePhone(phone: string): string {
  return phone.replace(/\D/g, "");
}

export function sanitizeHtml(input: string): string {
  return input.replace(/<[^>]*>/g, "");
}

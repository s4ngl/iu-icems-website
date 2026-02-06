export function sanitizeString(input: string): string {
  let result = input;
  let prev = "";
  while (result !== prev) {
    prev = result;
    result = result.replace(/<[^>]*>/g, "");
  }
  return result.trim();
}

export function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

export function sanitizePhone(phone: string): string {
  return phone.replace(/\D/g, "");
}

export function sanitizeHtml(input: string): string {
  let result = input;
  let prev = "";
  while (result !== prev) {
    prev = result;
    result = result.replace(/<[^>]*>/g, "");
  }
  return result;
}

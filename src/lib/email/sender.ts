import { sendEmail } from "./client";
import { renderWelcomeEmail } from "./templates/welcome";
import { renderEventAssignmentEmail } from "./templates/event-assignment";
import { renderEventModificationEmail } from "./templates/event-modification";
import { renderCertExpirationEmail } from "./templates/certification-expiration";
import { renderAccountStatusEmail } from "./templates/account-status";

export async function sendWelcomeEmail(
  email: string,
  name: string
): Promise<void> {
  const html = renderWelcomeEmail(name);
  await sendEmail(email, "Welcome to IU IC-EMS!", html);
}

export async function sendEventAssignmentEmail(
  email: string,
  name: string,
  eventName: string,
  eventDate: string,
  role: string
): Promise<void> {
  const html = renderEventAssignmentEmail(name, eventName, eventDate, role);
  await sendEmail(email, `Event Assignment: ${eventName}`, html);
}

export async function sendEventModificationEmail(
  email: string,
  name: string,
  eventName: string,
  changes: string
): Promise<void> {
  const html = renderEventModificationEmail(name, eventName, changes);
  await sendEmail(email, `Event Update: ${eventName}`, html);
}

export async function sendCertExpirationEmail(
  email: string,
  name: string,
  certType: string,
  expirationDate: string
): Promise<void> {
  const html = renderCertExpirationEmail(name, certType, expirationDate);
  await sendEmail(email, `Certification Expiring: ${certType}`, html);
}

export async function sendAccountStatusEmail(
  email: string,
  name: string,
  status: string
): Promise<void> {
  const html = renderAccountStatusEmail(name, status);
  await sendEmail(email, "Account Status Update - IU IC-EMS", html);
}

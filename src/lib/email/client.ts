export interface EmailConfig {
  from: string;
  replyTo: string;
}

export const emailConfig: EmailConfig = {
  from: "IC-EMS <noreply@iu-icems.org>",
  replyTo: "icems@iu.edu",
};

export async function sendEmail(
  to: string,
  subject: string,
  html: string
): Promise<{ success: boolean; error?: string }> {
  // Placeholder - would integrate with email service (e.g. Resend, SendGrid)
  console.log(`Email to ${to}: ${subject}`);
  console.log(`HTML length: ${html.length} characters`);
  return { success: true };
}

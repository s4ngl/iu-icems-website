import * as React from "react";

interface AccountStatusEmailProps {
  name: string;
  status: string;
}

const statusMessages: Record<string, { description: string; nextSteps: string }> = {
  active: {
    description: "Your account is now active. You can sign up for events and access all member features.",
    nextSteps: "Check the event calendar for upcoming opportunities to volunteer.",
  },
  inactive: {
    description: "Your account has been set to inactive. This may be due to expired certifications, unpaid dues, or excessive penalty points.",
    nextSteps: "Please review your profile and address any outstanding requirements, or contact the board for more information.",
  },
  suspended: {
    description: "Your account has been suspended. You are temporarily unable to sign up for events.",
    nextSteps: "Please contact the board at icems@iu.edu to discuss your account status and next steps.",
  },
  alumni: {
    description: "Your account has been moved to alumni status. Thank you for your service with IC-EMS!",
    nextSteps: "You can still access your profile and view your service history.",
  },
};

export function AccountStatusEmail({ name, status }: AccountStatusEmailProps) {
  const info = statusMessages[status] ?? {
    description: `Your account status has been changed to: ${status}.`,
    nextSteps: "Please contact the board at icems@iu.edu if you have questions.",
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", maxWidth: "600px", margin: "0 auto" }}>
      <div style={{ backgroundColor: "#990000", padding: "20px", textAlign: "center" as const }}>
        <h1 style={{ color: "#ffffff", margin: 0 }}>Account Status Update</h1>
      </div>
      <div style={{ padding: "20px", backgroundColor: "#ffffff" }}>
        <p>Hi {name},</p>
        <p>Your IC-EMS account status has been updated.</p>
        <div style={{ backgroundColor: "#f9f9f9", padding: "15px", borderLeft: "4px solid #990000", margin: "15px 0" }}>
          <p style={{ margin: "5px 0" }}><strong>New Status:</strong> {status}</p>
        </div>
        <p>{info.description}</p>
        <h2 style={{ color: "#990000" }}>Next Steps</h2>
        <p>{info.nextSteps}</p>
        <p>
          If you believe this change was made in error, please contact the board at{" "}
          <a href="mailto:icems@iu.edu">icems@iu.edu</a>.
        </p>
        <p>Best regards,<br />The IC-EMS Board</p>
      </div>
      <div style={{ backgroundColor: "#f5f5f5", padding: "10px", textAlign: "center" as const, fontSize: "12px", color: "#666" }}>
        <p>IU Intramural Center Emergency Medical Services</p>
      </div>
    </div>
  );
}

export function renderAccountStatusEmail(name: string, status: string): string {
  const ReactDOMServer = require("react-dom/server");
  return ReactDOMServer.renderToStaticMarkup(
    React.createElement(AccountStatusEmail, { name, status })
  );
}

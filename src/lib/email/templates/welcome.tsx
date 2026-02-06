import * as React from "react";

interface WelcomeEmailProps {
  name: string;
}

export function WelcomeEmail({ name }: WelcomeEmailProps) {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", maxWidth: "600px", margin: "0 auto" }}>
      <div style={{ backgroundColor: "#990000", padding: "20px", textAlign: "center" as const }}>
        <h1 style={{ color: "#ffffff", margin: 0 }}>Welcome to IU IC-EMS!</h1>
      </div>
      <div style={{ padding: "20px", backgroundColor: "#ffffff" }}>
        <p>Hi {name},</p>
        <p>
          Welcome to Indiana University&apos;s Intramural Center Emergency Medical
          Services (IC-EMS)! We&apos;re excited to have you as part of our team.
        </p>
        <h2 style={{ color: "#990000" }}>Next Steps</h2>
        <ol>
          <li>
            <strong>Upload Your Certifications</strong> — Upload your CPR/AED and
            First Aid certifications in your profile. These must be current and
            approved before you can sign up for events.
          </li>
          <li>
            <strong>Pay Membership Dues</strong> — Complete your dues payment to
            activate your membership and gain access to event signups.
          </li>
          <li>
            <strong>Sign Up for Training</strong> — Check the training calendar for
            upcoming AHA certification courses and skill refreshers.
          </li>
        </ol>
        <p>
          If you have any questions, don&apos;t hesitate to reach out to the board at{" "}
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

export function renderWelcomeEmail(name: string): string {
  // Server-side render to static HTML string
  const ReactDOMServer = require("react-dom/server");
  return ReactDOMServer.renderToStaticMarkup(
    React.createElement(WelcomeEmail, { name })
  );
}

import * as React from "react";

interface CertExpirationEmailProps {
  name: string;
  certType: string;
  expirationDate: string;
}

export function CertExpirationEmail({ name, certType, expirationDate }: CertExpirationEmailProps) {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", maxWidth: "600px", margin: "0 auto" }}>
      <div style={{ backgroundColor: "#990000", padding: "20px", textAlign: "center" as const }}>
        <h1 style={{ color: "#ffffff", margin: 0 }}>Certification Expiring Soon</h1>
      </div>
      <div style={{ padding: "20px", backgroundColor: "#ffffff" }}>
        <p>Hi {name},</p>
        <p>Your certification is expiring soon. Please renew it to maintain your active status.</p>
        <div style={{ backgroundColor: "#fff3cd", padding: "15px", borderLeft: "4px solid #ffc107", margin: "15px 0" }}>
          <p style={{ margin: "5px 0" }}><strong>Certification:</strong> {certType}</p>
          <p style={{ margin: "5px 0" }}><strong>Expiration Date:</strong> {expirationDate}</p>
        </div>
        <h2 style={{ color: "#990000" }}>How to Renew</h2>
        <ol>
          <li>Complete a renewal course through an AHA-authorized training center.</li>
          <li>Upload your new certification card to your IC-EMS profile.</li>
          <li>Wait for board approval of your updated certification.</li>
        </ol>
        <p>
          Check the training calendar for upcoming AHA courses offered by IC-EMS. If
          you have questions, contact us at{" "}
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

export function renderCertExpirationEmail(
  name: string,
  certType: string,
  expirationDate: string
): string {
  const ReactDOMServer = require("react-dom/server");
  return ReactDOMServer.renderToStaticMarkup(
    React.createElement(CertExpirationEmail, { name, certType, expirationDate })
  );
}

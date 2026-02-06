import * as React from "react";

interface EventModificationEmailProps {
  name: string;
  eventName: string;
  changes: string;
}

export function EventModificationEmail({ name, eventName, changes }: EventModificationEmailProps) {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", maxWidth: "600px", margin: "0 auto" }}>
      <div style={{ backgroundColor: "#990000", padding: "20px", textAlign: "center" as const }}>
        <h1 style={{ color: "#ffffff", margin: 0 }}>Event Update</h1>
      </div>
      <div style={{ padding: "20px", backgroundColor: "#ffffff" }}>
        <p>Hi {name},</p>
        <p>
          An event you are signed up for has been modified. Please review the changes
          below:
        </p>
        <div style={{ backgroundColor: "#f9f9f9", padding: "15px", borderLeft: "4px solid #990000", margin: "15px 0" }}>
          <p style={{ margin: "5px 0" }}><strong>Event:</strong> {eventName}</p>
          <p style={{ margin: "5px 0" }}><strong>Changes:</strong> {changes}</p>
        </div>
        <p>
          If these changes affect your availability, please update your signup
          status or contact the board at{" "}
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

export function renderEventModificationEmail(
  name: string,
  eventName: string,
  changes: string
): string {
  const ReactDOMServer = require("react-dom/server");
  return ReactDOMServer.renderToStaticMarkup(
    React.createElement(EventModificationEmail, { name, eventName, changes })
  );
}

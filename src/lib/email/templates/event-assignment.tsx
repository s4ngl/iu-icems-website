import * as React from "react";

interface EventAssignmentEmailProps {
  name: string;
  eventName: string;
  eventDate: string;
  role: string;
}

export function EventAssignmentEmail({ name, eventName, eventDate, role }: EventAssignmentEmailProps) {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", maxWidth: "600px", margin: "0 auto" }}>
      <div style={{ backgroundColor: "#990000", padding: "20px", textAlign: "center" as const }}>
        <h1 style={{ color: "#ffffff", margin: 0 }}>Event Assignment</h1>
      </div>
      <div style={{ padding: "20px", backgroundColor: "#ffffff" }}>
        <p>Hi {name},</p>
        <p>You have been assigned to the following event:</p>
        <div style={{ backgroundColor: "#f9f9f9", padding: "15px", borderLeft: "4px solid #990000", margin: "15px 0" }}>
          <p style={{ margin: "5px 0" }}><strong>Event:</strong> {eventName}</p>
          <p style={{ margin: "5px 0" }}><strong>Date:</strong> {eventDate}</p>
          <p style={{ margin: "5px 0" }}><strong>Role:</strong> {role}</p>
        </div>
        <p>
          Please make sure you arrive on time and are prepared for your shift. If you
          are unable to attend, please contact the board as soon as possible.
        </p>
        <p>
          Failure to attend an assigned event without prior notice may result in
          penalty points.
        </p>
        <p>Best regards,<br />The IC-EMS Board</p>
      </div>
      <div style={{ backgroundColor: "#f5f5f5", padding: "10px", textAlign: "center" as const, fontSize: "12px", color: "#666" }}>
        <p>IU Intramural Center Emergency Medical Services</p>
      </div>
    </div>
  );
}

export function renderEventAssignmentEmail(
  name: string,
  eventName: string,
  eventDate: string,
  role: string
): string {
  const ReactDOMServer = require("react-dom/server");
  return ReactDOMServer.renderToStaticMarkup(
    React.createElement(EventAssignmentEmail, { name, eventName, eventDate, role })
  );
}

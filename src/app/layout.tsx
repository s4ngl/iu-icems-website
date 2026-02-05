import "./globals.css";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "IC-EMS at IU | Intra-Collegiate Emergency Medical Service",
  description:
    "Indiana University's student-run EMS organization dedicated to " +
    "providing emergency medical services, training, and health & safety " +
    "education across the IU Bloomington campus community.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}

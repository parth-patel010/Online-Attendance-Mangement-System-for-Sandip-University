import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sandip University - Attendance Management System",
  description: "University attendance management system for faculty and administrators",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "THE RETURN - Daily Ledger",
  description: "Private discipline tracking ledger",
  applicationName: "THE RETURN",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "THE RETURN",
    statusBarStyle: "black-translucent"
  }
};

export const viewport: Viewport = {
  themeColor: "#050505"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

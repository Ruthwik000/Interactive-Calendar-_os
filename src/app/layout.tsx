import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Calendar — Interactive Wall Calendar",
  description: "A beautifully crafted interactive wall calendar component with date range selection, integrated notes, and seamless responsive design.",
  keywords: ["calendar", "wall calendar", "date picker", "range selector", "interactive"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

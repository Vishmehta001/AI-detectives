/**
 * Root Layout Component
 * 
 * This is the root layout for the Next.js app. It wraps all pages.
 * - Sets up the HTML structure
 * - Imports global styles (including Tailwind CSS)
 * - Uses a monospace font for the terminal aesthetic
 */

import type { Metadata } from "next";
import "./globals.css";

// Metadata for the page (shows in browser tab and search engines)
export const metadata: Metadata = {
  title: "AI Detective Game",
  description: "Classroom AI Detective Terminal",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* Apply a monospace font for the terminal aesthetic */}
      <body className="font-mono">
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OrbitOS | Business Operating System",
  description: "OrbitOS business operating system for operations, finance, and growth.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text-primary)] antialiased">
        {children}
      </body>
    </html>
  );
}

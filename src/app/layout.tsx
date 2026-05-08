import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rare Legacy Life",
  description:
    "Life insurance guidance, quote requests, CRM, and agent workflows for Rare Legacy Life.",
  icons: {
    icon: "/favicon.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-white text-[#050505]">{children}</body>
    </html>
  );
}

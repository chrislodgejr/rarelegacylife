import type { Metadata } from "next";

// Sign-in and account screens should never appear in search results.
export const metadata: Metadata = {
  title: "Rare Legacy CRM",
  robots: { index: false, follow: false },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return children;
}

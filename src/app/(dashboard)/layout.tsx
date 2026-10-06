import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rare Legacy CRM",
  robots: { index: false, follow: false },
};

export default function DashboardGroupLayout({ children }: { children: React.ReactNode }) {
  return children;
}

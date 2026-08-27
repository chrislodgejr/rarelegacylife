import type { Metadata, Viewport } from "next";
import { RetirementLanding } from "./retirement-landing";

const title = "Complimentary Retirement Income Blueprint | Rare Legacy Life Group";
const description =
  "Request a complimentary 30-minute Retirement Income Blueprint consultation with a licensed Rare Legacy professional.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "https://rarelegacylife.com/retirement",
  },
  openGraph: {
    title,
    description,
    type: "website",
    siteName: "Rare Legacy Life Group",
    url: "https://rarelegacylife.com/retirement",
    images: [
      {
        url: "https://rarelegacylife.com/brand/logo-dark-horizontal.png",
        width: 1200,
        height: 630,
        alt: "Rare Legacy Life Group",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["https://rarelegacylife.com/brand/logo-dark-horizontal.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#19201F",
};

export default function RetirementPage() {
  return <RetirementLanding />;
}

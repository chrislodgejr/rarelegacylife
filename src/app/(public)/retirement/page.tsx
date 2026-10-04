import type { Metadata, Viewport } from "next";
import { PublicFooter, PublicHeader } from "@/components/layout/public-shell";
import { SHARE_IMAGE } from "@/lib/brand";
import { absoluteUrl } from "@/lib/site";
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
        url: absoluteUrl(SHARE_IMAGE.url),
        width: SHARE_IMAGE.width,
        height: SHARE_IMAGE.height,
        alt: "Rare Legacy Life Group",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [absoluteUrl(SHARE_IMAGE.url)],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#0C0B09",
};

export default function RetirementPage() {
  return (
    <>
      <PublicHeader />
      <RetirementLanding />
      <PublicFooter />
    </>
  );
}

import { GoogleAdsTag } from "@/components/seo/google-ads-tag";

// The Google tag on every public page (Chris, 2026-11-24: "connect my mac and do all of it", of the ads plan): Google Ads can then
// build an audience of people who read the guides or the course and show them our ads again, and measure every landing page. The
// sign-in and dashboard pages are outside this group, so the tag never loads there.
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <GoogleAdsTag />
      {children}
    </>
  );
}

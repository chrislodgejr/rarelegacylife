import Script from "next/script";
import { GOOGLE_ADS_ID } from "@/lib/google-ads";

/** The Google tag for Google Ads, on every public page through src/app/(public)/layout.tsx (see src/lib/google-ads.ts). */
export function GoogleAdsTag() {
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`} strategy="lazyOnload" />
      <Script id="google-ads-tag" strategy="lazyOnload">
        {`window.dataLayer=window.dataLayer||[];window.gtag=window.gtag||function(){dataLayer.push(arguments);};gtag('js',new Date());gtag('config','${GOOGLE_ADS_ID}',{allow_enhanced_conversions:true});`}
      </Script>
    </>
  );
}

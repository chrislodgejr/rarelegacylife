import Script from "next/script";

/**
 * Loads Google Tag Manager (preferred — it also picks up the existing
 * `dataLayer.push({ event })` calls on /retirement) or, if only a GA4
 * measurement ID is set, GA4 directly. Renders nothing until an ID is
 * configured in Vercel, so it is safe to ship before analytics is set up.
 *
 * NEXT_PUBLIC_GTM_ID                → e.g. GTM-ABC1234
 * NEXT_PUBLIC_GA_MEASUREMENT_ID     → e.g. G-XXXXXXXXXX
 */
export function Analytics() {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  if (gtmId && /^GTM-[A-Z0-9]+$/.test(gtmId)) {
    return (
      <Script id="gtm" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`}
      </Script>
    );
  }

  if (gaId && /^G-[A-Z0-9]+$/.test(gaId)) {
    return (
      <>
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
        <Script id="ga4" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${gaId}');`}
        </Script>
      </>
    );
  }

  return null;
}

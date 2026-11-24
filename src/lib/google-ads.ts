// The Google tag on /protect (Chris, 2026-11-23: "Shouldn't their be a google tag?" then "Yes"). It tells Google Ads the moment a
// visitor sends the form ("RL Form Submit", a SECONDARY conversion: reported, never bid on), with the visitor's email and phone for
// enhanced conversions. gtag hashes them (SHA-256) in the browser before anything is sent; Google never receives them in plain text.
// The conversion Google bids on stays "RL Qualified Lead" ($150K and up), uploaded daily from Endless One.
export const GOOGLE_ADS_ID = "AW-11060417436";
export const FORM_SUBMIT_SEND_TO = `${GOOGLE_ADS_ID}/RMeICMqjnb4dEJyngpop`;

type GtagWindow = { gtag?: (...args: unknown[]) => void };

export type GoogleAdsUserData = { email?: string; phone_number?: string };

/** A US phone as Google wants it (+1 and ten digits), or nothing when it is not one. */
export function e164UsPhone(raw: string | null | undefined): string | undefined {
  const digits = String(raw ?? "").replace(/\D/g, "");
  const ten = digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;
  return /^[2-9]\d{2}[2-9]\d{6}$/.test(ten) ? `+1${ten}` : undefined;
}

export function googleAdsUserData(contact: { email?: string | null; phone?: string | null }): GoogleAdsUserData {
  const data: GoogleAdsUserData = {};
  const email = String(contact.email ?? "").trim().toLowerCase();
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) data.email = email;
  const phone = e164UsPhone(contact.phone);
  if (phone) data.phone_number = phone;
  return data;
}

/** Called once, after Endless One has accepted the form. Does nothing when the tag did not load (blocked, or no consent). */
export function reportFormSubmit(contact: { email?: string | null; phone?: string | null }, win: GtagWindow | undefined = globalThis as GtagWindow) {
  const gtag = win?.gtag;
  if (typeof gtag !== "function") return false;
  const userData = googleAdsUserData(contact);
  if (Object.keys(userData).length) gtag("set", "user_data", userData);
  gtag("event", "conversion", { send_to: FORM_SUBMIT_SEND_TO });
  return true;
}

import { SHARE_IMAGE } from "@/lib/brand";

/**
 * Single source of truth for public business details used in page copy,
 * metadata, and structured data (JSON-LD). Keep name/address/phone identical
 * to the Google Business Profile so search engines can match them.
 */
export const SITE = {
  name: "Rare Legacy Life Group",
  shortName: "Rare Legacy Life",
  url: "https://rarelegacylife.com",
  description:
    "Life insurance guidance, retirement income reviews, and annuity education from licensed advisors in East Norriton, PA, serving families in 49 states.",
  phone: {
    display: "(484) 430-4363",
    e164: "+14844304363",
    href: "tel:+14844304363",
  },
  address: {
    street: "59 W. Germantown Pike",
    city: "East Norriton",
    region: "PA",
    postalCode: "19403",
    country: "US",
  },
  areaServed: "49 U.S. states (excluding California)",
  localArea: "Montgomery County, PA",
  /** Share image for link previews and JSON-LD; generated from the logo (see src/lib/brand.ts). */
  ogImage: SHARE_IMAGE.url,
} as const;

export type Advisor = {
  slug: string;
  name: string;
  title: string;
  /** National Producer Number or PA license number, shown publicly for trust. */
  license: string;
  bio: string;
  photo?: string;
};

/**
 * Licensed advisors. They render on /about and as the named author/reviewer
 * of each guide. Credentials are as provided by the business — have compliance
 * confirm wording before changing them.
 */
export const ADVISORS: Advisor[] = [
  {
    slug: "daniel-pennachietti",
    name: "Daniel Pennachietti",
    title: "Licensed Life & Fixed Annuity Advisor",
    license: "NPN 21395664 · Life and Fixed Annuities",
    photo: "/team/daniel-pennachietti.jpg",
    bio: "Daniel helps families compare term, permanent, mortgage-protection, and final-expense coverage in plain language, so the policy matches the people it is meant to protect.",
  },
  {
    slug: "christian-pennachietti",
    name: "Christian Pennachietti",
    title: "Licensed Life & Annuity Advisor",
    license: "NPN 21707801 · Series 6, Series 63, SIE · Life, Variable and Fixed Annuities",
    photo: "/team/christian-pennachietti.jpg",
    bio: "Christian leads Rare Legacy's Retirement Income Blueprint reviews, helping pre-retirees and retirees understand how income sources, annuity features, and legacy goals fit together.",
  },
];

export const PRIMARY_ADVISOR = ADVISORS[0];
export const RETIREMENT_ADVISOR = ADVISORS[1];

export function advisorBySlug(slug: string) {
  return ADVISORS.find((advisor) => advisor.slug === slug) ?? PRIMARY_ADVISOR;
}

export function absoluteUrl(path = "/") {
  return `${SITE.url}${path.startsWith("/") ? path : `/${path}`}`;
}

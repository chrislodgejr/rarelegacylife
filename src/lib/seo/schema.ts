import { BRAND_FILES } from "@/lib/brand";
import { absoluteUrl, PRIMARY_ADVISOR, SITE, type Advisor } from "@/lib/site";

type Faq = { question: string; answer: string };

const ORG_ID = `${SITE.url}/#organization`;

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["InsuranceAgency", "FinancialService"],
    "@id": ORG_ID,
    name: SITE.name,
    alternateName: SITE.shortName,
    url: SITE.url,
    // Black full logo on transparent: search engines show logos on white.
    logo: absoluteUrl(BRAND_FILES.logoBlackPng),
    image: absoluteUrl(SITE.ogImage),
    description: SITE.description,
    telephone: SITE.phone.e164,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.city,
      addressRegion: SITE.address.region,
      postalCode: SITE.address.postalCode,
      addressCountry: SITE.address.country,
    },
    areaServed: [
      { "@type": "AdministrativeArea", name: SITE.localArea },
      { "@type": "Country", name: "United States" },
    ],
    knowsAbout: [
      "Term life insurance",
      "Whole life insurance",
      "Mortgage protection insurance",
      "Final expense insurance",
      "Annuities",
      "Retirement income planning",
      "Key person insurance",
    ],
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE.url}/#website`,
    url: SITE.url,
    name: SITE.shortName,
    publisher: { "@id": ORG_ID },
  };
}

export function faqSchema(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function personSchema(advisor: Advisor = PRIMARY_ADVISOR) {
  return {
    "@type": "Person",
    name: advisor.name,
    jobTitle: advisor.title,
    ...(advisor.photo ? { image: absoluteUrl(advisor.photo) } : {}),
    worksFor: { "@id": ORG_ID },
    url: absoluteUrl(`/about#${advisor.slug}`),
  };
}

export function articleSchema(input: {
  title: string;
  description: string;
  path: string;
  published: string;
  updated: string;
  author?: Advisor;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.title,
    description: input.description,
    mainEntityOfPage: absoluteUrl(input.path),
    datePublished: input.published,
    dateModified: input.updated,
    author: personSchema(input.author),
    reviewedBy: personSchema(input.author),
    publisher: { "@id": ORG_ID },
    image: absoluteUrl(SITE.ogImage),
  };
}

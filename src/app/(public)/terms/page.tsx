import { PublicShell } from "@/components/layout/public-shell";
import { Section } from "@/components/ui/section";
import { PremiumSectionHeader } from "@/components/ui/premium";

const sections = [
  {
    title: "Use of the Website",
    copy: "You may use this website to learn about life insurance, request information, submit a quote request, contact Rare Legacy Life, or apply for agent opportunities. You agree not to misuse the website, interfere with its security, or submit false information.",
  },
  {
    title: "No Guarantee of Coverage",
    copy: "Submitting a quote request does not guarantee eligibility, approval, pricing, policy issuance, or coverage. Final terms depend on carrier underwriting, application details, health history, state availability, and other factors.",
  },
  {
    title: "No Financial, Tax, or Legal Advice",
    copy: "Website content is educational and informational. It is not legal, tax, financial, or personalized insurance advice. You should consult qualified professionals before making major financial decisions.",
  },
  {
    title: "Communications and Consent",
    copy: "By submitting forms and consent boxes, you authorize Rare Legacy Life and its advisors to contact you according to the permissions you provide. Message and data rates may apply for texts. Consent is not a condition of purchase where prohibited by law.",
  },
  {
    title: "Account Access",
    copy: "Portal users are responsible for keeping credentials secure. Access may be limited, suspended, or revoked if an account is pending, inactive, misused, or no longer authorized.",
  },
  {
    title: "Intellectual Property",
    copy: "Rare Legacy Life branding, designs, copy, workflows, and platform materials may not be copied, reused, or distributed without permission except as allowed by law.",
  },
  {
    title: "Third-Party Services",
    copy: "The platform may rely on third-party services for hosting, authentication, email, communications, analytics, and other operations. Those services may have their own terms and policies.",
  },
  {
    title: "Limitation of Liability",
    copy: "To the fullest extent allowed by law, Rare Legacy Life is not responsible for indirect, incidental, consequential, or punitive damages arising from use of the website or reliance on website content.",
  },
  {
    title: "Updates to These Terms",
    copy: "We may update these Terms and Conditions as the platform evolves. Continued use of the website after updates means you accept the revised terms.",
  },
];

export default function TermsPage() {
  return (
    <PublicShell>
      <main>
        <Section className="black-hero-bg text-white">
          <PremiumSectionHeader
            dark
            eyebrow="Terms"
            title="Terms and Conditions"
            copy="These terms explain how visitors, clients, agents, and portal users may use the Rare Legacy Life website and platform."
          />
          <p className="mt-8 text-sm text-white/58">Effective date: September 1, 2026</p>
        </Section>
        <Section className="bg-[#F7F5EF]">
          <div className="grid gap-4">
            {sections.map((section) => (
              <article key={section.title} className="premium-card rounded-2xl p-6">
                <h2 className="font-premium text-2xl font-semibold text-[#050505]">{section.title}</h2>
                <p className="mt-3 text-sm leading-7 text-neutral-600">{section.copy}</p>
              </article>
            ))}
          </div>
        </Section>
      </main>
    </PublicShell>
  );
}

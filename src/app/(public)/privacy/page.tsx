import { PublicShell } from "@/components/layout/public-shell";
import { Section } from "@/components/ui/section";
import { PremiumSectionHeader } from "@/components/ui/premium";

const sections = [
  {
    title: "Information We Collect",
    copy: "We may collect contact details, quote request information, coverage goals, state and ZIP code, date of birth, health-related answers you choose to provide, consent records, website attribution data, and communication history related to your request.",
  },
  {
    title: "How We Use Information",
    copy: "We use information to respond to quote requests, help identify coverage options, connect you with an advisor, maintain consent and compliance records, improve our website, protect the platform, and administer requests and service records.",
  },
  {
    title: "Sensitive Information",
    copy: "Life insurance quote requests may include private health or family details. We limit access to authorized personnel, advisors, and service providers who need the information to support your request.",
  },
  {
    title: "Communications",
    copy: "If you provide consent, Rare Legacy Life or its advisors may contact you by phone, text, or email about your request. You can ask us to stop contacting you at any time.",
  },
  {
    title: "Service Providers",
    copy: "We use trusted providers such as hosting, database, authentication, email, analytics, and communication tools to operate the platform. These providers are expected to protect information appropriately.",
  },
  {
    title: "Security",
    copy: "We use authentication, role-based access, database security policies, audit logging, and secure operational practices designed to protect private lead and client information.",
  },
  {
    title: "Your Choices",
    copy: "You may request updates, corrections, opt-out handling, or deletion where legally appropriate by contacting Rare Legacy Life.",
  },
  {
    title: "Policy Updates",
    copy: "We may update this Privacy Policy as the platform evolves. The updated version will be posted on this page with a revised effective date.",
  },
];

export default function PrivacyPage() {
  return (
    <PublicShell>
      <main>
        <Section className="black-hero-bg text-white">
          <PremiumSectionHeader
            dark
            eyebrow="Privacy"
            title="Privacy Policy"
            copy="Rare Legacy Life treats quote requests and personal information with care, restraint, and security."
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

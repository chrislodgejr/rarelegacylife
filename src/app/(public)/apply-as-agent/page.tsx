import { AgentApplicationForm } from "@/components/forms/agent-application-form";
import { PublicShell } from "@/components/layout/public-shell";
import { Eyebrow, Section } from "@/components/ui/section";

export default function ApplyAsAgentPage() {
  return (
    <PublicShell>
      <main className="bg-[#F7F5EF]">
        <Section className="black-hero-bg text-white">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div>
              <Eyebrow>Apply as agent</Eyebrow>
              <h1 className="font-premium mt-4 text-4xl font-semibold leading-tight text-white sm:text-6xl">
                Submit your Rare Legacy Life agent application.
              </h1>
              <p className="mt-5 text-base leading-8 text-white/72">
                Complete the application form so the team can review your license status,
                state availability, experience, and fit for the Rare Legacy Life platform.
              </p>
              <div className="mt-8 grid gap-3 text-sm text-white/76 sm:grid-cols-2">
                {["Licensed agent review", "CRM access approval", "Carrier and state setup", "Lead workflow readiness"].map((item) => (
                  <div key={item} className="dark-premium-card rounded-xl px-4 py-3">
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="mb-4 rounded-2xl border border-white/12 bg-white/[0.06] p-4 text-white">
                <p className="text-sm font-semibold text-[#F5E7A3]">Agent Application Form</p>
                <p className="mt-1 text-xs leading-5 text-white/62">
                  This form is for agents applying to join or access the Rare Legacy Life platform.
                </p>
              </div>
              <AgentApplicationForm />
            </div>
          </div>
        </Section>
      </main>
    </PublicShell>
  );
}

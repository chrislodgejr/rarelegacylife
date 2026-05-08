import { AgentApplicationForm } from "@/components/forms/agent-application-form";
import { PublicShell } from "@/components/layout/public-shell";
import { Eyebrow } from "@/components/ui/section";

export default function AgentOpportunityPage() {
  return (
    <PublicShell>
      <main className="bg-[#F7F5EF]">
        <section className="black-hero-bg px-4 py-14 text-white sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="flex flex-col justify-center">
              <Eyebrow>Agent opportunity</Eyebrow>
              <h1 className="font-premium mt-3 text-5xl font-semibold leading-tight text-white">
                Build with a brand focused on protection, speed, and service.
              </h1>
              <p className="mt-5 text-base leading-8 text-white/72">
                Rare Legacy Life is looking for advisors who want CRM tools, lead access, training,
                brand support, and a clear follow-up workflow.
              </p>
              <div className="mt-8 grid gap-3 text-sm text-white/76">
                {["Lead access", "Training", "CRM tools", "Brand support", "Growth opportunity"].map((item) => (
                  <div key={item} className="dark-premium-card rounded-xl px-4 py-3">
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <AgentApplicationForm />
          </div>
        </section>
      </main>
    </PublicShell>
  );
}

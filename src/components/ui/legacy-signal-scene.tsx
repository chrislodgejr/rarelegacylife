import { Activity, BellRing, Gem, Sparkles, Zap } from "lucide-react";

export function LegacySignalScene() {
  const tickerItems = [
    "Quote received",
    "Consent captured",
    "Lead scored",
    "Advisor matched",
    "Follow-up queued",
  ];

  return (
    <div className="gold-border gold-glow relative min-h-[520px] overflow-hidden rounded-2xl bg-[#050505]">
      <div className="signal-grid absolute inset-0 opacity-70" />
      <div className="scan-line gold-gradient-subtle absolute inset-x-0 top-0 h-px" />

      <div className="absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#F5E7A3]/28">
        <div className="pulse-ring absolute inset-0 rounded-full border border-[#F5E7A3]/45" />
        <div className="absolute inset-6 rounded-full border border-[#C9A227]/45" />
        <div className="absolute inset-14 flex items-center justify-center rounded-full bg-black text-[#F5E7A3] shadow-2xl shadow-[#C9A227]/20">
          <Gem className="h-10 w-10" />
        </div>
      </div>

      <div className="float-panel absolute left-5 top-6 w-[230px] rounded-lg border border-white/12 bg-white/10 p-4 backdrop-blur">
        <div className="flex items-center justify-between">
          <span className="gold-gradient-text text-xs font-semibold uppercase">Protection score</span>
          <Sparkles className="h-4 w-4 text-[#F5E7A3]" />
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/15">
          <div className="gold-gradient-subtle h-full w-[82%] rounded-full" />
        </div>
        <p className="mt-3 text-2xl font-semibold text-white">82 hot</p>
      </div>

      <div className="float-panel-delayed absolute bottom-24 right-5 w-[250px] rounded-lg border border-white/12 bg-white/10 p-4 backdrop-blur">
        <div className="flex items-center gap-3">
          <span className="gold-gradient-button flex h-9 w-9 items-center justify-center rounded-md">
            <BellRing className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-semibold text-white">Advisor alerted</p>
            <p className="text-xs text-white/62">Speed-to-lead workflow</p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-5 right-5 overflow-hidden rounded-lg border border-white/12 bg-black/25 py-3">
        <div className="ticker-track flex w-max gap-3 px-3">
          {[...tickerItems, ...tickerItems].map((item, index) => (
            <span
              key={`${item}-${index}`}
              className="inline-flex items-center gap-2 rounded-md bg-white px-3 py-2 text-xs font-semibold text-black"
            >
              <Zap className="h-3.5 w-3.5 text-[#C9A227]" />
              {item}
            </span>
          ))}
        </div>
      </div>

      <div className="absolute right-8 top-10 grid gap-2">
        {[68, 44, 78, 53, 90].map((height, index) => (
          <div key={height} className="flex h-16 items-end gap-1">
            <span className="w-2 rounded-t bg-[#F5E7A3]/80" style={{ height: `${height}%` }} />
            <span className="w-2 rounded-t bg-[#C9A227]/80" style={{ height: `${Math.max(24, height - 18)}%` }} />
            <span className="w-2 rounded-t bg-white/50" style={{ height: `${Math.max(18, height - 28)}%` }} />
            {index === 2 ? <Activity className="ml-2 h-4 w-4 self-center text-[#F5E7A3]" /> : null}
          </div>
        ))}
      </div>
    </div>
  );
}

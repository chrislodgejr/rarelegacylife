import type { LeadGrade } from "@/types/domain";

export function LeadGradeBadge({
  grade,
  temperature,
  score,
  size = "sm",
}: {
  grade: LeadGrade;
  temperature: "hot" | "warm" | "cold";
  score?: number;
  size?: "sm" | "lg";
}) {
  const isHot = temperature === "hot" || grade === "A+" || grade === "A";
  const classes = isHot
    ? "gold-gradient-subtle border-transparent text-black"
    : temperature === "warm"
      ? "border-amber-200 bg-amber-50 text-amber-800"
      : "border-neutral-200 bg-neutral-100 text-neutral-700";

  return (
    <span
      className={`inline-flex items-center rounded-full border font-bold ${classes} ${
        size === "lg" ? "px-4 py-2 text-base" : "px-2.5 py-1 text-xs"
      }`}
    >
      {grade} / {titleCase(temperature)}
      {score != null ? <span className="ml-1 font-semibold opacity-70">{score}</span> : null}
    </span>
  );
}

export function ScoreReasonList({ breakdown }: { breakdown?: Record<string, number> | null }) {
  const entries = Object.entries(breakdown ?? {}).filter(([, value]) => value > 0);

  if (!entries.length) {
    return <p className="text-sm text-neutral-500">No score breakdown is available yet.</p>;
  }

  return (
    <ul className="grid gap-2 text-sm text-neutral-700">
      {entries.map(([key, value]) => (
        <li key={key} className="flex items-center justify-between gap-4 rounded-xl bg-[#F7F5EF] px-3 py-2">
          <span>{scoreReasonLabel(key)}</span>
          <span className="font-semibold text-[#8A6A16]">+{value}</span>
        </li>
      ))}
    </ul>
  );
}

export function scoreReasonLabel(key: string) {
  const labels: Record<string, string> = {
    family_or_dependents: "Has spouse or dependents",
    coverage_amount: "Requested $250K or more in coverage",
    preferred_contact_method: "Preferred contact method selected",
    health_rating: "Good or excellent health rating",
    non_tobacco: "No tobacco use",
    current_coverage_gap: "No current coverage or not enough coverage",
    age_range: "Age is between 25 and 55",
    required_fields_complete: "Required fields completed",
    high_intent_coverage_purpose: "High-intent coverage purpose selected",
    best_time_to_contact: "Best time to contact selected",
  };

  return labels[key] ?? key.replaceAll("_", " ");
}

function titleCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

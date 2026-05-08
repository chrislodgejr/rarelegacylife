import type { QuoteFormInput } from "@/lib/validation/forms";

export type LeadGrade = "A+" | "A" | "B" | "C" | "D" | "F";
export type LeadTemperature = "hot" | "warm" | "cold";

export function calculateLeadScore(input: QuoteFormInput) {
  let score = 0;
  const breakdown: Record<string, number> = {};

  if ((input.marital_status && input.marital_status !== "single") || input.dependents > 0) {
    breakdown.family_or_dependents = 20;
  }

  if ((input.desired_coverage_amount ?? 0) >= 250000) {
    breakdown.coverage_amount = 15;
  }

  if (input.preferred_contact_method) {
    breakdown.preferred_contact_method = 5;
  }

  if (input.health_rating === "excellent" || input.health_rating === "good") {
    breakdown.health_rating = 15;
  }

  if (!input.tobacco_use) {
    breakdown.non_tobacco = 10;
  }

  if (
    !input.current_coverage ||
    ["none", "no", "not enough", "not sure"].some((phrase) =>
      input.current_coverage?.toLowerCase().includes(phrase),
    )
  ) {
    breakdown.current_coverage_gap = 10;
  }

  const age = getAge(input.date_of_birth);
  if (age >= 25 && age <= 55) {
    breakdown.age_range = 15;
  }

  if (
    input.first_name &&
    input.last_name &&
    input.email &&
    input.phone &&
    input.date_of_birth &&
    input.state &&
    input.zip_code
  ) {
    breakdown.required_fields_complete = 10;
  }

  if (
    [
      "family_protection",
      "mortgage_protection",
      "business_protection",
      "wealth_transfer",
    ].includes(input.coverage_purpose)
  ) {
    breakdown.high_intent_coverage_purpose = 10;
  }

  if (input.best_time_to_contact) {
    breakdown.best_time_to_contact = 5;
  }

  score = Object.values(breakdown).reduce((total, value) => total + value, 0);
  const normalizedScore = Math.min(score, 100);
  const leadGrade = getLeadGrade(normalizedScore);
  const leadTemperature = getLeadTemperature(normalizedScore);

  return {
    lead_score: normalizedScore,
    lead_grade: leadGrade,
    lead_temperature: leadTemperature,
    lead_score_breakdown: breakdown,
    lead_score_reasons: getLeadScoreReasons(breakdown),
  };
}

function getAge(dateOfBirth: string) {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDelta = today.getMonth() - birthDate.getMonth();

  if (monthDelta < 0 || (monthDelta === 0 && today.getDate() < birthDate.getDate())) {
    age -= 1;
  }

  return age;
}

function getLeadGrade(score: number): LeadGrade {
  if (score >= 90) {
    return "A+";
  }

  if (score >= 80) {
    return "A";
  }

  if (score >= 70) {
    return "B";
  }

  if (score >= 60) {
    return "C";
  }

  if (score >= 40) {
    return "D";
  }

  return "F";
}

function getLeadTemperature(score: number): LeadTemperature {
  if (score >= 80) {
    return "hot";
  }

  if (score >= 60) {
    return "warm";
  }

  return "cold";
}

function getLeadScoreReasons(breakdown: Record<string, number>) {
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

  return Object.keys(breakdown).map((key) => labels[key] ?? key);
}

import { z } from "zod";
import {
  CONTACT_METHODS,
  COVERAGE_PURPOSES,
  HEALTH_RATINGS,
  LEAD_STATUSES,
  TASK_PRIORITIES,
  TASK_TYPES,
  US_STATES,
} from "@/lib/constants/options";
import { QUIZ_MONEY_VALUES, QUIZ_PAGE_KEYS, QUIZ_RETIRED_VALUES, QUIZ_WORRY_VALUES } from "@/lib/quiz";

const requiredText = z.string().trim().min(1, "This field is required");
const optionalText = z
  .string()
  .trim()
  .transform((value) => (value.length > 0 ? value : null))
  .optional()
  .nullable();

const checkbox = z.preprocess(
  (value) => value === "on" || value === "true" || value === true,
  z.boolean(),
);

const stateSchema = z
  .string()
  .trim()
  .transform((value) => value.toUpperCase())
  .pipe(z.enum(US_STATES));

const emailSchema = z.string().trim().email("Enter a valid email").toLowerCase();
/** A full US phone number: 10 digits, or 11 starting with the country code 1. */
export function isFullUsPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.length === 10 || (digits.length === 11 && digits.startsWith("1"));
}

// 2026-11-14: a 9-digit number came through the /protect form, so its estimate text could never arrive. Every form that asks for a
// phone now needs one that can be called and texted.
const phoneSchema = z
  .string()
  .trim()
  .min(7, "Enter your full 10-digit phone number")
  .max(32, "Phone number is too long")
  .refine(isFullUsPhone, "Enter your full 10-digit phone number");

const optionalAttribution = z
  .string()
  .trim()
  .max(500)
  .transform((value) => (value.length > 0 ? value : null))
  .optional()
  .nullable();

export const quoteFormSchema = z.object({
  first_name: requiredText.max(80),
  last_name: requiredText.max(80),
  email: emailSchema,
  phone: phoneSchema,
  date_of_birth: z
    .string()
    .refine((value) => !Number.isNaN(Date.parse(value)), "Enter a valid date")
    .refine((value) => new Date(value) <= new Date(), "Date of birth cannot be in the future"),
  state: stateSchema,
  zip_code: requiredText.regex(/^\d{5}(-\d{4})?$/, "Enter a valid ZIP code"),
  marital_status: optionalText,
  dependents: z.coerce.number().int().min(0).max(25),
  desired_coverage_amount: z
    .preprocess((value) => (value === "" || value == null ? null : value), z.coerce.number().positive().nullable())
    .optional(),
  coverage_purpose: z.enum(COVERAGE_PURPOSES),
  tobacco_use: z
    .enum(["yes", "no"])
    .transform((value) => value === "yes"),
  health_rating: z.enum(HEALTH_RATINGS),
  medical_conditions: optionalText,
  current_coverage: optionalText,
  preferred_contact_method: z.enum(CONTACT_METHODS),
  best_time_to_contact: optionalText,
  consent_tcpa: checkbox.refine((value) => value, "TCPA consent is required"),
  consent_privacy: checkbox.refine((value) => value, "Privacy consent is required"),
  consent_sms: checkbox.default(false),
  consent_email_marketing: checkbox.default(false),
  utm_source: optionalText,
  utm_medium: optionalText,
  utm_campaign: optionalText,
  utm_content: optionalText,
  utm_term: optionalText,
  landing_page: optionalText,
  referrer: optionalText,
});

export const contactFormSchema = z.object({
  name: requiredText.max(140),
  email: emailSchema,
  phone: z
    .string()
    .trim()
    .max(32)
    .transform((value) => (value.length > 0 ? value : null))
    .optional(),
  inquiry_type: z.enum([
    "get_coverage",
    "existing_client",
    "agent_opportunity",
    "partnership",
    "other",
  ]),
  message: requiredText.min(10, "Please include a little more detail").max(2500),
});

export const agentApplicationSchema = z.object({
  first_name: requiredText.max(80),
  last_name: requiredText.max(80),
  email: emailSchema,
  phone: phoneSchema,
  state: stateSchema,
  licensed: z.enum(["yes", "no"]).transform((value) => value === "yes"),
  license_number: optionalText,
  years_experience: z
    .preprocess((value) => (value === "" || value == null ? null : value), z.coerce.number().int().min(0).nullable())
    .optional(),
  current_agency: optionalText,
  interest_reason: requiredText.min(10).max(2500),
});

export const retirementBlueprintSchema = z.object({
  full_name: requiredText
    .min(3, "Enter your first and last name")
    .max(161, "Name is too long")
    .refine((value) => value.split(/\s+/).length >= 2, "Enter your first and last name"),
  phone: phoneSchema,
  email: emailSchema,
  zip_code: requiredText.regex(/^\d{5}(-\d{4})?$/, "Enter a valid ZIP code"),
  meeting_style: z.enum(["virtual", "home", "office", "phone"], {
    error: "Choose how you would like to meet",
  }),
  best_time_to_contact: requiredText
    .min(2, "Tell us a good day or time")
    .max(160, "Please keep this under 160 characters"),
  question: z
    .string()
    .trim()
    .max(2500, "Please keep this under 2,500 characters")
    .transform((value) => (value.length > 0 ? value : null))
    .optional(),
  consent_tcpa: checkbox.refine((value) => value, "Please review and accept the contact consent"),
  website: z.string().trim().max(200).optional().default(""),
  started_at: z.string().trim().max(32).optional().default(""),
  utm_source: optionalAttribution,
  utm_medium: optionalAttribution,
  utm_campaign: optionalAttribution,
  utm_content: optionalAttribution,
  utm_term: optionalAttribution,
  gclid: optionalAttribution,
  fbclid: optionalAttribution,
  msclkid: optionalAttribution,
  qr_source: optionalAttribution,
  landing_page: optionalAttribution,
  referrer: optionalAttribution,
});

// The Google Ads page, /protect (Chris, 2026-11-07): tiers "150-250k 250k-500k 500k-1m and 1m+", and under $150K is still a lead.
// Separate from the /retirement form, which is printed on a QR code and never changes.
export const PROTECT_AMOUNT_TIERS = [
  ["150k_250k", "$150K to $250K"],
  ["250k_500k", "$250K to $500K"],
  ["500k_1m", "$500K to $1M"],
  ["1m_plus", "$1M or more"],
  ["under_150k", "Under $150K"],
] as const;

// The estimate by text (Chris, 2026-11-13): the contact step is only name, phone, email and ZIP. "Best time to reach you" is gone from
// the form; Endless One still requires it on a retirement request, so the server sends this fixed answer.
export const PROTECT_BEST_TIME = "Ask on the call";

// The consent the /protect form shows beside its checkbox, recorded word for word with the request and sent to Endless One.
// Change the version whenever the words change.
export const PROTECT_CONSENT_TEXT =
  "I agree Rare Legacy Life Group and its licensed agents may call and text me at this number, including automated texts, about my request. Consent isn't required to buy. Msg & data rates may apply. Reply STOP to opt out.";
export const PROTECT_CONSENT_VERSION = "protect-v2";

/** The thank-you after a /protect request: never a figure, only that the estimate is coming by text (when there is one). */
export function protectSuccessMessage(firstName: string | null | undefined, estimateSent: boolean) {
  if (!estimateSent) return "Thank you. A licensed advisor will reach out shortly to set up your free review.";
  const name = firstName?.trim();
  return `${name ? `Thanks, ${name}.` : "Thanks."} Your estimate is on its way by text. We text between 8 a.m. and 9 p.m. your time, so if it's late it will arrive in the morning.`;
}

/** A hidden choice from the /protect form: absent or empty means not picked. */
const optionalChoice = <T extends readonly [string, ...string[]]>(values: T) =>
  z.preprocess((value) => (value === "" || value === null ? undefined : value), z.enum(values).optional());

export const protectRequestSchema = z.object({
  full_name: requiredText
    .min(3, "Enter your first and last name")
    .max(161, "Name is too long")
    .refine((value) => value.split(/\s+/).length >= 2, "Enter your first and last name"),
  phone: phoneSchema,
  email: emailSchema,
  zip_code: requiredText.regex(/^\d{5}(-\d{4})?$/, "Enter a valid ZIP code"),
  amount_tier: z.enum(["150k_250k", "250k_500k", "500k_1m", "1m_plus", "under_150k"], {
    error: "Choose about how much you want to protect",
  }),
  // The tap choices behind the estimate, as src/lib/estimates/income-estimate.ts accepts them; the server works the estimate out itself.
  goal: optionalChoice(["income", "growth", "indexed"] as const),
  age_band: optionalChoice(["55_59", "60_64", "65_69", "70_74", "75_plus"] as const),
  term_years: optionalChoice(["5", "7", "10"] as const),
  // The quiz pages (src/lib/quiz.ts) send the same request with their extra taps and which page it came from; /protect sends none.
  quiz_page: optionalChoice(QUIZ_PAGE_KEYS),
  retired: optionalChoice(QUIZ_RETIRED_VALUES),
  worry: optionalChoice(QUIZ_WORRY_VALUES),
  money_location: optionalChoice(QUIZ_MONEY_VALUES),
  consent_tcpa: checkbox.refine((value) => value, "Please review and accept the contact consent"),
  website: z.string().trim().max(200).optional().default(""),
  started_at: z.string().trim().max(32).optional().default(""),
  utm_source: optionalAttribution,
  utm_medium: optionalAttribution,
  utm_campaign: optionalAttribution,
  utm_content: optionalAttribution,
  utm_term: optionalAttribution,
  gclid: optionalAttribution,
  gbraid: optionalAttribution,
  wbraid: optionalAttribution,
  landing_page: optionalAttribution,
  referrer: optionalAttribution,
});

// The quiz's name and email screen (Chris, 2026-11-24: "i think an email only drop off should be classified as a prospect"): what
// goes to Endless One when someone taps Continue there, before any phone, ZIP or consent is asked. The same taps as the finished
// request; the server works the estimate out itself.
export const quizProspectSchema = z.object({
  first_name: requiredText.max(80, "Name is too long"),
  last_name: requiredText.max(80, "Name is too long"),
  email: emailSchema,
  amount_tier: protectRequestSchema.shape.amount_tier,
  quiz_page: z.enum(QUIZ_PAGE_KEYS),
  goal: protectRequestSchema.shape.goal,
  age_band: protectRequestSchema.shape.age_band,
  term_years: protectRequestSchema.shape.term_years,
  retired: protectRequestSchema.shape.retired,
  worry: protectRequestSchema.shape.worry,
  money_location: protectRequestSchema.shape.money_location,
  website: z.string().trim().max(200).optional().default(""),
  started_at: z.string().trim().max(32).optional().default(""),
  utm_source: optionalAttribution,
  utm_medium: optionalAttribution,
  utm_campaign: optionalAttribution,
  utm_content: optionalAttribution,
  utm_term: optionalAttribution,
  gclid: optionalAttribution,
  gbraid: optionalAttribution,
  wbraid: optionalAttribution,
  landing_page: optionalAttribution,
});

export const leadStatusSchema = z.object({
  lead_id: z.string().uuid(),
  status: z.enum(LEAD_STATUSES),
});

export const noteSchema = z.object({
  lead_id: z.string().uuid(),
  note: requiredText.min(2).max(5000),
});

export const taskSchema = z.object({
  lead_id: z.string().uuid(),
  title: requiredText.max(180),
  description: optionalText,
  due_date: z
    .string()
    .trim()
    .transform((value) => (value.length > 0 ? value : null))
    .nullable()
    .optional(),
  priority: z.enum(TASK_PRIORITIES),
  task_type: z.enum(TASK_TYPES),
});

export const assignmentSchema = z.object({
  lead_id: z.string().uuid(),
  agent_id: z
    .string()
    .trim()
    .transform((value) => (value.length > 0 ? value : null))
    .nullable(),
});

export const userApprovalSchema = z.object({
  profile_id: z.string().uuid(),
  role: z.enum(["admin", "manager", "agent", "client", "support"]),
  status: z.enum(["active", "inactive"]),
});

export const leadEmailSchema = z.object({
  lead_id: z.string().uuid(),
  subject: requiredText.min(3).max(180),
  body: requiredText.min(10).max(5000),
});

export const leadChatMessageSchema = z.object({
  lead_id: z.string().uuid(),
  body: requiredText.min(1).max(5000),
});

export const internalChatMessageSchema = z.object({
  thread_id: z.string().uuid(),
  body: requiredText.min(1).max(5000),
});

export type QuoteFormInput = z.infer<typeof quoteFormSchema>;
export type ContactFormInput = z.infer<typeof contactFormSchema>;
export type AgentApplicationInput = z.infer<typeof agentApplicationSchema>;
export type RetirementBlueprintInput = z.infer<typeof retirementBlueprintSchema>;

/** The free course's unlock (Chris, 2026-11-24: "yes build the free annuities course too"): a name and an email open every lesson. */
export const courseSignupSchema = z.object({
  first_name: requiredText.max(80, "Name is too long"),
  last_name: requiredText.max(80, "Name is too long"),
  email: emailSchema,
  website: z.string().trim().max(200).optional().default(""),
  started_at: z.string().trim().max(32).optional().default(""),
  utm_source: optionalAttribution,
  utm_medium: optionalAttribution,
  utm_campaign: optionalAttribution,
  utm_content: optionalAttribution,
  utm_term: optionalAttribution,
  gclid: optionalAttribution,
  gbraid: optionalAttribution,
  wbraid: optionalAttribution,
  landing_page: optionalAttribution,
});

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
const phoneSchema = z
  .string()
  .trim()
  .min(7, "Enter a valid phone number")
  .max(32, "Phone number is too long");

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

import type {
  APP_ROLES,
  CONTACT_METHODS,
  COVERAGE_PURPOSES,
  HEALTH_RATINGS,
  LEAD_STATUSES,
  TASK_PRIORITIES,
  TASK_STATUSES,
  TASK_TYPES,
} from "@/lib/constants/options";

export type AppRole = (typeof APP_ROLES)[number];
export type LeadStatus = (typeof LEAD_STATUSES)[number];
export type LeadGrade = "A+" | "A" | "B" | "C" | "D" | "F";
export type CoveragePurpose = (typeof COVERAGE_PURPOSES)[number];
export type HealthRating = (typeof HEALTH_RATINGS)[number];
export type ContactMethod = (typeof CONTACT_METHODS)[number];
export type TaskStatus = (typeof TASK_STATUSES)[number];
export type TaskPriority = (typeof TASK_PRIORITIES)[number];
export type TaskType = (typeof TASK_TYPES)[number];

export type Profile = {
  id: string;
  auth_user_id: string;
  email: string;
  full_name: string | null;
  role: AppRole;
  phone: string | null;
  state: string | null;
  status: "pending" | "active" | "inactive";
  avatar_url: string | null;
  approved_at: string | null;
  created_at: string;
  updated_at: string;
};

export type Agent = {
  id: string;
  profile_id: string | null;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  state: string | null;
  active: boolean;
  accepts_new_leads: boolean;
  max_active_leads: number;
  current_active_leads: number;
  team_id: string | null;
  last_assigned_at: string | null;
  lead_weight: number;
};

export type Lead = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  state: string;
  zip_code: string;
  marital_status: string | null;
  dependents: number;
  desired_coverage_amount: number | null;
  coverage_purpose: CoveragePurpose;
  tobacco_use: boolean;
  health_rating: HealthRating;
  medical_conditions: string | null;
  current_coverage: string | null;
  preferred_contact_method: ContactMethod;
  best_time_to_contact: string | null;
  source: string;
  status: LeadStatus;
  lead_score: number;
  lead_grade: LeadGrade;
  lead_temperature: "hot" | "warm" | "cold";
  lead_score_breakdown: Record<string, number>;
  quote_email_otp_verified: boolean;
  quote_email_otp_verified_at: string | null;
  quote_auth_user_id: string | null;
  assigned_agent_id: string | null;
  assigned_at: string | null;
  first_contacted_at: string | null;
  last_contacted_at: string | null;
  next_follow_up_at: string | null;
  last_activity_at: string | null;
  stale_at: string | null;
  sla_status: "on_track" | "at_risk" | "breached";
  created_at: string;
  updated_at: string;
};

export type CrmNotification = {
  id: string;
  profile_id: string;
  actor_profile_id: string | null;
  lead_id: string | null;
  title: string;
  body: string | null;
  notification_type: string;
  priority: TaskPriority;
  read_at: string | null;
  created_at: string;
};

export type ChatThread = {
  id: string;
  lead_id: string | null;
  name: string | null;
  thread_type: "lead" | "internal";
  visibility: "lead" | "team" | "company" | "direct";
  created_by: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export type ChatMessage = {
  id: string;
  thread_id: string;
  sender_profile_id: string | null;
  body: string;
  channel: "email" | "sms" | "call" | "chat" | "system";
  created_at: string;
  edited_at: string | null;
  deleted_at: string | null;
};

export const APP_ROLES = [
  "pending",
  "admin",
  "manager",
  "agent",
  "client",
  "support",
] as const;

export const ACTIVE_CRM_ROLES = ["admin", "manager", "agent"] as const;
export const ADMIN_ROLES = ["admin", "manager"] as const;

export const LEAD_STATUSES = [
  "new",
  "assigned",
  "contacted",
  "scheduled",
  "quoted",
  "application_started",
  "application_submitted",
  "underwriting",
  "approved",
  "placed",
  "lost",
  "not_qualified",
  "do_not_contact",
] as const;

export const TASK_STATUSES = [
  "open",
  "in_progress",
  "completed",
  "cancelled",
  "overdue",
] as const;

export const TASK_PRIORITIES = ["low", "medium", "high", "urgent"] as const;

export const TASK_TYPES = [
  "call",
  "text",
  "email",
  "appointment",
  "document_request",
  "application_follow_up",
  "underwriting_follow_up",
  "policy_delivery",
  "general_follow_up",
] as const;

export const COVERAGE_PURPOSES = [
  "family_protection",
  "mortgage_protection",
  "final_expenses",
  "business_protection",
  "wealth_transfer",
  "not_sure_yet",
] as const;

export const HEALTH_RATINGS = ["excellent", "good", "fair", "poor"] as const;
export const CONTACT_METHODS = ["phone", "sms", "email"] as const;

export const US_STATES = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
  "DC",
] as const;

export const PUBLIC_NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/education", label: "Education" },
  { href: "/agent-opportunity", label: "Agents" },
  { href: "/contact", label: "Contact" },
] as const;

export const ROLE_LABELS: Record<(typeof APP_ROLES)[number], string> = {
  pending: "Pending",
  admin: "Admin",
  manager: "Manager",
  agent: "Agent",
  client: "Client",
  support: "Support",
};

export const STATUS_LABELS: Record<(typeof LEAD_STATUSES)[number], string> = {
  new: "New",
  assigned: "Assigned",
  contacted: "Contacted",
  scheduled: "Scheduled",
  quoted: "Quoted",
  application_started: "Application Started",
  application_submitted: "Application Submitted",
  underwriting: "Underwriting",
  approved: "Approved",
  placed: "Placed",
  lost: "Lost",
  not_qualified: "Not Qualified",
  do_not_contact: "Do Not Contact",
};

export const COVERAGE_LABELS: Record<(typeof COVERAGE_PURPOSES)[number], string> = {
  family_protection: "Family protection",
  mortgage_protection: "Mortgage protection",
  final_expenses: "Final expenses",
  business_protection: "Business protection",
  wealth_transfer: "Wealth transfer",
  not_sure_yet: "Not sure yet",
};

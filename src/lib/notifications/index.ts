import { sendEmail } from "@/lib/email/provider";
import { getSiteUrl } from "@/lib/env";
import { createAdminClient } from "@/lib/supabase/admin";

type NewLeadNotification = {
  leadId: string;
  leadName: string;
  state: string;
  coveragePurpose: string;
  leadScore: number;
  leadGrade: string;
  leadTemperature: string;
  assignedAgentEmail?: string | null;
};

export async function sendNewLeadNotification(input: NewLeadNotification) {
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
  const recipients = [input.assignedAgentEmail, adminEmail].filter(Boolean) as string[];

  if (recipients.length === 0) {
    return;
  }

  const dashboardLink = `${getSiteUrl()}/admin/leads/${input.leadId}`;
  const subject = `New ${input.leadGrade} ${titleCase(input.leadTemperature)} Lead Submitted`;
  const text = [
    "New lead submitted",
    `Name: ${input.leadName}`,
    `State: ${input.state}`,
    `Coverage purpose: ${input.coveragePurpose}`,
    `Lead score: ${input.leadScore}`,
    `Lead grade: ${input.leadGrade}`,
    `Temperature: ${titleCase(input.leadTemperature)}`,
    `Secure dashboard link: ${dashboardLink}`,
  ].join("\n");

  await sendEmail({
    to: recipients,
    subject,
    text,
    html: text.replaceAll("\n", "<br />"),
  });

  await logCommunication({
    leadId: input.leadId,
    channel: "email",
    direction: "internal",
    provider: "resend",
    subject,
    body: "New lead notification sent with minimal lead details.",
    status: "sent",
  });
}

function titleCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export async function sendAgentApplicationNotification(input: {
  name: string;
  email: string;
  state: string;
}) {
  const to = process.env.ADMIN_NOTIFICATION_EMAIL;

  if (!to) {
    return;
  }

  await sendEmail({
    to,
    subject: `New agent application: ${input.name}`,
    text: `New agent application\nName: ${input.name}\nEmail: ${input.email}\nState: ${input.state}`,
  });
}

export async function sendContactMessageNotification(input: {
  name: string;
  email: string;
  inquiryType: string;
}) {
  const to = process.env.ADMIN_NOTIFICATION_EMAIL;

  if (!to) {
    return;
  }

  await sendEmail({
    to,
    subject: `New contact message: ${input.inquiryType}`,
    text: `New contact message\nName: ${input.name}\nEmail: ${input.email}\nInquiry: ${input.inquiryType}`,
  });
}

export async function sendPendingUserNotification(input: { email: string; profileId: string }) {
  const to = process.env.ADMIN_NOTIFICATION_EMAIL;

  if (!to) {
    return;
  }

  await sendEmail({
    to,
    subject: "New pending portal user",
    text: `A new user needs approval.\nEmail: ${input.email}\nProfile ID: ${input.profileId}\nUsers: ${getSiteUrl()}/admin/users`,
  });
}

export async function sendUserApprovedNotification(input: { email: string; role: string }) {
  await sendEmail({
    to: input.email,
    subject: "Your Rare Legacy Life portal access is approved",
    text: `Your account has been approved with the role: ${input.role}.\nSign in: ${getSiteUrl()}/login`,
  });
}

async function logCommunication(input: {
  leadId?: string;
  channel: "email" | "sms" | "call" | "system";
  direction: "inbound" | "outbound" | "internal";
  provider?: string;
  subject?: string;
  body?: string;
  status: "queued" | "sent" | "delivered" | "failed" | "received";
}) {
  if (!input.leadId || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return;
  }

  const admin = createAdminClient();
  await admin.from("communications").insert({
    lead_id: input.leadId,
    channel: input.channel,
    direction: input.direction,
    provider: input.provider,
    subject: input.subject,
    body: input.body,
    status: input.status,
    sent_at: input.status === "sent" ? new Date().toISOString() : null,
  });
}

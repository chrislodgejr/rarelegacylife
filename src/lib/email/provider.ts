import { Resend } from "resend";

type EmailPayload = {
  to: string | string[];
  subject: string;
  text: string;
  html?: string;
};

export async function sendEmail(payload: EmailPayload) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !from) {
    console.info("Email skipped because Resend environment variables are not configured.");
    return { skipped: true };
  }

  const resend = new Resend(apiKey);

  const { data, error } = await resend.emails.send({
    from,
    ...payload,
  });

  if (error) {
    throw new Error(error.message);
  }

  return { skipped: false, data };
}

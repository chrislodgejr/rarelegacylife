type SmsPayload = {
  to: string;
  body: string;
  leadId?: string;
};

export async function sendSms(payload: SmsPayload) {
  void payload;

  if (!process.env.SIGNALHOUSE_API_KEY || !process.env.SIGNALHOUSE_FROM_NUMBER) {
    console.info("SMS skipped because Signalhouse environment variables are not configured.");
    return { skipped: true };
  }

  throw new Error("Signalhouse provider is not implemented yet.");
}

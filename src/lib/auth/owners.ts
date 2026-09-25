/** Explicitly authorized CRM sign-ins. Keep access narrow and review changes. */
export function isCrmOwnerEmail(email?: string | null) {
  return ["chris@endlessconsulting.co", "dan@endlessconsulting.co", "christian@rarelegacylife.com"].includes(email?.toLowerCase() ?? "");
}

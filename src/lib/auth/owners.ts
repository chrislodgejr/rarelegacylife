/** The two authorized CRM sign-ins. Update only after an explicit access review. */
export function isCrmOwnerEmail(email?: string | null) {
  return ["chris@endlessconsulting.co", "dan@endlessconsulting.co"].includes(email?.toLowerCase() ?? "");
}

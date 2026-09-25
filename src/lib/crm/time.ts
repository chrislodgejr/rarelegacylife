/** Calculated once per server request for relative CRM reporting. */
export function crmClock() {
  const now = new Date();
  return { now: now.getTime(), weekStart: now.getTime() - 7 * 86400000 };
}

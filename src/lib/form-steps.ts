import type { FormStep } from "@/lib/endless-one/intake";

// The /protect page's steps, from the browser (Chris, 2026-11-12: "Is there a way to know if a person is filling it out and just not
// clicking submit"). One random id per page load, never tied to a person; each step (and detail) is sent once, as it happens, to
// /api/form-steps, which passes it to Endless One. Only a step's name and a fixed detail (a field's name, the goal, the amount tier)
// are ever sent, never a typed value.

const ENDPOINT = "/api/form-steps";

function randomId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") return crypto.randomUUID();
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export type FormStepReporter = (step: FormStep, detail?: string) => void;

/** A reporter for one page visit. `fromAd`: the visit came from an ad click (a Google click id in the address). */
export function formStepReporter(fromAd: boolean): FormStepReporter {
  const visitId = randomId();
  const mobile = typeof window !== "undefined" && window.matchMedia?.("(pointer: coarse)").matches === true;
  const sent = new Set<string>();
  return (step, detail = "") => {
    const key = `${step}|${detail}`;
    if (sent.has(key) || typeof window === "undefined") return;
    sent.add(key);
    const body = JSON.stringify({ visitId, fromAd, mobile, steps: [{ step, detail }] });
    try {
      if (navigator.sendBeacon?.(ENDPOINT, new Blob([body], { type: "application/json" }))) return;
    } catch {
      // Fall through to fetch.
    }
    fetch(ENDPOINT, { method: "POST", body, headers: { "content-type": "application/json" }, keepalive: true }).catch(() => {});
  };
}

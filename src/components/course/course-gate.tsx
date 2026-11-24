"use client";

import { Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef } from "react";
import { Field, type ProtectTracking } from "@/components/forms/protect-form";
import { SubmitButton } from "@/components/forms/submit-button";
import { signUpForCourse, type CourseSignupState } from "@/server/actions/course-signup";

const initialState: CourseSignupState = { ok: false };

/** The free course's one form: a name and an email open every lesson. */
export function CourseGate({ tracking, lessonCount }: { tracking: ProtectTracking; lessonCount: number }) {
  const [state, action] = useActionState(signUpForCourse, initialState);
  const router = useRouter();
  const startedAt = useRef<HTMLInputElement>(null);
  const landingPage = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (startedAt.current && !startedAt.current.value) startedAt.current.value = String(Date.now());
    if (landingPage.current && !landingPage.current.value) landingPage.current.value = window.location.href;
  }, []);

  useEffect(() => {
    if (state.ok) router.refresh();
  }, [state.ok, router]);

  const error = (field: "first_name" | "last_name" | "email") =>
    state.fieldErrors?.[field] ? <span className="mt-1 block text-sm text-red-700">{state.fieldErrors[field]}</span> : null;

  return (
    <form action={action} className="space-y-4 rounded-2xl bg-white p-6 text-[#050505] shadow-sm ring-1 ring-black/5 sm:p-7">
      <div>
        <h2 className="font-premium text-2xl font-semibold">Watch all {lessonCount} lessons free</h2>
        <p className="mt-1 text-sm leading-6 text-neutral-600">Tell us who you are and every lesson opens right away.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="First name" name="first_name" autoComplete="given-name" required error={error("first_name")} />
        <Field label="Last name" name="last_name" autoComplete="family-name" required error={error("last_name")} />
      </div>
      <Field label="Email" name="email" type="email" autoComplete="email" required error={error("email")} />
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
      <input type="hidden" name="started_at" ref={startedAt} />
      <input type="hidden" name="landing_page" ref={landingPage} />
      {Object.entries(tracking).map(([key, value]) => (
        <input key={key} type="hidden" name={key} value={value ?? ""} />
      ))}
      <SubmitButton>Start the free course</SubmitButton>
      <p className="flex items-start gap-2 text-xs leading-5 text-neutral-500">
        <Lock aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        Free. A licensed Rare Legacy advisor may email you once to see if you have questions. Your information is never sold.
      </p>
    </form>
  );
}

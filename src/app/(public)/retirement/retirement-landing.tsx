"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  Home,
  Phone,
  ShieldCheck,
  Video,
} from "lucide-react";
import { useActionState, useCallback, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import {
  RetirementBlueprintState,
  submitRetirementBlueprint,
} from "@/server/actions/retirement-blueprint";
import {
  RETIREMENT_SCHEDULER_URLS,
  RetirementMeetingStyle,
} from "@/lib/constants/retirement";
import styles from "./retirement.module.css";

type MeetingStyle = RetirementMeetingStyle;
type Attribution = Record<
  | "utm_source"
  | "utm_medium"
  | "utm_campaign"
  | "utm_content"
  | "utm_term"
  | "gclid"
  | "fbclid"
  | "msclkid"
  | "qr_source",
  string
>;

const initialState: RetirementBlueprintState = { ok: false, message: "" };
const emptyAttribution: Attribution = {
  utm_source: "",
  utm_medium: "",
  utm_campaign: "",
  utm_content: "",
  utm_term: "",
  gclid: "",
  fbclid: "",
  msclkid: "",
  qr_source: "",
};

const meetingOptions: Array<{
  value: MeetingStyle;
  title: string;
  description: string;
  icon: typeof Video;
}> = [
  {
    value: "virtual",
    title: "Virtual Meeting",
    description: "Meet securely from anywhere",
    icon: Video,
  },
  {
    value: "home",
    title: "We Come to You",
    description: "Meet at your home or another convenient location",
    icon: Home,
  },
  {
    value: "office",
    title: "Visit Our Office",
    description: "59 W. Germantown Pike, East Norriton, PA 19403",
    icon: Building2,
  },
  {
    value: "phone",
    title: "Start by Phone",
    description: "Request a call at a time you choose",
    icon: Phone,
  },
];

const meetingLabels: Record<MeetingStyle, string> = {
  virtual: "Virtual Meeting",
  home: "We Come to You",
  office: "Visit Our Office",
  phone: "Start by Phone",
};

const coverageItems = [
  "Your current and future retirement income sources",
  "When and how you may begin taking income",
  "Market risk, liquidity and important trade-offs",
  "How your plan aligns with your family and legacy goals",
  "Clear, education-first next steps based on your situation",
];

const faqs = [
  {
    question: "Is the consultation really complimentary?",
    answer:
      "Yes. The 30-minute Retirement Income Blueprint review is complimentary. Its purpose is to help you understand how the pieces of your retirement plan work together.",
  },
  {
    question: "Do I need to meet in person?",
    answer:
      "No. You may meet virtually, begin by phone, visit our East Norriton office, or ask us to meet at a convenient location.",
  },
  {
    question: "What should I bring?",
    answer:
      "If available, bring a recent Social Security estimate, pension information, retirement-account statements, and any questions you want to cover. Exact documents are not required for the introductory conversation.",
  },
  {
    question: "Will I be required to purchase anything?",
    answer:
      "No. There is no obligation to purchase a product or move forward with any recommendation.",
  },
  {
    question: "Can Rare Legacy work with clients outside Pennsylvania?",
    answer:
      "Insurance services are available in 49 states, excluding California, only where the appropriate professional is properly licensed and appointed and the product is available. We will confirm availability before moving forward.",
  },
];

export function RetirementLanding() {
  const [state, formAction] = useActionState(submitRetirementBlueprint, initialState);
  const [meetingStyle, setMeetingStyle] = useState<MeetingStyle | "">("");
  const [attribution, setAttribution] = useState<Attribution>(emptyAttribution);
  const [startedAt, setStartedAt] = useState("");
  const [pageContext, setPageContext] = useState({ landingPage: "", referrer: "" });
  const meetingSectionRef = useRef<HTMLElement>(null);
  const formSectionRef = useRef<HTMLElement>(null);
  const formStartedRef = useRef(false);
  const submittedRef = useRef(false);
  const trackedRequestRef = useRef<string | null>(null);
  const trackedAppointmentRef = useRef<string | null>(null);
  const attributionRef = useRef<Attribution>(emptyAttribution);
  const sessionIdRef = useRef("");
  const meetingStyleRef = useRef<MeetingStyle | "">("");

  const trackEvent = useCallback(
    (
      eventName:
        | "qr_landing_visit"
        | "meeting_option_click"
        | "form_start"
        | "form_submission"
        | "form_submission_success"
        | "form_validation_error"
        | "form_submission_error"
        | "successful_appointment",
      metadata: Record<string, unknown> = {},
      requestId?: string,
    ) => {
      const sessionId = sessionIdRef.current || getSessionId();
      sessionIdRef.current = sessionId;
      const payload = {
        event_name: eventName,
        request_id: requestId ?? null,
        session_id: sessionId,
        meeting_style:
          typeof metadata.option === "string" ? metadata.option : meetingStyleRef.current || null,
        page_url: window.location.href,
        referrer: document.referrer || null,
        ...attributionRef.current,
        metadata,
      };

      const analyticsWindow = window as Window & {
        dataLayer?: Array<Record<string, unknown>>;
      };
      analyticsWindow.dataLayer = analyticsWindow.dataLayer ?? [];
      analyticsWindow.dataLayer.push({ event: eventName, ...payload });

      void fetch("/api/retirement/events", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(() => undefined);
    },
    [],
  );

  useEffect(() => {
    const search = new URLSearchParams(window.location.search);
    const captured = Object.keys(emptyAttribution).reduce<Attribution>((values, key) => {
      values[key as keyof Attribution] = search.get(key) ?? "";
      return values;
    }, { ...emptyAttribution });

    if (!captured.qr_source && captured.utm_medium === "direct_mail") {
      captured.qr_source = "direct_mail";
    }

    attributionRef.current = captured;
    sessionIdRef.current = getSessionId();

    const animationFrame = window.requestAnimationFrame(() => {
      setAttribution(captured);
      setStartedAt(String(Date.now()));
      setPageContext({ landingPage: window.location.href, referrer: document.referrer });
    });

    trackEvent("qr_landing_visit", { entry: "page_load" });

    if (search.get("appointment") === "confirmed") {
      trackEvent("successful_appointment", {
        appointment_id: search.get("appointment_id") ?? "redirect",
        source: "confirmation_redirect",
      });
    }

    return () => window.cancelAnimationFrame(animationFrame);
  }, [trackEvent]);

  useEffect(() => {
    if (!state.ok || !state.requestId) {
      return;
    }

    function handleSchedulerMessage(event: MessageEvent<unknown>) {
      if (event.origin !== "https://scheduler.zoom.us") {
        return;
      }

      if (!isZoomBookingMessage(event.data)) {
        return;
      }

      const appointmentId = event.data.payload.scheduledEventId;
      if (trackedAppointmentRef.current === appointmentId) {
        return;
      }

      trackedAppointmentRef.current = appointmentId;
      trackEvent(
        "successful_appointment",
        {
          appointment_id: appointmentId,
          attendee_id: event.data.payload.attendeeId,
          source: "zoom_scheduler_embed",
        },
        state.requestId,
      );
    }

    window.addEventListener("message", handleSchedulerMessage);
    return () => window.removeEventListener("message", handleSchedulerMessage);
  }, [state.ok, state.requestId, trackEvent]);

  useEffect(() => {
    if (state.ok && state.requestId && trackedRequestRef.current !== state.requestId) {
      trackedRequestRef.current = state.requestId;
      trackEvent("form_submission_success", {}, state.requestId);
      formSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    if (submittedRef.current && !state.ok && state.message) {
      trackEvent(state.fieldErrors ? "form_validation_error" : "form_submission_error", {
        fields: Object.keys(state.fieldErrors ?? {}),
      });
      submittedRef.current = false;
    }

    if (state.fieldErrors?.meeting_style) {
      meetingSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [state, trackEvent]);

  function chooseMeeting(value: MeetingStyle, moveToForm = false) {
    meetingStyleRef.current = value;
    setMeetingStyle(value);
    trackEvent("meeting_option_click", { option: value });

    if (moveToForm) {
      window.setTimeout(() => {
        formSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    }
  }

  function beginForm() {
    if (formStartedRef.current) {
      return;
    }
    formStartedRef.current = true;
    trackEvent("form_start");
  }

  function handleSubmit() {
    submittedRef.current = true;
    trackEvent("form_submission");
  }

  const schedulerUrl = meetingStyle
    ? buildEmbeddedSchedulerUrl(meetingStyle, attribution)
    : null;

  return (
    <div className={styles.page}>
      <a className={styles.skipLink} href="#main-content">
        Skip to main content
      </a>

      <main id="main-content">
        <section aria-labelledby="hero-title" className={styles.hero}>
          <div className={styles.heroInner}>
            <div className={styles.heroCopy}>
              <p className={styles.eyebrow}>Complimentary Retirement Income Blueprint</p>
              <h1 id="hero-title">Turn what you&apos;ve saved into the life you&apos;ve planned.</h1>
              <p className={styles.heroSupporting}>
                Meet with a licensed Rare Legacy professional to review how your retirement income,
                market risk, liquidity and legacy goals work together.
              </p>
              <button
                className={styles.primaryButton}
                onClick={() =>
                  meetingSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
                }
                type="button"
              >
                Choose How You&apos;d Like to Meet
                <ArrowRight aria-hidden="true" size={19} />
              </button>
              <p className={styles.trustLine}>
                <ShieldCheck aria-hidden="true" size={18} />
                Complimentary 30-minute review. No pressure. Just clarity.
              </p>
            </div>

            <div className={styles.heroVisual}>
              <Image
                alt="A retired couple enjoying a walk together in a landscaped park"
                fill
                priority
                sizes="(max-width: 767px) 100vw, 44vw"
                src="https://images.pexels.com/photos/8972326/pexels-photo-8972326.jpeg?auto=compress&cs=tinysrgb&w=1600"
              />
              <div aria-hidden="true" className={styles.imageVeil} />
              <p className={styles.photoNote}>A clearer plan for what comes next.</p>
            </div>
          </div>
        </section>

        <section
          aria-labelledby="meeting-title"
          className={styles.meetingSection}
          ref={meetingSectionRef}
        >
          <div className={styles.sectionInner}>
            <div className={styles.centerHeading}>
              <p className={styles.sectionEyebrow}>Meet on your terms</p>
              <h2 id="meeting-title">Choose the setting that feels right.</h2>
              <p>You decide how the conversation begins. You can change your preference later.</p>
            </div>

            <fieldset className={styles.meetingFieldset}>
              <legend className={styles.srOnly}>Preferred meeting style</legend>
              <div className={styles.meetingGrid}>
                {meetingOptions.map((option) => {
                  const Icon = option.icon;
                  const selected = meetingStyle === option.value;

                  return (
                    <button
                      aria-pressed={selected}
                      className={`${styles.meetingCard} ${selected ? styles.meetingCardSelected : ""}`}
                      key={option.value}
                      onClick={() => chooseMeeting(option.value)}
                      type="button"
                    >
                      <span className={styles.meetingIcon}>
                        <Icon aria-hidden="true" size={25} strokeWidth={1.6} />
                      </span>
                      <span className={styles.meetingText}>
                        <strong>{option.title}</strong>
                        <span>{option.description}</span>
                      </span>
                      <span aria-hidden="true" className={styles.selectionMark}>
                        {selected ? <Check size={16} strokeWidth={2.5} /> : null}
                      </span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            {meetingStyle ? (
              <button
                className={styles.continueButton}
                onClick={() =>
                  formSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
                }
                type="button"
              >
                Continue with {meetingLabels[meetingStyle]}
                <ArrowRight aria-hidden="true" size={18} />
              </button>
            ) : null}
          </div>
        </section>

        <section aria-labelledby="coverage-title" className={styles.valueSection}>
          <div className={styles.valueInner}>
            <div className={styles.valueHeading}>
              <p className={styles.sectionEyebrow}>A focused conversation</p>
              <h2 id="coverage-title">What We&apos;ll Cover</h2>
              <p>
                We&apos;ll look at the whole picture, explain the trade-offs in plain language, and
                help you identify the questions that matter most.
              </p>
            </div>
            <ul className={styles.coverageList}>
              {coverageItems.map((item) => (
                <li key={item}>
                  <span aria-hidden="true">
                    <Check size={16} strokeWidth={2.4} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section aria-labelledby="form-title" className={styles.formSection} ref={formSectionRef}>
          <div className={styles.formLayout}>
            <div className={styles.formIntro}>
              <p className={styles.sectionEyebrow}>Your next step</p>
              <h2 id="form-title">Request your complimentary blueprint.</h2>
              <p>
                Share a few details first so Christian receives your request. Virtual and phone
                visitors can then choose a time without leaving this page; for home and office
                meetings, Christian will reach out to confirm the details.
              </p>
              <div className={styles.assuranceCard}>
                <CalendarDays aria-hidden="true" size={24} strokeWidth={1.6} />
                <div>
                  <strong>About 30 minutes</strong>
                  <span>Education-first and tailored to your situation</span>
                </div>
              </div>
            </div>

            <div className={styles.formCard}>
              {state.ok ? (
                <div className={styles.successState}>
                  <div aria-live="polite" role="status">
                    <span className={styles.successIcon}>
                      <CheckCircle2 aria-hidden="true" size={32} strokeWidth={1.7} />
                    </span>
                    <p className={styles.successEyebrow}>Request received</p>
                    <h3>Now choose a time with Christian.</h3>
                    <p>{state.message}</p>
                  </div>
                  {schedulerUrl && meetingStyle ? (
                    <div className={styles.schedulerEmbed}>
                      <iframe
                        allow="clipboard-write"
                        loading="lazy"
                        onLoad={() =>
                          trackEvent("meeting_option_click", {
                            option: meetingStyle,
                            action: "embedded_zoom_scheduler_loaded",
                          }, state.requestId)
                        }
                        src={schedulerUrl}
                        title={`Choose a time for your ${meetingLabels[meetingStyle]} with Christian`}
                      />
                      <p>
                        If the scheduler does not display, use the secure fallback link to{" "}
                        <a href={schedulerUrl} rel="noopener noreferrer" target="_blank">
                          open Zoom Scheduler
                        </a>.
                      </p>
                    </div>
                  ) : null}
                </div>
              ) : (
                <form
                  action={formAction}
                  className={styles.form}
                  noValidate
                  onFocusCapture={beginForm}
                  onSubmit={handleSubmit}
                >
                  <div className={styles.field}>
                    <label htmlFor="full_name">First and last name</label>
                    <input
                      aria-describedby={fieldDescriptionId(state, "full_name")}
                      aria-invalid={Boolean(state.fieldErrors?.full_name)}
                      autoComplete="name"
                      id="full_name"
                      name="full_name"
                      placeholder="Your full name"
                      required
                      type="text"
                    />
                    <FieldError error={state.fieldErrors?.full_name} field="full_name" />
                  </div>

                  <div className={styles.fieldRow}>
                    <div className={styles.field}>
                      <label htmlFor="phone">Mobile phone</label>
                      <input
                        aria-describedby={fieldDescriptionId(state, "phone")}
                        aria-invalid={Boolean(state.fieldErrors?.phone)}
                        autoComplete="tel"
                        id="phone"
                        inputMode="tel"
                        name="phone"
                        placeholder="(215) 555-0123"
                        required
                        type="tel"
                      />
                      <FieldError error={state.fieldErrors?.phone} field="phone" />
                    </div>
                    <div className={styles.field}>
                      <label htmlFor="email">Email address</label>
                      <input
                        aria-describedby={fieldDescriptionId(state, "email")}
                        aria-invalid={Boolean(state.fieldErrors?.email)}
                        autoComplete="email"
                        id="email"
                        inputMode="email"
                        name="email"
                        placeholder="you@example.com"
                        required
                        type="email"
                      />
                      <FieldError error={state.fieldErrors?.email} field="email" />
                    </div>
                  </div>

                  <div className={styles.fieldRow}>
                    <div className={`${styles.field} ${styles.zipField}`}>
                      <label htmlFor="zip_code">ZIP code</label>
                      <input
                        aria-describedby={fieldDescriptionId(state, "zip_code")}
                        aria-invalid={Boolean(state.fieldErrors?.zip_code)}
                        autoComplete="postal-code"
                        id="zip_code"
                        inputMode="numeric"
                        maxLength={10}
                        name="zip_code"
                        placeholder="19403"
                        required
                        type="text"
                      />
                      <FieldError error={state.fieldErrors?.zip_code} field="zip_code" />
                    </div>
                    <div className={styles.field}>
                      <label htmlFor="meeting_style">Preferred meeting style</label>
                      <div className={styles.selectWrap}>
                        <select
                          aria-describedby={fieldDescriptionId(state, "meeting_style")}
                          aria-invalid={Boolean(state.fieldErrors?.meeting_style)}
                          id="meeting_style"
                          name="meeting_style"
                          onChange={(event) => {
                            const value = event.target.value as MeetingStyle;
                            if (value) chooseMeeting(value);
                          }}
                          required
                          value={meetingStyle}
                        >
                          <option value="">Choose one</option>
                          {meetingOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.title}
                            </option>
                          ))}
                        </select>
                        <ChevronDown aria-hidden="true" size={18} />
                      </div>
                      <FieldError error={state.fieldErrors?.meeting_style} field="meeting_style" />
                    </div>
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="best_time_to_contact">Best day or time to contact</label>
                    <input
                      aria-describedby={fieldDescriptionId(state, "best_time_to_contact")}
                      aria-invalid={Boolean(state.fieldErrors?.best_time_to_contact)}
                      id="best_time_to_contact"
                      name="best_time_to_contact"
                      placeholder="For example: Weekdays after 4 p.m."
                      required
                      type="text"
                    />
                    <FieldError error={state.fieldErrors?.best_time_to_contact} field="best_time_to_contact" />
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="question">
                      Optional question or concern <span>(optional)</span>
                    </label>
                    <textarea
                      id="question"
                      maxLength={2500}
                      name="question"
                      placeholder="What would you most like clarity on?"
                      rows={4}
                    />
                  </div>

                  <div className={styles.consentBox}>
                    <input
                      aria-describedby="consent-copy consent-error"
                      aria-invalid={Boolean(state.fieldErrors?.consent_tcpa)}
                      id="consent_tcpa"
                      name="consent_tcpa"
                      required
                      type="checkbox"
                    />
                    <div>
                      <label htmlFor="consent_tcpa">I agree to be contacted about my request.</label>
                      <p id="consent-copy">
                        I agree that Rare Legacy Life Group and its licensed professionals may call,
                        email, or text me at the contact information I provide, including using
                        automated technology, about my request and related insurance or retirement
                        planning services. Message and data rates may apply. Consent is not a
                        condition of purchasing any product or service. See our{" "}
                        <Link href="/privacy">privacy policy</Link>.
                      </p>
                      <p className={styles.draftLabel}>
                        Compliance draft—final legal/compliance approval required before launch.
                      </p>
                      <FieldError error={state.fieldErrors?.consent_tcpa} field="consent" />
                    </div>
                  </div>

                  <div aria-hidden="true" className={styles.honeypot}>
                    <label htmlFor="website">Website</label>
                    <input autoComplete="off" id="website" name="website" tabIndex={-1} type="text" />
                  </div>

                  <input name="started_at" type="hidden" value={startedAt} />
                  <input name="landing_page" type="hidden" value={pageContext.landingPage} />
                  <input name="referrer" type="hidden" value={pageContext.referrer} />
                  {Object.entries(attribution).map(([key, value]) => (
                    <input key={key} name={key} type="hidden" value={value} />
                  ))}

                  {state.message ? (
                    <p aria-live="assertive" className={styles.formError} role="alert">
                      {state.message}
                    </p>
                  ) : null}

                  <SubmitButton />
                  <p className={styles.formTrust}>
                    <ShieldCheck aria-hidden="true" size={16} />
                    Your information is submitted securely and used to respond to this request.
                  </p>
                </form>
              )}
            </div>
          </div>
        </section>

        <section aria-labelledby="faq-title" className={styles.faqSection}>
          <div className={styles.faqLayout}>
            <div className={styles.faqIntro}>
              <p className={styles.sectionEyebrow}>Before we meet</p>
              <h2 id="faq-title">A few helpful answers.</h2>
              <p>Still unsure which meeting option to choose? Start by phone and we&apos;ll help.</p>
              <button
                className={styles.textButton}
                onClick={() => chooseMeeting("phone", true)}
                type="button"
              >
                Start by phone <ArrowRight aria-hidden="true" size={17} />
              </button>
            </div>
            <div className={styles.faqList}>
              {faqs.map((faq, index) => (
                <details key={faq.question} open={index === 0}>
                  <summary>
                    {faq.question}
                    <ChevronDown aria-hidden="true" size={20} />
                  </summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <button
        className={styles.stickyCta}
        onClick={() =>
          meetingSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
        }
        type="button"
      >
        Choose How to Meet
        <ArrowRight aria-hidden="true" size={18} />
      </button>
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button className={styles.submitButton} disabled={pending} type="submit">
      {pending ? "Sending your request…" : "Request My Complimentary Blueprint"}
      {!pending ? <ArrowRight aria-hidden="true" size={18} /> : null}
    </button>
  );
}

function FieldError({ error, field }: { error?: string; field: string }) {
  return error ? (
    <span className={styles.fieldError} id={`${field}-error`}>
      {error}
    </span>
  ) : null;
}

function fieldDescriptionId(state: RetirementBlueprintState, field: string) {
  return state.fieldErrors?.[field] ? `${field}-error` : undefined;
}

function getSessionId() {
  const storageKey = "rare_legacy_retirement_session";
  const existing = window.sessionStorage.getItem(storageKey);
  if (existing) return existing;

  const id =
    typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `session-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  window.sessionStorage.setItem(storageKey, id);
  return id;
}

function buildEmbeddedSchedulerUrl(meetingStyle: MeetingStyle, attribution: Attribution) {
  const url = new URL(RETIREMENT_SCHEDULER_URLS[meetingStyle]);
  url.searchParams.set("embed", "true");
  url.searchParams.set("utm_source", attribution.utm_source || "rare_legacy_website");
  url.searchParams.set("utm_medium", attribution.utm_medium || "website");
  url.searchParams.set("utm_campaign", attribution.utm_campaign || "retirement_blueprint");
  url.searchParams.set("utm_content", attribution.utm_content || meetingStyle);

  if (attribution.utm_term) {
    url.searchParams.set("utm_term", attribution.utm_term);
  }

  return url.toString();
}

function isZoomBookingMessage(
  data: unknown,
): data is {
  type: "bookingForm";
  payload: { scheduledEventId: string; attendeeId: string };
} {
  if (!data || typeof data !== "object") {
    return false;
  }

  const candidate = data as {
    type?: unknown;
    payload?: { scheduledEventId?: unknown; attendeeId?: unknown };
  };

  return (
    candidate.type === "bookingForm" &&
    typeof candidate.payload?.scheduledEventId === "string" &&
    typeof candidate.payload.attendeeId === "string"
  );
}

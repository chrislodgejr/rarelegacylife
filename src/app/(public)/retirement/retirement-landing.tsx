"use client";

import Image from "next/image";
import { ArrowRight, Check, ChevronDown, ShieldCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import styles from "./retirement.module.css";
import { RetirementQuiz } from "@/components/forms/retirement-quiz";
import type { ProtectTracking } from "@/components/forms/protect-form";
import { RETIREMENT_ADVISOR, SITE } from "@/lib/site";

// /retirement, the page printed on a QR code (Chris, 2026-11-24: "the retirement page can change. i just need it to be a live page").
// One form only: the retirement quiz (Chris, 2026-11-25: "has conflicting forms now ... the blueprint form isnt connected to any adds
// or anything like that so if someone subumits through there its not tracked"). The quiz sends to Endless One with the page's own
// source, reports the Google Ads conversion and keeps name-and-email drop-offs as prospects; after a request it offers the advisor's
// calendar, so booking a meeting still works. The meeting-style picker, the Blueprint form and its embedded scheduler are gone.

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

export function RetirementLanding({ tracking }: { tracking: ProtectTracking }) {
  const quizSectionRef = useRef<HTMLElement>(null);
  // The quiz stays closed until the hero's button opens it (Chris, 2026-11-24: "the form should not be visible. clicking the 2 minute
  // quiz should take you to the form"); an address ending in #quiz opens it too.
  const [quizOpen, setQuizOpen] = useState(false);
  const scrollToQuiz = useRef(false);
  useEffect(() => {
    const fromHash = () => {
      if (window.location.hash === "#quiz") {
        scrollToQuiz.current = true;
        setQuizOpen(true);
      }
    };
    const frame = requestAnimationFrame(fromHash);
    window.addEventListener("hashchange", fromHash);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", fromHash);
    };
  }, []);
  useEffect(() => {
    if (!quizOpen || !scrollToQuiz.current) return;
    scrollToQuiz.current = false;
    quizSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [quizOpen]);
  function openQuiz() {
    scrollToQuiz.current = true;
    if (quizOpen) quizSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    else setQuizOpen(true);
  }
  // The sticky button hides while the quiz is on screen, so it never covers an answer.
  const [quizInView, setQuizInView] = useState(false);
  useEffect(() => {
    const section = quizSectionRef.current;
    if (!quizOpen || !section || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => setQuizInView(entry.isIntersecting), { threshold: 0.05 });
    observer.observe(section);
    return () => observer.disconnect();
  }, [quizOpen]);

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
                aria-controls="quiz"
                aria-expanded={quizOpen}
                onClick={openQuiz}
                type="button"
              >
                Take the 2-Minute Quiz
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
                src="/images/retirement-couple.jpg"
              />
              <div aria-hidden="true" className={styles.imageVeil} />
              <p className={styles.photoNote}>A clearer plan for what comes next.</p>
            </div>
          </div>
        </section>

        {quizOpen ? (
          <section
            aria-label="Retirement quiz"
            className="light-hero-bg scroll-mt-20 px-4 py-12 text-[#050505] sm:px-6 lg:px-8"
            id="quiz"
            ref={quizSectionRef}
          >
            <div className="mx-auto max-w-2xl">
              <RetirementQuiz
                page="retirement"
                tracking={tracking}
                title="Find out which retirement options fit you."
                intro={`A few quick questions, about two minutes. Tap an answer to move on. Prefer to talk first? Call ${SITE.phone.display}.`}
                advisor={RETIREMENT_ADVISOR}
              />
            </div>
          </section>
        ) : null}

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

        <section aria-labelledby="faq-title" className={styles.faqSection}>
          <div className={styles.faqLayout}>
            <div className={styles.faqIntro}>
              <p className={styles.sectionEyebrow}>Before we meet</p>
              <h2 id="faq-title">A few helpful answers.</h2>
              <p>Have a question first? Call us and a licensed advisor will help.</p>
              <a className={styles.textButton} data-track="phone_click" href={SITE.phone.href}>
                Call {SITE.phone.display} <ArrowRight aria-hidden="true" size={17} />
              </a>
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
        style={quizInView ? { display: "none" } : undefined}
        onClick={openQuiz}
        type="button"
      >
        Take the 2-Minute Quiz
        <ArrowRight aria-hidden="true" size={18} />
      </button>
    </div>
  );
}

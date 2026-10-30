"use client";

import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { recordMeasurement } from "@/lib/measurement";
import { PropertyLink } from "@/components/solutions/PropertyLink";
import { site } from "@/lib/config";
import {
  creditObjectives, creditAnswers, noAccountsAnswer, creditDimensions,
  evaluateBusinessCredit, formatCreditActionPlan,
  type CreditInput, type CreditResult, type CreditTask
} from "@/lib/solutions/business-credit-diagnostic";

function TaskList({ tasks }: { tasks: CreditTask[] }) {
  return <ol className="credit-task-list">{tasks.map((task) => <li key={task.id}>
    <h5>{task.title}</h5>
    <p><strong>REVIEW</strong>{task.evidence}</p>
    <p><strong>COMPLETE WHEN</strong>{task.completion}</p>
    <Link href={task.guide.href}>{task.guide.label} <span aria-hidden="true">↗</span></Link>
  </li>)}</ol>;
}

export function BusinessCreditDiagnostic() {
  const started = useRef(false);
  const completedRevision = useRef(false);
  const [answers, setAnswers] = useState<Partial<CreditInput>>({});
  const [result, setResult] = useState<CreditResult | null>(null);
  const [plan, setPlan] = useState("");
  const [copyStatus, setCopyStatus] = useState("");
  const [showPlan, setShowPlan] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);
  const planRef = useRef<HTMLTextAreaElement>(null);
  const revision = useRef(0);
  const completed = creditDimensions.filter(({ id }) => answers[id] !== undefined).length + Number(answers.objective !== undefined);

  function select<K extends keyof CreditInput>(field: K, value: CreditInput[K]) {
    if (!started.current) { started.current = true; recordMeasurement({ name: "diagnostic_started", diagnostic_id: "business-credit", route: "/business-credit-readiness" }); }
    completedRevision.current = false;
    revision.current += 1;
    setAnswers((current) => ({ ...current, [field]: value }));
    setResult(null);
    setPlan("");
    setCopyStatus("");
    setShowPlan(false);
  }

  function buildPlan(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (completed !== 7) return;
    if (!completedRevision.current) { completedRevision.current = true; recordMeasurement({ name: "diagnostic_completed", diagnostic_id: "business-credit", route: "/business-credit-readiness" }); }
    const input = answers as CreditInput;
    const nextResult = evaluateBusinessCredit(input);
    revision.current += 1;
    setResult(nextResult);
    setPlan(formatCreditActionPlan(input, nextResult));
    setCopyStatus("");
    requestAnimationFrame(() => {
      resultRef.current?.focus({ preventScroll: true });
      resultRef.current?.scrollIntoView({ block: "start", behavior: "instant" });
    });
  }

  async function copyPlan() {
    const version = revision.current;
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(plan);
      if (version === revision.current) setCopyStatus("Action plan copied.");
    } catch {
      if (version !== revision.current) return;
      setShowPlan(true);
      setCopyStatus("Clipboard unavailable. Your plan is selected below; use your device's Copy command.");
      requestAnimationFrame(() => {
        planRef.current?.focus();
        planRef.current?.select();
      });
    }
  }

  return <section className="workflow-diagnostic credit-diagnostic content-section" id="credit-readiness-diagnostic" aria-labelledby="credit-diagnostic-title">
    <div className="workflow-diagnostic-heading">
      <div><span className="eyebrow">FIELD TOOL / BUSINESS-CREDIT PREPARATION</span><h2 id="credit-diagnostic-title">Check the records.<br/>Build the next move.</h2></div>
      <p>Six foundation checks and one objective. Get a practical action sequence from your answers. No account details, identifiers, or documents are collected. Answers stay in this page&apos;s memory and clear when you leave or reload.</p>
    </div>
    <div className="workflow-diagnostic-grid">
      <form className="workflow-form credit-form" onSubmit={buildPlan}>
        <div className="credit-progress"><label htmlFor="credit-progress">{completed} / 7 SELECTIONS COMPLETE</label><progress id="credit-progress" value={completed} max={7} /></div>
        <fieldset className="workflow-question">
          <legend><span>01</span>What is your primary objective?</legend>
          <p id="credit-objective-hint">Choose the job this plan should help you complete.</p>
          <div className="workflow-options">{creditObjectives.map((option) => <label className="workflow-option" key={option.value}>
            <input type="radio" name="credit-objective" value={option.value} checked={answers.objective === option.value} onChange={() => select("objective", option.value)} aria-describedby="credit-objective-hint" required />
            <span>{option.label}</span>
          </label>)}</div>
        </fieldset>
        {creditDimensions.map(({ id, question, hint }, index) => <fieldset className="workflow-question" key={id}>
          <legend><span>{String(index + 2).padStart(2, "0")}</span>{question}</legend>
          <p id={`credit-${id}-hint`}>{hint}</p>
          <div className="workflow-options">{creditAnswers.map((option) => <label className="workflow-option" key={option.value}>
            <input type="radio" name={`credit-${id}`} value={option.value} checked={answers[id] === option.value} onChange={() => select(id, option.value)} aria-describedby={`credit-${id}-hint`} required />
            <span>{option.label}</span>
          </label>)}{id === "payments" && <label className="workflow-option">
            <input type="radio" name="credit-payments" value={noAccountsAnswer.value} checked={answers.payments === "na"} onChange={() => select("payments", "na")} aria-describedby="credit-payments-hint" required />
            <span>{noAccountsAnswer.label}</span>
          </label>}</div>
        </fieldset>)}
        <div className="workflow-form-foot"><span className="mono-label" role="status">{completed === 7 ? "READY TO BUILD YOUR PLAN" : `${7 - completed} SELECTIONS REMAINING`}</span><button type="submit" className="button button-orange" disabled={completed !== 7}>Build my action roadmap <span aria-hidden="true">↗</span></button></div>
        <p className="credit-form-note">Changing an answer clears the previous plan. Choose &ldquo;not sure&rdquo; when the supporting evidence has not been checked.</p>
      </form>
      <div className="workflow-output">
        {result ? <div ref={resultRef} id="credit-readiness-result" tabIndex={-1} className="workflow-result credit-result" role="region" aria-labelledby="credit-status-title">
          <span className="eyebrow">CURRENT PREPARATION STATUS</span>
          <h3 id="credit-status-title">{result.status}</h3>
          <p className="credit-rationale">{result.rationale}</p>
          <section className="workflow-result-block" aria-labelledby="credit-gaps-title">
            <h4 id="credit-gaps-title" className="mono-label">Priority gaps / evidence register</h4>
            <p className="credit-section-note">{result.gaps.length ? `${result.gaps.length} areas need work or verification. The ordered tasks below put foundational records and existing obligations first.` : "No preparation gaps reported. Keep the documented controls active."} &ldquo;Confirmed by you&rdquo; records your answer; it is not an independent finding.</p>
            <dl className="credit-evidence">{result.evidence.map((item) => <div key={item.id} data-state={item.answer}><dt>{item.label}</dt><dd>{item.status}</dd></div>)}</dl>
          </section>
          <section className="workflow-result-block" aria-labelledby="credit-now-title"><h4 className="mono-label" id="credit-now-title">Immediate actions / now</h4><TaskList tasks={result.immediate}/></section>
          <section className="workflow-result-block" aria-labelledby="credit-next-title"><h4 className="mono-label" id="credit-next-title">Next actions / after foundations</h4><TaskList tasks={result.next}/></section>
          <section className="workflow-result-block" aria-labelledby="credit-ongoing-title"><h4 className="mono-label" id="credit-ongoing-title">Ongoing practices</h4><ul className="credit-practices">{result.ongoing.map((item) => <li key={item}>{item}</li>)}</ul></section>
          <details className="credit-verification"><summary>What to verify before opening a credit account</summary><p>If you choose to evaluate an account, use this checklist. Adding credit is optional.</p><ul className="credit-practices">{result.accountVerification.map((item) => <li key={item}>{item}</li>)}</ul></details>
          <section className="workflow-next" aria-labelledby="credit-resources-title"><h4 className="mono-label" id="credit-resources-title">Relevant resources</h4><div className="workflow-guide-links">{result.resources.map((resource) => resource.href.startsWith("/") ? <Link key={resource.href} href={resource.href}>{resource.label} <span aria-hidden="true">↗</span></Link> : <a key={resource.href} href={resource.href}>{resource.label} <span aria-hidden="true">↗</span></a>)}</div><p className="credit-section-note">Official external resources describe that provider&apos;s process. Check the relevant bureau or provider&apos;s current instructions for your specific record.</p><Link className="button button-lime" href="/business-credit-roadmap">Use the implementation guide <span aria-hidden="true">↗</span></Link> <PropertyLink className="button button-outline-light" href={site.fundingSite}>Explore Funding preview <span aria-hidden="true">↗</span></PropertyLink></section>
          <div className="workflow-copy"><button className="button button-outline-light" type="button" onClick={copyPlan}>Copy Action Plan</button><p role="status" aria-live="polite">{copyStatus}</p></div>
          <details className="workflow-plan-text" open={showPlan} onToggle={(event) => setShowPlan(event.currentTarget.open)}><summary>View plain-text action plan</summary><textarea ref={planRef} aria-label="Business-credit action plan" value={plan} readOnly rows={18} onFocus={(event) => event.currentTarget.select()} /></details>
        </div> : <div className="workflow-empty credit-empty"><span className="eyebrow">YOUR OPERATING PLAN / READY WHEN YOU ARE</span><div className="workflow-preview-mark" aria-hidden="true">↘</div><h3>Know what&apos;s checked.<br/>Act on what&apos;s next.</h3><p>See your preparation status, a record of what needs verification, and three immediate actions with evidence to review and a clear completion condition.</p><div className="workflow-preview-steps"><span>01 / VERIFY THE FOUNDATIONS</span><span>02 / CONTROL EXISTING OBLIGATIONS</span><span>03 / MAINTAIN THE RECORDS</span></div></div>}
      </div>
    </div>
    <p className="workflow-disclaimer">Educational preparation only. This diagnostic does not access credit reports, calculate a bureau score, determine lender eligibility, predict approval, or submit information. No account purchase is required.</p>
  </section>;
}

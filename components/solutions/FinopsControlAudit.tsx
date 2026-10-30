"use client";

import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { recordMeasurement, recordRelatedGuide } from "@/lib/measurement";
import {
  controlAnswers, controlDimensions, evaluateFinopsControls, formatFinopsActionPlan,
  type ControlAnswer, type ControlId, type ControlInput, type ControlObjective, type ControlResult
} from "@/lib/solutions/finops-control-audit";

const objectives: { value: ControlObjective; label: string }[] = [
  { value: "reduce-errors", label: "Reduce errors and payment risk" },
  { value: "cash-visibility", label: "Improve cash visibility" },
  { value: "faster-close", label: "Stabilize the close" },
  { value: "safe-automation", label: "Prepare for safe automation" }
];

export function FinopsControlAudit() {
  const started = useRef(false);
  const completedRevision = useRef(false);
  const [answers, setAnswers] = useState<Partial<ControlInput>>({});
  const [result, setResult] = useState<ControlResult | null>(null);
  const [report, setReport] = useState("");
  const [copyStatus, setCopyStatus] = useState("");
  const [showReport, setShowReport] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);
  const reportRef = useRef<HTMLTextAreaElement>(null);
  const revision = useRef(0);
  const completed = controlDimensions.filter((item) => answers[item.id] !== undefined).length;

  function select(field: ControlId | "objective", value: ControlAnswer | ControlObjective) {
    if (!started.current) { started.current = true; recordMeasurement({ name: "diagnostic_started", diagnostic_id: "finops-controls", route: "/financial-operations" }); }
    completedRevision.current = false;
    revision.current += 1;
    setAnswers((current) => ({ ...current, [field]: value }));
    setResult(null);
    setReport("");
    setShowReport(false);
    setCopyStatus("");
  }

  function build(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (completed !== controlDimensions.length) return;
    if (!completedRevision.current) { completedRevision.current = true; recordMeasurement({ name: "diagnostic_completed", diagnostic_id: "finops-controls", route: "/financial-operations" }); }
    const input = answers as ControlInput;
    const next = evaluateFinopsControls(input);
    revision.current += 1;
    setResult(next);
    setReport(formatFinopsActionPlan(input, next));
    setCopyStatus("");
    requestAnimationFrame(() => { resultRef.current?.focus({ preventScroll: true }); resultRef.current?.scrollIntoView({ block: "start", behavior: "instant" }); });
  }

  async function copy() {
    const version = revision.current;
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(report);
      if (version === revision.current) setCopyStatus("Action plan copied.");
    } catch {
      if (version !== revision.current) return;
      setShowReport(true);
      setCopyStatus("Clipboard unavailable. The plain-text plan is selected below; use your device's Copy command.");
      requestAnimationFrame(() => { reportRef.current?.focus(); reportRef.current?.select(); });
    }
  }

  return <section className="workflow-diagnostic finops-audit content-section" id="finops-control-audit" aria-labelledby="finops-audit-title">
    <div className="workflow-diagnostic-heading"><div><span className="eyebrow">FIELD TOOL / FINANCIAL OPERATIONS</span><h2 id="finops-audit-title">Control the work.<br/>Then improve it.</h2></div><p>Seven quick checks produce an owned action sequence. Choose broad conditions only. Do not enter names, balances, account data, or customer details. Answers stay in this browser and clear on reload.</p></div>
    <div className="workflow-diagnostic-grid">
      <form className="workflow-form finops-form" onSubmit={build}>
        <div className="credit-progress"><label htmlFor="finops-progress">{completed} / 7 CONTROLS MAPPED</label><progress id="finops-progress" value={completed} max={7}/></div>
        <fieldset className="workflow-question finops-objective"><legend><span>00</span>Primary objective <small>(optional)</small></legend><div className="workflow-options">{objectives.map((item) => <label className="workflow-option" key={item.value}><input type="radio" name="finops-objective" checked={answers.objective === item.value} onChange={() => select("objective", item.value)}/><span>{item.label}</span></label>)}</div></fieldset>
        {controlDimensions.map((item, index) => <fieldset className="workflow-question" key={item.id}>
          <legend><span>{String(index + 1).padStart(2, "0")}</span>{item.question}</legend>
          <p id={`finops-${item.id}-hint`}>{item.hint}</p>
          <div className="workflow-options">{controlAnswers.filter((option) => option.value !== "na" || item.allowsNa).map((option) => <label className="workflow-option" key={option.value}><input type="radio" name={`finops-${item.id}`} value={option.value} checked={answers[item.id] === option.value} onChange={() => select(item.id, option.value)} aria-describedby={`finops-${item.id}-hint`} required/><span>{option.label}</span></label>)}</div>
        </fieldset>)}
        <div className="workflow-form-foot"><span className="mono-label" role="status">{completed === 7 ? "READY TO BUILD THE PLAN" : `${7 - completed} CONTROL CHECKS REMAIN`}</span><button className="button button-orange" type="submit" disabled={completed !== 7}>Build improvement plan <span aria-hidden="true">↗</span></button></div>
        <p className="credit-form-note">Choose “Unsure” when evidence has not been checked. Changing an answer clears the prior plan.</p>
      </form>
      <div className="workflow-output">{result ? <div ref={resultRef} tabIndex={-1} className="workflow-result finops-result" role="region" aria-labelledby="finops-result-title">
        <span className="eyebrow">SELF-REPORTED CONTROL POSITION</span><h3 id="finops-result-title">{result.classification}</h3><p className="credit-rationale">{result.explanation}</p>
        <section className="workflow-result-block" aria-labelledby="finops-matrix-title"><h4 className="mono-label" id="finops-matrix-title">Seven-control overview</h4><dl className="finops-matrix">{result.matrix.map((item) => <div key={item.id} data-state={item.answer}><dt>{item.label}</dt><dd>{item.status}</dd></div>)}</dl></section>
        <section className="workflow-result-block" aria-labelledby="finops-first-title"><h4 className="mono-label" id="finops-first-title">First workflow to improve</h4><p className="finops-first">{result.firstWorkflow}</p></section>
        <section className="workflow-result-block" aria-labelledby="finops-priority-title"><h4 className="mono-label" id="finops-priority-title">Three priority actions</h4><ol className="finops-priorities">{result.priorities.map((action) => <li key={action.id}><h5>{action.problem}</h5><p>{action.correction}</p><dl><div><dt>EVIDENCE</dt><dd>{action.evidence}</dd></div><div><dt>OWNER</dt><dd>{action.owner}</dd></div><div><dt>COMPLETE WHEN</dt><dd>{action.completion}</dd></div><div><dt>DEPENDENCY</dt><dd>{action.dependency}</dd></div></dl><Link href={action.guide.href}>{action.guide.label} ↗</Link></li>)}</ol></section>
        <div className="finops-timeline"><section className="workflow-result-block" aria-labelledby="finops-week-title"><h4 className="mono-label" id="finops-week-title">First 7 days</h4><ol>{result.firstSevenDays.map((item) => <li key={item}>{item}</li>)}</ol></section><section className="workflow-result-block" aria-labelledby="finops-month-title"><h4 className="mono-label" id="finops-month-title">Next 30 days</h4><ol>{result.nextThirtyDays.map((item) => <li key={item}>{item}</li>)}</ol></section></div>
        <section className="workflow-result-block" aria-labelledby="finops-rhythm-title"><h4 className="mono-label" id="finops-rhythm-title">Ongoing operating rhythm</h4><ul className="credit-practices">{result.rhythm.map((item) => <li key={item}>{item}</li>)}</ul><p className="credit-section-note">Set actual review frequency with the responsible team based on activity and risk.</p></section>
        <section className="workflow-result-block" aria-labelledby="finops-automation-title"><h4 className="mono-label" id="finops-automation-title">Automation opportunities + safeguards</h4><ul className="credit-practices">{result.automation.map((item) => <li key={item}>{item}</li>)}</ul></section>
        <section className="workflow-next" aria-labelledby="finops-guides-title"><h4 className="mono-label" id="finops-guides-title">Continue with the relevant guide</h4><div className="workflow-guide-links">{result.guides.map((guide) => <Link href={guide.href} key={guide.href} onClick={() => recordRelatedGuide("/financial-operations", guide.href)}>{guide.label} ↗</Link>)}</div></section>
        <div className="workflow-copy"><button className="button button-outline-light" type="button" onClick={copy}>Copy Action Plan</button><p role="status" aria-live="polite">{copyStatus}</p></div><details className="workflow-plan-text" open={showReport} onToggle={(event) => setShowReport(event.currentTarget.open)}><summary>View plain-text summary</summary><textarea ref={reportRef} aria-label="Financial operations action plan" value={report} readOnly rows={18} onFocus={(event) => event.currentTarget.select()}/></details>
      </div> : <div className="workflow-empty finops-empty"><span className="eyebrow">CONTROL MAP / READY FOR INPUT</span><div className="workflow-preview-mark" aria-hidden="true">↘</div><h3>Seven controls.<br/>Three next moves.</h3><p>Map current practice, identify evidence gaps, and leave with a first workflow, accountable actions, and a 7/30-day sequence.</p><div className="workflow-preview-steps"><span>01 / CHECK THE CONTROLS</span><span>02 / ASSIGN EVIDENCE + OWNER</span><span>03 / STABILIZE BEFORE AUTOMATION</span></div></div>}</div>
    </div><p className="workflow-disclaimer">This self-assessment is planning guidance. It does not inspect your records or provide a formal audit, accounting opinion, or financial-health score.</p>
  </section>;
}

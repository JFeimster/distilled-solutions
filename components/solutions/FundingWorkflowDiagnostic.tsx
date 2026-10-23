"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import {
  bottleneckOptions, processOptions, workloadOptions, riskOptions, systemOptions,
  evaluateFundingWorkflow, formatActionPlan,
  type DiagnosticInput, type DiagnosticResult
} from "@/lib/solutions/funding-workflow-diagnostic";

const questions = [
  { field: "bottleneck", title: "Where does work stall?", hint: "Pick the handoff that costs the most attention.", options: bottleneckOptions },
  { field: "process", title: "How does it run now?", hint: "Think about the current path, not the intended one.", options: processOptions },
  { field: "workload", title: "What is the workload?", hint: "A rough volume is enough; no counts are needed.", options: workloadOptions },
  { field: "risk", title: "What risk needs control?", hint: "Choose the issue you would address first.", options: riskOptions },
  { field: "system", title: "Where is the work tracked?", hint: "Choose the closest current system context.", options: systemOptions }
] as const;

function copyFallback(value: string): boolean {
  const field = document.createElement("textarea");
  field.value = value;
  field.style.position = "fixed";
  field.style.left = "-9999px";
  document.body.append(field);
  field.select();
  const copied = document.execCommand("copy");
  field.remove();
  return copied;
}

export function FundingWorkflowDiagnostic() {
  const [answers, setAnswers] = useState<Partial<DiagnosticInput>>({});
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [plan, setPlan] = useState("");
  const [copyStatus, setCopyStatus] = useState("");
  const completed = questions.filter(({ field }) => answers[field] !== undefined).length;

  function select(field: keyof DiagnosticInput, value: string) {
    setAnswers((current) => ({ ...current, [field]: value }));
    setResult(null);
    setPlan("");
    setCopyStatus("");
  }

  function buildPlan(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (completed !== questions.length) return;
    const input = answers as DiagnosticInput;
    const nextResult = evaluateFundingWorkflow(input);
    setResult(nextResult);
    setPlan(formatActionPlan(input, nextResult));
    setCopyStatus("");
    requestAnimationFrame(() => document.getElementById("workflow-result")?.focus());
  }

  async function copyPlan() {
    try {
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(plan);
      else if (!copyFallback(plan)) throw new Error("Clipboard unavailable");
      setCopyStatus("Action plan copied.");
    } catch {
      try {
        if (!copyFallback(plan)) throw new Error("Clipboard unavailable");
        setCopyStatus("Action plan copied.");
      } catch {
        setCopyStatus("Copy unavailable. Select the plan text below to copy it manually.");
      }
    }
  }

  return <section className="workflow-diagnostic content-section" id="workflow-diagnostic" aria-labelledby="workflow-diagnostic-title">
    <div className="workflow-diagnostic-heading">
      <div><span className="eyebrow">FIELD TOOL / WORKFLOW OPPORTUNITY DIAGNOSTIC</span><h2 id="workflow-diagnostic-title">Find the first fix.</h2></div>
      <p>Choose five broad workflow conditions. The plan stays in this browser; do not enter customer records or credentials.</p>
    </div>
    <div className="workflow-diagnostic-grid">
      <form className="workflow-form" onSubmit={buildPlan}>
        {questions.map(({ field, title, hint, options }, index) => <fieldset className="workflow-question" key={field}>
          <legend><span>{String(index + 1).padStart(2, "0")}</span>{title}</legend>
          <p>{hint}</p>
          <div className="workflow-options">{options.map((option) => <label className="workflow-option" key={option.value}>
            <input type="radio" name={field} value={option.value} checked={answers[field] === option.value} onChange={() => select(field, option.value)} required />
            <span>{option.label}</span>
          </label>)}</div>
        </fieldset>)}
        <div className="workflow-form-foot"><span className="mono-label">{completed} / 5 ANSWERS SELECTED</span><button type="submit" className="button button-orange" disabled={completed !== questions.length}>Build action plan <span aria-hidden="true">↗</span></button></div>
      </form>
      <div className="workflow-output" aria-live="polite">
        {result ? <div id="workflow-result" tabIndex={-1} className="workflow-result">
          <span className="eyebrow">YOUR WORKFLOW / FIRST MOVE</span>
          <h3>{result.bottleneck}</h3>
          <p className="workflow-first-fix">{result.firstFix}</p>
          <p className="workflow-reasoning">{result.reasoning}</p>
          <div className="workflow-result-block"><span className="mono-label">THREE PRIORITIZED ACTIONS</span><ol>{result.actions.map((action) => <li key={action}>{action}</li>)}</ol></div>
          <div className="workflow-controls"><div><span className="mono-label">HUMAN REVIEW</span><ul>{result.humanControls.map((control) => <li key={control}>{control}</li>)}</ul></div><div><span className="mono-label">DATA OWNERSHIP + PRIVACY</span><ul>{result.dataControls.map((control) => <li key={control}>{control}</li>)}</ul></div></div>
          <div className="workflow-next"><span className="mono-label">KEEP MOVING</span><div className="workflow-guide-links">{result.relatedGuides.map((guide) => <Link href={guide.href} key={guide.href}>{guide.label} <span aria-hidden="true">↗</span></Link>)}</div><Link className="button button-lime" href={result.nextStep.href}>{result.nextStep.label} <span aria-hidden="true">↗</span></Link></div>
          <div className="workflow-copy"><button className="button button-outline-light" type="button" onClick={copyPlan}>Copy action plan</button><p role="status">{copyStatus}</p></div>
          <details className="workflow-plan-text"><summary>View plain-text plan</summary><textarea aria-label="Plain-text action plan" value={plan} readOnly rows={18} onFocus={(event) => event.currentTarget.select()} /></details>
        </div> : <div className="workflow-empty"><span className="eyebrow">PLAN PREVIEW / READY WHEN YOU ARE</span><div className="workflow-preview-mark" aria-hidden="true">↘</div><h3>One bottleneck.<br/>One first move.</h3><p>Complete the five selections to see a specific first fix, three actions, review controls, and relevant guides.</p><div className="workflow-preview-steps"><span>01 / MAP THE HANDOFF</span><span>02 / KEEP HUMAN REVIEW</span><span>03 / PILOT A BOUNDED FIX</span></div></div>}
      </div>
    </div>
    <p className="workflow-disclaimer">Operational guidance only. This diagnostic does not assess eligibility, make credit or underwriting decisions, approve financing, or submit information to a lender.</p>
  </section>;
}

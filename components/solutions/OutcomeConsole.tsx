"use client";
import Link from "next/link";
import { useState } from "react";

const intents = [
  { id: "cash", label: "CASH FLOW", family: "improve-cash-flow", prompt: "Where does the cash cycle feel tight?", options: [["Receipts arrive late", "accounts-receivable-cash-flow"], ["Costs land before revenue", "working-capital-gap"], ["The low point changes by season", "seasonal-cash-flow"]] },
  { id: "growth", label: "GROWTH", family: "finance-business-growth", prompt: "What investment are you planning?", options: [["A new location", "open-a-new-location"], ["More inventory", "buy-inventory"], ["Equipment or capacity", "finance-equipment"]] },
  { id: "credit", label: "CREDIT", family: "business-credit-builder", prompt: "What needs attention first?", options: [["Business records", "fundability-check"], ["A step-by-step plan", "business-credit-roadmap"], ["Credit use and obligations", "business-credit-readiness"]] },
  { id: "acquisition", label: "ACQUISITION", family: "buy-or-sell-a-business", prompt: "Which side of the transaction?", options: [["I want to buy", "buy-a-business"], ["I am preparing to sell", "sell-a-business"], ["I need to test a deal", "deal-analysis"]] },
  { id: "automation", label: "AUTOMATION", family: "automate-my-funding", prompt: "Where does work repeat or stall?", options: [["Intake and handoffs", "funding-intake-automation"], ["Document requests", "document-collection-automation"], ["CRM tasks", "crm-automation"]] },
  { id: "operations", label: "FINOPS", family: "finops-as-a-service", prompt: "Which workflow needs clarity?", options: [["Payments and approvals", "payment-operations"], ["Expenses and coding", "expense-management"], ["Reconciliations and data", "financial-data-operations"]] },
  { id: "cfo", label: "CFO SUPPORT", family: "cfo-as-a-service", prompt: "Which decision needs a better view?", options: [["Cash commitments", "cash-flow-management"], ["Budget and scenarios", "budgeting-forecasting"], ["Profit by product or customer", "profitability-analysis"]] },
  { id: "readiness", label: "READINESS", family: "funding-readiness", prompt: "What preparation is incomplete?", options: [["Core documents", "document-readiness"], ["Revenue records", "revenue-readiness"], ["Application checklist", "application-readiness"]] }
] as const;
export function OutcomeConsole() {
  const [intentId, setIntentId] = useState<(typeof intents)[number]["id"]>("cash");
  const [option, setOption] = useState(0);
  const intent = intents.find((item) => item.id === intentId)!;
  const route = intent.options[option]?.[1] ?? intent.family;
  return <section className="command-console" aria-labelledby="console-title">
    <div className="console-top"><div><span className="eyebrow">01 / OUTCOME COMMAND</span><h2 id="console-title">Name the friction.<br/><em>Get a grounded next step.</em></h2></div><span className="live-status"><i aria-hidden="true"/> ROUTING READY</span></div>
    <div className="console-body"><div className="intent-panel"><span className="mono-label">SELECT AN INTENT</span><div className="intent-list" role="group" aria-label="Choose a business intent">{intents.map((item, index) => <button key={item.id} className={`intent-button ${intentId === item.id ? "selected" : ""}`} aria-pressed={intentId === item.id} onClick={() => { setIntentId(item.id); setOption(0); }}><span className="intent-index">0{index + 1}</span><span>{item.label}</span><span aria-hidden="true">↗</span></button>)}</div></div>
      <div className="diagnostic-panel"><span className="mono-label">DECISION POINT / {intent.label}</span><h3>{intent.prompt}</h3><div className="choice-list" role="group" aria-label={intent.prompt}>{intent.options.map(([label], index) => <button key={label} className={`choice-button ${option === index ? "selected" : ""}`} aria-pressed={option === index} onClick={() => setOption(index)}><span className="choice-radio" aria-hidden="true"/>{label}</button>)}</div><div className="recommendation"><span className="eyebrow">SUGGESTED GUIDE</span><Link href={`/${route}`} className="recommendation-link">{route.replaceAll("-", " ")} <span aria-hidden="true">↗</span></Link><p>This route follows the choice you selected. It does not score eligibility or predict an outcome.</p><Link href={`/${intent.family}`} className="text-link">VIEW THE FULL SOLUTION PATH <span aria-hidden="true">→</span></Link></div></div></div>
    <div className="console-foot"><span>LOCAL ROUTING / NO PROFILE DATA STORED</span><span>01 — 08 / INTENTS</span></div>
  </section>;
}

"use client";
import { useMemo, useState } from "react";
import { formatPlaybookChecklist } from "@/lib/solutions/playbooks";

export function PlaybookChecklist({ title, items }: { title: string; items: string[] }) {
  const [checked, setChecked] = useState<boolean[]>(() => items.map(() => false));
  const [copied, setCopied] = useState(false);
  const completed = checked.filter(Boolean).length;
  const plan = useMemo(() => formatPlaybookChecklist(title, items, checked), [checked, items, title]);
  async function copyPlan() {
    try {
      await navigator.clipboard.writeText(plan);
    } catch {
      const field = document.createElement("textarea");
      field.value = plan;
      field.setAttribute("readonly", "");
      field.style.position = "fixed";
      field.style.opacity = "0";
      document.body.append(field);
      field.select();
      document.execCommand("copy");
      field.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2500);
  }
  return <div className="playbook-checklist">
    <div className="playbook-checklist-head"><div><span className="mono-label">CHECKLIST / {completed} OF {items.length}</span><p>Mark items as you verify them. Your selections stay in this tab and are not sent or saved.</p></div><button type="button" className="button button-orange" onClick={copyPlan}>{copied ? "Copied" : "Copy checklist"}</button></div>
    <ul>{items.map((item, index) => <li key={item}><label><input type="checkbox" checked={checked[index]} onChange={(event) => setChecked((prior) => prior.map((value, itemIndex) => itemIndex === index ? event.target.checked : value))}/><span>{item}</span></label></li>)}</ul>
    <progress value={completed} max={items.length} aria-label={`${completed} of ${items.length} checklist items complete`}/>
  </div>;
}

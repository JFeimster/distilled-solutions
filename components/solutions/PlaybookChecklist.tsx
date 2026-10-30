"use client";
import { useMemo, useState } from "react";
import { recordMeasurement } from "@/lib/measurement";
import { formatPlaybookChecklist } from "@/lib/solutions/playbooks";

export function PlaybookChecklist({ title, items, route }: { title: string; items: string[]; route: string }) {
  const [checked, setChecked] = useState<boolean[]>(() => items.map(() => false));
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">("idle");
  const completed = checked.filter(Boolean).length;
  const plan = useMemo(() => formatPlaybookChecklist(title, items, checked), [checked, items, title]);
  async function copyPlan() {
    let success = false;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(plan);
        success = true;
      }
    } catch {
      // Fall back to the browser selection-based clipboard method.
    }
    if (!success) {
      const field = document.createElement("textarea");
      field.value = plan;
      field.setAttribute("readonly", "");
      field.style.position = "fixed";
      field.style.opacity = "0";
      document.body.append(field);
      field.select();
      try {
        success = document.execCommand("copy");
      } catch {
        success = false;
      } finally {
        field.remove();
      }
    }
    if (success) recordMeasurement({ name: "checklist_copied", route, item_count: items.length });
    setCopyStatus(success ? "copied" : "failed");
  }
  return <div className="playbook-checklist">
    <div className="playbook-checklist-head"><div><span className="mono-label">CHECKLIST / {completed} OF {items.length}</span><p>Mark items as you verify them. Your selections stay in this tab and are not sent or saved.</p></div><button type="button" className="button button-orange" onClick={copyPlan}>{copyStatus === "copied" ? "Copied" : "Copy checklist"}</button></div>
    <p role="status" aria-live="polite">{copyStatus === "copied" ? "Checklist copied." : ""}</p>
    {copyStatus === "failed" && <div className="playbook-copy-fallback"><p role="alert">Clipboard unavailable. Select the checklist text below and copy it manually.</p><textarea aria-label="Plain-text checklist for manual copying" value={plan} readOnly rows={10} style={{ width: "100%" }} onFocus={(event) => event.currentTarget.select()} /></div>}
    <ul>{items.map((item, index) => <li key={item}><label><input type="checkbox" checked={checked[index]} onChange={(event) => { recordMeasurement({ name: "checklist_interacted", route, item_index: index, checked: event.target.checked }); setChecked((prior) => prior.map((value, itemIndex) => itemIndex === index ? event.target.checked : value)); setCopyStatus("idle"); }}/><span>{item}</span></label></li>)}</ul>
    <progress value={completed} max={items.length} aria-label={`${completed} of ${items.length} checklist items complete`}/>
  </div>;
}

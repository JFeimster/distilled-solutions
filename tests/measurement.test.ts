import test from "node:test";
import assert from "node:assert/strict";
import { isMeasurementEvent, recordMeasurement } from "../lib/measurement";

test("measurement accepts only known routes, fixed identifiers and explicit payload keys", () => {
  assert.equal(isMeasurementEvent({ name: "diagnostic_started", diagnostic_id: "business-credit", route: "/business-credit-readiness" }), true);
  assert.equal(isMeasurementEvent({ name: "diagnostic_completed", diagnostic_id: "business-credit", route: "/financial-operations" }), false);
  assert.equal(isMeasurementEvent({ name: "diagnostic_completed", diagnostic_id: "business-credit", route: "/business-credit-readiness", answers: ["private"] }), false);
  assert.equal(isMeasurementEvent({ name: "checklist_interacted", route: "/playbooks/cash-flow/diagnose-working-capital-gap", item_index: 1, checked: true }), true);
  assert.equal(isMeasurementEvent({ name: "checklist_interacted", route: "/playbooks/not-a-route", item_index: 1, checked: true }), false);
  assert.equal(isMeasurementEvent({ name: "checklist_copied", route: "/playbooks/cash-flow/diagnose-working-capital-gap", item_count: 3, contents: "private" }), false);
  assert.equal(isMeasurementEvent({ name: "related_resource_clicked", source_route: "/financial-operations", resource_type: "guide", destination_host: "solutions.distilledfunding.com", resource_id: "/playbooks" }), true);
  assert.equal(isMeasurementEvent({ name: "related_resource_clicked", source_route: "/financial-operations", resource_type: "guide", destination_host: "evil.example", resource_id: "/playbooks" }), false);
  assert.equal(isMeasurementEvent({ name: "cross_property_cta_selected", source_route: "/", destination_property: "funding", cta_id: "funding" }), true);
  assert.equal(isMeasurementEvent({ name: "cross_property_cta_selected", source_route: "/", destination_property: "funding", cta_id: "acquire" }), false);
});

test("no-op measurement never sends or logs even valid events", () => {
  const originalFetch = globalThis.fetch;
  const originalLog = console.log;
  let calls = 0;
  globalThis.fetch = (() => { calls++; throw new Error("unexpected network"); }) as typeof fetch;
  console.log = () => { calls++; };
  try {
    assert.equal(recordMeasurement({ name: "diagnostic_started", diagnostic_id: "funding-workflow", route: "/funding-workflow-automation" }), true);
    assert.equal(calls, 0);
  } finally { globalThis.fetch = originalFetch; console.log = originalLog; }
});

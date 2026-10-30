import routes from "@/data/solutions/solutions.routes.manifest.json";

// This contract deliberately accepts identifiers only, never user selections or text.
const diagnostics = {
  "funding-workflow": "/funding-workflow-automation",
  "business-credit": "/business-credit-readiness",
  "finops-controls": "/financial-operations"
} as const;
type DiagnosticId = keyof typeof diagnostics;
type Property = "funding" | "tools" | "acquire";
export type MeasurementEvent =
  | { name: "diagnostic_started" | "diagnostic_completed"; diagnostic_id: DiagnosticId; route: string }
  | { name: "checklist_interacted"; route: string; item_index: number; checked: boolean }
  | { name: "checklist_copied"; route: string; item_count: number }
  | { name: "related_resource_clicked"; source_route: string; resource_type: "guide"; destination_host: "solutions.distilledfunding.com"; resource_id: string }
  | { name: "cross_property_cta_selected"; source_route: string; destination_property: Property; cta_id: Property };

const knownRoutes = new Set(routes);
const keysAre = (value: Record<string, unknown>, keys: string[]) => Object.keys(value).length === keys.length && keys.every((key) => Object.hasOwn(value, key));
export function isMeasurementEvent(input: unknown): input is MeasurementEvent {
  if (!input || typeof input !== "object" || Array.isArray(input)) return false;
  const e = input as Record<string, unknown>;
  if (e.name === "diagnostic_started" || e.name === "diagnostic_completed") {
    return keysAre(e, ["name", "diagnostic_id", "route"]) && typeof e.diagnostic_id === "string" && Object.hasOwn(diagnostics, e.diagnostic_id) && diagnostics[e.diagnostic_id as DiagnosticId] === e.route;
  }
  if (e.name === "checklist_interacted" || e.name === "checklist_copied") {
    if (typeof e.route !== "string" || !e.route.startsWith("/playbooks/") || !knownRoutes.has(e.route)) return false;
    if (e.name === "checklist_interacted") return keysAre(e, ["name", "route", "item_index", "checked"]) && Number.isInteger(e.item_index) && (e.item_index as number) >= 0 && (e.item_index as number) < 100 && typeof e.checked === "boolean";
    return keysAre(e, ["name", "route", "item_count"]) && Number.isInteger(e.item_count) && (e.item_count as number) > 0 && (e.item_count as number) <= 100;
  }
  if (e.name === "related_resource_clicked") return keysAre(e, ["name", "source_route", "resource_type", "destination_host", "resource_id"]) && typeof e.source_route === "string" && knownRoutes.has(e.source_route) && e.resource_type === "guide" && e.destination_host === "solutions.distilledfunding.com" && typeof e.resource_id === "string" && knownRoutes.has(e.resource_id);
  if (e.name === "cross_property_cta_selected") return keysAre(e, ["name", "source_route", "destination_property", "cta_id"]) && typeof e.source_route === "string" && knownRoutes.has(e.source_route) && ["funding", "tools", "acquire"].includes(String(e.destination_property)) && e.cta_id === e.destination_property;
  return false;
}

// No adapter is connected. Do not add logging, storage, cookies, or network calls here.
export function recordMeasurement(event: MeasurementEvent): boolean {
  return isMeasurementEvent(event);
}

export function recordRelatedGuide(source: string, destination: string) {
  if (knownRoutes.has(source) && knownRoutes.has(destination)) recordMeasurement({ name: "related_resource_clicked", source_route: source, resource_type: "guide", destination_host: "solutions.distilledfunding.com", resource_id: destination });
}

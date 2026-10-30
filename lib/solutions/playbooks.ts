import records from "@/data/solutions/solutions.playbooks.manifest.json";
import { playbookIndexSchema, playbookSchema, type Playbook, type PlaybookIndex, type PlaybookPage } from "@/schemas/playbooks";

export const playbookPages: PlaybookPage[] = records.map((record) => {
  const kind = (record as { kind?: string }).kind;
  return kind === "index" ? playbookIndexSchema.parse(record) : playbookSchema.parse(record);
});
export const playbooks = playbookPages.filter((page): page is Playbook => page.kind === "playbook");
export const playbookIndex = playbookPages.find((page): page is PlaybookIndex => page.kind === "index")!;
const byRoute = new Map(playbookPages.map((page) => [page.route, page]));
export const getPlaybookByRoute = (route: string) => byRoute.get(route);
export function formatPlaybookChecklist(title: string, items: string[], checked: boolean[] = []) {
  return [`${title} — working checklist`, ...items.map((item, index) => `${checked[index] ? "[x]" : "[ ]"} ${item}`)].join("\n");
}

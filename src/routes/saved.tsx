import { createFileRoute } from "@tanstack/react-router";
import { BookmarkCheck } from "lucide-react";
import { PageHeader, Panel, EmptyState } from "@/components/app/ui";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAppState } from "@/lib/store";
import { seo } from "@/lib/seo";

const tabs = ["chats", "concerns", "plans", "research"] as const;
type SavedTab = typeof tabs[number];
export const Route = createFileRoute("/saved")({
  validateSearch: (search: Record<string, unknown>): { tab: SavedTab } => ({ tab: tabs.find((tab) => tab === search["tab"]) ?? "chats" }),
  head: () => seo("Saved Information — AutismCare AI", "Your saved conversations, concerns, routines and research in AutismCare AI."),
  component: SavedPage,
});

function SavedPage() {
  const state = useAppState((s) => s);
  const { tab } = Route.useSearch();
  const navigate = Route.useNavigate();
  const groups = {
    chats: state.chats.map((item) => ({ id: item.id, title: item.title, text: item.body })),
    concerns: state.concerns.map((item) => ({ id: item.id, title: item.title, text: item.text })),
    plans: state.plans.map((item) => ({ id: item.id, title: item.title, text: Object.values(item.plan).flat().map((task) => `${task.time} — ${task.task}`).join("\n") })),
    research: state.research.map((item) => ({ id: item.id, title: item.topic, text: item.result.summary })),
  };
  return <div>
    <PageHeader title="Saved Information" icon={<BookmarkCheck />} />
    <Tabs value={tab} onValueChange={(value) => { const next = tabs.find((item) => item === value); if (next) navigate({ search: { tab: next } }); }}>
      <TabsList className="mb-6 flex h-auto flex-wrap">{tabs.map((item) => <TabsTrigger key={item} value={item} className="capitalize">{item}</TabsTrigger>)}</TabsList>
      {tabs.map((item) => <TabsContent key={item} value={item} className="space-y-4">
        {groups[item].length ? groups[item].map((entry) => <Panel key={entry.id}><h2 className="font-semibold">{entry.title}</h2><p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">{entry.text}</p></Panel>) : <EmptyState icon={<BookmarkCheck />} title="Nothing saved yet" text="" />}
      </TabsContent>)}
    </Tabs>
  </div>;
}
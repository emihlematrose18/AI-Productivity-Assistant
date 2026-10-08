import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Check, ListChecks, Puzzle, RefreshCw, Save, Search, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AIBadge,
  EditToggle,
  EditableSection,
  ErrorBox,
  InfoBox,
  Loading,
  PageHeader,
  Panel,
  ResponsibleNotice,
  errMsg,
} from "@/components/app/ui";
import { analyzeSigns, type SignsResult } from "@/lib/ai.functions";
import { setState, uid, type SavedConcern } from "@/lib/store";
import { seo } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/signs")({
  head: () =>
    seo("Signs & Concerns — AutismCare AI", "Explore behaviours and developmental differences you have noticed. This tool does not diagnose autism."),
  component: SignsPage,
});

const CATEGORIES: Record<string, string[]> = {
  Communication: [
    "Limited or delayed speech",
    "Difficulty with back-and-forth conversation",
    "Difficulty communicating needs",
    "Does not consistently respond when called",
    "Repeats words or phrases",
    "Difficulty understanding certain communication cues",
  ],
  "Social Interaction": [
    "Difficulty interacting with other children",
    "Difficulty understanding social cues",
    "Difficulty with shared play",
    "Often prefers playing alone",
    "Difficulty starting or maintaining interactions",
  ],
  "Repetitive Behaviours & Routines": [
    "Repetitive movements",
    "Strong preference for routines",
    "Becomes distressed by unexpected changes",
    "Repeatedly focuses on particular activities",
    "Repeats particular actions or behaviours",
  ],
  "Sensory Differences": [
    "Sensitive to loud sounds",
    "Sensitive to certain textures",
    "Sensitive to bright lights",
    "Strong reactions to smells",
    "Seeks particular sensory experiences",
    "Becomes overwhelmed in busy environments",
  ],
};

const MEANING =
  "Some of the observations you selected can occur in autistic children, but these behaviours can also occur for many other reasons. This tool cannot determine whether your child is autistic. If you are concerned, consider speaking with a qualified healthcare or developmental professional.";
const STEPS = [
  "Keep a record of when the behaviour occurs.",
  "Note possible triggers and situations.",
  "Record how often the behaviour occurs.",
  "Discuss your concerns with the child's healthcare or developmental professional.",
  "Ask whether an appropriate developmental assessment may be useful.",
];

function SignsPage() {
  const navigate = useNavigate();
  const analyze = useServerFn(analyzeSigns);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [result, setResult] = useState<SignsResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return Object.entries(CATEGORIES)
      .map(([cat, items]) => [cat, items.filter((i) => !q || i.toLowerCase().includes(q) || cat.toLowerCase().includes(q))] as const)
      .filter(([, items]) => items.length);
  }, [query]);

  const toggle = (o: string) => setSelected((s) => (s.includes(o) ? s.filter((x) => x !== o) : [...s, o]));

  async function run() {
    setLoading(true);
    setError("");
    try {
      const r = await analyze({ data: { observations: selected } });
      setResult(r);
    } catch (e) {
      setError(errMsg(e));
    } finally {
      setLoading(false);
    }
  }

  const current: SignsResult = result ?? { meaning: MEANING, observations: [], next_steps: STEPS };
  const update = (patch: Partial<SignsResult>) => setResult({ ...current, ...patch });

  function text() {
    return [
      `Observations: ${selected.join("; ")}`,
      "",
      current.meaning,
      ...current.observations.map((o) => `• ${o.observation}: ${o.note} Idea: ${o.support_idea}`),
      "",
      "Next steps:",
      ...current.next_steps.map((s) => `• ${s}`),
    ].join("\n");
  }

  function saveObservations() {
    setState((s) => ({
      ...s,
      chats: [{ id: uid(), title: `Observations: ${selected.slice(0, 3).join(", ")}${selected.length > 3 ? "…" : ""}`, body: text(), createdAt: new Date().toISOString() }, ...s.chats],
    }));
    toast.success("Observations saved");
  }

  function addToConcerns() {
    setState((s) => ({
      ...s,
      concerns: selected
        .map((o): SavedConcern => ({ id: uid(), title: o, text: `Observed: ${o}`, date: new Date().toISOString().slice(0, 10), category: "Other", result: null, createdAt: new Date().toISOString() }))
        .concat(s.concerns),
    }));
    toast.success(`${selected.length} observation${selected.length > 1 ? "s" : ""} added to My Child's Concerns`);
    navigate({ to: "/saved", search: { tab: "concerns" } });
  }

  return (
    <div className="animate-rise space-y-6">
      <PageHeader
        icon={<Puzzle className="h-6 w-6" />}
        title="Signs & Concerns"
        subtitle="Explore behaviours and developmental differences you have noticed. This tool does not diagnose autism."
      />
      <ResponsibleNotice compact />

      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search for a sign or behaviour..." className="h-12 rounded-xl bg-card pl-10" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map(([cat, items]) => (
          <Panel key={cat}>
            <h2 className="font-semibold">{cat}</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {items.map((o) => {
                const on = selected.includes(o);
                return (
                  <button
                    key={o}
                    onClick={() => toggle(o)}
                    aria-pressed={on}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-left text-sm transition-colors",
                      on ? "border-primary bg-accent text-accent-foreground" : "bg-background hover:border-primary/50",
                    )}
                  >
                    {on && <Check className="h-3.5 w-3.5 shrink-0" />}
                    {o}
                  </button>
                );
              })}
            </div>
          </Panel>
        ))}
        {filtered.length === 0 && <p className="text-sm text-muted-foreground">No matching observations. Try another word.</p>}
      </div>

      <div className="sticky bottom-4 z-10 flex flex-col gap-3 rounded-2xl border bg-card/95 p-4 shadow-lift backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-2 text-sm">
          <ListChecks className="h-4 w-4 text-primary" /> {selected.length} observation{selected.length === 1 ? "" : "s"} selected
        </p>
        <div className="flex gap-2">
          <Button variant="ghost" disabled={!selected.length} onClick={() => { setSelected([]); setResult(null); }}>
            Clear
          </Button>
          <Button disabled={!selected.length || loading} onClick={run}>
            <Sparkles /> {result ? "Regenerate" : "Understand my observations"}
          </Button>
        </div>
      </div>

      {loading && <Loading label="Organising your observations…" />}
      {error && <ErrorBox message={error} />}

      {selected.length > 0 && !loading && (
        <Panel className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-semibold">What Your Observations May Mean</h2>
            <div className="flex items-center gap-2">
              {result && <AIBadge />}
              <EditToggle editing={editing} setEditing={setEditing} />
            </div>
          </div>
          <InfoBox>
            <EditableSection title="" value={current.meaning} editing={editing} onChange={(v) => update({ meaning: v as string })} />
          </InfoBox>
          {current.observations.length > 0 && (
            <div className="grid gap-3 sm:grid-cols-2">
              {current.observations.map((o, i) => (
                <div key={i} className="rounded-xl border p-4">
                  <p className="text-sm font-semibold">{o.observation}</p>
                  <EditableSection title="" value={o.note} editing={editing} onChange={(v) => update({ observations: current.observations.map((x, j) => (j === i ? { ...x, note: v as string } : x)) })} />
                  <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-secondary">Supportive idea</p>
                  <EditableSection title="" value={o.support_idea} editing={editing} onChange={(v) => update({ observations: current.observations.map((x, j) => (j === i ? { ...x, support_idea: v as string } : x)) })} />
                </div>
              ))}
            </div>
          )}
          <EditableSection title="Suggested Next Steps" value={current.next_steps} editing={editing} onChange={(v) => update({ next_steps: v as string[] })} />
          <div className="flex flex-wrap gap-2 border-t pt-4">
            <Button onClick={saveObservations}>
              <Save /> Save My Observations
            </Button>
            <Button variant="secondary" onClick={addToConcerns}>
              Add to My Child's Concerns
            </Button>
            {result && (
              <Button variant="outline" onClick={run}>
                <RefreshCw /> Regenerate
              </Button>
            )}
          </div>
        </Panel>
      )}
    </div>
  );
}

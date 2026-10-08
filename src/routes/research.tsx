import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Bot, ExternalLink, RefreshCw, Save, Search, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AIBadge, EditToggle, EditableSection, ErrorBox, Loading, PageHeader, Panel, ResponsibleNotice, errMsg } from "@/components/app/ui";
import { researchTopic, type ResearchResult } from "@/lib/ai.functions";
import { setState, uid } from "@/lib/store";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/research")({
  head: () => seo("AI Research Assistant — AutismCare AI", "Explore autism and child-development topics in simple language."),
  component: ResearchPage,
});

const EXAMPLES = ["Autism and sensory processing", "Communication differences", "Supporting transitions", "Visual schedules", "Autism and school", "Social interaction"];

function ResearchPage() {
  const research = useServerFn(researchTopic);
  const [topic, setTopic] = useState("");
  const [asked, setAsked] = useState("");
  const [result, setResult] = useState<ResearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);

  async function run(t: string) {
    const q = t.trim();
    if (q.length < 2) return;
    setTopic(q);
    setLoading(true);
    setError("");
    try {
      setResult(await research({ data: { topic: q } }));
      setAsked(q);
      setEditing(false);
    } catch (e) {
      setError(errMsg(e));
    } finally {
      setLoading(false);
    }
  }

  const upd = (k: keyof ResearchResult) => (v: string | string[]) => result && setResult({ ...result, [k]: v });

  return (
    <div className="animate-rise space-y-6">
      <PageHeader icon={<Search className="h-6 w-6" />} title="AI Research Assistant" subtitle="Explore autism and child-development topics in simple language." />
      <ResponsibleNotice compact />

      <Panel>
        <form onSubmit={(e) => { e.preventDefault(); run(topic); }} className="flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="What would you like to learn about?" className="h-12 rounded-xl pl-10" />
          </div>
          <Button type="submit" size="lg" className="h-12" disabled={loading || topic.trim().length < 2}>
            <Sparkles /> Research
          </Button>
        </form>
        <div className="mt-4 flex flex-wrap gap-2">
          {EXAMPLES.map((e) => (
            <button key={e} onClick={() => run(e)} className="rounded-full border bg-background px-3 py-1.5 text-sm transition-colors hover:border-primary hover:bg-accent">
              {e}
            </button>
          ))}
        </div>
      </Panel>

      {loading && <Loading label={`Researching "${topic}"…`} />}
      {error && <ErrorBox message={error} />}

      {result && !loading && (
        <Panel className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-semibold">{asked}</h2>
            <AIBadge />
          </div>
          <div className="rounded-xl bg-accent p-4">
            <EditableSection title="Quick Summary" value={result.summary} editing={editing} onChange={upd("summary")} />
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <EditableSection title="Key Points" value={result.key_points} editing={editing} onChange={upd("key_points")} />
            <EditableSection title="Practical Information" value={result.practical} editing={editing} onChange={upd("practical")} />
          </div>
          <EditableSection title="Questions to Ask a Professional" value={result.questions} editing={editing} onChange={upd("questions")} />

          <section className="rounded-xl border border-info/30 bg-info-soft p-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-info-foreground">Sources</h3>
            <p className="mt-1 text-xs text-info-foreground">
              Source material from external organisations. The sections above are AI-generated summaries — please check the original sources.
            </p>
            <ul className="mt-3 space-y-2">
              {result.sources.map((s, i) => (
                <li key={i}>
                  <a href={s.url} target="_blank" rel="noreferrer" className="inline-flex items-start gap-2 text-sm text-secondary hover:underline">
                    <ExternalLink className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>
                      <span className="font-medium">{s.name}</span> — {s.title}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <div className="flex flex-wrap gap-2 border-t pt-4">
            <Button
              onClick={() => {
                setState((s) => ({ ...s, research: [{ id: uid(), topic: asked, result, createdAt: new Date().toISOString() }, ...s.research] }));
                toast.success("Research saved");
              }}
            >
              <Save /> Save Research
            </Button>
            <EditToggle editing={editing} setEditing={setEditing} />
            <Button variant="outline" onClick={() => run(asked)}>
              <RefreshCw /> Regenerate
            </Button>
            <Button asChild variant="secondary">
              <Link to="/chat" search={{ q: `Can you tell me more about ${asked.toLowerCase()} and how it might apply to my child?` }}>
                <Bot /> Ask AI About This
              </Link>
            </Button>
          </div>
        </Panel>
      )}
    </div>
  );
}

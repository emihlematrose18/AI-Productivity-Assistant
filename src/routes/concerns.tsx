import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { NotebookPen, RefreshCw, Save, Sparkles, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AIBadge, EditToggle, EditableSection, ErrorBox, Loading, PageHeader, Panel, ResponsibleNotice, errMsg } from "@/components/app/ui";
import { analyzeConcern, type ConcernResult } from "@/lib/ai.functions";
import { setState, uid } from "@/lib/store";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/concerns")({
  head: () => seo("My Child's Concerns — AutismCare AI", "Write down what you are experiencing and let AI help you organise your thoughts."),
  component: ConcernsPage,
});

const CATS = ["Communication", "Behaviour", "Sensory", "Routine", "Social interaction", "School", "Other"];

function ConcernsPage() {
  const navigate = useNavigate();
  const analyze = useServerFn(analyzeConcern);
  const [text, setText] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [result, setResult] = useState<ConcernResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);

  async function run() {
    if (text.trim().length < 5) return setError("Please describe your concern in a little more detail.");
    setLoading(true);
    setError("");
    try {
      setResult(await analyze({ data: { text, date, category } }));
      setEditing(false);
    } catch (e) {
      setError(errMsg(e));
    } finally {
      setLoading(false);
    }
  }

  function save() {
    if (!result) return;
    setState((s) => ({
      ...s,
      concerns: [
        { id: uid(), title: result.summary.split(/(?<=\.)\s/)[0].slice(0, 100), text, date, category: category || "Other", result, createdAt: new Date().toISOString() },
        ...s.concerns,
      ],
    }));
    toast.success("Concern saved");
    navigate({ to: "/saved", search: { tab: "concerns" } });
  }

  const upd = (k: keyof ConcernResult) => (v: string | string[]) => result && setResult({ ...result, [k]: v });

  return (
    <div className="animate-rise space-y-6">
      <PageHeader icon={<NotebookPen className="h-6 w-6" />} title="My Child's Concerns" subtitle="Write down what you are experiencing and let AI help you organise your thoughts." />
      <ResponsibleNotice compact />

      <Panel className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="concern">Your concern</Label>
          <Textarea
            id="concern"
            rows={6}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Describe the problem or concern you are currently experiencing..."
          />
          <button type="button" className="text-xs text-secondary hover:underline" onClick={() => setText("My child becomes very upset whenever we change their routine. They also struggle with loud noises at school.")}>
            Use an example
          </button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="date">Date (optional)</Label>
            <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Category (optional)</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a category" />
              </SelectTrigger>
              <SelectContent>
                {CATS.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button size="lg" onClick={run} disabled={loading}>
          <Sparkles /> Analyse My Concern
        </Button>
      </Panel>

      {loading && <Loading label="Organising your concern…" />}
      {error && <ErrorBox message={error} />}

      {result && !loading && (
        <Panel className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-semibold">Your organised concern</h2>
            <AIBadge />
          </div>
          <EditableSection title="Concern Summary" value={result.summary} editing={editing} onChange={upd("summary")} />
          <div className="grid gap-6 md:grid-cols-2">
            <EditableSection title="Possible Factors" value={result.possible_factors} editing={editing} onChange={upd("possible_factors")} />
            <EditableSection title="Things You Could Try" value={result.things_to_try} editing={editing} onChange={upd("things_to_try")} />
            <EditableSection title="What to Monitor" value={result.what_to_monitor} editing={editing} onChange={upd("what_to_monitor")} />
            <EditableSection title="Consider Discussing With a Professional" value={result.professional} editing={editing} onChange={upd("professional")} />
          </div>
          <div className="flex flex-wrap gap-2 border-t pt-4">
            <EditToggle editing={editing} setEditing={setEditing} />
            <Button onClick={save}>
              <Save /> Save Concern
            </Button>
            <Button variant="outline" onClick={run}>
              <RefreshCw /> Regenerate
            </Button>
            <Button variant="ghost" className="text-destructive" onClick={() => { setResult(null); toast("Analysis deleted"); }}>
              <Trash2 /> Delete
            </Button>
          </div>
        </Panel>
      )}
    </div>
  );
}

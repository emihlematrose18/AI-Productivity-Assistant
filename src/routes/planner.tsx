import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { CalendarPlus, CheckCircle2, Circle, ClipboardList, Loader2, Plus, RefreshCw, Save, Sparkles, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AIBadge, ErrorBox, Loading, PageHeader, Panel, errMsg } from "@/components/app/ui";
import { generatePlan, regenerateTask } from "@/lib/ai.functions";
import { setState, uid, type Plan, type PlanRow } from "@/lib/store";
import { seo } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/planner")({
  head: () => seo("AI Task Planner — AutismCare AI", "Create a structured and flexible routine for your child's day."),
  component: PlannerPage,
});

const PERIODS = [
  ["morning", "Morning"],
  ["afternoon", "Afternoon"],
  ["evening", "Evening"],
] as const;
type Period = (typeof PERIODS)[number][0];

const FIELDS = [
  ["age", "Child's age", "e.g. 7"],
  ["goal", "Main goal", "Create a calm after-school routine."],
  ["time", "Available time", "3 hours after school."],
  ["interests", "Activities / interests", "Drawing, music and outdoor play."],
  ["challenges", "Challenges to consider", "Difficulty transitioning between activities."],
] as const;

function PlannerPage() {
  const gen = useServerFn(generatePlan);
  const regen = useServerFn(regenerateTask);
  const [form, setForm] = useState({ age: "", goal: "", time: "", interests: "", challenges: "" });
  const [plan, setPlan] = useState<Plan | null>(null);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [busyRow, setBusyRow] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function run() {
    if (form.goal.trim().length < 2) return setError("Please add a main goal for the routine.");
    setLoading(true);
    setError("");
    try {
      const r = await gen({ data: form });
      const wrap = (rows: { time: string; task: string; notes: string }[]) => rows.map((t) => ({ ...t, id: uid(), done: false }));
      setPlan({ morning: wrap(r.morning), afternoon: wrap(r.afternoon), evening: wrap(r.evening) });
      setTitle(form.goal.slice(0, 80));
    } catch (e) {
      setError(errMsg(e));
    } finally {
      setLoading(false);
    }
  }

  const patchRow = (p: Period, id: string, patch: Partial<PlanRow>) =>
    setPlan((pl) => pl && { ...pl, [p]: pl[p].map((r) => (r.id === id ? { ...r, ...patch } : r)) });
  const delRow = (p: Period, id: string) => setPlan((pl) => pl && { ...pl, [p]: pl[p].filter((r) => r.id !== id) });
  const addRow = (p: Period) =>
    setPlan((pl) => pl && { ...pl, [p]: [...pl[p], { id: uid(), time: "", task: "New task", notes: "", done: false }] });

  async function regenRow(p: Period, row: PlanRow) {
    setBusyRow(row.id);
    try {
      const t = await regen({ data: { ...form, period: p, current: row.task, slot: row.time } });
      patchRow(p, row.id, { task: t.task, notes: t.notes, time: t.time || row.time });
    } catch (e) {
      toast.error(errMsg(e));
    } finally {
      setBusyRow(null);
    }
  }

  function save() {
    if (!plan) return;
    setState((s) => ({ ...s, plans: [{ id: uid(), title: title || "My routine", plan, createdAt: new Date().toISOString() }, ...s.plans] }));
    toast.success("Routine saved");
  }

  function addToToday() {
    if (!plan) return;
    const rows = PERIODS.flatMap(([p]) => plan[p]);
    setState((s) => ({ ...s, todayTasks: rows.map((r) => ({ id: uid(), label: `${r.time ? r.time + " · " : ""}${r.task}`, done: r.done })) }));
    toast.success("Added to Today's Tasks on your dashboard");
  }

  return (
    <div className="animate-rise space-y-6">
      <PageHeader icon={<ClipboardList className="h-6 w-6" />} title="AI Task Planner" subtitle="Create a structured and flexible routine for your child's day." />

      <Panel>
        <div className="grid gap-4 sm:grid-cols-2">
          {FIELDS.map(([k, label, ph]) => (
            <div key={k} className={cn("space-y-2", k === "goal" && "sm:col-span-2")}>
              <Label htmlFor={k}>{label}</Label>
              <Input id={k} value={form[k]} placeholder={ph} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />
            </div>
          ))}
        </div>
        <Button size="lg" className="mt-5" onClick={run} disabled={loading}>
          <Sparkles /> {plan ? "Regenerate Plan" : "Generate Plan"}
        </Button>
      </Panel>

      {loading && <Loading label="Building a flexible routine…" />}
      {error && <ErrorBox message={error} />}

      {plan && !loading && (
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <Input value={title} onChange={(e) => setTitle(e.target.value)} className="max-w-md bg-card font-semibold" aria-label="Routine name" />
              <AIBadge />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={addToToday}>
                <CalendarPlus /> Use for today
              </Button>
              <Button onClick={save}>
                <Save /> Save routine
              </Button>
            </div>
          </div>

          {PERIODS.map(([p, label]) => (
            <Panel key={p} className="p-0 sm:p-0">
              <div className="flex items-center justify-between border-b px-5 py-3">
                <h2 className="font-semibold">{label}</h2>
                <Button variant="ghost" size="sm" onClick={() => addRow(p)}>
                  <Plus /> Add task
                </Button>
              </div>
              <div className="hidden grid-cols-[2.5rem_6rem_1fr_1.3fr_6rem] gap-3 px-5 pt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground md:grid">
                <span />
                <span>Time</span>
                <span>Task</span>
                <span>Notes</span>
                <span />
              </div>
              <ul className="divide-y">
                {plan[p].length === 0 && <li className="px-5 py-4 text-sm text-muted-foreground">No tasks yet.</li>}
                {plan[p].map((r) => (
                  <li key={r.id} className={cn("grid grid-cols-[2.5rem_1fr_auto] gap-3 px-5 py-3 md:grid-cols-[2.5rem_6rem_1fr_1.3fr_6rem] md:items-center", r.done && "opacity-60")}>
                    <button onClick={() => patchRow(p, r.id, { done: !r.done })} aria-label={r.done ? "Mark incomplete" : "Mark complete"} className="row-span-3 self-start pt-2 md:row-span-1 md:pt-0">
                      {r.done ? <CheckCircle2 className="h-5 w-5 text-primary" /> : <Circle className="h-5 w-5 text-muted-foreground" />}
                    </button>
                    <Input type="time" value={/^\d{2}:\d{2}$/.test(r.time) ? r.time : ""} onChange={(e) => patchRow(p, r.id, { time: e.target.value })} aria-label="Time" className="h-9 md:col-auto" />
                    <div className="col-start-2 md:col-start-auto">
                      <Input value={r.task} onChange={(e) => patchRow(p, r.id, { task: e.target.value })} aria-label="Task" className={cn("h-9 font-medium", r.done && "line-through")} />
                    </div>
                    <div className="col-start-2 md:col-start-auto">
                      <Input value={r.notes} onChange={(e) => patchRow(p, r.id, { notes: e.target.value })} aria-label="Notes" placeholder="Notes" className="h-9 text-muted-foreground" />
                    </div>
                    <div className="col-start-3 row-start-1 flex justify-end gap-1 md:col-start-auto md:row-start-auto">
                      <Button variant="ghost" size="icon" onClick={() => regenRow(p, r)} disabled={busyRow === r.id} aria-label="Regenerate task">
                        {busyRow === r.id ? <Loader2 className="animate-spin" /> : <RefreshCw />}
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => delRow(p, r.id)} aria-label="Delete task" className="text-destructive">
                        <Trash2 />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </Panel>
          ))}
        </div>
      )}
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Bot, CheckCircle2, Circle, ClipboardList, Languages, NotebookPen, Puzzle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Panel, ResponsibleNotice } from "@/components/app/ui";
import { setState, useAppState } from "@/lib/store";
import { seo } from "@/lib/seo";
import { LANGUAGES, dashboardCopy, dashboardSample } from "@/lib/dashboard-language";

export const Route = createFileRoute("/")({
  head: () =>
    seo(
      "AutismCare AI — Support for parents and caregivers",
      "Supportive AI tools for parents: chatbot, signs explorer, routine planner and research assistant. Never a diagnosis.",
    ),
  component: Dashboard,
});

const FEATURES = [
  { to: "/chat", title: "AI Chatbot", text: "Ask questions and receive supportive, easy-to-understand information.", cta: "Open Chatbot", icon: Bot },
  { to: "/signs", title: "Signs & Concerns", text: "Explore developmental and behavioural signs you may have noticed.", cta: "Explore Signs", icon: Puzzle },
  { to: "/planner", title: "AI Task Planner", text: "Create routines, activities and tasks for your child's day.", cta: "Create a Plan", icon: ClipboardList },
  { to: "/research", title: "AI Research Assistant", text: "Research autism-related topics and receive simplified explanations.", cta: "Start Research", icon: Search },
] as const;

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? "morning" : h < 18 ? "afternoon" : "evening";
}

function Dashboard() {
  const tasks = useAppState((s) => s.todayTasks);
  const concerns = useAppState((s) => s.concerns);
  const research = useAppState((s) => s.research);
  const name = useAppState((s) => s.settings.name);
  const language = useAppState((s) => s.settings.language);
  const copy = dashboardCopy(language);
  const locale = LANGUAGES.find((item) => item.value === language) ?? LANGUAGES[0];
  const [hello, setHello] = useState<"morning" | "afternoon" | "evening">("morning");
  useEffect(() => setHello(greeting()), []);
  const done = tasks.filter((t) => t.done).length;

  return (
    <div className="animate-rise space-y-8" lang={locale.code}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {copy[hello]}
          {name ? `, ${name}` : ""} 👋
        </h1>
        <p className="mt-1.5 text-muted-foreground">{copy.welcome}</p>
        </div>
        <div className="w-full shrink-0 sm:w-48">
          <label htmlFor="dashboard-language" className="mb-1.5 flex items-center gap-2 text-sm font-medium">
            <Languages className="h-4 w-4 text-primary" aria-hidden="true" />
            {copy.language}
          </label>
          <Select value={locale.value} onValueChange={(value) => setState((s) => ({ ...s, settings: { ...s.settings, language: value } }))}>
            <SelectTrigger id="dashboard-language" aria-label={copy.language} className="h-10 bg-card">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {FEATURES.map(({ to, icon: Icon }, index) => (
          <div key={to} className="group flex flex-col rounded-2xl border bg-card p-5 shadow-card transition-shadow hover:shadow-lift">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent text-accent-foreground">
              <Icon className="h-5 w-5" />
            </span>
            <h2 className="mt-4 break-words font-semibold">{copy.nav[[1, 2, 4, 5][index] ?? 1]}</h2>
            <p className="mt-1 flex-1 text-sm text-muted-foreground">{copy.descriptions[index]}</p>
            <Button asChild className="mt-5 h-auto min-h-9 w-full whitespace-normal py-2 text-center">
              <Link to={to}>
                {copy.actions[index]} <ArrowRight className="shrink-0 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <Panel className="lg:col-span-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">{copy.tasks}</h2>
            <span className="shrink-0 text-sm text-muted-foreground">
              {done}/{tasks.length} {copy.done}
            </span>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
            <div className="h-full bg-primary transition-all" style={{ width: `${tasks.length ? (done / tasks.length) * 100 : 0}%` }} />
          </div>
          {tasks.length === 0 ? (
            <p className="mt-6 text-sm text-muted-foreground">{copy.emptyTasks}</p>
          ) : (
            <ul className="mt-4 divide-y">
              {tasks.map((t) => (
                <li key={t.id}>
                   <Button variant="ghost"
                    onClick={() => setState((s) => ({ ...s, todayTasks: s.todayTasks.map((x) => (x.id === t.id ? { ...x, done: !x.done } : x)) }))}
                    className="h-auto min-h-11 w-full justify-start gap-3 whitespace-normal px-0 py-3 text-left text-sm"
                    aria-pressed={t.done}
                  >
                    {t.done ? <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" /> : <Circle className="h-5 w-5 shrink-0 text-muted-foreground" />}
                    <span className={t.done ? "text-muted-foreground line-through" : ""}>{dashboardSample(t.label, copy)}</span>
                  </Button>
                </li>
              ))}
            </ul>
          )}
          <Button asChild variant="soft" className="mt-4">
            <Link to="/planner">{copy.plan}</Link>
          </Button>
        </Panel>

        <Panel className="lg:col-span-2">
          <h2 className="text-lg font-semibold">{copy.concerns}</h2>
          {concerns.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">{copy.emptyConcerns}</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {concerns.slice(0, 3).map((c) => (
                <li key={c.id} className="flex items-start gap-3 rounded-xl bg-accent/60 p-3 text-sm">
                  <NotebookPen className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>"{dashboardSample(c.title, copy)}"</span>
                </li>
              ))}
            </ul>
          )}
          <Button asChild variant="outline" className="mt-4 h-auto min-h-9 w-full whitespace-normal py-2 text-center">
            <Link to="/saved" search={{ tab: "concerns" }}>
              {copy.allConcerns}
            </Link>
          </Button>
          {research[0] && (
            <div className="mt-6 border-t pt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{copy.research}</p>
              <Link to="/saved" search={{ tab: "research" }} className="mt-1 block text-sm font-medium text-secondary hover:underline">
                {dashboardSample(research[0].topic, copy)}
              </Link>
            </div>
          )}
        </Panel>
      </div>

      <ResponsibleNotice compact title={copy.noticeTitle} text={copy.notice} />
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Bot, CheckCircle2, Circle, ClipboardList, NotebookPen, Puzzle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Panel, ResponsibleNotice } from "@/components/app/ui";
import { setState, useAppState } from "@/lib/store";
import { seo } from "@/lib/seo";

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
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
}

function Dashboard() {
  const tasks = useAppState((s) => s.todayTasks);
  const concerns = useAppState((s) => s.concerns);
  const research = useAppState((s) => s.research);
  const name = useAppState((s) => s.settings.name);
  const [hello, setHello] = useState("Good morning");
  useEffect(() => setHello(greeting()), []);
  const done = tasks.filter((t) => t.done).length;

  return (
    <div className="animate-rise space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {hello}
          {name ? `, ${name}` : ""} 👋
        </h1>
        <p className="mt-1.5 text-muted-foreground">How can AutismCare AI support you today?</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {FEATURES.map(({ to, title, text, cta, icon: Icon }) => (
          <div key={to} className="group flex flex-col rounded-2xl border bg-card p-5 shadow-card transition-shadow hover:shadow-lift">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent text-accent-foreground">
              <Icon className="h-5 w-5" />
            </span>
            <h2 className="mt-4 font-semibold">{title}</h2>
            <p className="mt-1 flex-1 text-sm text-muted-foreground">{text}</p>
            <Button asChild className="mt-5 w-full">
              <Link to={to}>
                {cta} <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <Panel className="lg:col-span-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Today's Tasks</h2>
            <span className="shrink-0 text-sm text-muted-foreground">
              {done}/{tasks.length} done
            </span>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
            <div className="h-full bg-primary transition-all" style={{ width: `${tasks.length ? (done / tasks.length) * 100 : 0}%` }} />
          </div>
          {tasks.length === 0 ? (
            <p className="mt-6 text-sm text-muted-foreground">No tasks yet. Generate a routine in the AI Task Planner and add it to today.</p>
          ) : (
            <ul className="mt-4 divide-y">
              {tasks.map((t) => (
                <li key={t.id}>
                  <button
                    onClick={() => setState((s) => ({ ...s, todayTasks: s.todayTasks.map((x) => (x.id === t.id ? { ...x, done: !x.done } : x)) }))}
                    className="flex w-full items-center gap-3 py-3 text-left text-sm"
                    aria-pressed={t.done}
                  >
                    {t.done ? <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" /> : <Circle className="h-5 w-5 shrink-0 text-muted-foreground" />}
                    <span className={t.done ? "text-muted-foreground line-through" : ""}>{t.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          <Button asChild variant="soft" className="mt-4">
            <Link to="/planner">Plan the day</Link>
          </Button>
        </Panel>

        <Panel className="lg:col-span-2">
          <h2 className="text-lg font-semibold">Recent Concerns</h2>
          {concerns.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">No concerns saved yet.</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {concerns.slice(0, 3).map((c) => (
                <li key={c.id} className="flex items-start gap-3 rounded-xl bg-accent/60 p-3 text-sm">
                  <NotebookPen className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>"{c.title}"</span>
                </li>
              ))}
            </ul>
          )}
          <Button asChild variant="outline" className="mt-4 w-full">
            <Link to="/saved" search={{ tab: "concerns" }}>
              View All Concerns
            </Link>
          </Button>
          {research[0] && (
            <div className="mt-6 border-t pt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Recent research</p>
              <Link to="/saved" search={{ tab: "research" }} className="mt-1 block text-sm font-medium text-secondary hover:underline">
                {research[0].topic}
              </Link>
            </div>
          )}
        </Panel>
      </div>

      <ResponsibleNotice compact />
    </div>
  );
}

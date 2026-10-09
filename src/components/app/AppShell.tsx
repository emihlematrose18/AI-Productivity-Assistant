import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  Bot,
  BookmarkCheck,
  ClipboardList,
  HeartHandshake,
  LayoutDashboard,
  Menu,
  NotebookPen,
  Puzzle,
  Search,
  Settings,
  ShieldCheck,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppState } from "@/lib/store";
import { dashboardCopy } from "@/lib/dashboard-language";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/chat", label: "AI Chatbot", icon: Bot },
  { to: "/signs", label: "Signs & Concerns", icon: Puzzle },
  { to: "/concerns", label: "My Child's Concerns", icon: NotebookPen },
  { to: "/planner", label: "AI Task Planner", icon: ClipboardList },
  { to: "/research", label: "AI Research Assistant", icon: Search },
  { to: "/saved", label: "Saved Information", icon: BookmarkCheck },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

function Brand() {
  const language = useAppState((s) => s.settings.language);
  const copy = dashboardCopy(language);
  return (
    <Link to="/" className="flex items-center gap-3">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground shadow-card">
        <HeartHandshake className="h-5 w-5" />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-base font-bold tracking-tight">AutismCare AI</span>
        <span className="block text-xs text-muted-foreground">{copy.subtitle}</span>
      </span>
    </Link>
  );
}

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const language = useAppState((s) => s.settings.language);
  const copy = dashboardCopy(language);
  const path = useRouterState({ select: (s) => s.location.pathname });
  const item = "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors";
  return (
    <div className="flex h-full flex-col">
      <nav className="flex flex-1 flex-col gap-1" aria-label="Main">
        {NAV.map(({ to, icon: Icon }, index) => {
          const active = to === "/" ? path === "/" : path.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                item,
                active
                  ? "bg-primary text-primary-foreground shadow-card"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="min-w-0 break-words">{copy.nav[index]}</span>
            </Link>
          );
        })}
      </nav>
      <Link
        to="/responsible-ai"
        onClick={onNavigate}
        className={cn(
          item,
          "mt-4 border border-warning/40 bg-warning-soft text-warning-foreground hover:bg-warning/20",
          path === "/responsible-ai" && "ring-2 ring-warning",
        )}
      >
        <ShieldCheck className="h-4 w-4 shrink-0" />
        {copy.responsible}
      </Link>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const settings = useAppState((s) => s.settings);
  useEffect(() => {
    document.body.classList.toggle("a11y-large", settings.largeText);
    document.body.classList.toggle("a11y-reduce", settings.reduceMotion);
  }, [settings.largeText, settings.reduceMotion]);

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col gap-8 border-r border-sidebar-border bg-sidebar p-5 lg:flex">
        <Brand />
        <NavList />
      </aside>

      <header className="sticky top-0 z-30 flex items-center justify-between border-b bg-card/90 px-4 py-3 backdrop-blur lg:hidden">
        <Brand />
        <button
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border bg-card"
        >
          <Menu className="h-5 w-5" />
        </button>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-foreground/30" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] animate-rise flex-col gap-8 bg-sidebar p-5 shadow-lift">
            <div className="flex items-center justify-between gap-2">
              <Brand />
              <button onClick={() => setOpen(false)} aria-label="Close menu" className="grid h-9 w-9 shrink-0 place-items-center rounded-lg hover:bg-muted">
                <X className="h-5 w-5" />
              </button>
            </div>
            <NavList onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}

      <main className="lg:pl-64">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">{children}</div>
      </main>
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { HeartHandshake, Lightbulb, ShieldCheck, Sparkles, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader, Panel, ResponsibleNotice } from "@/components/app/ui";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/about")({
  head: () =>
    seo(
      "About & Founder — AutismCare AI",
      "Meet Mihle Matrose, the founder and creator of AutismCare AI, and learn why this supportive parent and caregiver tool was built.",
    ),
  component: AboutPage,
});

const WHY = [
  {
    icon: Lightbulb,
    title: "Questions should not wait",
    text: "Parents often search late at night with nothing but a worry and a search bar. This app turns that worry into clear, plain-language information they can act on.",
  },
  {
    icon: HeartHandshake,
    title: "Support, never a label",
    text: "AutismCare AI is built to help families understand, organise and prepare — not to hand out a diagnosis. Every answer points back to qualified professionals.",
  },
  {
    icon: Sparkles,
    title: "Made for real days",
    text: "Routines, concerns and research are stored so a parent can pick up where they left off, in a language they are comfortable with.",
  },
];

const TOOLS = [
  { to: "/chat", label: "AI Chatbot", text: "Ask anything and receive supportive, easy-to-understand information." },
  { to: "/signs", label: "Signs & Concerns", text: "Explore developmental and behavioural signs you may have noticed." },
  { to: "/planner", label: "AI Task Planner", text: "Build morning, afternoon and evening routines for your child." },
  { to: "/research", label: "AI Research Assistant", text: "Research autism-related topics with simplified explanations." },
] as const;

const NEVER = [
  "Diagnose autism or any other condition",
  "Say how likely it is that your child is autistic",
  "Advise on starting, stopping or changing medication",
  "Replace an assessment by a qualified professional",
];

function AboutPage() {
  return (
    <div className="animate-rise space-y-6">
      <PageHeader
        title="About & Founder"
        subtitle="Who built AutismCare AI, why it exists, and what it will never do."
        icon={<User />}
      />

      <Panel className="max-w-3xl">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <span
            aria-hidden="true"
            className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-primary text-xl font-bold text-primary-foreground shadow-card"
          >
            MM
          </span>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">Founder &amp; creator</p>
            <h2 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">Mihle Matrose</h2>
            <p className="mt-3 text-sm leading-relaxed">
              AutismCare AI was designed and built by Mihle Matrose. Mihle created this application so that parents
              and caregivers have a calm, trustworthy place to ask questions about a child's development,
              communication, behaviour, routines and sensory needs — and to keep everything organised in one spot.
            </p>
            <p className="mt-3 text-sm leading-relaxed">
              Every tool in this app was shaped by one rule: help a family understand and prepare, then send them to
              a qualified professional. It shares information and structure. It does not diagnose.
            </p>
            <Button asChild variant="soft" className="mt-5">
              <Link to="/responsible-ai">
                <ShieldCheck className="h-4 w-4" />
                Read the Responsible AI commitment
              </Link>
            </Button>
          </div>
        </div>
      </Panel>

      <section className="max-w-3xl space-y-4">
        <h2 className="text-lg font-semibold">Why this app exists</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {WHY.map(({ icon: Icon, title, text }) => (
            <Panel key={title} className="p-5">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-accent-foreground">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-3 font-semibold leading-snug">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{text}</p>
            </Panel>
          ))}
        </div>
      </section>

      <section className="max-w-3xl space-y-4">
        <h2 className="text-lg font-semibold">What you can use here</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {TOOLS.map(({ to, label, text }) => (
            <Link
              key={to}
              to={to}
              className="rounded-2xl border bg-card p-4 text-sm shadow-card transition-shadow hover:shadow-lift focus-visible:ring-2 focus-visible:ring-primary"
            >
              <span className="font-semibold text-primary">{label}</span>
              <span className="mt-1 block text-muted-foreground">{text}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-3xl space-y-4">
        <h2 className="text-lg font-semibold">What AutismCare AI will never do</h2>
        <Panel className="border-warning/50 bg-warning-soft">
          <ul className="space-y-2 text-sm">
            {NEVER.map((line) => (
              <li key={line} className="flex gap-2">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-warning-foreground" />
                <span className="text-warning-foreground">{line}</span>
              </li>
            ))}
          </ul>
        </Panel>
        <ResponsibleNotice />
      </section>

      <p className="max-w-3xl border-t pt-5 text-sm text-muted-foreground">
        AutismCare AI is an independent project created by Mihle Matrose. AI-generated answers may contain errors and
        are always marked and editable.
      </p>
    </div>
  );
}

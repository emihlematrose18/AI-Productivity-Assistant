import { useState, type ReactNode } from "react";
import { Info, Loader2, Pencil, ShieldCheck, Check, AlertCircle } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function PageHeader({ title, subtitle, icon }: { title: string; subtitle?: string; icon?: ReactNode }) {
  return (
    <div className="mb-6 flex items-start gap-4 sm:mb-8">
      {icon && (
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-accent text-accent-foreground">{icon}</span>
      )}
      <div className="min-w-0">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground sm:text-base">{subtitle}</p>}
      </div>
    </div>
  );
}

export function Panel({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("rounded-2xl border bg-card p-5 shadow-card sm:p-6", className)}>{children}</div>;
}

export function ResponsibleNotice({ compact }: { compact?: boolean }) {
  return (
    <div className="flex gap-3 rounded-2xl border border-warning/50 bg-warning-soft p-4 text-sm text-warning-foreground">
      <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0" />
      <div className="min-w-0">
        <p className="font-semibold">Responsible AI Notice</p>
        <p className="mt-1">
          AutismCare AI provides general educational and supportive information. It does not diagnose autism and does
          not replace advice from qualified healthcare, developmental, educational or therapeutic professionals.
        </p>
        {!compact && (
          <p className="mt-1">
            AI-generated information may contain errors. Parents and caregivers should use professional guidance when
            making important decisions about a child's health, development, education or wellbeing.{" "}
            <Link to="/responsible-ai" className="font-medium underline underline-offset-2">
              Learn more
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}

export function InfoBox({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-3 rounded-2xl bg-accent p-4 text-sm text-accent-foreground">
      <Info className="mt-0.5 h-5 w-5 shrink-0" />
      <div className="min-w-0">{children}</div>
    </div>
  );
}

export function ErrorBox({ message }: { message: string }) {
  return (
    <div role="alert" className="flex gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
      <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
      <p>{message}</p>
    </div>
  );
}

export function Loading({ label }: { label: string }) {
  return (
    <Panel className="flex items-center gap-3 text-sm text-muted-foreground">
      <Loader2 className="h-5 w-5 animate-spin text-primary" />
      {label}
    </Panel>
  );
}

export function EmptyState({ icon, title, text, action }: { icon: ReactNode; title: string; text: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed bg-card px-6 py-12 text-center">
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-accent text-accent-foreground">{icon}</span>
      <p className="mt-4 font-semibold">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{text}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function AIBadge() {
  return (
    <span className="inline-flex items-center rounded-full bg-info-soft px-2.5 py-0.5 text-xs font-medium text-info-foreground">
      AI-generated · editable
    </span>
  );
}

/** Editable AI section: text or list. */
export function EditableSection({
  title,
  value,
  onChange,
  editing,
}: {
  title: string;
  value: string | string[];
  onChange: (v: string | string[]) => void;
  editing: boolean;
}) {
  const isList = Array.isArray(value);
  const text = isList ? value.join("\n") : value;
  return (
    <section>
      {title && <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-primary">{title}</h3>}
      {editing ? (
        <Textarea
          value={text}
          rows={isList ? Math.max(3, value.length + 1) : 4}
          onChange={(e) => onChange(isList ? e.target.value.split("\n") : e.target.value)}
          aria-label={title || "Edit text"}
        />
      ) : isList ? (
        <ul className="space-y-1.5 text-sm leading-relaxed">
          {value.filter(Boolean).map((v, i) => (
            <li key={i} className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <span>{v}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm leading-relaxed">{value}</p>
      )}
    </section>
  );
}

export function EditToggle({ editing, setEditing }: { editing: boolean; setEditing: (v: boolean) => void }) {
  return (
    <Button variant="outline" size="sm" onClick={() => setEditing(!editing)}>
      {editing ? <Check className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
      {editing ? "Done editing" : "Edit"}
    </Button>
  );
}

export function useEditing() {
  return useState(false);
}

export function errMsg(e: unknown) {
  return e instanceof Error ? e.message : "Something went wrong. Please try again.";
}

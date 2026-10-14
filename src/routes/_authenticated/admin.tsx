import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BarChart3 } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { PageHeader } from "@/components/app/ui";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin — AutismCare AI" }, { name: "robots", content: "noindex" }] }),
  component: AdminPage,
});

type Ev = { event_type: string; language: string; timestamp: string };
type Fb = { id: string; rating: string; comment: string | null; language: string; timestamp: string };

function AdminPage() {
  const [ev, setEv] = useState<Ev[]>([]);
  const [fb, setFb] = useState<Fb[]>([]);
  const [filter, setFilter] = useState<"all" | "up" | "down">("all");
  useEffect(() => {
    supabase.from("analytics").select("event_type,language,timestamp").then(({ data }) => setEv(data ?? []));
    supabase.from("feedback").select("*").order("timestamp", { ascending: false }).then(({ data }) => setFb(data ?? []));
  }, []);
  const chats = ev.filter((e) => e.event_type === "chat_started");
  const langs: Record<string, number> = {};
  chats.forEach((c) => (langs[c.language] = (langs[c.language] || 0) + 1));
  const top = Object.entries(langs).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";
  const pos = fb.length ? Math.round((fb.filter((f) => f.rating === "up").length / fb.length) * 100) : 0;
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(Date.now() - (6 - i) * 864e5).toISOString().slice(0, 10);
    return { day: d.slice(5), visits: ev.filter((e) => e.event_type === "visit" && e.timestamp.startsWith(d)).length };
  });
  const cards = [["Total Visits", ev.filter((e) => e.event_type === "visit").length], ["Chats Started", chats.length], ["Feedback Positive", `${pos}%`], ["Top Language", top]];
  return (
    <div className="space-y-6">
      <PageHeader title="Admin" icon={<BarChart3 />} subtitle="Anonymous usage only — no personal data. Only the founder account can see this data." />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {cards.map(([k, v]) => <div key={k} className="rounded-2xl border bg-card p-4 shadow-card"><p className="text-xs text-muted-foreground">{k}</p><p className="text-2xl font-semibold text-primary">{v}</p></div>)}
      </div>
      <div className="h-56 rounded-2xl border bg-card p-4"><ResponsiveContainer><BarChart data={days}><XAxis dataKey="day" fontSize={12} /><YAxis allowDecimals={false} fontSize={12} /><Bar dataKey="visits" fill="var(--primary)" radius={6} /></BarChart></ResponsiveContainer></div>
      <div className="space-y-2">
        <div className="flex gap-2">{(["all", "up", "down"] as const).map((f) => <button key={f} onClick={() => setFilter(f)} className={`rounded-lg border px-3 py-1 text-sm ${filter === f ? "bg-primary text-primary-foreground" : ""}`}>{f}</button>)}</div>
        {fb.filter((f) => filter === "all" || f.rating === filter).map((f) => <div key={f.id} className="rounded-xl border bg-card p-3 text-sm"><span>{f.rating === "up" ? "👍" : "👎"} · {f.language} · {new Date(f.timestamp).toLocaleString()}</span>{f.comment && <p className="mt-1">{f.comment}</p>}</div>)}
      </div>
    </div>
  );
}

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/app/ui";
import { supabase } from "@/integrations/supabase/client";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/auth")({
  head: () => ({ ...seo("Founder sign in — AutismCare AI", "Private sign in for the AutismCare AI founder."), meta: [...seo("Founder sign in — AutismCare AI", "Private sign in for the AutismCare AI founder.").meta, { name: "robots", content: "noindex" }] }),
  component: AuthPage,
});

function AuthPage() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  async function go(mode: "in" | "up") {
    setBusy(true); setMsg("");
    const res = mode === "in"
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/auth` } });
    setBusy(false);
    if (res.error) return setMsg(res.error.message);
    if (mode === "up" && !res.data.session) return setMsg("Check your email to confirm your account, then sign in.");
    nav({ to: "/admin" });
  }

  return (
    <div className="max-w-sm">
      <PageHeader title="Founder sign in" icon={<Lock />} subtitle="This area is private to the app founder." />
      <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); go("in"); }}>
        <Input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} aria-label="Email" />
        <Input type="password" required minLength={8} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} aria-label="Password" />
        <div className="flex gap-2">
          <Button type="submit" disabled={busy}>Sign in</Button>
          <Button type="button" variant="ghost" disabled={busy} onClick={() => go("up")}>Create account</Button>
        </div>
        {msg && <p className="text-sm text-muted-foreground">{msg}</p>}
      </form>
    </div>
  );
}

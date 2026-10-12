import { useState } from "react";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { containsPII, langCode } from "@/lib/analytics";
import { useAppState } from "@/lib/store";

export function Feedback() {
  const language = useAppState((s) => s.settings.language);
  const [rating, setRating] = useState<"up" | "down" | null>(null);
  const [comment, setComment] = useState("");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const pii = containsPII(comment);

  if (done) return <p className="mt-1 text-xs text-primary">Thank you, your feedback helps improve support for parents.</p>;

  async function submit() {
    if (!rating || pii) return;
    setBusy(true); setErr("");
    const text = comment.trim().slice(0, 200);
    const { error } = await supabase.from("feedback").insert({ rating, comment: text || null, language: langCode(language) });
    setBusy(false);
    if (error) setErr("Couldn't send feedback. Please try again.");
    else setDone(true);
  }

  return (
    <div className="mt-1 space-y-2 text-left">
      <div className="flex items-center gap-1">
        <span className="text-xs text-muted-foreground">Was this helpful?</span>
        <Button variant={rating === "up" ? "soft" : "ghost"} size="sm" aria-label="Helpful" aria-pressed={rating === "up"} onClick={() => setRating("up")}><ThumbsUp /></Button>
        <Button variant={rating === "down" ? "soft" : "ghost"} size="sm" aria-label="Not helpful" aria-pressed={rating === "down"} onClick={() => setRating("down")}><ThumbsDown /></Button>
      </div>
      {rating && (
        <div className="space-y-2 rounded-xl border bg-background p-3">
          <Textarea value={comment} maxLength={200} rows={2} onChange={(e) => setComment(e.target.value)} placeholder="What was helpful or not? (optional, anonymous)" aria-label="Feedback comment" className="text-sm" />
          <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
            <span>{comment.length}/200 · Please don't include names, phone numbers or emails.</span>
            <Button size="sm" disabled={busy || pii} onClick={submit}>Send</Button>
          </div>
          {pii && <p role="alert" className="text-xs text-destructive">Please remove phone numbers or email addresses — feedback must stay anonymous.</p>}
          {err && <p role="alert" className="text-xs text-destructive">{err}</p>}
        </div>
      )}
    </div>
  );
}

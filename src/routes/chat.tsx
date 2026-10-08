import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Bookmark, Bot, Loader2, Send, Trash2, User } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ErrorBox, PageHeader, ResponsibleNotice, errMsg } from "@/components/app/ui";
import { chatWithAI } from "@/lib/ai.functions";
import { setState, uid } from "@/lib/store";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/chat")({
  validateSearch: z.object({ q: z.string().optional() }),
  head: () =>
    seo("AI Chatbot — AutismCare AI", "Ask questions about your child's development, behaviour, communication and routines."),
  component: ChatPage,
});

const SUGGESTED = [
  "What can I do when my child struggles with changes in routine?",
  "How can I make transitions easier?",
  "What are some ways to support communication?",
  "What can I do if my child becomes overwhelmed by noise?",
];

type Msg = { id: string; role: "user" | "assistant"; content: string };

function ChatPage() {
  const { q } = Route.useSearch();
  const chat = useServerFn(chatWithAI);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (q) setInput(q);
  }, [q]);
  useEffect(() => endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }), [messages, loading]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || loading) return;
    const next = [...messages, { id: uid(), role: "user" as const, content }];
    setMessages(next);
    setInput("");
    setError("");
    setLoading(true);
    try {
      const { reply } = await chat({ data: { messages: next.slice(-20).map(({ role, content }) => ({ role, content })) } });
      setMessages((m) => [...m, { id: uid(), role: "assistant", content: reply }]);
    } catch (e) {
      setError(errMsg(e));
    } finally {
      setLoading(false);
    }
  }

  function save(i: number) {
    const reply = messages[i];
    const question = messages.slice(0, i).reverse().find((m) => m.role === "user")?.content ?? "Chatbot response";
    setState((s) => ({
      ...s,
      chats: [{ id: uid(), title: question.slice(0, 90), body: reply.content, createdAt: new Date().toISOString() }, ...s.chats],
    }));
    toast.success("Response saved to Saved Information");
  }

  return (
    <div className="animate-rise">
      <PageHeader
        icon={<Bot className="h-6 w-6" />}
        title="AI Chatbot"
        subtitle="Ask questions about your child's development, behaviour, communication and daily routines."
      />
      <div className="mb-4">
        <ResponsibleNotice compact />
      </div>

      <div className="flex h-[min(70vh,680px)] min-h-[440px] flex-col overflow-hidden rounded-2xl border bg-card shadow-card">
        <div className="flex items-center justify-between gap-2 border-b px-4 py-3">
          <p className="text-sm font-medium">Conversation</p>
          <Button variant="ghost" size="sm" disabled={!messages.length} onClick={() => { setMessages([]); setError(""); }}>
            <Trash2 /> Clear conversation
          </Button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6" aria-live="polite">
          {messages.length === 0 && (
            <div className="mx-auto max-w-xl py-6 text-center">
              <p className="text-sm text-muted-foreground">Try one of these questions to get started:</p>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {SUGGESTED.map((s) => (
                  <button key={s} onClick={() => send(s)} className="rounded-xl border bg-background p-3 text-left text-sm transition-colors hover:border-primary hover:bg-accent">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={m.id} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
              <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${m.role === "user" ? "bg-secondary text-secondary-foreground" : "bg-primary text-primary-foreground"}`}>
                {m.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </span>
              <div className={`max-w-[85%] sm:max-w-[75%] ${m.role === "user" ? "text-right" : ""}`}>
                <div className={`inline-block whitespace-pre-wrap rounded-2xl px-4 py-3 text-left text-sm leading-relaxed ${m.role === "user" ? "bg-secondary text-secondary-foreground" : "bg-accent text-foreground"}`}>
                  {m.content}
                </div>
                {m.role === "assistant" && (
                  <div className="mt-1">
                    <Button variant="ghost" size="sm" onClick={() => save(i)}>
                      <Bookmark /> Save response
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground">
                <Bot className="h-4 w-4" />
              </span>
              <Loader2 className="h-4 w-4 animate-spin" /> AutismCare AI is thinking…
            </div>
          )}
          {error && <ErrorBox message={error} />}
          <div ref={endRef} />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex items-end gap-2 border-t p-3 sm:p-4"
        >
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
            placeholder="Type your question…"
            rows={1}
            className="max-h-40 min-h-11 resize-none"
            aria-label="Your message"
          />
          <Button type="submit" size="icon" className="h-11 w-11 shrink-0" disabled={loading || !input.trim()} aria-label="Send">
            <Send />
          </Button>
        </form>
      </div>
    </div>
  );
}

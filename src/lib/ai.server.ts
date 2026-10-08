// Server-only Lovable AI Gateway helper (OpenAI Responses API, streamed + accumulated).
const GATEWAY = "https://ai.gateway.lovable.dev/v1/responses";
const MODEL = "openai/gpt-6-astra";

export class AIError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

type Input = string | { role: "user" | "assistant"; content: string }[];

export async function callAI(opts: {
  instructions: string;
  input: Input;
  schema?: { name: string; schema: Record<string, unknown> };
}): Promise<string> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new AIError(500, "AI is not configured.");

  const input =
    typeof opts.input === "string"
      ? opts.input
      : opts.input.map((m) => ({
          role: m.role,
          content: [{ type: m.role === "user" ? "input_text" : "output_text", text: m.content }],
        }));

  const res = await fetch(GATEWAY, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": apiKey,
      "X-Lovable-AIG-SDK": "fetch",
    },
    body: JSON.stringify({
      model: MODEL,
      instructions: opts.instructions,
      input,
      stream: true,
      store: false,
      reasoning: { effort: "low" },
      ...(opts.schema
        ? { text: { format: { type: "json_schema", name: opts.schema.name, schema: opts.schema.schema, strict: true } } }
        : {}),
    }),
  });

  if (!res.ok || !res.body) {
    let msg = "The AI service is unavailable right now. Please try again shortly.";
    if (res.status === 429) msg = "Too many requests right now. Please wait a moment and try again.";
    if (res.status === 402) msg = "AI credits have run out for this workspace. Please add credits to continue.";
    try {
      const j = (await res.json()) as { error?: { message?: string }; message?: string };
      if (res.status === 402 || res.status === 403) msg = j.message || j.error?.message || msg;
    } catch {}
    throw new AIError(res.status, msg);
  }

  const reader = res.body.getReader();
  const dec = new TextDecoder();
  let buf = "";
  let text = "";
  let refused = false;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    let idx: number;
    while ((idx = buf.indexOf("\n\n")) !== -1) {
      const frame = buf.slice(0, idx);
      buf = buf.slice(idx + 2);
      for (const line of frame.split("\n")) {
        if (!line.startsWith("data:")) continue;
        const data = line.slice(5).trim();
        if (!data || data === "[DONE]") continue;
        try {
          const ev = JSON.parse(data) as { type?: string; delta?: string; error?: { message?: string } };
          if (ev.type === "response.output_text.delta" && ev.delta) text += ev.delta;
          else if (ev.type === "response.refusal.delta") refused = true;
          else if (ev.type === "response.failed" || ev.type === "error")
            throw new AIError(500, ev.error?.message || "The AI could not complete this request.");
        } catch (e) {
          if (e instanceof AIError) throw e;
        }
      }
    }
  }
  if (refused && !text) throw new AIError(400, "The AI declined this request. Please rephrase or speak to a professional.");
  if (!text) throw new AIError(500, "The AI returned an empty response. Please try again.");
  return text;
}

export async function callAIJson<T>(opts: {
  instructions: string;
  input: string;
  name: string;
  schema: Record<string, unknown>;
}): Promise<T> {
  const text = await callAI({ instructions: opts.instructions, input: opts.input, schema: { name: opts.name, schema: opts.schema } });
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new AIError(500, "The AI response could not be read. Please try again.");
  }
}

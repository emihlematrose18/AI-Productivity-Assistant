import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const str = { type: "string" } as const;
const strArr = { type: "array", items: str } as const;
const obj = (properties: Record<string, unknown>) => ({
  type: "object",
  properties,
  required: Object.keys(properties),
  additionalProperties: false,
});

async function run<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (e) {
    console.error("AI error", e);
    throw new Error(e instanceof Error ? e.message : "Something went wrong with the AI request.");
  }
}

export const chatWithAI = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z
      .object({
        messages: z
          .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().min(1).max(6000) }))
          .min(1)
          .max(40),
      })
      .parse(d),
  )
  .handler(async ({ data }) =>
    run(async () => {
      const { callAI } = await import("./ai.server");
      const { CHATBOT_PROMPT } = await import("./prompts.server");
      const reply = await callAI({ instructions: CHATBOT_PROMPT, input: data.messages });
      return { reply };
    }),
  );

export type SignsResult = {
  meaning: string;
  observations: { observation: string; note: string; support_idea: string }[];
  next_steps: string[];
};

export const analyzeSigns = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ observations: z.array(z.string().max(200)).min(1).max(30) }).parse(d))
  .handler(async ({ data }) =>
    run(async () => {
      const { callAIJson } = await import("./ai.server");
      const { SIGNS_PROMPT } = await import("./prompts.server");
      return callAIJson<SignsResult>({
        instructions: SIGNS_PROMPT,
        input: `Observations the parent selected:\n${data.observations.map((o) => `- ${o}`).join("\n")}`,
        name: "signs_result",
        schema: obj({
          meaning: str,
          observations: { type: "array", items: obj({ observation: str, note: str, support_idea: str }) },
          next_steps: strArr,
        }),
      });
    }),
  );

export type ConcernResult = {
  summary: string;
  possible_factors: string[];
  things_to_try: string[];
  what_to_monitor: string[];
  professional: string;
};

export const analyzeConcern = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z
      .object({ text: z.string().min(5).max(4000), date: z.string().max(40), category: z.string().max(40) })
      .parse(d),
  )
  .handler(async ({ data }) =>
    run(async () => {
      const { callAIJson } = await import("./ai.server");
      const { CONCERN_PROMPT } = await import("./prompts.server");
      return callAIJson<ConcernResult>({
        instructions: CONCERN_PROMPT,
        input: `Date: ${data.date || "not given"}\nCategory: ${data.category || "not given"}\nParent's description:\n${data.text}`,
        name: "concern_result",
        schema: obj({
          summary: str,
          possible_factors: strArr,
          things_to_try: strArr,
          what_to_monitor: strArr,
          professional: str,
        }),
      });
    }),
  );

const plannerInput = z.object({
  age: z.string().max(40),
  goal: z.string().min(2).max(500),
  time: z.string().max(200),
  interests: z.string().max(500),
  challenges: z.string().max(500),
});
type PlannerInput = z.infer<typeof plannerInput>;
const describe = (d: PlannerInput) =>
  `Child's age: ${d.age || "not given"}\nMain goal: ${d.goal}\nAvailable time: ${d.time || "not given"}\nInterests: ${d.interests || "not given"}\nChallenges: ${d.challenges || "none given"}`;

const taskSchema = obj({ time: str, task: str, notes: str });
export type PlanTask = { time: string; task: string; notes: string };
export type PlanResult = { morning: PlanTask[]; afternoon: PlanTask[]; evening: PlanTask[] };

export const generatePlan = createServerFn({ method: "POST" })
  .inputValidator((d) => plannerInput.parse(d))
  .handler(async ({ data }) =>
    run(async () => {
      const { callAIJson } = await import("./ai.server");
      const { PLANNER_PROMPT } = await import("./prompts.server");
      const arr = { type: "array", items: taskSchema };
      return callAIJson<PlanResult>({
        instructions: PLANNER_PROMPT,
        input: describe(data),
        name: "routine_plan",
        schema: obj({ morning: arr, afternoon: arr, evening: arr }),
      });
    }),
  );

export const regenerateTask = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    plannerInput.extend({ period: z.string().max(20), current: z.string().max(300), time: z.string().max(200), slot: z.string().max(10) }).parse(d),
  )
  .handler(async ({ data }) =>
    run(async () => {
      const { callAIJson } = await import("./ai.server");
      const { TASK_REGEN_PROMPT } = await import("./prompts.server");
      return callAIJson<PlanTask>({
        instructions: TASK_REGEN_PROMPT,
        input: `${describe(data)}\nPeriod: ${data.period}\nTime slot: ${data.slot}\nCurrent task to replace: ${data.current}`,
        name: "task",
        schema: taskSchema,
      });
    }),
  );

export type ResearchResult = {
  summary: string;
  key_points: string[];
  practical: string[];
  questions: string[];
  sources: { name: string; title: string; url: string }[];
};

export const researchTopic = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ topic: z.string().min(2).max(300) }).parse(d))
  .handler(async ({ data }) =>
    run(async () => {
      const { callAIJson } = await import("./ai.server");
      const { RESEARCH_PROMPT } = await import("./prompts.server");
      return callAIJson<ResearchResult>({
        instructions: RESEARCH_PROMPT,
        input: `Topic: ${data.topic}`,
        name: "research",
        schema: obj({
          summary: str,
          key_points: strArr,
          practical: strArr,
          questions: strArr,
          sources: { type: "array", items: obj({ name: str, title: str, url: str }) },
        }),
      });
    }),
  );

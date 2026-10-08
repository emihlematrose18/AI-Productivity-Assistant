import { useSyncExternalStore } from "react";
import type { ConcernResult, PlanTask, ResearchResult } from "./ai.functions";

export type Task = { id: string; label: string; done: boolean };
export type PlanRow = PlanTask & { id: string; done: boolean };
export type Plan = { morning: PlanRow[]; afternoon: PlanRow[]; evening: PlanRow[] };

export type SavedChat = { id: string; title: string; body: string; createdAt: string };
export type SavedConcern = {
  id: string;
  title: string;
  text: string;
  date: string;
  category: string;
  result: ConcernResult | null;
  createdAt: string;
};
export type SavedResearch = { id: string; topic: string; result: ResearchResult; createdAt: string };
export type SavedPlan = { id: string; title: string; plan: Plan; createdAt: string };

export type Settings = {
  name: string;
  email: string;
  childNickname: string;
  reminders: boolean;
  dailySummary: boolean;
  language: string;
  largeText: boolean;
  reduceMotion: boolean;
  aiTone: "gentle" | "concise" | "detailed";
  aiIncludeSources: boolean;
};

export type AppState = {
  todayTasks: Task[];
  chats: SavedChat[];
  concerns: SavedConcern[];
  research: SavedResearch[];
  plans: SavedPlan[];
  settings: Settings;
};

export const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

const now = new Date().toISOString();
const DEFAULT: AppState = {
  todayTasks: [
    { id: "t1", label: "Morning routine", done: true },
    { id: "t2", label: "School preparation", done: false },
    { id: "t3", label: "Afternoon activity", done: false },
    { id: "t4", label: "Evening routine", done: false },
  ],
  chats: [],
  concerns: [
    { id: "c1", title: "Difficulty with changes in routine", text: "Becomes very upset when the morning order changes.", date: "", category: "Routine", result: null, createdAt: now },
    { id: "c2", title: "Sensitive to loud noises", text: "Covers ears and wants to leave busy places like the shops.", date: "", category: "Sensory", result: null, createdAt: now },
    { id: "c3", title: "Communication difficulties", text: "Finds it hard to tell us what they need when tired.", date: "", category: "Communication", result: null, createdAt: now },
  ],
  research: [
    {
      id: "r1",
      topic: "Sensory processing and autism",
      createdAt: now,
      result: {
        summary:
          "Many autistic people experience sensory input — sound, light, touch, taste, smell, movement — more or less intensely than others. These differences vary greatly from person to person.",
        key_points: [
          "Sensory differences can involve over-responsiveness, under-responsiveness or seeking certain sensations.",
          "Busy or unpredictable environments can feel overwhelming.",
          "Sensory needs can change with tiredness, stress or setting.",
        ],
        practical: ["Notice which settings feel hard and which feel calm.", "Offer a quiet space and simple tools like ear defenders."],
        questions: ["Would an occupational therapy sensory assessment be helpful for my child?"],
        sources: [{ name: "National Autistic Society", title: "Sensory differences", url: "https://www.autism.org.uk/" }],
      },
    },
  ],
  plans: [],
  settings: {
    name: "",
    email: "",
    childNickname: "",
    reminders: true,
    dailySummary: false,
    language: "English",
    largeText: false,
    reduceMotion: false,
    aiTone: "gentle",
    aiIncludeSources: true,
  },
};

const KEY = "autismcare-ai-v1";
let state: AppState = DEFAULT;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) state = { ...DEFAULT, ...JSON.parse(raw), settings: { ...DEFAULT.settings, ...JSON.parse(raw).settings } };
  } catch {}
}

export function setState(fn: (s: AppState) => AppState) {
  load();
  state = fn(state);
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {}
  listeners.forEach((l) => l());
}

export function resetAll() {
  setState(() => ({ ...DEFAULT, todayTasks: [], concerns: [], research: [], chats: [], plans: [], settings: state.settings }));
}

export function useAppState<T>(select: (s: AppState) => T): T {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => {
      load();
      return select(state);
    },
    () => select(DEFAULT),
  );
}

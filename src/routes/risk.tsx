import { createFileRoute } from "@tanstack/react-router";
import { Scale } from "lucide-react";
import { LegalPage } from "@/components/app/LegalPage";
import { seo } from "@/lib/seo";

const ITEMS = [
  ["Govern", "Owned by Mihle Matrose, who is accountable for the app."],
  ["Map", "Main risk is medical advice hallucination. Context: users are parents, not clinicians."],
  ["Measure", "We test weekly for prompt injection, bias, toxicity and hallucination."],
  ["Manage", "Mitigation via guardrails, disclaimer, referral to professionals, Clear Chat and the Report button."],
];

export const Route = createFileRoute("/risk")({
  head: () => seo("How We Manage Risk — AutismCare AI", "How AutismCare AI follows the NIST AI Risk Management Framework: Govern, Map, Measure, Manage."),
  component: () => (
    <LegalPage title="How We Manage Risk (NIST AI RMF)" icon={<Scale />}>
      {ITEMS.map(([k, v]) => (
        <div key={k}><h2 className="font-semibold">{k}</h2><p>{v}</p></div>
      ))}
    </LegalPage>
  ),
});

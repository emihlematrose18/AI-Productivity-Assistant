import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle } from "lucide-react";
import { LegalPage } from "@/components/app/LegalPage";
import { REPORT_HREF } from "@/components/app/Footer";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/disclaimer")({
  head: () => seo("Disclaimer & Responsible AI Notice — AutismCare AI", "AutismCare AI is informational only, not medical advice. Always consult a qualified professional."),
  component: () => (
    <LegalPage title="Disclaimer & Responsible AI Notice" icon={<AlertTriangle />}>
      <p>Informational only, not medical advice.</p>
      <p>AI can hallucinate, be biased or be incomplete. Always consult a qualified healthcare professional.</p>
      <p>We do not diagnose, prescribe, or create treatment plans.</p>
      <p>If you see harmful, toxic or biased output, please <a className="text-primary underline" href={REPORT_HREF}>Report it</a>.</p>
      <p>Built with Responsible AI: transparency, fairness, accountability, human oversight.</p>
    </LegalPage>
  ),
});

import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { PageHeader, ResponsibleNotice } from "@/components/app/ui";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/responsible-ai")({
  head: () => seo("Responsible AI — AutismCare AI", "Understand the limits of AutismCare AI and the importance of qualified professional guidance."),
  component: ResponsiblePage,
});
function ResponsiblePage() {
  return <div className="space-y-6">
    <PageHeader title="Responsible AI" icon={<ShieldCheck />} />
    <ResponsibleNotice compact />
    <section className="max-w-2xl space-y-4 text-sm leading-relaxed">
      <h2 className="text-lg font-semibold">Professional guidance matters</h2>
      <p>AI-generated information may contain errors. Speak with a qualified professional when making important decisions about your child's health, development, education or wellbeing.</p>
      <p>This app cannot diagnose autism, estimate the likelihood of autism or recommend changes to prescription medication. Each child has individual needs.</p>
      <p>If your child is in immediate danger or there is an urgent health concern, seek emergency or professional help immediately.</p>
    </section>
  </div>;
}
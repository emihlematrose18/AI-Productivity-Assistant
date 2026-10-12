import type { ReactNode } from "react";
import { PageHeader } from "@/components/app/ui";

export function LegalPage({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) {
  return (
    <div className="animate-rise space-y-6">
      <PageHeader title={title} icon={icon} />
      <section className="max-w-2xl space-y-4 rounded-2xl border bg-card p-6 text-sm leading-relaxed shadow-card">{children}</section>
    </div>
  );
}

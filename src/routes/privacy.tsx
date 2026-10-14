import { createFileRoute } from "@tanstack/react-router";
import { Lock } from "lucide-react";
import { LegalPage } from "@/components/app/LegalPage";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/privacy")({
  head: () => seo("Privacy Policy — AutismCare AI", "How AutismCare AI handles your information: no personal data collected, GDPR and POPIA aligned."),
  component: () => (
    <LegalPage title="Privacy Policy" icon={<Lock />}>
      <p className="text-muted-foreground">AutismCare AI — Updated 12 Oct 2026 — Built by Mihle Matrose.</p>
      <p>We collect NO personal data (no names, IDs, addresses, medical records). Please do not type such details into the app.</p>
      <p>Messages are sent over HTTPS (encrypted) to our secure server functions and then to the AI model provider via the Lovable AI Gateway, under the provider's API data usage terms (not used for training).</p>
      <p>No long-term storage on our servers. Your saved items stay only in your own browser on your device. If any server storage is added, it will be protected so each user can only see their own data.</p>
      <p>GDPR/POPIA compliant: you can clear the chat anytime with the Clear Chat button, and remove all saved data in Settings.</p>
      <p>Anonymous analytics: we count site visits, chats started and Clear Chat clicks. Each record holds only the event type, the language (en/xh/zu/af) and the time — no names, emails, IP addresses or child information. You can opt out anytime in Settings.</p>
      <p>Anonymous feedback: thumbs up/down and an optional comment (max 200 characters). Comments containing phone numbers or email addresses are blocked. Only the founder can view feedback.</p>
      <p>No tracking cookies. No sale of data. For parents/caregivers aged 18+ only.</p>
      <p>Contact for deletion: <a className="text-primary underline" href="mailto:emihlematrose18@gmail.com">emihlematrose18@gmail.com</a></p>
    </LegalPage>
  ),
});

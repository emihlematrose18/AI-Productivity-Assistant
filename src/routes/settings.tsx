import { createFileRoute } from "@tanstack/react-router";
import { Settings } from "lucide-react";
import { PageHeader } from "@/components/app/ui";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LANGUAGES } from "@/lib/dashboard-language";
import { setState, useAppState, type Settings as AppSettings } from "@/lib/store";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/settings")({
  head: () => seo("Settings — AutismCare AI", "Manage your AutismCare AI profile, language and accessibility preferences."),
  component: SettingsPage,
});
function SettingsPage() {
  const settings = useAppState((s) => s.settings);
  function update<K extends keyof AppSettings>(key: K, value: AppSettings[K]) { setState((s) => ({ ...s, settings: { ...s.settings, [key]: value } })); }
  return <div>
    <PageHeader title="Settings" icon={<Settings />} />
    <div className="max-w-xl space-y-6">
      <div><label htmlFor="parent-name" className="mb-2 block text-sm font-medium">Your name</label><Input id="parent-name" value={settings.name} onChange={(e) => update("name", e.target.value)} /></div>
      <div><label htmlFor="child-nickname" className="mb-2 block text-sm font-medium">Child's nickname</label><Input id="child-nickname" value={settings.childNickname} onChange={(e) => update("childNickname", e.target.value)} /></div>
      <div><label htmlFor="settings-language" className="mb-2 block text-sm font-medium">Language</label><Select value={settings.language} onValueChange={(value) => update("language", value)}><SelectTrigger id="settings-language"><SelectValue /></SelectTrigger><SelectContent>{LANGUAGES.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectContent></Select></div>
      <div className="flex items-center justify-between gap-4 border-t pt-4"><label htmlFor="large-text">Larger text</label><Switch id="large-text" checked={settings.largeText} onCheckedChange={(value) => update("largeText", value)} /></div>
      <div className="flex items-center justify-between gap-4"><label htmlFor="reduce-motion">Reduce motion</label><Switch id="reduce-motion" checked={settings.reduceMotion} onCheckedChange={(value) => update("reduceMotion", value)} /></div>
    </div>
  </div>;
}
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const REPORT_HREF =
  "mailto:emihlematrose18@gmail.com?subject=" + encodeURIComponent("AutismCare AI — Report harmful output");

export function Footer() {
  const link = "hover:text-foreground underline-offset-4 hover:underline";
  const [count, setCount] = useState<number | null>(null);
  useEffect(() => {
    supabase.rpc("parents_supported").then(({ data }) => typeof data === "number" && setCount(data), () => {});
  }, []);
  return (
    <footer className="mt-12 border-t pt-6 text-xs text-muted-foreground">
      {count !== null && (
        <p className="mb-3 flex items-center gap-1.5 text-sm text-primary">
          <Heart className="h-4 w-4" /> {count.toLocaleString()} parents supported
        </p>
      )}
      <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Legal">
        <Link to="/privacy" className={link}>Privacy Policy</Link>
        <Link to="/disclaimer" className={link}>Disclaimer</Link>
        <Link to="/risk" className={link}>How We Manage Risk</Link>
        <a href={REPORT_HREF} className={link}>Report harmful output</a>
      </nav>
      <p className="mt-3">© 2026 AutismCare AI · Built by Mihle Matrose · Informational only, not medical advice.</p>
    </footer>
  );
}

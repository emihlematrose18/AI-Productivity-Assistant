import { Link } from "@tanstack/react-router";

export const REPORT_HREF =
  "mailto:emihlematrose18@gmail.com?subject=" + encodeURIComponent("AutismCare AI — Report harmful output");

export function Footer() {
  const link = "hover:text-foreground underline-offset-4 hover:underline";
  return (
    <footer className="mt-12 border-t pt-6 text-xs text-muted-foreground">
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

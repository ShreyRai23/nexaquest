import { Link } from "@tanstack/react-router";
import { Github, Twitter, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-20 px-3 sm:px-6 pb-6">
      <div className="mx-auto max-w-7xl pixel-card-flat p-6 sm:p-8" style={{ background: "var(--ink)", color: "var(--cream)" }}>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="font-pixel text-[12px] text-[color:var(--sunny)]">MINDBLOOM AI</div>
            <p className="mt-3 text-sm text-[color:var(--cream)]/80">An AI-powered adventure where kids find their superpowers.</p>
            <div className="mt-4 flex gap-2">
              <a className="grid h-9 w-9 place-items-center rounded-lg border-4 border-[color:var(--cream)] bg-[color:var(--teal-pop)] text-[color:var(--ink)]" href="#"><Twitter size={16}/></a>
              <a className="grid h-9 w-9 place-items-center rounded-lg border-4 border-[color:var(--cream)] bg-[color:var(--orange-pop)]" href="#"><Youtube size={16}/></a>
              <a className="grid h-9 w-9 place-items-center rounded-lg border-4 border-[color:var(--cream)] bg-[color:var(--sunny)] text-[color:var(--ink)]" href="#"><Github size={16}/></a>
            </div>
          </div>
          {[
            { t: "Play", l: [["Missions","/missions"],["Games","/games"],["Achievements","/achievements"]] },
            { t: "Learn", l: [["AI Mentor","/mentor"],["Progress","/progress"],["AI Report","/report"]] },
            { t: "Family", l: [["Parent Zone","/parent"],["Sign In","/auth"],["Dashboard","/dashboard"]] },
          ].map((c) => (
            <div key={c.t}>
              <div className="font-pixel text-[10px] text-[color:var(--teal-pop)]">{c.t.toUpperCase()}</div>
              <ul className="mt-3 space-y-2 text-sm">
                {c.l.map(([n, h]) => (
                  <li key={n}><Link to={h as string} className="hover:text-[color:var(--sunny)]">{n}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8 flex items-center justify-between border-t-4 border-dashed border-[color:var(--cream)]/30 pt-4 text-xs text-[color:var(--cream)]/60">
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-md border-2 border-[color:var(--sunny)] bg-[color:var(--grass)] animate-bounce-soft">🌱</span>
            <span>© 2026 MindBloom AI · Made for young heroes</span>
          </div>
          <span className="font-pixel text-[9px] text-[color:var(--sunny)]">PRESS START</span>
        </div>
      </div>
    </footer>
  );
}
